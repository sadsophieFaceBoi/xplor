import { DirectoryInfo, FileInfo, IFileApi } from "../types/file-models"
import * as fs from 'fs';
import * as path from 'path';
export const convertWindowsPathToUnixPath = (windowsPath: string): string => {
  
  const unixPath = windowsPath
    .replace(/\\/g, '/')
    .replace(/^([a-zA-Z]):/, '/$1')
    .toLowerCase()
    console.log('unixPath', unixPath)
  return unixPath
}
//add a method to convert a unix path to a windows path
export const convertUnixPathToWindowsPath = (unixPath: string): string => {
  const windowsPath = unixPath
    .replace(/\//g, '\\')
    .replace(/^\/([a-zA-Z])/, '$1:')
    .toLowerCase()
  return windowsPath}

  export const getSubDirectories = (directoryPath: string): Promise<DirectoryInfo[]> => {
    const directories: DirectoryInfo[] = [];

    const items = fs.readdirSync(directoryPath, { withFileTypes: true });
    items.forEach(item => {
        if (item.isDirectory()) {
            const fullPath = path.join(directoryPath, item.name);
            const stats = fs.statSync(fullPath);
            directories.push({
                name: item.name,
                dateModified: stats.mtime
            });
        }
    });
   // console.log('directories', directories)
    return Promise.resolve(directories);
};


export const getFilesInDirectory = (directoryPath: string): Promise<FileInfo[]> => {
    const files: FileInfo[] = [];

    const items = fs.readdirSync(directoryPath, { withFileTypes: true });

    items.forEach(item => {
        if (item.isFile()) {
            const fullPath = path.join(directoryPath, item.name);
            const stats = fs.statSync(fullPath);
            files.push({
                name: item.name,
                type: path.extname(item.name),
                dateModified: stats.mtime,
                size: stats.size
            });
        }
    });

    return Promise.resolve(files);
};
export const fileApi: IFileApi = {
    getSubDirectories,
    getFilesInDirectory
};
  