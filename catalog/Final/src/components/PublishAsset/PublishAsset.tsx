import Catalog from '@nevermined-io/catalog-core'
import { MetaData } from '@nevermined-io/nevermined-sdk-js'
import { RoyaltyKind } from '@nevermined-io/nevermined-sdk-js/dist/node/nevermined/Assets'

import React, { useState } from 'react'
import {
  UiButton,
  UiDivider,
  UiFormGroup,
  UiForm,
  UiFormInput,
  UiLayout,
  Orientation,
  UiText,
  UiFormSelect
} from '@nevermined-io/styles'

export const assetTypes = ['Asset', 'NFT721', 'NFT1155']
// This component is used to publish an asset.
export const PublishAsset = () => {
  const { sdk } = Catalog.useNevermined()

  const { onAssetPublish, onAsset721Publish, onAsset1155Publish, assetPublish, setAssetPublish } =
    Catalog.useAssetPublish()
  const [didDeployed, setDidDeployed] = useState<any>()
  const [erc20, setErc20] = useState<string>(sdk.token.getAddress())
  const [cap, setCap] = useState<number>(0)
  const [royalties, setRoyalties] = useState<number>(0)
  const [royaltiesKind, setRoyaltiesKind] = useState<number>(RoyaltyKind.Standard)
  const [typeAsset, setTypeAsset] = useState<string>('Asset')

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
      cap: cap,
      royalties: royalties,
      royaltyKind: royaltiesKind
    })
    setDidDeployed(mintAsset!.id)
  }

  function isAsset() {
    return typeAsset === 'Asset'
  }
  function is721() {
    return typeAsset === 'NFT721'
  }
  function is1155() {
    return typeAsset === 'NFT1155'
  }

  return (
    <UiLayout type="container" align="center" direction="column">
      <UiDivider />
      <UiForm>
        <UiFormGroup orientation={Orientation.Vertical}>
          <UiFormSelect
            name="name"
            label="Type of asset"
            value={typeAsset}
            options={assetTypes}
            onChange={(e) => setTypeAsset(e as string)}
          ></UiFormSelect>
        </UiFormGroup>
      </UiForm>
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
          {is721() && (
            <UiFormGroup orientation={Orientation.Vertical}>
              <UiFormInput
                name="erc20"
                type="text"
                label="Nft Address"
                value={erc20}
                onChange={(e) => setErc20(e.target.value)}
              />
            </UiFormGroup>
          )}
          {is1155() && (
            <>
              <UiFormGroup orientation={Orientation.Vertical}>
                <UiFormInput
                  name="cap"
                  type="number"
                  inputMode="numeric"
                  label="Cap"
                  value={cap}
                  onChange={(e) => setCap(e.target.value)}
                />
              </UiFormGroup>
              <UiFormGroup orientation={Orientation.Vertical}>
                <UiFormInput
                  name="Royalties"
                  type="number"
                  inputMode="numeric"
                  label="Royalties"
                  value={royalties}
                  onChange={(e) => setRoyalties(e.target.value)}
                />
              </UiFormGroup>
              <UiFormGroup orientation={Orientation.Vertical}>
                <UiFormSelect
                  name="name"
                  label="Type of asset"
                  value={royaltiesKind}
                  options={Object.keys(RoyaltyKind).filter((v) => isNaN(Number(v)))}
                  onChange={(e) => setRoyaltiesKind(e.valueOf() as number)}
                ></UiFormSelect>
              </UiFormGroup>
            </>
          )}
          <UiDivider />
          <UiLayout type="grid" align="center" direction="row">
            {isAsset() && <UiButton onClick={handleOnSubmit}>Publish</UiButton>}
            {is721() && <UiButton onClick={handleOnSubmitNft721}>Publish NFT 721</UiButton>}
            {is1155() && <UiButton onClick={handleOnSubmitNft}>Publish NFT 1155</UiButton>}
          </UiLayout>
        </UiForm>
        {didDeployed ? <UiText>{didDeployed} succesfully.</UiText> : <></>}
      </UiLayout>
    </UiLayout>
  )
}
