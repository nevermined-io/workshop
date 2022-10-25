import { Catalog } from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import React, { useEffect, useMemo, useState } from 'react'
import { BEM } from '@nevermined-io/styles'

import styles from './nft-list.module.scss'
import { type AssetInfo, mapDdoToAsset } from 'utils/utils'

const b = BEM('nft-list', styles)

const pageSize = 12

type NftListProps = unknown

export const NftList: React.FC<NftListProps> = () => {
  const { sdk } = Catalog.useNevermined()
  const { walletAddress } = MetaMask.useWallet()
  const [assets, setAssets] = useState<AssetInfo[]>([])

  const isSdkAvailable = useMemo(() => sdk && Object.keys(sdk).length > 0, [sdk])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await sdk.assets.query({
          offset: pageSize,
          page: 1,
          sort: {
            created: 'desc',
          },
        })

        setAssets(result.results.map((ddo) => mapDdoToAsset(ddo)))

        console.log(result.results)
      } catch (err) {
        console.error(err)
      }
    }

    if (walletAddress && isSdkAvailable) {
      fetchData()
    }
  }, [walletAddress, isSdkAvailable])

  return (
    <>
      {assets.length ? (
        <div className={b()}>
          {assets.map(({ ddo, metadata }) => (
            <a key={ddo.id} className={b('item')}>
              {metadata.main?.name || ddo.id}
            </a>
          ))}
        </div>
      ) : (
        'There are no NFTs'
      )}
    </>
  )
}
