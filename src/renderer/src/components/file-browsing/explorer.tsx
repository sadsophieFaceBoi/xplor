import React, { useEffect, useState } from 'react'
import { useDirectory } from '../../context/DirectoryContext'
import { fileRendererApi } from './file-api'
import { DirectoryInfo, FileInfo } from 'types/file-models'
import './explorer.css'

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
    loadDirectoryContents(currentDirectory)
    const interval = setInterval(() => {
      //loadDirectoryContents(currentDirectory)
    }, 2000)
    return () => clearInterval(interval)
  }, [currentDirectory])

  const handleFolderClick = (folder: string) => {
    setCurrentDirectory(`${currentDirectory}\\${folder}`, 'explorer')
  }

  return (
    <div className="file-explorer">
      <h2>File Explorer</h2>
      <div className="directories">
        {directories.map((dir) => (
          <div key={dir.name} className="directory" onClick={() => handleFolderClick(dir.name)}>
            📁 {dir.name}
          </div>
        ))}
      </div>
      <div className="files">
        {files.map((file) => (
          <div key={file.name} className="file">
            📄 {file.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileExplorer