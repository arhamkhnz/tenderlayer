import { contextBridge, ipcRenderer } from 'electron/renderer'
import {
  ipcChannels,
  type ElectronApi,
  type IpcContract,
} from '../shared/ipc.js'

const electronApi = {
  versions: {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
  },
  ping: () =>
    ipcRenderer.invoke(ipcChannels.ping) as Promise<
      IpcContract[typeof ipcChannels.ping]['result']
    >,
} satisfies ElectronApi

contextBridge.exposeInMainWorld('electronAPI', electronApi)
