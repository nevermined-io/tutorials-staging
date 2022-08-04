import Catalog from '@nevermined-io/catalog-core'
import { UiDivider, UiLayout, UiText, UiFormInput } from '@nevermined-io/styles'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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

  useEffect(() => {
    setDids(result?.results?.map((asset) => asset.id))
  }, [result])

  const [query, setQuery] = useState('')

  function filterItems(query: string) {
    setQuery(query)
    setDids(result?.results?.map((asset) => asset.id)?.filter((item) => item.includes(query)))
  }

  return (
    <>
      <UiLayout type="grid" align="center" direction="column">
        <UiDivider />
        <UiFormInput
          type="search"
          name="search-form"
          id="search-form"
          placeholder="Search for..."
          value={query}
          onChange={(e) => filterItems(e.target.value)}
        />
        <UiDivider />
        <ul>
          {!isLoadingAssets ? (
            dids?.map((asset) => (
              <li key={asset}>
                <Link to={`/did/${asset}`}>
                  <UiText>{asset}</UiText>
                </Link>
              </li>
            ))
          ) : (
            <UiText>Loading assets...</UiText>
          )}
        </ul>
      </UiLayout>
    </>
  )
}
