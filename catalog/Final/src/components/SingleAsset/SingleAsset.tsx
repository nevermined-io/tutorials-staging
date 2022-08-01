import Catalog from '@nevermined-io/catalog-core'
import { UiButton, UiLayout, UiDivider, UiText } from '@nevermined-io/styles'
import React from 'react'
import { useParams } from 'react-router-dom'

// This component is used to display some asset information.
export const SingleAsset = () => {
  let params = useParams()
  const { sdk, isLoadingSDK, account, assets } = Catalog.useNevermined()
  const { ddo, isLoading, metadata } = Catalog.useAsset(params.did!)

  async function handleDownload() {
    // First order the asset
    // await assets.consumeAsset(ddo.id)
    await assets.downloadAsset(params.did!)
  }

  async function handleNFTDownload() {
    if (!isLoadingSDK) {
      await sdk?.accounts?.list().then((list) => list[0])
      if (!account.isTokenValid()) {
        await account.generateToken()
      }
      await assets.downloadNFT(params.did!)
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
