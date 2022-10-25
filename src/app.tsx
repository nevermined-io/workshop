import '@nevermined-io/styles/lib/esm/styles/globals.scss'
import '@nevermined-io/styles/lib/esm/index.css'
import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Catalog, AssetService } from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { appConfig } from './config/config'
import chainConfig, { mumbaiChainId } from './config/chain_config'
import 'app.scss'

export const App = () => {
  return (
    <>
      <Catalog.NeverminedProvider config={appConfig} verbose={!!appConfig.verbose}>
        <AssetService.AssetPublishProvider>
          <MetaMask.WalletProvider
            externalChainConfig={chainConfig}
            correctNetworkId={mumbaiChainId}
            nodeUri={String(appConfig.nodeUri)}
          >
            <>
              <header>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="nfts">NFTs</Link>
                  </li>
                  <li>
                    <Link to="nft/publish">Publish NFT</Link>
                  </li>
                </ul>
              </header>
              <section>
                <Outlet />
              </section>
              <footer></footer>
            </>
          </MetaMask.WalletProvider>
        </AssetService.AssetPublishProvider>
      </Catalog.NeverminedProvider>
    </>
  )
}
