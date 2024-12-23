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
  const [fit, setFit] = useState<FitAddon|null>(null)
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
   
    const t = new Terminal()
    
    
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
     
    }
    if (terminalRef.current && terminal) {
      const id = await loadBackendTerminal()
      terminal.loadAddon(fitAddon)
      terminal.clear()
      terminal.open(terminalRef.current)
    
      
      fitAddon.activate(terminal)
     fitAddon.fit()
     setFit(fitAddon)
      terminal.onData((data: string) => {
     
        ptyApi.writeToTerminal(data, id)
      })
      ptyApi.receive(`terminal-output-${id}`, (data) => {

        writeStreamToTerminal(data?.toString() || '')
      })
      setLoaded(true)
      embiggen()
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
  }
  const embiggen=()=>{
    
      console.log('fitting')
      fit?.fit()
   
  }

  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        console.log('Width:', width, 'Height:', height);
        // Call your function here
        embiggen();
      }
     
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    return () => {
      if (terminalRef.current) {
        resizeObserver.unobserve(terminalRef.current);
      }
    };
  }, [fit]);

  return (
    <div className='  h-full w-full border-2 place-content-stretch border-red-400 '>
      <div  id="terminal" className="xterm border-2 border-green-400 " ref={terminalRef}  style={{height:"100%"}}/>
    </div>
  )
}
