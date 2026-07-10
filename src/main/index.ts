import {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  protocol,
  type IpcMainInvokeEvent,
} from 'electron/main'
import { shell } from 'electron'
import squirrelStartup from 'electron-squirrel-startup'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ipcChannels,
  type IpcContract,
} from '../shared/ipc.js'

if (squirrelStartup) {
  app.quit()
}

const rendererProtocol = 'app'
const rendererHost = 'renderer'
const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const preloadPath = path.join(currentDirectory, '../preload/index.cjs')
const rendererPath = path.join(currentDirectory, '../renderer/index.html')
const rendererDirectory = path.dirname(rendererPath)
const rendererUrl = `${rendererProtocol}://${rendererHost}/index.html`
const rendererDevUrl = app.isPackaged
  ? undefined
  : process.env.VITE_DEV_SERVER_URL

protocol.registerSchemesAsPrivileged([
  {
    scheme: rendererProtocol,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
])

type PingResult = IpcContract[typeof ipcChannels.ping]['result']

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
])
const productionContentSecurityPolicy =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'"

function parseUrl(url: string) {
  try {
    return new URL(url)
  } catch {
    return undefined
  }
}

function decodePathname(pathname: string) {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return undefined
  }
}

function getRendererFilePath(url: string) {
  const parsedUrl = parseUrl(url)

  if (
    !parsedUrl ||
    parsedUrl.protocol !== `${rendererProtocol}:` ||
    parsedUrl.hostname !== rendererHost
  ) {
    return undefined
  }

  const pathname = decodePathname(parsedUrl.pathname)

  if (pathname === undefined) {
    return undefined
  }

  const filePath = path.normalize(
    path.join(rendererDirectory, pathname),
  )
  const relativePath = path.relative(rendererDirectory, filePath)

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return undefined
  }

  return filePath
}

function isTrustedRendererUrl(url: string) {
  const parsedUrl = parseUrl(url)

  if (!parsedUrl) {
    return false
  }

  if (rendererDevUrl) {
    return parsedUrl.origin === new URL(rendererDevUrl).origin
  }

  parsedUrl.hash = ''
  parsedUrl.search = ''

  return parsedUrl.href === rendererUrl
}

function isSafeExternalUrl(url: string) {
  return parseUrl(url)?.protocol === 'https:'
}

function isTrustedSender(event: IpcMainInvokeEvent) {
  const senderFrame = event.senderFrame

  if (!senderFrame || senderFrame !== event.sender.mainFrame) {
    return false
  }

  return isTrustedRendererUrl(senderFrame.url)
}

function registerIpcHandlers() {
  ipcMain.handle(ipcChannels.ping, (event, ...args): PingResult => {
    if (!isTrustedSender(event)) {
      throw new Error('Blocked IPC request from an untrusted sender')
    }

    if (args.length !== 0) {
      throw new TypeError(`Invalid arguments for ${ipcChannels.ping}`)
    }

    return 'pong'
  })
}

function registerRendererProtocol() {
  protocol.handle(rendererProtocol, async (request) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {
        headers: {
          Allow: 'GET, HEAD',
        },
        status: 405,
      })
    }

    const filePath = getRendererFilePath(request.url)

    if (!filePath) {
      return new Response('Not found', { status: 404 })
    }

    try {
      const data = await readFile(filePath)
      const contentType =
        mimeTypes.get(path.extname(filePath)) ?? 'application/octet-stream'
      const headers: Record<string, string> = {
        'Content-Type': contentType,
      }

      if (path.extname(filePath) === '.html') {
        headers['Content-Security-Policy'] = productionContentSecurityPolicy
      }

      return new Response(request.method === 'HEAD' ? null : data, {
        headers,
      })
    } catch {
      return new Response('Not found', { status: 404 })
    }
  })
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#16171d' : '#ffffff',
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: preloadPath,
      sandbox: true,
    },
  })

  window.once('ready-to-show', () => {
    window.show()
  })

  window.webContents.on('will-navigate', (event, url) => {
    if (!isTrustedRendererUrl(url)) {
      event.preventDefault()
    }
  })

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      void shell.openExternal(url).catch((error) => {
        console.error('[electron] failed to open external URL', error)
      })
    }

    return { action: 'deny' }
  })

  if (rendererDevUrl) {
    void window.loadURL(rendererDevUrl)
  } else {
    void window.loadURL(rendererUrl)
  }
}

app.whenReady().then(() => {
  registerRendererProtocol()
  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
