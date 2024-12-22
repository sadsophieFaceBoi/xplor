import React, { useEffect, useState } from 'react';
import Split from 'react-split';


import { DirectoryInfo, FileInfo } from 'types/file-models';
import { fileRendererApi } from './file-api';
import { useDirectory } from '@renderer/context/DirectoryContext';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@fluentui/react-components';

const FileExplorer = () => {
  const {currentDirectory, setCurrentDirectory,sender} = useDirectory();
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<FileInfo[]>([])
  const [directories, setDirectories] = useState<DirectoryInfo[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileInfo[]>([])
  const [filteredDirectories, setFilteredDirectories] = useState<DirectoryInfo[]>([])
  //loads the contents of the current directory
  const loadDirectoryContents = async (directory: string) => {
    const [files, directories] = await Promise.all([
      fileRendererApi.getFilesInDirectory(directory),
      fileRendererApi.getSubDirectories(directory)
    ])
    setFiles(files)
    setDirectories(directories)
    setSearchTerm('')
    //setFilteredItems()
  }
  //called when the current directory
  useEffect(() => {
    if(sender === 'explorer'){
    
      return
    }

   
    if (!currentDirectory) return
    loadDirectoryContents(currentDirectory)
    const interval = setInterval(() => {
       loadDirectoryContents(currentDirectory)
    }, 2000)
    return () => clearInterval(interval)
  }, [sender,currentDirectory])
  useEffect(() => {
    setFilteredItems()
  }, [searchTerm, files, directories])
  const handleFolderClick = (folder: string) => {
      setCurrentDirectory(`${currentDirectory}\\${folder}`, 'explorer')
    }

  const setFilteredItems = () => {
    const d = directories.filter((dir) =>
    dir.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const f = files.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDirectories(d);
    setFilteredFiles(f);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };





const moveFile = (fileName, targetDirectory) => {
  // Implement file move logic here
};

const openFile = (fileName) => {
  // Implement file open logic here
};

const deleteFile = (fileName) => {
  // Implement file delete logic here
};


  return (
   
      <div className="flex flex-col flex-grow h-full w-full m-2 p-2">
        <h1>File Explorer</h1>
        <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-2 p-1 border text-black"
              />
        <div className='flex-grow h-full overflow-y-auto'>
          <Split
            sizes={[30, 70]}
            minSize={100}
            gutterSize={10}
            direction='horizontal'
            className='flex-grow flex h-full w-full'
        
          >
            <div>
              <h1>Directories</h1>
              
              {filteredDirectories.map((dir) => (
                <div
                  key={dir.name}
                  className="hover:bg-blue-200 hover:text-slate-900 hover:cursor-pointer"
                  onClick={() => handleFolderClick(dir.name)}
                >
                  📁 {dir.name}
                </div>
              ))}
            </div>
            <div  >
              <h1>Files</h1>
              <Table >
                <TableHeader>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Date Modified</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map((file) => (
                    <TableRow key={file.name} >
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{file.size < 1024 ? '<1 KB' : (file.size / 1024).toFixed(2) + ' KB'}</TableCell>
                      <TableCell>
                        {file.dateModified.toLocaleDateString()} {file.dateModified.toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Split>
        </div>
      </div>
   
  );
};

export default FileExplorer;