import { fileApi } from "../../utils/file-utils"
import { FileInfo, DirectoryInfo } from "types/file-models"
import { ipcMain } from "electron"




export const registerFileHandlers = () => {
  ipcMain.handle('get-files-in-folder', (event: Electron.IpcMainInvokeEvent, folder: string): Promise<FileInfo[]> => {
    return fileApi.getFilesInDirectory(folder)
  })
ipcMain.handle('get-folder-sub-directories', (event: Electron.IpcMainInvokeEvent, folder: string): Promise<DirectoryInfo[]> => {
    return fileApi.getSubDirectories(folder)
  })
}


