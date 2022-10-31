/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  AssetService,
  BigNumber,
  Catalog,
  getCurrentAccount,
  getRoyaltyScheme,
  MetaData,
  RoyaltyKind,
} from '@nevermined-io/catalog-core'
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards'
import { appConfig, erc20TokenAddress } from 'config/config'
import { AppContext } from 'utils/app-context'

type NftPublishProps = unknown

export const Exercise2: React.FC<NftPublishProps> = () => {
  const { account, sdk } = Catalog.useNevermined()
  const { assetPublish, handleChange, setErrorAssetMessage, setAssetPublish, publishNFT1155 } =
    AssetService.useAssetPublish()
  const { enableNextStep, nftsOwned } = useContext(AppContext)
  const [_, setErrors] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState('1')

  const resetValues = () => {
    setAssetPublish({
      name: '',
      author: '',
      description: '',
      type: '',
      category: 'None',
      protocol: 'None',
      network: 'None',
      price: 0,
      assetFiles: [],
    })
  }

  useEffect(() => {
    resetValues()

    // enable next step based on the number of NFTs
    enableNextStep(nftsOwned > 0)
  }, [nftsOwned])

  const handleSubmitClick = useCallback(
    async (e: React.SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault()

      const errors: Record<string, string> = {}

      if (!assetPublish.name) {
        errors.name = 'Name is required'
      }

      if (Object.keys(errors).length) {
        return
      }

      try {
        /**
         *
         * Add your code here for exercise 2.
         * Implement publish function
         *
         * await PUBLISH...
         */
      } catch (error: any) {
        setErrorAssetMessage(error.message)
      }
    },
    [assetPublish, setErrors],
  )

  return (
    <div className="nft-publish">
      <form>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="input" onChange={(e) => handleChange(e.target.value, 'name')} />
        </div>
        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="publish-button">
          <button onClick={handleSubmitClick}>Publish Asset</button>
        </div>
      </form>
    </div>
  )
}
