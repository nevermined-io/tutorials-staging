import Catalog from '@nevermined-io/components-catalog'
import React, { useEffect, useState } from 'react'

function App() {

  const { loginMetamask, walletAddress, logout, checkIsLogged } = Catalog.useWallet();
  
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
