import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { TerminalComponent } from './components/console/terminal'
import { DirectoryProvider } from './context/DirectoryContext'
import FileExplorer from './components/file-browsing/explorer'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      
     
   
     
      <div>
        
       
        <DirectoryProvider>

            <div  style={{display: 'flex', flexDirection: 'row'}}>
              <FileExplorer/>
              <TerminalComponent/>
            </div>
        </DirectoryProvider>
      </div>
      {/* <Versions></Versions> */}
    </>
  )
}

export default App
