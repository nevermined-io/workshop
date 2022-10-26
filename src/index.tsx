import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Example from 'examples'
import { NftList } from 'pages/nft-list/nft-list'
import { NftDetails } from 'pages/nft-details/nft-details'
import { NftPublish } from 'pages/nft-publish/nft-publish'
import { App } from 'app'
import { NotFound } from 'pages/not-found/not-found'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'nft/publish',
        element: <NftPublish />,
      },
      {
        path: 'nft/:did',
        element: <NftDetails />,
      },
      {
        path: 'nfts',
        element: <NftList />,
      },
      {
        path: '/example',
        element: <Example />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />,
)
