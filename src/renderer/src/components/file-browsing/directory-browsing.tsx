import React, { useState, useEffect } from 'react';
import {  DirectoryInfo } from 'types/file-models';
import { fileRendererApi } from './file-api';
import { useDirectory } from '@renderer/context/DirectoryContext';




const DirectoryBrowsing: React.FC = () => {
  const [directories, setDirectories] = useState<DirectoryInfo[]>([]);
 const [expandedDirectories, setExpandedDirectories] = useState<string[]>([]);
 const {currentDirectory, setCurrentDirectory} = useDirectory();
  const [dirChanged, setDirChanged] = useState<boolean>(false);
  useEffect(() => {
    const fetchRootDirectories = async () => {
      const rootDirectories = await fileRendererApi.getSubDirectories('C:\\');
      setDirectories(rootDirectories);
    };

    fetchRootDirectories();
  }, []);



useEffect(() => {

    if(currentDirectory){
        handleDirectoryChanged(currentDirectory);}
    
   
}, [currentDirectory]);
useEffect(() => {
    if(dirChanged){
        const container = document.getElementById('browser');
        if (!container) return;
        const target = document.getElementById(currentDirectory);
        if (!target) return;
        container.scrollTop = target.offsetTop - container.offsetTop-50;
        setDirChanged(false);}
    },
    [expandedDirectories]);

const handleToggle = async (dir: string) => {
    //if the directory is already expanded, collapse it
     if (expandedDirectories.includes(dir)) {

       setExpandedDirectories(expandedDirectories.filter(d => d !== dir));
       return;
     }
     //expand the directory
     //console.log('expanding directory:', dir.fullPath);
     const subDirectories = await fileRendererApi.getSubDirectories(dir);
    // console.log('sub directories:', subDirectories);
     //only add the sub directories if they are not already in the list
     const newDirectories = subDirectories.filter(subDir => !directories.some(d => d.fullPath === subDir.fullPath));
     setDirectories([...directories, ...newDirectories]);
 
    
     // setTimeout(() => {
     //     setExpandedDirectories([...expandedDirectories, dir.fullPath]);
     // }, 500);
    setExpandedDirectories([...expandedDirectories, dir]);
    //setCurrentDirectory(dir.fullPath, 'dir-explorer');
 };
 
const handleDirectoryChanged = async (d: string) => {
  //  setExpandedDirectories([]);
    //await new Promise(resolve => setTimeout(resolve, 500));
    //split the path into parts
    
    let currentDir=d;
    let paths:string[]=[];
    let newDirs:DirectoryInfo[]=[];
    const subDirectories = await fileRendererApi.getSubDirectories(currentDir);
    newDirs=[...newDirs, ...subDirectories];
    while(true){
        const parent= await fileRendererApi.getParentDirectory(currentDir);
        const subDirectories = await fileRendererApi.getSubDirectories(parent);
        //only add the sub directories if they are not already in the list
        const newDirectories = subDirectories.filter(subDir => !directories.some(d => d.fullPath === subDir.fullPath));
        newDirs=[...newDirs, ...newDirectories];
        //console.log(directories)
        //if the parent is not found then break
        if(!parent || parent==='C:\\'){
            break;
        }
        //add the parent to the start of the list
        paths.unshift(parent);
        currentDir=parent;
    }
    paths.push(d);
  
    setExpandedDirectories(paths);

    const newDirectories = newDirs.filter(subDir => !directories.some(d => d.fullPath.toLowerCase() === subDir.fullPath.toLowerCase()));
    setDirectories([...directories, ...newDirectories]);
    //iterate through the paths and expand the directories
    setDirChanged(true);
    
    
    
}
const isExpanded = (dir: string) => {
    const expanded = expandedDirectories.includes(dir.toLowerCase());

    return expanded;
}

const renderDirectories = ( parentPath: string ) => {
   // console.log('rendering directories in path:', parentPath);
   //display sub directories in the parent path

    const subDirectories = directories.filter(dir => dir.parendDirectory?.toLowerCase()===parentPath.toLowerCase());

    return subDirectories.map((dir) => {
       // console.log('rendering directory:', dir.fullPath);
    return (
      <div className='ml-2' key={dir.fullPath}>
        <div
        onClick={() => {
          setCurrentDirectory(dir.fullPath, 'dir-explorer');
         ;
        }}
        className={`flex items-center hover:cursor-pointer hover:bg-gray-200 hover:text-blue-500 ${currentDirectory === dir.fullPath ? 'bg-blue-100 text-blue-700 ' : ''}`}
        id={dir.fullPath}
        >
        <button onClick={(e) => { e.stopPropagation(); handleToggle(dir.fullPath); }}>
          {isExpanded(dir.fullPath) ? '-' : '+'}
        </button>
        📁 {dir.name}
        </div>
        {isExpanded(dir.fullPath)===true? renderDirectories(dir.fullPath) : null}
      </div>
    );
    });
};

  return <div className='h-full overflow-y-auto' id="browser" tabIndex={3}>{renderDirectories('C:\\')}</div>;
};

export default DirectoryBrowsing;