import Catalog from '@nevermined-io/catalog-core'
import { UiLayout, UiDivider, UiText } from '@nevermined-io/styles'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// This component is used to display some user information.
export const User = () => {
  let params = useParams()
  const { sdk, isLoadingSDK } = Catalog.useNevermined()
  const [assets, setAssets] = useState<string[]>()

  useEffect(() => {
    const fetchAssets = async () => {
      const account = await sdk?.accounts?.list().then((list) => list[0])
      console.log(account.getId())
      setAssets(await sdk?.assets?.consumerAssets(params.address!))
    }
    console.log(assets)
    fetchAssets().catch(console.error)
  }, [])

  return (
    <>
      <UiLayout type="grid" align="center" direction="column">
        <UiDivider />
        <UiText> address: {params.address!}</UiText>
        <UiText>{!isLoadingSDK ? sdk.token.getAddress() : ''}</UiText>
      </UiLayout>
    </>
  )
}
