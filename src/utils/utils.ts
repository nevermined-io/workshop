import type { MetaData, DDO, BigNumber, Nevermined } from '@nevermined-io/catalog-core'
import { WagmiCore } from '@nevermined-io/catalog-providers'
import { didZeroX } from '@nevermined-io/nevermined-sdk-js/dist/node/utils'
import { categoryPrefix, networkPrefix, subcategoryPrefix } from './constants'

export type DefiInfo = {
  category: string
  subcategory: string
  network: string
}

export type AssetInfo = {
  ddo: DDO
  metadata: MetaData
  defi?: DefiInfo
}

export function getDefiInfo({ additionalInformation }: MetaData): DefiInfo | undefined {
  const categories = additionalInformation?.categories

  if (categories) {
    const findBy = (prefix: string) => {
      const result = categories.filter((cat) => cat.includes(prefix))
      return result.length > 0 ? result[0].substring(result[0].indexOf(':') + 1) : ''
    }

    return {
      category: findBy(categoryPrefix),
      subcategory: findBy(subcategoryPrefix),
      network: findBy(networkPrefix),
    }
  }
}

export function mapDdoToAsset(ddo: DDO): AssetInfo {
  const metadata = ddo.findServiceByType('metadata').attributes

  return {
    ddo,
    metadata,
    defi: getDefiInfo(metadata),
  }
}

export const getFeesFromBigNumber = (fees: BigNumber): string => {
  return (fees.toNumber() / 10000).toPrecision(2).toString()
}

export const loadAssetProvenance = async (
  sdk: Nevermined,
  provider: WagmiCore.Provider,
  did: string,
): Promise<any | undefined> => {
  let useds = sdk.keeper.didRegistry.events.getPastEvents({
    methodName: 'getUseds',
    filterSubgraph: {
      where: {
        _did: didZeroX(did),
      },
      orderBy: '_blockNumberUpdated',
      orderDirection: 'desc',
    },
    result: {
      id: true,
      _did: true,
      __typename: true,
      _attributes: true,
      _blockNumberUpdated: true,
      _agentId: true,
    },
  })

  useds = Promise.all(
    (await useds).map(async (event) => {
      const block = await provider.getBlock(event._blockNumberUpdated.toNumber())
      return { ...event, date: new Date(Number(block.timestamp) * 1000) }
    }),
  )

  return useds
}

export function toDate(date: string) {
  return new Date(date).toLocaleDateString('en-uk')
}
