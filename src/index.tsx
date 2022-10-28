import React, { useContext } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { AppProvider } from 'utils/app-context'
import { AssetService, Catalog } from '@nevermined-io/catalog-core'
import { appConfig } from 'config/config'
import { chainConfig, mumbaiChainId } from 'config/chain_config'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { AppContext } from 'utils/app-context'
import { Exercise1 } from 'pages/exercise1'
import { Exercise2 } from 'pages/exercise2'
import { Exercise3 } from 'pages/exercise3'
import './index.scss'

const Layout = () => {
  const {
    isPreviousStepEnabled,
    isNextStepEnabled,
    isWalletConnected,
    connectWallet,
    goToNextStep,
    goToPreviousStep,
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
        {!isWalletConnected && (
          <div className="actions">
            <button onClick={connectWallet}>Connect to Nevermined</button>
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
        <MetaMask.WalletProvider
          externalChainConfig={chainConfig}
          correctNetworkId={mumbaiChainId}
          nodeUri={String(appConfig.nodeUri)}
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
        </MetaMask.WalletProvider>
      </AssetService.AssetPublishProvider>
    </Catalog.NeverminedProvider>
  )
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />)
