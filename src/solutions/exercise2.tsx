/**
 * Solution for exercise 2
 *
 * Meant to be used as reference
 */

import {
  BigNumber,
  getCurrentAccount,
  getRoyaltyScheme,
  Nevermined,
  RoyaltyKind,
  AssetRewards
} from '@nevermined-io/catalog-core'
import type {
  AssetPublishParams,
  AssetPublishProviderState,
  MetaData,
} from '@nevermined-io/catalog-core/dist/node/types/index'
import { appConfig, erc20TokenAddress } from 'config/config'

export const solution2 = async (
  sdk: Nevermined,
  publishNFT1155: AssetPublishProviderState['publishNFT1155'],
  assetPublish: AssetPublishParams,
  quantity: string,
) => {
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

    try {
      await publishNFT1155({
        neverminedNodeAddress: String(appConfig.neverminedNodeAddress),
        assetRewards,
        metadata: {
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
        } as MetaData,
        nftAmount: BigNumber.from(1),
        preMint: true,
        cap: BigNumber.from(quantity),
        royaltyAttributes,
        erc20TokenAddress,
      })
    } catch (error: any) {
      if (error.message.includes('Transaction was not mined within 50 blocks')) {
        console.error(
          'Transaction was not mined within 50 blocks, but it might still be mined. Check later the Published Assets section in your Account',
        )
      }
    }
  } catch (error) {
    console.log('error', error)
  }
}
