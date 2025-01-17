
import { TerminalComponent } from './components/console/terminal'
import { DirectoryProvider } from './context/DirectoryContext'
import FileExplorer from './components/file-browsing/explorer'
import Split from 'react-split'
import React, { useEffect } from 'react';
import DirectoryBrowsing from './components/file-browsing/directory-browsing';

function App(): JSX.Element {
  useEffect(() => {
    const minimizeButton = document.querySelector('.minimize');
    const maximizeButton = document.querySelector('.maximize');
    const closeButton = document.querySelector('.close');
    const handleClose=()=>{
      window.electron.ipcRenderer.send('close-window');
    }
    const handleMaximize=()=>{
      window.electron.ipcRenderer.send('maximize-window');
    }
    const handleMinimize=()=>{
      window.electron.ipcRenderer.send('minimize-window');
    }
    minimizeButton?.addEventListener('click', handleMinimize);
    maximizeButton?.addEventListener('click', handleMaximize);
    closeButton?.addEventListener('click', handleClose);
    return () => {
      minimizeButton?.removeEventListener('click', handleMinimize);
      maximizeButton?.removeEventListener('click', handleMaximize);
      closeButton?.removeEventListener('click', handleClose);
    };
   

  }, []);

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
    <div className='flex flex-col h-screen w-screen  p-2  '>
     
      <Split sizes={[20, 80]} minSize={100} className='flex flex-grow h-5/6  w-full' gutterSize={10}>
        <div className='bg-zinc-900 rounded-lg'>
          <DirectoryBrowsing/>
        </div>

          <Split direction='vertical' sizes={[50, 50]} minSize={100} className=' h-full ' gutterSize={10}>
            <div className='bg-zinc-900 rounded-lg'>
              <FileExplorer />
            </div>
            <div className='rounded-lg'>
              <TerminalComponent />
            </div>
          </Split>
       
       
      </Split>
    </div>
  );
};

export default App
