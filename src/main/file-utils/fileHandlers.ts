import { fileApi } from "../../utils/file-utils"
import { FileInfo, DirectoryInfo } from "types/file-models"
import { ipcMain } from "electron"
import { exec } from "child_process";

 const openFile = (filePath: string, appName?: string): void => {
    const command = appName ? ` start ${appName} "${filePath}"` : `"${filePath}"`;
    exec(command, (error: any) => {
        if (error) {
            console.error(`Error opening file: ${error.message}`);
        }
    });
};




export const registerFileHandlers = () => {
  ipcMain.handle('get-files-in-folder', (_event: Electron.IpcMainInvokeEvent, folder: string): Promise<FileInfo[]> => {
    return fileApi.getFilesInDirectory(folder)
  })
ipcMain.handle('get-folder-sub-directories', (_event: Electron.IpcMainInvokeEvent, folder: string): Promise<DirectoryInfo[]> => {
    return fileApi.getSubDirectories(folder)
  })
  ipcMain.handle('open-file', (_event: Electron.IpcMainInvokeEvent, file: string,appName?:string): void => {
    openFile(file,appName)
  })
}
ipcMain.handle('get-parent-directory', (_event: Electron.IpcMainInvokeEvent, directory: string): Promise<string> => {
    return fileApi.getParentDirectory(directory)
  }

)
