export interface FileInfo {
    name: string;
    type: string;
    dateModified: Date;
    size: number;
}
export interface DirectoryInfo {
    name: string;
    dateModified: Date;
    fullPath: string;
    parendDirectory?: string;
}
export interface IFileApi {
    getSubDirectories(directoryPath: string): Promise<DirectoryInfo[]>;
    getFilesInDirectory(directoryPath: string): Promise<FileInfo[]>;
    getParentDirectory(directoryPath: string): Promise<string>;
  
}