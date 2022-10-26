import { Catalog } from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import React, { useEffect, useMemo, useState } from 'react'
import { BEM } from '@nevermined-io/styles'

import styles from './nft-list.module.scss'
import { type AssetInfo, mapDdoToAsset } from 'utils/utils'
import { Link } from 'react-router-dom'

const b = BEM('nft-list', styles)

const pageSize = 12

type NftListProps = unknown

export const NftList: React.FC<NftListProps> = () => {
  const { sdk } = Catalog.useNevermined()
  const { walletAddress } = MetaMask.useWallet()
  const [assets, setAssets] = useState<AssetInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
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
      } finally {
        setIsLoading(false)
      }
    }

    setIsLoading(true)

    if (walletAddress && isSdkAvailable) {
      fetchData()
    }
  }, [walletAddress, isSdkAvailable])

  useEffect(() => {
    if (isLoading && !hasLoaded) {
      setHasLoaded(true)
    }
  }, [isLoading, hasLoaded, setHasLoaded])

  return (
    <div className={b()}>
      {Boolean(!isLoading && hasLoaded && assets.length) &&
        assets.map(({ ddo, metadata }) => (
          <Link key={ddo.id} className={b('item')} to={`/nft/${ddo.id}`}>
            {metadata.main?.name || `${ddo.id.slice(0, 10)}...${ddo.id.slice(-4)}`}
          </Link>
        ))}
      {Boolean(!isLoading && hasLoaded && !assets.length) && 'There are no NFTs'}
      {isLoading && 'Loading...'}
    </div>
  )
}
