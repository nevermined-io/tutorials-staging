import Catalog from '@nevermined-io/components-catalog'
import { SingleAsset } from 'components/SingleAsset/SingleAsset'
import React, { useEffect, useState } from 'react'
import './MultipleAssets.scss'

const q = {
  offset: 150,
  page: 1,
  query: {},
  sort: {
    created: 'desc'
  }
}

// This component is used to display a list of assets.
export const MultipleAssets = () => {
  const { isLoading: isLoadingAssets, result } = Catalog.useAssets(q)
  const [dids, setDids] = useState<string[]>()
  const [assetDid, setAssetDid] = useState<string>('')

  useEffect(() => {
    setDids(result?.results?.map((asset) => asset.id))
  }, [result])

  const [query, setQuery] = useState('')

  function filterItems(query: string) {
    setQuery(query)
    setDids(result?.results?.map((asset) => asset.id)?.filter((item) => item.includes(query)))
  }

  function handleAssetClick(did: string) {
    setAssetDid(did)
  }

  return (
    <>
      <div className="items">
        <div className="item">
          <div>
            <input
              type="search"
              name="search-form"
              id="search-form"
              className="search-input"
              placeholder="Search for..."
              value={query}
              onChange={(e) => filterItems(e.target.value)}
            />
          </div>
          <ul className="asset-list">
            {!isLoadingAssets
              ? dids?.map((asset) => (
                  <li key={asset}>
                    <div onClick={() => handleAssetClick(asset)}>{asset}</div>
                  </li>
                ))
              : 'Loading assets...'}
          </ul>
        </div>
        <div className="item">
          <SingleAsset did={assetDid!} />
        </div>
      </div>
    </>
  )
}
