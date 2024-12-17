import * as pty from 'node-pty';
import {BrowserWindow,  contextBridge,  ipcMain, IpcMainInvokeEvent, ipcRenderer} from 'electron';
import { IPtyEvents } from './IPty';
import * as os from 'os';
import { execSync } from 'child_process';
import { env } from 'process';
const shell =   "C:\\Program Files\\Git\\bin\\bash.exe";
const cols = 80; // default column size
const rows = 24; // default row size
let mainWindow: BrowserWindow | null = null;
const terminals: PtyTerminal[] = [];
const spawnNewTerminal = (w: BrowserWindow) :number=> {
    const id = terminals.length;
    const terminal = new PtyTerminal(w,terminals.length);
    terminals.push(terminal);
    return id;
}


class PtyTerminal {
    private mainWindow: BrowserWindow | null = null;
    private ptyProcess: pty.IPty | null = null;
    private workingDirectoryRequested: boolean = false;
    private skipcount: number = 0;
    private id: number;
    private directorySent: boolean=false;
  
    constructor(mainWindow: BrowserWindow,id:number) {
      this.mainWindow = mainWindow;
      this.id=id;
      this.spawnPty();
       
    }
    private spawnPty() {
        this.ptyProcess = pty.spawn(shell, [], {
          name: 'xterm-color',
          cols,
          rows,
          cwd: process.env.HOME,
          env: process.env,
        });
    
        this.ptyProcess.write('export HISTCONTROL=ignorespace\rclear\r');
    
        this.ptyProcess.onData((data) => {
           if (this.mainWindow) {
            this.mainWindow.webContents.send(`terminal-output-${this.id}`, data);
              }

            // this.sendDataToTerminal(data);
        });
        
        ipcMain.on(`write-to-terminal-${this.id}`, (event: IpcMainInvokeEvent, data: string) => {
           
            this.ptyProcess?.write(data);
        });
        
        ipcMain.on(`get-working-directory-${this.id}`, (event: IpcMainInvokeEvent) => {
          this.getWorkingDirectory();
           
        });
      }
   
   private sendDataToTerminal(data: string) {

            if (this.mainWindow) {
                if (this.workingDirectoryRequested ) {
                    if (data.toString().trim() && data.toString().trim().includes('/')
                         && !data.includes('~')
                         && !data.includes('[')
                        &&!this.directorySent) {
                
                        this.mainWindow.webContents.send(`working-directory-${this.id}`, data);
                        setTimeout(() => {
                            this.directorySent=true;
                        },200);
                        return;
                    }  
                   return;
                } 
                else {
                        this.mainWindow.webContents.send(`terminal-output-${this.id}`, data);
                   
                }
               
            }
      }
      private getWorkingDirectory() {
        this.workingDirectoryRequested = true;
       this.directorySent=false;
            this.skipcount = 0;
       
        setTimeout(() => {
            this.ptyProcess?.write(` pwd\r`);
        }, 20);
    const interval = setInterval(() => {
        if (this.directorySent) {
       
            this.workingDirectoryRequested = false;
            clearInterval(interval);
      
        
        }
    }, 200);
    
        
    
      }

}
export function register(w:BrowserWindow) {
    mainWindow = w;
    
    ipcMain.handle("spawn-terminal", (event: IpcMainInvokeEvent) => {
        console.log('spawning terminal');
        if(mainWindow) {
            
           return spawnNewTerminal(mainWindow);
        }
      
    });
}


