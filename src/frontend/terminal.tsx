import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export const TerminalComponent = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
  
    const [terminal, setTerminal] = useState<Terminal | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [termId, setTermId] = useState(-1);
    const setWorkingDirectory = (data:string) => {
        const d= data.toString();
        console.log('working directory set:',data.toString());
    };
    useEffect(() => {
        if (terminal) return;
        const t = new Terminal();
        setTerminal(t);
    }, []);
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
                terminal.write(data.toString());
            });
            window.terminal.receive(`working-directory-${id}`, (data) => { setWorkingDirectory(data) });
            setLoaded(true);
        }
    };
   
    const requestWorkingDirectory = () => {
       
        window.terminal.getWorkingDirectory(termId);
    };
    return <div>
        <button onClick={requestWorkingDirectory}>Request Working Directory</button>
        <div id="terminal" className="xterm" ref={terminalRef} style={{textAlign:"left"}}  />
    </div>;
};
