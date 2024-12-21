import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { DirectoryInfo, FileInfo, IFileApi } from '../types/file-models'



// Custom APIs for renderer
const api = {}
console.log('api loading')

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
export const backend = {
  nodeVersion: async (msg: string): Promise<string> => await ipcRenderer.invoke('node-version', msg)
}

contextBridge.exposeInMainWorld('backend', backend)
//register the terminal api
contextBridge.exposeInMainWorld('system', {
  getSystemInfo: async (): Promise<ISystem> => {
    return await ipcRenderer.invoke('get-system-info')
  }
})
const fileRendererApi: IFileApi = {
  getFilesInDirectory: (folder: string): Promise<FileInfo[]> => {
      return window.Electron.ipcRenderer.invoke('get-files-in-folder', folder)
  },
  getSubDirectories: (folder: string): Promise<DirectoryInfo[]> => {
      return window.Electron.ipcRenderer.invoke('get-folder-sub-directories', folder)
  }
}
contextBridge.exposeInMainWorld('fileApi', fileRendererApi)
//contextBridge.exposeInMainWorld('fileApi', fileRendererApi)
console.log('api loaded')
// eslint-disable-next-line @typescript-eslint/no-unused-vars

