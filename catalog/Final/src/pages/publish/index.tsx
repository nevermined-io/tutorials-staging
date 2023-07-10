import {Catalog, MetaData, RoyaltyKind, AssetService, AssetAttributes, BigNumber, AssetPrice, getAccountObject, NFTAttributes, ContractHandler, Nft721Contract} from '@nevermined-io/catalog'

import React, { useEffect, useState } from 'react'
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
import { useWallet } from '@nevermined-io/providers'
import { appConfig } from '../../config'

export const assetTypes = ['Asset', 'NFT721', 'NFT1155']
// This component is used to publish an asset.
const PublishAsset = () => {
  const { sdk, isLoadingSDK, account } = Catalog.useNevermined()
  const { publishAsset, publishNFT721, publishNFT1155, assetPublish, setAssetPublish } =
    AssetService.useAssetPublish()
  const {walletAddress} = useWallet()
  const [didDeployed, setDidDeployed] = useState<any>()
  const [erc20, setErc20] = useState<string>('')
  const [cap, setCap] = useState<number>(0)
  const [royalties, setRoyalties] = useState<number>(0)
  const [royaltiesKind, setRoyaltiesKind] = useState<number>(RoyaltyKind.Standard)
  const [typeAsset, setTypeAsset] = useState<string>('Asset')

  useEffect(() => {
    if(isLoadingSDK || !walletAddress) {
      return
    }

    (async () => {
      if (!account.isTokenValid()) {
        const publisher = await getAccountObject(sdk, walletAddress)
        await account.generateToken(publisher) 
      }
    })()

    setErc20(sdk.utils.token.getAddress())
  }, [isLoadingSDK, walletAddress])

  const getAttributes = async() => {
    const publisher = await getAccountObject(sdk, walletAddress)

    const assetRewardsMap = new Map([
      [walletAddress, BigNumber.parseUnits(Number.parseFloat(assetPublish.price).toFixed(2))]
    ])

    const feeReceiver = await sdk.keeper.nvmConfig.getFeeReceiver()

    const assetPrice = new AssetPrice(assetRewardsMap).adjustToIncludeNetworkFees(
      feeReceiver,
      AssetPrice.NETWORK_FEE_DENOMINATOR,
    )

    assetPrice.setTokenAddress(erc20)

    const metadata: MetaData = {
      main: {
        name: assetPublish?.name,
        dateCreated: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        author: assetPublish?.author,
        license: 'No License Specified',
        datePublished: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        type: assetPublish?.type,
        files: [{ url: assetPublish?.file, contentType: 'text/markdown' }]
      },
      additionalInformation: {
        description: assetPublish?.description,
        categories: []
      }
    } as MetaData

    return {
      assetPrice,
      metadata,
      publisher
    }
  }

  async function handleOnSubmit() {
    const {assetPrice, publisher, metadata} = await getAttributes()
    const attributes = AssetAttributes.getInstance({
      metadata,
      price: assetPrice,
    })

    const ddo = await publishAsset({ assetAttributes: attributes, publisher })
    setDidDeployed(ddo!.id)
  }

  async function handleOnSubmitNft721() {
    const {assetPrice, publisher, metadata} = await getAttributes()
    const networkName = (await sdk.keeper.getNetworkName()).toLowerCase()
    const erc721ABI = await ContractHandler.getABI(
      'NFT721Upgradeable',
      appConfig.artifactsFolder,
      networkName,
    )

    const nft = await sdk.utils.contractHandler.deployAbi(erc721ABI, publisher, [
      walletAddress,
      sdk.keeper.didRegistry.address,
      'NFT721',
      'NVM',
      '',
      '0',
    ])

    const nftContract = await Nft721Contract.getInstance(
      (sdk.keeper as any).instanceConfig,
      nft.address,
    )

    await sdk.contracts.loadNft721(nftContract.address)

    const attributes = NFTAttributes.getNFT721Instance({
      metadata,
      price: assetPrice,
      preMint: false,
      nftTransfer: false,
      royaltyAttributes: undefined,
      nftContractAddress: nft.address,
      serviceTypes: ['nft-sales']
    })

    const mintAsset = await publishNFT721({
      nftAddress: erc20,
      nftAttributes: attributes,
      publisher,
    })
    setDidDeployed(mintAsset!.id)
  }

  async function handleOnSubmitNft() {
    const {assetPrice, publisher, metadata} = await getAttributes()
    const attributes = NFTAttributes.getNFT721Instance({
      metadata,
      price: assetPrice,
      preMint: false,
      nftTransfer: false,
      royaltyAttributes: undefined,
      serviceTypes: ['nft-sales']
    })

    const mintAsset = await publishNFT1155({
      nftAttributes: attributes,
      publisher
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

export default PublishAsset