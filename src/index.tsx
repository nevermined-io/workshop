import '@nevermined-io/styles/lib/esm/styles/globals.scss'
import '@nevermined-io/styles/lib/esm/index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Catalog, AssetService } from '@nevermined-io/catalog-core'
import { appConfig } from './config/config'
import Example from 'examples'
import { MetaMask } from '@nevermined-io/catalog-providers'
import chainConfig, { mumbaiChainId } from './config/chain_config'
import { NftList } from 'pages/nft-list/nft-list'
import { NftDetails } from 'pages/nft-details/nft-details'

const router = createBrowserRouter([
  {
    path: 'nft/:did',
    element: <NftDetails />,
  },
  {
    path: 'nfts',
    element: <NftList />,
  },
  {
    path: '/',
    element: <Example />,
  },
])

createRoot(document.getElementById('root') as HTMLElement).render(
  <div>
    <Catalog.NeverminedProvider config={appConfig} verbose={!!appConfig.verbose}>
      <AssetService.AssetPublishProvider>
        <MetaMask.WalletProvider
          externalChainConfig={chainConfig}
          correctNetworkId={mumbaiChainId}
          nodeUri={String(appConfig.nodeUri)}
        >
          <RouterProvider router={router} />
        </MetaMask.WalletProvider>
      </AssetService.AssetPublishProvider>
    </Catalog.NeverminedProvider>
  </div>,
)
