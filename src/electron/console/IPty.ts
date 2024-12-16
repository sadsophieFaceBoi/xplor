export interface IPtyEvents {
    writeToTerminal(data: string,id:number): void;
    receive(channel: string, func: (...args: any[]) => void): void;
    spawn(): Promise<number>;
    getWorkingDirectory(id:number): void;
 
}
declare global {
    interface Window {
        terminal: IPtyEvents;
    }
    
}