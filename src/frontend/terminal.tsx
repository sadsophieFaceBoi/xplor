import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { ISystem } from "../types/system";

export const TerminalComponent = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
  
    const [terminal, setTerminal] = useState<Terminal | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [termId, setTermId] = useState(-1);
    const [systemInfo,setSystemInfo] =useState<ISystem|null>(null);
    const [userComputer,setUserComputer]=useState('');
    const setWorkingDirectory = (data:string) => {
        const d= data.toString();
        console.log('working directory set:',data.toString());
    };
    useEffect(() => {
        if (terminal) return;
        loadSysInfo();
        const t = new Terminal();
        setTerminal(t);
       
      
    }, []);
    const loadSysInfo = async () => {
        if(systemInfo!=null) return;
        const d=await window.system.getSystemInfo();
        setSystemInfo(d);
        const uMac=`${d.user}@${d.computer}`;
        
        setUserComputer(uMac);
    }
    useEffect(() => {
       // console.log('system info loaded:',systemInfo);
    }, [systemInfo]);
    useEffect(() => {
        if(loaded) return;
        initTerminal();
    }, [terminal]);
    const loadBackendTerminal = async ():Promise<number> => {
        const id = await window.terminal.spawn();
        setTermId(id);
        return id;       
    };
    const initTerminal = async () => {
        const fitAddon = new FitAddon();
        if (terminal) {
            terminal.loadAddon(fitAddon);
            terminal.clear();
        }
        if (terminalRef.current&&terminal) {
            const id=await loadBackendTerminal();
            terminal?.open(terminalRef.current);
            fitAddon.fit();
            terminal?.onData((data: string) => {
        
                window.terminal.writeToTerminal(data,id);
            });
            window.terminal.receive(`terminal-output-${id}`, (data) => {
             
                writeToTerminal(data);
            });
            window.terminal.receive(`working-directory-${id}`, (data) => { setWorkingDirectory(data) });
            setLoaded(true);
        }
    };

    const writeToTerminal=(data: string)=> {
        if (terminal) {
            terminal.write(data);
 
            checkForDirectoryChange(data);    
        }
    }
        
    const checkForDirectoryChange=(data: string) =>{
        
        if (data.startsWith('[32m') && data.toLowerCase().includes(userComputer.toLowerCase())) {
     
            const path = data.split(' ')[2].trim();
            const cleanPath = path.replace(/\x1b\[.*?m/g, '');
            const homePath = systemInfo?.homedir || '';
            const updatedPath = cleanPath.replace(/^~/, homePath).replace(/\//g, '\\');
             console.log('updated path:', updatedPath);
            setWorkingDirectory(updatedPath);
        }
    }

    return <div>
    <button onClick={loadSysInfo}>Load System Info</button>
     <div id="terminal" className="xterm" ref={terminalRef} style={{textAlign:"left"}}  />
    </div>;
};
