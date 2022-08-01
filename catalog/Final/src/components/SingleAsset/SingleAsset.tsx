import Catalog from '@nevermined-io/catalog-core'
import React from 'react'
import { useParams } from 'react-router-dom'

// This component is used to display some asset information.
export const SingleAsset = () => {
  let params = useParams()
  const { sdk, isLoadingSDK, account, assets } = Catalog.useNevermined()
  const { ddo, isLoading, metadata } = Catalog.useAsset(params.did!)


  async function handleDownload() {
    if (!isLoadingSDK) {
      if (!account.isTokenValid()) {
        await account.generateToken()
      }
      // First order the asset
      // await assets.consumeAsset(ddo.id)
      await assets.downloadAsset(params.did!)
    }
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
    return ddo.service.map(x => x.index).includes(3)
  }

  const hasNftAccess = () => {
    return ddo.service.map(x => x.index).includes(7)
  }

  return (
    <>
      <div>
        {!isLoading && ddo ? (
          <div>
            Did : {ddo.id}
            <div>
              <div> Services: {JSON.stringify(ddo.service.map(x => x.type))}</div>
              <div> Name: {metadata.main.name}</div>
              <div> Type: {metadata.main.type}</div>
              <div> Date Created: {metadata.main.dateCreated}</div>
              <div> Author: {metadata.main.author}</div>
              <div> Price: {metadata.main.price}</div>
            </div>
            {hasAccessService() && <button onClick={handleDownload}>Download Files</button>}
            {hasNftAccess() && <button onClick={handleNFTDownload}>Download NFT</button>}
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  )
}
