import React, { useState, useCallback, useEffect } from 'react';
import { DirectoryProvider, useDirectory } from './context/DirectoryContext';
import {TerminalComponent} from './components/terminal';
import './App.css';
import { convertWindowsPathToUnixPath } from '../utils/file-utils';

function App() {
  const [count, setCount] = useState(0);
  const [nodeVersion, setNodeVersion] = useState<string | undefined>(undefined);

  const updateNodeVersion = useCallback(
    async () => setNodeVersion(await backend.nodeVersion("Hello from App.tsx!")),
    []
  );

  return (
    <DirectoryProvider>
      <div>
        <DirectoryChanger />
        {/* Other components can be added here */}
      </div>
      <TerminalComponent />
    </DirectoryProvider>
  );
}

const DirectoryChanger: React.FC = () => {
  const { setCurrentDirectory,currentDirectory,sender } = useDirectory();
  const [unixPath, setUnixPath] = useState<string | undefined>(undefined);
  const changeDirectory = () => {
    setCurrentDirectory('C:\\Users\\andre\\source\\repos\\jsas\\jsas_app', 'App');
  };
 useEffect(() => {
  const p=convertWindowsPathToUnixPath(currentDirectory);
  setUnixPath(p);
  }, [currentDirectory]);
  return (
    <div>
      <p>Current Path: {currentDirectory}</p>
      <p>Unix Path: {unixPath}</p>
      <button onClick={changeDirectory}>Change Directory</button>
    </div>
 
  );
};

export default App;
