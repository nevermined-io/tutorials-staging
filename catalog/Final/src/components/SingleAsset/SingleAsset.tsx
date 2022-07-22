import Catalog from '@nevermined-io/components-catalog'
import React from 'react'
import { useParams } from 'react-router-dom'

// This component is used to display some asset information.
export const SingleAsset = () => {
  let params = useParams()
  const { ddo, isLoading } = Catalog.useAsset(params.did!)

  return (
    <>
      <div>
        {!isLoading && ddo ? (
          <div>
            Did : {ddo.id}
            <div>
              <div> Name: {JSON.stringify(ddo.service[0].attributes.main.name)}</div>
              <div> Type: {JSON.stringify(ddo.service[0].attributes.main.type)}</div>
              <div> Date Created: {JSON.stringify(ddo.service[0].attributes.main.dateCreated)}</div>
              <div> Author: {JSON.stringify(ddo.service[0].attributes.main.author)}</div>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  )
}
