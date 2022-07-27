import { MetaMask } from '@nevermined-io/catalog-providers'
import React from 'react'

function App() {

  const { loginMetamask, walletAddress, logout } = MetaMask.useWallet();
  
  return (
    <div className="App">
      <header className="App-header">
             {!walletAddress ? <button onClick={loginMetamask}>Login</button> : <button onClick={logout}>logout</button>}
             {walletAddress ? 
               <>
                   <div className="nav-item">{walletAddress}</div>
               </>
              : <></>
             }
      </header>
    </div>
)}

export default App;
