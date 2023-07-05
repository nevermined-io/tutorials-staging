import { NeverminedOptions } from '@nevermined-io/catalog'
import { ethers } from 'ethers'

export const neverminedNodeAddress =
  process.env.REACT_APP_NODE_ADDRESS || '0xB82dc620BB4dE6712376055a5cfc0DF11112D442'
export const neverminedNodeUri =
  process.env.REACT_APP_NODE_URI || 'https://node.goerli.nevermined.one'
export const faucetUri =
  process.env.REACT_APPREACT_APP_FAUCET_URI_FAUCET_URI ||
  'https://faucet.mumbai.public.nevermined.rocks'
export const web3Provider =
  process.env.REACT_APP_NODE_URI || 'https://arbitrum-goerli.public.blastapi.io'
export const acceptedChainId = process.env.REACT_APP_ACCEPTED_CHAIN_ID || '421613' // for Mumbai
export const rootUri = process.env.REACT_APP_ROOT_URI || 'http://localhost:3000'
export const marketplaceUri =
  process.env.REACT_APP_MARKETPLACE_URI || 'https://marketplace-api.goerli.nevermined.one'

export const appConfig: NeverminedOptions = {
  //@ts-ignore
  web3Provider:
    typeof window !== 'undefined'
      ? (window as any).ethereum
      : new ethers.providers.JsonRpcProvider(web3Provider),
  neverminedNodeUri,
  verbose: true,
  neverminedNodeAddress,
  marketplaceAuthToken: '',
  marketplaceUri,
  artifactsFolder: `${rootUri}/contracts`
}
