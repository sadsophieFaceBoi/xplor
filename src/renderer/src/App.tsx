import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { TerminalComponent } from './components/console/terminal'
import { DirectoryProvider } from './context/DirectoryContext'
import FileExplorer from './components/file-browsing/explorer'
import Split from 'react-split'
import React from 'react';

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      
     
      <DirectoryProvider>
        <MainLayout></MainLayout>
      </DirectoryProvider>
     
    
    </>
  )
}
const MainLayout: React.FC = () => {
  return (
    <div className='flex flex-col h-screen w-screen border-green-400 border-2 p-3'>
      <div className='w-screen h-auto text-center border-red-400 border-2'>
        <h1 className="text-3xl font-bold underline">Tool Bar</h1>
      </div>
      <Split sizes={[25, 50, 25]} minSize={100} className='flex-grow flex h-full w-full border-red-300 border-4' gutterSize={10}>
        <div className='border-blue-400 border-2'>
          <h1 className="text-3xl font-bold underline">Left</h1>
        </div>

          <Split direction='vertical' sizes={[50, 50]} minSize={100} className='flex-grow h-full border-2 border-yellow-400' gutterSize={10}>
            <div className='border-blue-400 border-2 '>
              <FileExplorer />
            </div>
            <div className='border-blue-400 border-2'>
              <TerminalComponent />
            </div>
          </Split>
       
        <div className='border-blue-400 border-2'>
          <h1 className="text-3xl font-bold underline">Right</h1>
        </div>
      </Split>
    </div>
  );
};

export default App
