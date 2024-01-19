import { appConfig } from '@/config'
import { GenericOutput, NeverminedProviderContext, NeverminedProviderProps } from '@/types'
import { fetchMarketplaceApiTokenFromLocalStorage } from '@/utils/marketplace-api-token'
import { NeverminedOptions, Nevermined, Logger } from '@nevermined-io/sdk'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import React from 'react'

const initialState = {
  sdk: {} as Nevermined,
}

const neverminedReducer = (
  state: {
    sdk: Nevermined
  },
  action: {
    type: 'SET_SDK'
    payload: {
      sdk: Nevermined
    }
  },
) => {
  switch (action.type) {
    case 'SET_SDK': {
      return { ...action.payload }
    }
    default: {
      return state
    }
  }
}

export const initializeNevermined = async (
  config: NeverminedOptions,
): Promise<GenericOutput<Nevermined, any>> => {
  try {
    Logger.log('Loading SDK Started..')
    const nvmSdk: Nevermined = await Nevermined.getInstance({
      ...config,
    })
    Logger.log('Loading SDK Finished Successfully')
    return { data: nvmSdk, error: undefined, success: true }
  } catch (error) {
    Logger.log('Loading SDK Failed:')
    Logger.log(error)
    return { data: {} as Nevermined, error, success: false }
  }
}

export const NeverminedProvider = ({ children }: NeverminedProviderProps) => {
  // const { chain } = useNetwork()
  const [chainId, setChainId] = useState<number>()
  const [walletAddress, setWalletAddress] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [web3Provider, setWeb3Provider] = useState<any>()
  const [marketplaceAuthToken, setMarketplaceAuthToken] = useState<string>('')

  // TODO: set auth token inside useEffect

  const setChainIdAndAddress = useCallback(
    (newChainId?: number, newAddress?: string) => {
      let newMarketplaceAuthToken = ''

      if (chainId !== newChainId || walletAddress !== newAddress) {
        setChainId(newChainId)
        setWalletAddress(newAddress || '')

        if (newChainId && newAddress) {
          newMarketplaceAuthToken =
            fetchMarketplaceApiTokenFromLocalStorage({
              address: newAddress,
              chainId: newChainId,
            }) || ''

          setMarketplaceAuthToken(newMarketplaceAuthToken)
        } else {
          setMarketplaceAuthToken('')
        }
      }

      return newMarketplaceAuthToken
    },
    [chainId, walletAddress],
  )

  const [{ sdk }, dispatch] = useReducer(neverminedReducer, initialState)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sdkError, setSdkError] = useState<any | undefined>(undefined)


  useEffect(() => {
    const loadNevermined = async (): Promise<void> => {
      if (!web3Provider && !appConfig.neverminedNodeUri) {
        Logger.log('Please include web3 provider in your sdk config. aborting.')
        return
      }
      setIsLoading(true)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data, success, error } = await initializeNevermined({
        ...appConfig,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        web3Provider,
        marketplaceAuthToken,
      })
      if (success) {
        dispatch({ type: 'SET_SDK', payload: { sdk: data } })
      }
      setSdkError(error)
      setIsLoading(false)
    }
    void loadNevermined()
  }, [web3Provider, marketplaceAuthToken])

  const value = useMemo(
    () => ({
      sdk,
      isLoadingSDK: isLoading,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      sdkError,
      chainId,
      walletAddress,
      marketplaceAuthToken,
      setMarketplaceAuthToken,
      setChainIdAndAddress,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      web3Provider,
      setWeb3Provider,
    }),
    [
      sdk,
      isLoading,
      sdkError,
      chainId,
      walletAddress,
      marketplaceAuthToken,
      setChainIdAndAddress,
      web3Provider,
    ],
  )

  return <NeverminedContext.Provider value={value}>{children}</NeverminedContext.Provider>
}

export const NeverminedContext = createContext({} as NeverminedProviderContext)

export const useNevermined = (): NeverminedProviderContext => {
  const contextValue = useContext(NeverminedContext)

  if (!contextValue) {
    throw new Error(
      'could not find Nevermined context value; please ensure the component is wrapped in a <NeverminedProvider>',
    )
  }

  return contextValue
}
