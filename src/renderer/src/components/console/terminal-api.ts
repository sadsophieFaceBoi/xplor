export const ptyApi: IPtyEvents = {
  writeToTerminal: (data: string, id: number) => {

    window.electron.ipcRenderer.send(`write-to-terminal-${id}`, data)
  },
  receive: (channel: string, func: (...args: unknown[]) => void) => {
    window.electron.ipcRenderer.on(channel, (_event, ...args) => func(...args))
  },
  spawn: (): Promise<number> => {
    console.log('spawn terminal')
    return window.electron.ipcRenderer.invoke('spawn-terminal')
  },
  getWorkingDirectory: (id: number) => {
    window.electron.ipcRenderer.send(`get-working-directory-${id}`)

  }
}
