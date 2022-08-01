import Catalog from '@nevermined-io/catalog-core'
import { MetaData } from '@nevermined-io/nevermined-sdk-js'
import React, { useState } from 'react'
import './PublishAsset.scss'

// This component is used to publish an asset.
export const PublishAsset = () => {
  const { onAssetPublish, onAsset1155Publish, assetPublish, setAssetPublish } =
    Catalog.useAssetPublish()
  const [didDeployed, setDidDeployed] = useState<any>()

  const metadata: MetaData = {
    main: {
      name: assetPublish?.name,
      dateCreated: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
      author: assetPublish?.author,
      license: 'No License Specified',
      price: String(assetPublish?.price),
      datePublished: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
      type: assetPublish?.type,
      files: [{ url: assetPublish?.file, contentType: 'text/markdown' }]
    },
    additionalInformation: {
      description: assetPublish?.description,
      categories: []
    }
  } as MetaData

  function handleInputChange(event: any) {
    const target = event.target
    // const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name
    setAssetPublish({ ...assetPublish, [name]: target.value })
  }

  async function handleOnSubmit() {
    const ddo = await onAssetPublish({ metadata: metadata })
    setDidDeployed(ddo!.id)
  }

  async function handleOnSubmitNft() {
    const mintAsset = await onAsset1155Publish({
      metadata: metadata,
      cap: 10,
      royalties: 0,
      royaltyKind: 0
    })
    setDidDeployed(mintAsset!.id)
  }

  return (
    <div>
      <form>
        <div className="row">
          <label>
            Name:
            <input
              name="name"
              type="text"
              value={assetPublish?.name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="row">
          <label>
            Author:
            <input
              name="author"
              type="text"
              value={assetPublish?.author}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="row">
          <label>
            Description:
            <input
              name="description"
              type="text"
              value={assetPublish?.description}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="row">
          <label>
            File url:
            <input
              name="file"
              type="text"
              value={assetPublish?.file}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="row">
          <label>
            Price:
            <input
              name="price"
              type="text"
              value={assetPublish?.price}
              onChange={handleInputChange}
            />
          </label>
        </div>
      </form>
      <button onClick={handleOnSubmit}>Publish</button>
      <button onClick={handleOnSubmitNft}>Mint Nft</button>
      {didDeployed ? <div>{didDeployed} succesfully.</div> : <></>}
    </div>
  )
}
