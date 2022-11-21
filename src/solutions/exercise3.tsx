/**
 * Solution for exercise 3
 *
 * Meant to be used as reference
 */

import {
  AssetsModule,
  BigNumber,
  DDO,
  Nevermined,
  NFTSModule,
} from '@nevermined-io/catalog-core'

const buy = async (
  sdk: Nevermined,
  nfts: NFTSModule,
  ddo: DDO,
  owner: string,
) => {
  return nfts.access(ddo.id, owner, BigNumber.from(1), 1155)
}

const download = (assets: AssetsModule, ddo: DDO) => assets.downloadNFT(ddo.id)

export const solution3 = {
  buy,
  download,
}
