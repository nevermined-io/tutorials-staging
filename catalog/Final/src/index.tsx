import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App'
import Catalog from '@nevermined-io/components-catalog'
import { appConfig } from './config'
import ChainConfig from './ChainConfig'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <div>
    <BrowserRouter>
      <Catalog.NeverminedProvider config={appConfig}>
        <Catalog.WalletProvider
          nodeUri={appConfig.nodeUri!}
          correctNetworkId="0x13881"
          chainConfig={ChainConfig}
        >
          <App />
        </Catalog.WalletProvider>
      </Catalog.NeverminedProvider>
    </BrowserRouter>
  </div>,
  document.getElementById('root') as HTMLElement
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
