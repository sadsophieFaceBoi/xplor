
export const convertWindowsPathToUnixPath = (windowsPath: string): string => {
    const unixPath = windowsPath.replace(/\\/g, '/').replace(/^([a-zA-Z]):/, '/$1').toLowerCase();
    return unixPath;
};
//add a method to convert a unix path to a windows path
export const convertUnixPathToWindowsPath = (unixPath: string): string => {
    const windowsPath = unixPath.replace(/\//g, '\\').replace(/^\/([a-zA-Z])/, '$1:').toLowerCase();
    return windowsPath;
};