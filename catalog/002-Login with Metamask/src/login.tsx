import { useWallet, ConnectKit } from '@nevermined-io/providers'
import React from 'react'

const Login = () => {

  const { walletAddress } = useWallet();
  
  return (
    <div className="App">
      <header className="App-header">
        {walletAddress ? 
          <>
              <div className="nav-item">{walletAddress}</div>
          </>
        : <ConnectKit.ConnectKitButton/>
        }
      </header>
    </div>
)}

export default Login;
