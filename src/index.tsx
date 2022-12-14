import React, { useContext } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { AppProvider } from 'utils/app-context'
import { AssetService, Catalog, Logger } from '@nevermined-io/catalog-core'
import { appConfig } from 'config/config'
import { WalletProvider, getClient, ConnectKit } from '@nevermined-io/catalog-providers'
import { AppContext } from 'utils/app-context'
import { Exercise1 } from 'exercises/exercise1'
import { Exercise2 } from 'exercises/exercise2'
import { Exercise3 } from 'exercises/exercise3'
import './index.scss'

Logger.setLevel(3)

const Layout = () => {
  const {
    isPreviousStepEnabled,
    isNextStepEnabled,
    isWalletConnected,
    goToNextStep,
    goToPreviousStep,
    poapsOwned,
    nftsOwned,
  } = useContext(AppContext)

  return (
    <>
      <section>
        <Outlet />
      </section>
      <footer>
        <div className="navigation">
          {isPreviousStepEnabled && <button onClick={goToPreviousStep}>Previous</button>}
          <button disabled={!isNextStepEnabled} onClick={goToNextStep}>
            Next
          </button>
        </div>
        <p>POAPs owned: {poapsOwned}</p>
        <p>NFTs owned: {nftsOwned}</p>

        {!isWalletConnected && (
          <div className="actions">
            <ConnectKit.ConnectKitButton/>
          </div>
        )}
      </footer>
    </>
  )
}

const App = () => {
  return (
    <Catalog.NeverminedProvider config={appConfig} verbose={!!appConfig.verbose}>
      <AssetService.AssetPublishProvider>
        <WalletProvider
          correctNetworkId={80001}
          client={getClient()}
        >
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <AppProvider>
                    <Layout />
                  </AppProvider>
                }
              >
                <Route index element={<Navigate to="/exercise1" replace />} />
                <Route path="exercise1" element={<Exercise1 />} />
                <Route path="exercise2" element={<Exercise2 />} />
                <Route path="exercise3" element={<Exercise3 />} />
                <Route path="*" element={<Navigate to="/exercise1" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WalletProvider>
      </AssetService.AssetPublishProvider>
    </Catalog.NeverminedProvider>
  )
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />)
