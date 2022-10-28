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
  const { enableNextStep } = useContext(AppContext)
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
    enableNextStep(true)
  }, [])

  const generateMetadata = () => {
    const metadata = {
      main: {
        name: assetPublish.name,
        dateCreated: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        author: 'Some author',
        license: 'No License Specified',
        datePublished: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        type: 'dataset',
        files: [
          {
            index: 0,
            contentType: '',
            url: 'https://uploads5.wikiart.org/00268/images/william-holbrook-beard/the-bear-dance-1870.jpg',
            contentLength: '',
          },
        ],
      },
      additionalInformation: {
        description: '',
      },
    } as MetaData

    return metadata
  }

  const publish = async () => {
    try {
      const publisher = await getCurrentAccount(sdk)
      const assetRewards = new AssetRewards(publisher.getId(), BigNumber.from(0))
      const networkFee = await sdk.keeper.nvmConfig.getNetworkFee()
      const feeReceiver = await sdk.keeper.nvmConfig.getFeeReceiver()

      assetRewards.addNetworkFees(feeReceiver, BigNumber.from(networkFee))

      const royaltyAttributes = {
        royaltyKind: RoyaltyKind.Standard,
        scheme: getRoyaltyScheme(sdk, RoyaltyKind.Standard),
        amount: 0,
      }

      if (
        !account.isTokenValid() ||
        account.getAddressTokenSigner().toLowerCase() !== publisher.getId().toLowerCase()
      ) {
        await account.generateToken()
      }

      try {
        await publishNFT1155({
          gatewayAddress: String(appConfig.gatewayAddress),
          assetRewards,
          metadata: generateMetadata(),
          nftAmount: BigNumber.from(1),
          preMint: true,
          cap: BigNumber.from(quantity),
          royaltyAttributes,
          erc20TokenAddress,
        })
      } catch (error: any) {
        if (error.message.includes('Transaction was not mined within 50 blocks')) {
          setErrorAssetMessage(
            'Transaction was not mined within 50 blocks, but it might still be mined. Check later the Published Assets section in your Account',
          )
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }

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
        await publish()
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
