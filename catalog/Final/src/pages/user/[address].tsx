import { Catalog } from '@nevermined-io/catalog'
import { UiLayout, UiDivider, UiText } from '@nevermined-io/styles'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// This component is used to display some user information.
const User = () => {
  const router = useRouter()
  const { sdk, isLoadingSDK } = Catalog.useNevermined()
  const [assets, setAssets] = useState<string[]>()

  useEffect(() => {
    const fetchAssets = async () => {
      const account = await sdk?.accounts?.list().then((list) => list[0])
      console.log(account.getId())
      setAssets(await sdk?.assets?.consumerAssets(router.query.address as string))
    }
    console.log(assets)
    fetchAssets().catch(console.error)
  }, [])

  return (
    <>
      <UiLayout type="grid" align="center" direction="column">
        <UiDivider />
        <UiText> address: {router.query.address as string}</UiText>
        <UiText>{!isLoadingSDK ? sdk.utils.token.getAddress() : ''}</UiText>
      </UiLayout>
    </>
  )
}

export default User