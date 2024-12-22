import React, { useEffect, useState } from 'react'
import { useDirectory } from '../../context/DirectoryContext'
import { fileRendererApi } from './file-api'
import { DirectoryInfo, FileInfo } from 'types/file-models'
import Split from 'react-split'


export const FileExplorer: React.FC = () => {
  const { currentDirectory, setCurrentDirectory } = useDirectory()
  const [files, setFiles] = useState<FileInfo[]>([])
  const [directories, setDirectories] = useState<DirectoryInfo[]>([])

  const loadDirectoryContents = async (directory: string) => {
    const [files, directories] = await Promise.all([
      fileRendererApi.getFilesInDirectory(directory),
      fileRendererApi.getSubDirectories(directory)
    ])
    setFiles(files)
    setDirectories(directories)
  }

  useEffect(() => {
    if (!currentDirectory) return
    loadDirectoryContents(currentDirectory)
    const interval = setInterval(() => {
      loadDirectoryContents(currentDirectory)
    }, 2000)
    return () => clearInterval(interval)
  }, [currentDirectory])

  const handleFolderClick = (folder: string) => {
    setCurrentDirectory(`${currentDirectory}\\${folder}`, 'explorer')
  }

  return (
    <>
      <div className="flex flex-row flex-grow h-full w-full m-2 p-2">
     
     <Split 
            sizes={[30, 70]} minSize={10}  gutterSize={10} direction='vertical' className='flex-grow h-full border-2 border-yellow-400'>
       <div >
         <h1>Directories</h1>
         {directories.map((dir) => (
           <div key={dir.name} className="hover:bg-blue-200 hover:text-slate-900 hover:cursor-pointer" onClick={() => handleFolderClick(dir.name)}>
             📁 {dir.name}
           </div>
         ))}
       </div>
       <div >
         <h1>Files</h1>
         <table className="table-auto border-collapse">
           <thead className='border border-y-gray-400'>
             <tr>
               <th>Name</th>
               <th>Type</th>
               <th>Date Modified</th>
               <th>Size</th>
             </tr>
           </thead>
           <tbody>
             {files.map((file) => (
               <tr key={file.name} className=' border border-y-gray-400
                                              hover:bg-blue-200 hover:text-slate-900 hover:cursor-pointer'>
                 <td>📄 {file.name}</td>
                 <td>{file.type}</td>
                 <td>{file.dateModified.toLocaleDateString()}</td>
                 <td>{file.size}</td>
               </tr>
             ))}
           </tbody>
           </table>
       </div>
     </Split>

 </div>
    </>
  
  )
}

export default FileExplorer