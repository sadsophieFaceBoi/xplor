// src/electron/api.ts

import { ipcMain, IpcMainInvokeEvent } from "electron";
import * as os from 'os';
import { env } from "process";
import { ISystem } from "../types/system";

ipcMain.handle(
  "node-version",
  (event: IpcMainInvokeEvent, msg: string): string => {
    console.log(event);
    console.log(msg);

    return process.versions.node;
  }
);
export const system = {
   

  arch:os.arch(),
  user: os.userInfo().username,
  machine: os.machine(),
  homedir: os.homedir(),
  platform: os.platform(),
  release: os.release(),
  type: os.type(),
  version: os.version(),
  computer: env.COMPUTERNAME || "unknown",
  
}
console.log('api loaded');
ipcMain.handle("get-system-info", 
  (event: IpcMainInvokeEvent): ISystem => {
    
  console.log(system);
  return system;
  });