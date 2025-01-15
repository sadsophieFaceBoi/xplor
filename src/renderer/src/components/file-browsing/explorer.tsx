import  { useEffect, useState } from 'react';
import Split from 'react-split';
import { Button, TableCellActions, TableHeaderCell, Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider } from '@fluentui/react-components';

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
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState('ascending');
  //loads the contents of the current directory
  const loadDirectoryContents = async (directory: string) => {

   
    const f=await fileRendererApi.getFilesInDirectory(directory);
   const d= await fileRendererApi.getSubDirectories(directory);
    if (f && JSON.stringify(f) !== JSON.stringify(files)) {
      setFiles(f);

    }
    if (d &&JSON.stringify(d) !== JSON.stringify(directories)) {
      setDirectories(d);
   
    }
  }
  //called when the current directory
  useEffect(() => {
    
    if (!currentDirectory) return
    setSearchTerm('')
    loadDirectoryContents(currentDirectory)
    const interval = setInterval(() => {
      // loadDirectoryContents(currentDirectory)
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
    const d = directories.filter((dir) =>dir.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const f = files.filter((file) =>file.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredDirectories(d);
    setFilteredFiles(f);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortColumn(column);
      setSortDirection('ascending');
    }
  };

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue < bValue) return sortDirection === 'ascending' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'ascending' ? 1 : -1;
    return 0;
  });



const openFile = (fileName:string,asText:boolean) => {
  // Implement file open logic here
  console.log('openFile', `${currentDirectory}\\${fileName}`);
  if(asText){
    fileRendererApi.openFile(`${currentDirectory}\\${fileName}`,"notepad++.exe");
    return
  }
  fileRendererApi.openFile(`${currentDirectory}\\${fileName}`);
};


const getFileSizeString = (size) => {
  if (size < 1024) {
    return '<1 KB';
  }
  //if greater than 1024 kb convert to MB
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  }
  //if greater than 1024 MB convert to GB
  if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }
  //if greater than 1024 GB convert to TB
  return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

const handleBreadcrumbClick = (path: string) => {

  setCurrentDirectory(path+"\\", 'breadcrumb');
};

const renderBreadcrumb = () => {
  const pathParts = currentDirectory.split('\\');
  return (
    <Breadcrumb>
      {pathParts.map((part, index) => {
        const path = pathParts.slice(0, index + 1).join('\\');
        return (
            <>
            <BreadcrumbItem key={path}>
            <BreadcrumbButton onClick={() => handleBreadcrumbClick(path)}>
              {part }
            </BreadcrumbButton>
            </BreadcrumbItem>
            {index < pathParts.length - 1 && <BreadcrumbDivider />}
            </>
        );
      })}
    </Breadcrumb>
  );
};

  return (
   
      <div className="flex flex-col flex-grow h-full w-full m-2 p-2">
        <h1>File Explorer</h1>
        {renderBreadcrumb()}
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
            gutterStyle={(index, direction) => ({
              backgroundColor: 'white',
              cursor: 'col-resize',
              width: '1px',
              margin: '0 5px',
              hover: {
                backgroundColor: 'lightblue',
              },
            })}
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
              <Table sortable size='medium'  >
                
              
                
                <TableHeader className='bg-stone-700' >
                    <TableRow>
                    <TableHeaderCell  onClick={() => handleSort('name')} 
                    className='hover:bg-blue-200 hover:text-slate-900 hover:cursor-pointer w-3/5' >
                       Name {sortColumn === 'name' && (sortDirection === 'ascending' ? '↑' : '↓')}
                    </TableHeaderCell>
                    <TableHeaderCell onClick={() => handleSort('size')} className='hover:bg-blue-200 hover:text-slate-900 hover:cursor-pointer' style={{ flex: 1 }}>
                      Size {sortColumn === 'size' && (sortDirection === 'ascending' ? '↑' : '↓')}
                    </TableHeaderCell>
                    <TableHeaderCell onClick={() => handleSort('dateModified')} className='hover:bg-blue-200 hover:text-slate-900 hover:cursor-pointer' style={{ flex: 1 }}>
                      Date Modified {sortColumn === 'dateModified' && (sortDirection === 'ascending' ? '↑' : '↓')}
                    </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFiles.map((file) => (
                    <TableRow key={file.name} onClick={() => openFile(file.name,false)}>
                      <TableCell className='break-words'>
                        <TableCellActions>
                          <Button  onClick={(e) => { e.stopPropagation(); openFile(file.name, true); }}>Open as text</Button>
                         
                        </TableCellActions>
                        {file.name} 
                      </TableCell>
                      <TableCell>{getFileSizeString(file.size)}</TableCell>
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