import { useNevermined } from '@/context/nvm-sdk-context'
import { Nevermined } from '@nevermined-io/sdk'
import { useEffect, useState } from 'react'

export const isSdkAvailable = (sdk: Nevermined) =>
  sdk && Object.keys(sdk).length > 0 && sdk.assets && sdk.keeper?.nvmConfig


export const useSdkReadiness = (callbackWhenReady?: () => void) => {
  const { sdk, isLoadingSDK } = useNevermined()
  const [isSdkReady, setIsSdkReady] = useState<boolean>(false)

  useEffect(() => {
    if (isSdkReady || isLoadingSDK || !isSdkAvailable(sdk)) {
      if (isSdkReady && (isLoadingSDK || !isSdkAvailable(sdk))) {
        setIsSdkReady(false)
      }
      return
    }

    if (!isSdkReady) {
      setIsSdkReady(true)
      callbackWhenReady?.()
    }
  }, [isLoadingSDK, sdk, isSdkReady, callbackWhenReady])

  return { isSdkReady }
}