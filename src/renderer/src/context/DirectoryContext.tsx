import { createContext, useState, useContext, ReactNode } from 'react'
import { convertUnixPathToWindowsPath } from '../../../utils/file-utils'

interface DirectoryContextType {
  currentDirectory: string
  setCurrentDirectory: (directory: string, sender: string) => void
  sender: string
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined)

export const DirectoryProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [currentDirectory, setCurrentDirectoryState] = useState<string>('')
  const [sender, setSender] = useState<string>('')

  const setCurrentDirectory = (directory: string, sender: string): void => {
    if (directory.startsWith('/')) {
      directory = convertUnixPathToWindowsPath(directory)
    }
    console.log('setting directory:', directory)
    setSender(sender)
    setCurrentDirectoryState(directory)
  }

  return (
    <DirectoryContext.Provider value={{ currentDirectory, setCurrentDirectory, sender }}>
      {children}
    </DirectoryContext.Provider>
  )
}

export const useDirectory = (): DirectoryContextType => {
  const context = useContext(DirectoryContext)
  if (context === undefined) {
    throw new Error('useDirectory must be used within a DirectoryProvider')
  }
  return context
}
