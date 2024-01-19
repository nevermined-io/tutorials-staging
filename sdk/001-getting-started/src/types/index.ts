import {
    Nevermined,
  } from '@nevermined-io/sdk'
  
  export interface NeverminedProviderContext {
    sdk: Nevermined
    sdkError: any | undefined
    isLoadingSDK: boolean
    chainId?: number
    walletAddress: string
    web3Provider: object
    setWeb3Provider: (provider: any) => void
    marketplaceAuthToken: string
    setMarketplaceAuthToken: (token: string) => void
    setChainIdAndAddress: (chainId?: number, address?: string) => string
  }
  
  /**
   * Nevermined Provider to get the core Catalog functionalities as context
   */
  export interface NeverminedProviderProps {
    /** This provider require children elements */
    children: any
  }
  
  /**
   * Used as a result data schema of a resolved promise
   */
  export interface GenericOutput<T, E> {
    /** Data from the promise */
    data: T
    /** If the promise throw an error */
    error: E
    /** If the promise resolve was success */
    success: boolean
  }
  
  /** Id of the asset */
  export type DID = string
