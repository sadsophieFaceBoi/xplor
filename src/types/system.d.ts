/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
interface ISystem {
  arch: string
  user: string
  machine: string
  homedir: string
  platform: string
  release: string
  type: string
  version: string
  computer: string
}
interface IPtyEvents {
  writeToTerminal(data: string, id: number): void
  receive(channel: string, func: (...args: unknown[]) => void): void
  spawn(): Promise<number>
  getWorkingDirectory(id: number): void
}
