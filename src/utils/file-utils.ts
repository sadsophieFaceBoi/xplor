import { DirectoryInfo, FileInfo, IFileApi } from "../types/file-models"
import * as fs from 'fs';
import * as path from 'path';

export const convertWindowsPathToUnixPath = (windowsPath: string): string => {
  
  const unixPath = windowsPath
    .replace(/\\/g, '/')
    .replace(/^([a-zA-Z]):/, '/$1')
    .toLowerCase()
 
  return unixPath
}
//add a method to convert a unix path to a windows path
export const convertUnixPathToWindowsPath = (unixPath: string): string => {
    const windowsPath = unixPath
      .replace(/^\//, '')
      .replace(/\//g, '\\')
      .replace(/^([a-zA-Z])/, '$1:');

    return windowsPath;
  }

export const getSubDirectories = (directoryPath: string): Promise<DirectoryInfo[]> => {
  const directories: DirectoryInfo[] = [];
  
  try {
    const items = fs.readdirSync(directoryPath, { withFileTypes: true });
    items.forEach(item => {
      if (item.isDirectory()) {
        const fullPath = path.join(directoryPath, item.name);
     
        try {
          const stats = fs.statSync(fullPath);
          directories.push({
            name: item.name,
            dateModified: stats.mtime,
            fullPath: fullPath,
            parendDirectory: directoryPath
          });
        } catch (err) {
          //console.error(`Access denied to directory: ${fullPath}`, err);
        }
      }
    });
  } catch (err) {
    //console.error(`Access denied to directory: ${directoryPath}`, err);
  }

  return Promise.resolve(directories);
};

export const getFilesInDirectory = (directoryPath: string): Promise<FileInfo[]> => {
    const files: FileInfo[] = [];
   
    const items = fs.readdirSync(directoryPath, { withFileTypes: true });

    items.forEach(item => {
        if (item.isFile()) {
            const fullPath = path.join(directoryPath, item.name);
            try {
              const stats = fs.statSync(fullPath);
              files.push({
                  name: item.name,
                  type: path.extname(item.name),
                  dateModified: stats.mtime,
                  size: stats.size
              });
            } catch (err) {
                //console.error(`Access denied to file: ${fullPath}`, err);
            }
        }
    });

    return Promise.resolve(files);
};
//get parent directory
export const getParentDirectory = (directoryPath: string): Promise<string> => {
    //check if the directory is the root directory
    if (directoryPath.toLowerCase() === 'c:\\' || directoryPath === '/') {
        return Promise.resolve("");
    }
    const parent = path.dirname(directoryPath);
    //check if the parent is the root directory
  
    return Promise.resolve( parent);
};
export const fileApi: IFileApi = {
    getSubDirectories,
    getFilesInDirectory,
    getParentDirectory,
    
};