/**
 * Solution for exercise 3
 *
 * Meant to be used as reference
 */

import {
  AccountModule,
  AssetsModule,
  BigNumber,
  DDO,
  getCurrentAccount,
  Nevermined,
  SubscriptionActions,
} from '@nevermined-io/catalog-core'

const buy = async (
  sdk: Nevermined,
  account: AccountModule,
  subscription: SubscriptionActions,
  ddo: DDO,
  owner: string,
) => {
  const currentAccount = await getCurrentAccount(sdk)
  if (
    !account.isTokenValid() ||
    account.getAddressTokenSigner().toLowerCase() !== currentAccount.getId().toLowerCase()
  ) {
    await account.generateToken()
  }

  return subscription.buySubscription(ddo.id, currentAccount, owner, BigNumber.from(1), 1155)
}

const download = (assets: AssetsModule, ddo: DDO) => assets.downloadNFT(ddo.id)

export const solution3 = {
  buy,
  download,
}
