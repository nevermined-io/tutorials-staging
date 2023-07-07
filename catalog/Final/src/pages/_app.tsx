import React from 'react'
import '../index.css'
import Assets from '../assets'
import { Catalog, AssetService } from '@nevermined-io/catalog'
import { ConnectKit, Wagmi, WalletProvider } from '@nevermined-io/providers';
import '../components/NavBar/NavBar.scss'
import { acceptedChainId, appConfig } from '../config'
import {chainConfig} from '../ChainConfig'
import type { AppProps } from 'next/app'

const client = Wagmi.createClient(
  ConnectKit.getDefaultClient({
    appName: 'Nevermined One',
    chains: chainConfig,
  }),
)

const App = ({ Component, pageProps }: AppProps) =>
    <Catalog.NeverminedProvider config={appConfig}>
      <AssetService.AssetPublishProvider>
        <WalletProvider
          client={client}
          correctNetworkId={Number.parseInt(acceptedChainId, 10)}
        >
          <>
            <Assets />
            <Component {...pageProps}/>
          </>
        </WalletProvider>
      </AssetService.AssetPublishProvider>
    </Catalog.NeverminedProvider>

export default App