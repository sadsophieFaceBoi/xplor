import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { ISystem } from "../../types/system";
import { useDirectory } from "../context/DirectoryContext";
import { convertWindowsPathToUnixPath } from "../../utils/file-utils";

export const TerminalComponent = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const { currentDirectory, setCurrentDirectory,sender } = useDirectory();
    const [terminal, setTerminal] = useState<Terminal | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [termId, setTermId] = useState(-1);
    const [systemInfo,setSystemInfo] =useState<ISystem|null>(null);
    const [userComputer,setUserComputer]=useState('');
    let directoryChangedExternally = false;
    const setWorkingDirectory = (data:string) => {
        if(directoryChangedExternally) {
            directoryChangedExternally = false;
            return;
        }
        const d= data.toString();
        setCurrentDirectory(d,'terminal');
    };
    useEffect(() => {
        if (terminal) return;
        loadSysInfo();
        const t = new Terminal();
        setTerminal(t);
    }, []);
    useEffect(() => {
        if (terminal&&sender!=='terminal') {
            const unixPath = convertWindowsPathToUnixPath(currentDirectory);
            //replace the homedir with ~
            let homePath = systemInfo?.homedir || '';
            homePath=convertWindowsPathToUnixPath(homePath);
            const updatedPath = unixPath.replace(homePath, '~');
            window.terminal.writeToTerminal(`cd ${updatedPath}\r`,termId);
            directoryChangedExternally = true;
        }
    }, [currentDirectory, terminal,sender]);
    const loadSysInfo = async () => {
        if(systemInfo!=null) return;
        const d=await window.system.getSystemInfo();
        setSystemInfo(d);
        const uMac=`${d.user}@${d.computer}`;
        setUserComputer(uMac);
    }
    useEffect(() => {
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
        //search pattern should be [32muser@computer
        const pattern = `\\[32m\\s*${userComputer}`;
        const regex = new RegExp(pattern, 'i');
        if (regex.test(data) && userComputer !== '') {
            const fields = data.split('[');
            //get the field that starts with 33m
            let field = fields.find(f => f.startsWith('33m'));
            if (!field) {
                return;
            }
            field = field.split('[')[0].replace('', '').replace('33m', '').trim();
            const path = field;
            const homePath = systemInfo?.homedir || '';
            const updatedPath = path.replace(/^~/, homePath)
                        .replace(/\//g, '\\')
                        .replace('$', '')
                        .trim();
            setWorkingDirectory(updatedPath);
        } 
    }

    return <div>
    <button onClick={loadSysInfo}>Load System Info</button>
     <div id="terminal" className="xterm" ref={terminalRef} style={{textAlign:"left"}}  />
    </div>;
};
