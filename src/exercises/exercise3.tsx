/* eslint-disable @typescript-eslint/no-unused-vars */
import { BigNumber, Catalog, DDO, getCurrentAccount } from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { solution3 } from 'solutions/exercise3'
import { AppContext } from 'utils/app-context'
import { type AssetInfo, mapDdoToAsset } from 'utils/utils'

const pageSize = 20

const BuyAsset = ({ ddo }: { ddo: DDO }) => {
  const { assets, account, isLoadingSDK, subscription, sdk } = Catalog.useNevermined()
  const { walletAddress } = MetaMask.useWallet()
  const [ownNFT1155, setOwnNFT1155] = useState(false)
  const [isBought, setIsBought] = useState(false)
  const [owner, setOwner] = useState('')

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      setOwnNFT1155(await account.isNFT1155Holder(ddo.id, walletAddress))
      setOwner(await sdk.assets.owner(ddo.id))
    })()
  }, [walletAddress, isBought])

  const handleBuyClick = async () => {
    /**
     *
     * Implement and add your code here for purchasing a DDO
     * const response = await BUY...
     * setIsBought(Boolean(response))
     */
  }

  const handleDownloadClick = async () => {
    /**
     *
     * Implement and add your code here for downloading a DDO
     *
     */
  }

  return (
    <div className="nft-list__buy">
      {ownNFT1155 ? (
        <button onClick={handleDownloadClick} disabled={isLoadingSDK}>
          Download NFT
        </button>
      ) : owner !== walletAddress ? (
        <button onClick={handleBuyClick} disabled={isLoadingSDK}>
          Buy
        </button>
      ) : (
        <span>The owner cannot buy, please change the account to buy the NFT asset</span>
      )}
    </div>
  )
}

export const Exercise3 = () => {
  const { sdk } = Catalog.useNevermined()
  const { walletAddress } = MetaMask.useWallet()
  const { enableNextStep } = useContext(AppContext)
  const [assets, setAssets] = useState<AssetInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const isSdkAvailable = useMemo(() => sdk && Object.keys(sdk).length > 0, [sdk])

  useEffect(() => {
    enableNextStep(false)
  }, [])

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
    <div className="nft-list">
      {Boolean(!isLoading && hasLoaded && assets.length) &&
        assets.map(({ ddo, metadata }) => (
          <div key={ddo.id} className="nft-list__item">
            <div className="nft-list__data">
              {metadata.main?.name || `${ddo.id.slice(0, 10)}...${ddo.id.slice(-4)}`}
            </div>
            <BuyAsset ddo={ddo} />
          </div>
        ))}
      {Boolean(!isLoading && hasLoaded && !assets.length) && 'There are no NFTs'}
      {isLoading && 'Loading...'}
    </div>
  )
}
