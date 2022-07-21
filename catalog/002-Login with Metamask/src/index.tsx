import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Catalog from '@nevermined-io/components-catalog'
import { appConfig } from './config'
import ChainConfig from './ChainConfig'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig}>
        <Catalog.WalletProvider
          nodeUri={appConfig.nodeUri!}
          correctNetworkId="0x13881"
          chainConfig={ChainConfig}
        >
        <App />
      </Catalog.WalletProvider>
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
)

reportWebVitals();
