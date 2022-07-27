import Catalog from '@nevermined-io/catalog-core'
import { MetaData } from '@nevermined-io/nevermined-sdk-js'
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards'
import React, { useState } from 'react'
import './PublishAsset.scss'

// This component is used to publish an asset.
export const PublishAsset = () => {
  const { sdk, isLoadingSDK, account } = Catalog.useNevermined()
  const [asset, setAsset] = useState<any>()
  const [didDeployed, setDidDeployed] = useState<any>()

  const metadata: MetaData = {
    main: {
      name: asset?.name,
      dateCreated: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
      author: asset?.author,
      license: 'No License Specified',
      price: String(asset?.price),
      datePublished: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
      type: 'dataset',
      files: [{url: asset?.file, contentType: 'text/markdown'}],
    },
    additionalInformation: {
      description: asset?.description,
      categories: []
    }
  } as MetaData

  function handleInputChange(event: any) {
    const target = event.target
    // const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name
    setAsset({ ...asset, [name]: target.value })
  }

  async function handleOnSubmit() {
    if (!isLoadingSDK) {
      const wallet = await sdk?.accounts?.list().then((list) => list[0])
      if (!account.isTokenValid()) {
        await account.generateToken()
      }
      const ddo = await sdk.assets.create(metadata, wallet)
      // assets.mint(ddo.id)
      setDidDeployed(ddo.id)
    }
  }
  

  async function handleOnSubmitNft() {
    if (!isLoadingSDK) {
      const wallet = await sdk?.accounts?.list().then((list) => list[0])
      if (!account.isTokenValid()) {
        await account.generateToken()
      }
      const mintAsset = await sdk.nfts.create(metadata, wallet, 10, 0, new AssetRewards())
      setDidDeployed(mintAsset.id)
    }
  }


  return (
    <>
      <div>
        <form>
          <div className="row">
            <label>
              Name:
              <input name="name" type="text" value={asset?.name} onChange={handleInputChange} />
            </label>
          </div>
          <div className="row">
            <label>
              Author:
              <input name="author" type="text" value={asset?.author} onChange={handleInputChange} />
            </label>
          </div>
          <div className="row">
            <label>
              Description:
              <input
                name="description"
                type="text"
                value={asset?.description}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="row">
            <label>
              File url:
              <input name="file" type="text" value={asset?.file} onChange={handleInputChange} />
            </label>
          </div>
          <div className="row">
            <label>
              Price:
              <input name="price" type="text" value={asset?.price} onChange={handleInputChange} />
            </label>
          </div>
        </form>
        <button onClick={handleOnSubmit}>Publish</button>
        <button onClick={handleOnSubmitNft}>Mint Nft</button>
        {didDeployed ? <div>{didDeployed} succesfully.</div> : <></>}
      </div>
    </>
  )
}
