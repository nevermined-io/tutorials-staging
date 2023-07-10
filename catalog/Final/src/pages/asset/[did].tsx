import { Catalog, AssetService, ERCType, getAccountObject } from '@nevermined-io/catalog'
import { useWallet } from '@nevermined-io/providers'
import { UiButton, UiLayout, UiDivider, UiText } from '@nevermined-io/styles'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { BigNumber } from 'ethers'

// This component is used to display some asset information.
const SingleAsset = () => {
  const router = useRouter()
  const { sdk, isLoadingSDK, assets, nfts } = Catalog.useNevermined()
  const { walletAddress } = useWallet()
  const [nftDetail, setNftDetail] = useState<any>()
  const { ddo, isLoading, metadata } = AssetService.useAsset(router.query.did as string, ERCType.nft721)

  useEffect(() => {
    const nftDetails = async () => {
      const details = await assets.nftDetails(router.query.did as string, ERCType.nft721)
      setNftDetail(details)
    }
    nftDetails().catch(console.error)
  }, [nftDetail])

  async function handleDownload() {
    if (!isLoadingSDK) {
      const account = await getAccountObject(sdk, walletAddress)
      const address = walletAddress
      const owner = await sdk?.assets.owner(router.query.did as string)
      if (owner === address) {
        // If the asset is owned by the current account, we can download it
        console.log('Downloading asset')
        await assets.downloadAsset({
          did: router.query.did as string,
          consumer: account
        })
      } else {
        
      }
    }
  }

  async function handleNFTDownload() {
    if (!isLoadingSDK) {
      const consumer = await getAccountObject(sdk, walletAddress)
      const owner = await sdk?.assets.owner(router.query.did as string)
      if (owner === walletAddress) {
        await assets.downloadNFT({
          did: router.query.did as string,
          consumer,
          ercType: ERCType.nft721
        })

        return
      }

      await nfts.access({
        did: router.query.did as string,
        buyer: consumer,
        nftAmount: BigNumber.from(1),
        ercType: ERCType.nft721,
        nftHolder: owner
      })

      return
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

export default SingleAsset