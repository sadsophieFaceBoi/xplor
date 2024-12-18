import React, { useState, useCallback } from 'react';
import { DirectoryProvider, useDirectory } from './context/DirectoryContext';
import {TerminalComponent} from './components/terminal';
import './App.css';

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
 
  const changeDirectory = () => {
    setCurrentDirectory('C:\\Users\\andre\\source\\repos\\jsas\\jsas_app', 'App');
  };

  return (
    <div>
      <p>Current Path: {currentDirectory}</p>
      <button onClick={changeDirectory}>Change Directory</button>
    </div>
 
  );
};

export default App;
