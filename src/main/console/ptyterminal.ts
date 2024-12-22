import * as pty from 'node-pty'
import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron'
const shell = 'C:\\Program Files\\Git\\bin\\bash.exe'
const cols = 80 // default column size
const rows = 24 // default row size
let mainWindow: BrowserWindow | null = null
const terminals: PtyTerminal[] = []
const spawnNewTerminal = (w: BrowserWindow): number => {
  const id = terminals.length
  const terminal = new PtyTerminal(w, terminals.length)
  terminals.push(terminal)
  return id
}

class PtyTerminal {
  private mainWindow: BrowserWindow | null = null
  private ptyProcess: pty.IPty | null = null
  private id: number
  private directorySent: boolean = false

  constructor(mainWindow: BrowserWindow, id: number) {
    this.mainWindow = mainWindow
    this.id = id
    this.spawnPty()
  }
  private spawnPty(): void {
    this.ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols,
      rows,
      cwd: process.env.HOME,
      env: process.env
    })

    this.ptyProcess.write('export HISTCONTROL=ignorespace\rclear\r')

    this.ptyProcess.onData((data) => {
      if (this.mainWindow) {
        this.mainWindow.webContents.send(`terminal-output-${this.id}`, data)
      }
    })

    ipcMain.on(`write-to-terminal-${this.id}`, (_event: IpcMainInvokeEvent, data: string) => {
      this.ptyProcess?.write(data)
    })

   
  }

 
}
export function register(w: BrowserWindow): void {
  mainWindow = w

  ipcMain.handle('spawn-terminal', () => {
    if (mainWindow) {
      return spawnNewTerminal(mainWindow)
    }
    return null
  })
}
