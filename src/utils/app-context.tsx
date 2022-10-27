/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { Catalog } from '@nevermined-io/catalog-core'

export const AppContext = React.createContext({
  isWalletConnected: false,
  connectWallet: () => {},
  isNextStepEnabled: false,
  enableNextStep: (value: boolean) => {},
})

export const AppProvider = ({ children }: { children: any }) => {
  const { isLoadingSDK } = Catalog.useNevermined()
  const { loginMetamask, walletAddress } = MetaMask.useWallet()
  const [isNextStepEnabled, enableNextStep] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(true)

  useEffect(() => {
    if (isLoadingSDK) {
      return
    }

    const isWalletAddressAvailable = walletAddress?.length > 0

    setIsWalletConnected(isWalletAddressAvailable)
  }, [isLoadingSDK, walletAddress])

  return (
    <AppContext.Provider
      value={{
        isWalletConnected,
        connectWallet: loginMetamask,
        isNextStepEnabled,
        enableNextStep,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
