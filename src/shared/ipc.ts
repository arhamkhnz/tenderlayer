export const ipcChannels = {
  ping: 'app:ping',
} as const

export type IpcContract = {
  [ipcChannels.ping]: {
    args: []
    result: 'pong'
  }
}

export interface ElectronApi {
  versions: Readonly<{
    chrome: string
    electron: string
    node: string
  }>
  ping: () => Promise<IpcContract[typeof ipcChannels.ping]['result']>
}
