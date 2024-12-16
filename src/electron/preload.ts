// src/electron/preload.ts

import { contextBridge, ipcRenderer } from "electron";
import { IPtyEvents } from "./console/IPty";

export const backend = {
  nodeVersion: async (msg: string): Promise<string> =>
    await ipcRenderer.invoke("node-version", msg),
};

contextBridge.exposeInMainWorld("backend", backend);
//register the terminal api
export const ptyApi: IPtyEvents = {
    writeToTerminal: (data: string,id:number) => {
        
        ipcRenderer.send(`write-to-terminal-${id}`, data);
    },
    receive: (channel: string, func: (...args: any[]) => void) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    spawn: () :Promise<number>=> {
        console.log('spawn terminal');
        return ipcRenderer.invoke('spawn-terminal');
    },
    getWorkingDirectory: (id:number) => {
       
        ipcRenderer.send(`get-working-directory-${id}`);
        console.log('get working directory for terminal:',id);	
    },
  

};
contextBridge.exposeInMainWorld("terminal", ptyApi);