/* eslint-disable prettier/prettier */
// src/electron/api.ts

import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { system } from '../utils/system-utils'


ipcMain.handle('node-version', (event: IpcMainInvokeEvent, msg: string): string => {
  console.log(event)
  console.log(msg)

  return process.versions.node
})
ipcMain.handle('get-system-info', (): ISystem => {
  return system
})

console.log('api loaded')

