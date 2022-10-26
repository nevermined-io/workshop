import type { MetaData, DDO, BigNumber } from '@nevermined-io/catalog-core'
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

function getDefiInfo({ additionalInformation }: MetaData): DefiInfo | undefined {
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
