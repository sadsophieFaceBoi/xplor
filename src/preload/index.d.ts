import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    system: {
      getSystemInfo: () => Promise<ISystem>
    }
    fileApi: IFileApi
  }
}
