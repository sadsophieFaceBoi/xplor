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
    <div className='flex flex-col h-screen w-screen  p-3 '>
      <div className='w-screen h-auto text-center'>
        <h1 className="text-3xl font-bold underline">Tool Bar</h1>
      </div>
      <Split sizes={[10, 80, 10]} minSize={100} className='flex flex-grow h-5/6  w-full' gutterSize={10}>
        <div className='border-blue-400 border-2'>
          <h1 className="text-3xl font-bold underline">Left</h1>
        </div>

          <Split direction='vertical' sizes={[50, 50]} minSize={100} className=' h-full ' gutterSize={10}>
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
