import { useNevermined } from "@/context/nvm-sdk-context"
import { useSdkReadiness } from "@/hooks/use-sdk-readiness"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from 'wagmi/connectors/injected'

const MainPage: NextPage = () => {
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
      })
    const { disconnect } = useDisconnect()
    const { sdk, isLoadingSDK } = useNevermined()
    const { isSdkReady} = useSdkReadiness()

    const [assets, setAssets] = useState<string[]>()
    const query = {
        offset: 150,
        page: 1,
        sort: {
          created: 'desc'
        }
      }

    useEffect(() => {
        if (!isSdkReady) return
        sdk?.services?.metadata.queryMetadata(query).then((assets) => {
            setAssets(assets.results.map((asset) => asset.id))
        })

    }, [isSdkReady])  

    return (
        <>
            <header>
                <h1>Nvm App</h1>
                {isConnected ? (
                    <div>
                        Connected to {address}
                        <button onClick={() => disconnect()}>Disconnect</button>
                    </div>
                ) : (
                    <button onClick={() => connect()}>Connect Wallet</button>
                )}
            </header>
            <main>
                Hello world   
                {!isSdkReady ? 'Loading SDK...' : 'SDK loaded!'}
                {isSdkReady && sdk && (
                    <ul>
                        {assets?.map((asset) => <li key={asset}>{asset}</li>)}
                    </ul>
                )}
            </main>
        </>
    )
  }
  
  export default MainPage