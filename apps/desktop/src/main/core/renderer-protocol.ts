import { app, net, protocol } from "electron/main";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rendererScheme = "app";
const rendererHost = "renderer";
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const rendererPath = path.join(currentDirectory, "../renderer/index.html");
const rendererDirectory = path.dirname(rendererPath);
const rendererUrl = `${rendererScheme}://${rendererHost}/index.html`;
const rendererDevUrl = app.isPackaged ? undefined : process.env.VITE_DEV_SERVER_URL;

export const preloadPath = path.join(currentDirectory, "../preload/index.cjs");
export const rendererPageUrl = rendererDevUrl ?? rendererUrl;

const productionContentSecurityPolicy =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'";

function parseUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    return undefined;
  }
}

function decodePathname(pathname: string) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return undefined;
  }
}

function getRendererFilePath(url: string) {
  const parsedUrl = parseUrl(url);

  if (!parsedUrl || parsedUrl.protocol !== `${rendererScheme}:` || parsedUrl.hostname !== rendererHost) {
    return undefined;
  }

  const pathname = decodePathname(parsedUrl.pathname);

  if (pathname === undefined) {
    return undefined;
  }

  const filePath = path.normalize(path.join(rendererDirectory, pathname));
  const relativePath = path.relative(rendererDirectory, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return undefined;
  }

  return filePath;
}

export function isTrustedRendererUrl(url: string) {
  const parsedUrl = parseUrl(url);

  if (!parsedUrl) {
    return false;
  }

  if (rendererDevUrl) {
    return parsedUrl.origin === new URL(rendererDevUrl).origin;
  }

  parsedUrl.hash = "";
  parsedUrl.search = "";

  return parsedUrl.href === rendererUrl;
}

export function registerRendererScheme() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: rendererScheme,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
      },
    },
  ]);
}

export function registerRendererProtocol() {
  protocol.handle(rendererScheme, async (request) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        headers: {
          Allow: "GET, HEAD",
        },
        status: 405,
      });
    }

    const filePath = getRendererFilePath(request.url);

    if (!filePath) {
      return new Response("Not found", { status: 404 });
    }

    try {
      const response = await net.fetch(pathToFileURL(filePath).toString());
      const isHtml = path.extname(filePath) === ".html";

      if (request.method === "GET" && !isHtml) {
        return response;
      }

      const headers = new Headers(response.headers);

      if (isHtml) {
        headers.set("Content-Security-Policy", productionContentSecurityPolicy);
      }

      if (request.method === "HEAD") {
        await response.body?.cancel();
      }

      return new Response(request.method === "HEAD" ? null : response.body, {
        headers,
        status: response.status,
        statusText: response.statusText,
      });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  });
}
