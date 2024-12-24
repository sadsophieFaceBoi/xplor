import { DirectoryInfo, FileInfo, IFileApi } from "types/file-models"
interface IFileRendererApi extends IFileApi {
    openFile(file: string,appName?:string): void;
  }
  export const fileRendererApi: IFileRendererApi = {
    getFilesInDirectory: (folder: string): Promise<FileInfo[]> => {
    
        return window.electron.ipcRenderer.invoke('get-files-in-folder', folder)
    },
    getSubDirectories: (folder: string): Promise<DirectoryInfo[]> => {
        return window.electron.ipcRenderer.invoke('get-folder-sub-directories', folder)
    },
    openFile: (file: string,appName?:string): void => {
         window.electron.ipcRenderer.invoke('open-file', file,appName)
    }
   
  }
