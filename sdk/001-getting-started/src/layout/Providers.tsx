import { NeverminedProvider } from '@/context/nvm-sdk-context'
import { ReactNode, useMemo } from 'react'
import { createPublicClient, http } from 'viem'
import { arbitrumSepolia } from 'viem/chains'
import { createConfig, WagmiConfig } from 'wagmi'

const Providers = ({
  children,
}: {
  children: ReactNode
}) => {
    const wagmiConfig = createConfig({
        autoConnect: true,
        publicClient: createPublicClient({
          chain: arbitrumSepolia,
          transport: http(),
        }),
      })
  
  return (
    <WagmiConfig config={wagmiConfig}>
      <NeverminedProvider>
        {children}
      </NeverminedProvider>
    </WagmiConfig>
  )
}

export default Providers
