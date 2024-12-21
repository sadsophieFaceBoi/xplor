import { DirectoryInfo, FileInfo, IFileApi } from "types/file-models"

export const fileRendererApi: IFileApi = {
    getFilesInDirectory: (folder: string): Promise<FileInfo[]> => {
        console.log('getFilesInDirectory called')
        return window.electron.ipcRenderer.invoke('get-files-in-folder', folder)
    },
    getSubDirectories: (folder: string): Promise<DirectoryInfo[]> => {
        console.log('getSubDirectories called')
        return window.electron.ipcRenderer.invoke('get-folder-sub-directories', folder)
    }
  }