import Catalog from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { UiButton, UiLayout, UiDivider, UiText } from '@nevermined-io/styles'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// This component is used to display some asset information.
export const SingleAsset = () => {
  let params = useParams()
  const { sdk, isLoadingSDK, assets, account } = Catalog.useNevermined()
  const { walletAddress } = MetaMask.useWallet()
  const [nftDetail, setNftDetail] = useState<any>()
  const { ddo, isLoading, metadata } = Catalog.useAsset(params.did!)

  useEffect(() => {
    const nftDetails = async () => {
      const details = await assets.nftDetails(params.did!)
      setNftDetail(details)
    }
    nftDetails().catch(console.error)
  }, [nftDetail])

  async function handleDownload() {
    if (!isLoadingSDK) {
      const account = await sdk?.accounts.list().then((list) => list[0])
      const address = walletAddress
      const owner = await sdk?.assets.owner(params.did!)
      if (owner === address) {
        // If the asset is owned by the current account, we can download it
        console.log('Downloading asset')
        await assets.downloadAsset(params.did!)
      } else {
        const agreementId = await sdk.assets.order(params.did!, 'access', account)
        await sdk.assets.consume(agreementId, params.did!, account)
      }
    }
  }

  async function handleNFTDownload() {
    if (!isLoadingSDK) {
      const address = await sdk?.accounts.list().then((list) => list[0])
      const owner = await sdk?.assets.owner(params.did!)
      if (owner === walletAddress) {
        return await sdk.nfts.access(params.did!, address)
      }
      if (hasNft721Access()) {
        const agreementId = await sdk.nfts.order721(params.did!, address)
        return await sdk.nfts.access(params.did!, address)
      }
      if (!account.isTokenValid()) {
        await account.generateToken()
      }
      const agreementId = await sdk.nfts.order(params.did!, 1, address)
      return await sdk.nfts.access(params.did!, address)
    }
  }

  const hasAccessService = () => {
    return ddo.service.map((x) => x.index).includes(3)
  }

  const hasNft721Access = () => {
    return ddo.service.map((x) => x.index).includes(8)
  }

  const hasNft1155Access = () => {
    return ddo.service.map((x) => x.index).includes(7)
  }

  return (
    <>
      {!isLoading && ddo ? (
        <UiLayout type="grid" align="center" direction="column">
          <UiDivider />
          <UiText> Did: {ddo.id}</UiText>
          <UiText> Name: {metadata.main.name}</UiText>
          <UiText> Type: {metadata.main.type}</UiText>
          <UiText> Date Created: {metadata.main.dateCreated}</UiText>
          <UiText> Author: {metadata.main.author}</UiText>
          <UiText> Description: {metadata.additionalInformation?.description}</UiText>
          <UiText> Services: {JSON.stringify(ddo.service.map((x) => x.type))}</UiText>
          <UiText> Price: {metadata.main.price}</UiText>
          <UiText> Owner: {ddo.proof.creator}</UiText>
          {hasNft1155Access() && <UiText> NFT details: {JSON.stringify(nftDetail)}</UiText>}
          {hasAccessService() && <UiButton onClick={handleDownload}>Download Files</UiButton>}
          {hasNft721Access() && <UiButton onClick={handleNFTDownload}>Download NFT 721</UiButton>}
          {hasNft1155Access() && <UiButton onClick={handleNFTDownload}>Download NFT 1155</UiButton>}
        </UiLayout>
      ) : (
        <></>
      )}
    </>
  )
}
