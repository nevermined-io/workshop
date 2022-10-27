import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from 'app'
import { Exercise1 } from 'pages/exercise1'
import { Exercise2 } from 'pages/exercise2'
import { Exercise3 } from 'pages/exercise3'
import { AppProvider } from 'utils/app-context'
import { AssetService, Catalog } from '@nevermined-io/catalog-core'
import { appConfig } from 'config/config'
import { MetaMask } from '@nevermined-io/catalog-providers'
import chainConfig, { mumbaiChainId } from 'config/chain_config'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Catalog.NeverminedProvider config={appConfig} verbose={!!appConfig.verbose}>
        <AssetService.AssetPublishProvider>
          <MetaMask.WalletProvider
            externalChainConfig={chainConfig}
            correctNetworkId={mumbaiChainId}
            nodeUri={String(appConfig.nodeUri)}
          >
            <AppProvider>
              <App />
            </AppProvider>
          </MetaMask.WalletProvider>
        </AssetService.AssetPublishProvider>
      </Catalog.NeverminedProvider>
    ),
    children: [
      {
        index: true,
        path: 'exercise1',
        element: <Exercise1 />,
      },
      {
        path: 'exercise2',
        element: <Exercise2 />,
      },
      {
        path: 'exercise3',
        element: <Exercise3 />,
      },
    ],
  },
])

createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />,
)
