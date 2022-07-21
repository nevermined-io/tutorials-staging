import Catalog from '@nevermined-io/components-catalog'
import React from 'react'

// This component is used to display some asset information.
export const SingleAsset = (props: { did: string }) => {
  const { ddo, isLoading } = Catalog.useAsset(props.did)

  return (
    <>
      <div>
        {!isLoading && ddo ? (
          <div>
            {' '}
            Did : {ddo.id}{' '}
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
