import Catalog from '@nevermined-io/catalog-core'
import { MetaData } from '@nevermined-io/nevermined-sdk-js'
import React, { useState } from 'react'
import {
  UiButton,
  UiDivider,
  UiFormGroup,
  UiForm,
  UiFormInput,
  UiLayout,
  Orientation,
  UiText
} from '@nevermined-io/styles'

// This component is used to publish an asset.
export const PublishAsset = () => {
  const { onAssetPublish, onAsset721Publish, onAsset1155Publish, assetPublish, setAssetPublish } =
    Catalog.useAssetPublish()
  const [didDeployed, setDidDeployed] = useState<any>()
  const [erc20, setErc20] = useState<string>('0x9A753f0F7886C9fbF63cF59D0D4423C5eFaCE95B')

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

  async function handleOnSubmit() {
    const ddo = await onAssetPublish({ metadata: metadata })
    setDidDeployed(ddo!.id)
  }

  async function handleOnSubmitNft721() {
    const mintAsset = await onAsset721Publish({
      nftAddress: erc20,
      metadata: metadata
    })  
    setDidDeployed(mintAsset!.id)
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
    <UiLayout type="container" align="center" direction="column">
      <UiDivider />
      <UiLayout type="grid" align="center" direction="row">
        <UiForm>
          <UiFormGroup orientation={Orientation.Vertical}>
            <UiFormInput
              name="name"
              type="text"
              label="Name"
              value={assetPublish?.name}
              onChange={(e) => setAssetPublish({ ...assetPublish, name: e.target.value })}
            />
          </UiFormGroup>
          <UiFormGroup orientation={Orientation.Vertical}>
            <UiFormInput
              name="author"
              type="text"
              label="Author"
              value={assetPublish?.author}
              onChange={(e) => setAssetPublish({ ...assetPublish, author: e.target.value })}
            />
          </UiFormGroup>
          <UiFormGroup orientation={Orientation.Vertical}>
            <UiFormInput
              name="description"
              type="text"
              label="Description"
              value={assetPublish?.description}
              onChange={(e) => setAssetPublish({ ...assetPublish, description: e.target.value })}
            />
          </UiFormGroup>
          <UiFormGroup orientation={Orientation.Vertical}>
            <UiFormInput
              name="file"
              type="text"
              label="File url"
              value={assetPublish?.file}
              onChange={(e) => setAssetPublish({ ...assetPublish, file: e.target.value })}
            />
          </UiFormGroup>
          <UiFormGroup orientation={Orientation.Vertical}>
            <UiFormInput
              name="price"
              type="text"
              label="Price"
              value={assetPublish?.price}
              onChange={(e) => setAssetPublish({ ...assetPublish, price: e.target.value })}
            />
          </UiFormGroup>
          <UiFormGroup orientation={Orientation.Vertical}>
          <UiFormInput
              name="erc20"
              type="text"
              label="Nft Address"
              value={erc20}
              onChange={(e) => setErc20(e.target.value)}
            />
          </UiFormGroup>
          <UiDivider />
          <UiLayout type="grid" align="center" direction="row">
            <UiButton onClick={handleOnSubmit}>Publish</UiButton>
            <UiDivider vertical />

            <UiButton onClick={handleOnSubmitNft721}>Mint Nft 721</UiButton>
            <UiDivider vertical />

            <UiButton onClick={handleOnSubmitNft}>Mint Nft 1155</UiButton>
          </UiLayout>
        </UiForm>
        {didDeployed ? <UiText>{didDeployed} succesfully.</UiText> : <></>}
      </UiLayout>
    </UiLayout>
  )
}
