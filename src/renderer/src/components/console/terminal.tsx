import { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { convertWindowsPathToUnixPath } from '../../../../utils/file-utils'
import { useDirectory } from '../../context/DirectoryContext'
import { ptyApi } from './terminal-api'

export const TerminalComponent: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null)
  const { currentDirectory, setCurrentDirectory, sender } = useDirectory()
  const [terminal, setTerminal] = useState<Terminal | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [termId, setTermId] = useState(-1)
  const [systemInfo, setSystemInfo] = useState<ISystem | null>(null)
  const [userComputer, setUserComputer] = useState('')
  let directoryChangedExternally = false
  const setWorkingDirectory = (data: string|unknown): void => {
    if (directoryChangedExternally) {
      directoryChangedExternally = false
      return
    }
    const d = data?.toString() || ''
    setCurrentDirectory(d, 'terminal')
  }
  useEffect(() => {
    if (terminal) return
    loadSysInfo()
    
  }, [])
  useEffect(() => {
    if (terminal && sender !== 'terminal') {
      console.log('setting working directory:', currentDirectory)
      const unixPath = convertWindowsPathToUnixPath(currentDirectory)
      //replace the homedir with ~
      let homePath = systemInfo?.homedir || ''
      homePath = convertWindowsPathToUnixPath(homePath)
      const updatedPath = unixPath.replace(homePath, '~')
      console.log('setting :', currentDirectory)
      ptyApi.writeToTerminal(` cd ${updatedPath}\r`, termId)
      directoryChangedExternally = true
    }
  }, [currentDirectory, terminal, sender])
  const loadSysInfo = async (): Promise<void> => {
    if (systemInfo != null) return
    const d = await window.system.getSystemInfo()
    setSystemInfo(d)
    const uMac = `${d.user}@${d.computer}`
    setUserComputer(uMac)
  }
  //load the terminal when the system info is loaded
  useEffect(() => {
    if (!systemInfo) return
    if (terminal) return
    const t = new Terminal({ cols: 80 })
    
    setTerminal(t)
  }, [systemInfo])
  useEffect(() => {
    if (loaded) return
    initTerminal()
  }, [terminal])
  const loadBackendTerminal = async (): Promise<number> => {
    const id = await ptyApi.spawn()
    setTermId(id)
    return id
  }
  const initTerminal = async (): Promise<void> => {
    const fitAddon = new FitAddon()

    if (terminal) {
      terminal.loadAddon(fitAddon)
      terminal.clear()
    }
    if (terminalRef.current && terminal) {
      const id = await loadBackendTerminal()
      terminal?.open(terminalRef.current)
      fitAddon.fit()
      terminal?.onData((data: string) => {
     
        ptyApi.writeToTerminal(data, id)
      })
      ptyApi.receive(`terminal-output-${id}`, (data) => {

        writeStreamToTerminal(data?.toString() || '')
      })
      setLoaded(true)
    }
  }

  const writeStreamToTerminal = (data: string): void => {
    if (terminal) {
   
      terminal.write(data)
      checkForDirectoryChange(data)
    }
  }

  const checkForDirectoryChange = (data: string): void => {
    //search pattern should be [32muser@computer
    const pattern = `\\[32m\\s*.*${userComputer}`
    const regex = new RegExp(pattern, 'i')
   
    setTimeout(() => {

      if (regex.test(data) && userComputer !== '') {
       
        const fields = data.split('[')
        //get the field that starts with 33m
        let field = fields.find((f) => f.startsWith('33m'))
        if (!field) {
          return
        }
        field = field.split('[')[0].replace('', '').replace('33m', '').trim()
        const path = field
        const homePath = systemInfo?.homedir || ''
        const updatedPath = path.replace(/^~/, homePath).replace(/\//g, '\\').replace('$', '').trim()
      
        setWorkingDirectory(updatedPath)
      }
      else {
   
      }
    }, 200)
    // if (regex.test(data) && userComputer !== '') {
    //   console.log('found user computer:', userComputer)
    //   const fields = data.split('[')
    //   //get the field that starts with 33m
    //   let field = fields.find((f) => f.startsWith('33m'))
    //   if (!field) {
    //     return
    //   }
    //   field = field.split('[')[0].replace('', '').replace('33m', '').trim()
    //   const path = field
    //   const homePath = systemInfo?.homedir || ''
    //   const updatedPath = path.replace(/^~/, homePath).replace(/\//g, '\\').replace('$', '').trim()
    //   console.log('updated path:', updatedPath)
    //   setWorkingDirectory(updatedPath)
    // }
  }

  return (
    <div>
      <div id="terminal" className="xterm" ref={terminalRef} style={{ textAlign: 'left' }} />
    </div>
  )
}


