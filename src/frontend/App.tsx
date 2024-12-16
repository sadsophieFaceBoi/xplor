import { useCallback, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TerminalComponent } from './terminal'

function App() {
  const [count, setCount] = useState(0)
  const [nodeVersion, setNodeVersion] = useState<string | undefined>(undefined);

  const updateNodeVersion = useCallback(
    async () => setNodeVersion(await backend.nodeVersion("Hello from App.tsx!")),
    []
  );

  return (
    <>
      <div>
        
      
        
      </div>
      <TerminalComponent />
    </>
  )
}

export default App
