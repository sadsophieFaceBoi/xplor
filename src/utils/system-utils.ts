import * as os from 'os'
import { env } from 'process'
export const system = {
  arch: os.arch(),
  user: os.userInfo().username,
  machine: os.machine(),
  homedir: os.homedir(),
  platform: os.platform(),
  release: os.release(),
  type: os.type(),
  version: os.version(),
  computer: env.COMPUTERNAME || 'unknown'
}
