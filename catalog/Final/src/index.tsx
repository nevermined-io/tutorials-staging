import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App'
import { MetaMask } from '@nevermined-io/catalog-providers';
import Catalog from '@nevermined-io/catalog-core'
import { appConfig } from './config'
import ChainConfig from './ChainConfig'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
    <BrowserRouter>
      <Catalog.NeverminedProvider config={appConfig}>
        <MetaMask.WalletProvider
          nodeUri={appConfig.nodeUri!}
          correctNetworkId="0x13881"
          chainConfig={ChainConfig}
        >
          <App />
        </MetaMask.WalletProvider>
      </Catalog.NeverminedProvider>
    </BrowserRouter>,
  document.getElementById('root') as HTMLElement
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
