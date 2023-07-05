import React from 'react'
import '../index.css'
import Login from '../login'
import { Catalog } from '@nevermined-io/catalog'
import { ConnectKit, Wagmi, WalletProvider } from '@nevermined-io/providers';
import { acceptedChainId, appConfig } from '../config'
import {chainConfig} from '../ChainConfig'

const client = Wagmi.createClient(
  ConnectKit.getDefaultClient({
    appName: 'Nevermined One',
    chains: chainConfig,
  }),
)

const App = () =>
    <Catalog.NeverminedProvider config={appConfig}>
        <WalletProvider
          client={client}
          correctNetworkId={Number.parseInt(acceptedChainId, 10)}
        >
        <Login />
      </WalletProvider>
    </Catalog.NeverminedProvider>

export default App
