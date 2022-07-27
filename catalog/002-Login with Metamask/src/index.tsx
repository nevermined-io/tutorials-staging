import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Catalog from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers';
import { appConfig } from './config'
import ChainConfig from './ChainConfig'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig}>
        <MetaMask.WalletProvider
          nodeUri={appConfig.nodeUri!}
          correctNetworkId="0x13881"
          chainConfig={ChainConfig}
        >
        <App />
      </MetaMask.WalletProvider>
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
)

reportWebVitals();
