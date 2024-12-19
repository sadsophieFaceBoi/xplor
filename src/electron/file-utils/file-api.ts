import * as fs from 'fs';
import * as path from 'path';

interface DirectoryInfo {
    name: string;
    dateModified: Date;
}

export const getSubDirectories = (directoryPath: string): DirectoryInfo[] => {
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

    return directories;
};
interface FileInfo {
    name: string;
    type: string;
    dateModified: Date;
    size: number;
}

export const getFilesInDirectory = (directoryPath: string): FileInfo[] => {
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

    return files;
};