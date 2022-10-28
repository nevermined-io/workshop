/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useEffect, useState } from 'react'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { Catalog } from '@nevermined-io/catalog-core'
import { useLocation, useNavigate } from 'react-router-dom'

export const AppContext = React.createContext({
  isWalletConnected: false,
  connectWallet: () => {},
  isPreviousStepEnabled: false,
  isNextStepEnabled: false,
  enableNextStep: (value: boolean) => {},
  goToPreviousStep: () => {},
  goToNextStep: () => {},
})

export const AppProvider = ({ children }: { children: any }) => {
  const { isLoadingSDK } = Catalog.useNevermined()
  const { loginMetamask, walletAddress } = MetaMask.useWallet()
  const navigate = useNavigate()
  const location = useLocation()
  const [isPreviousStepEnabled, enablePreviousStep] = useState(false)
  const [isNextStepEnabled, enableNextStep] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(true)

  useEffect(() => {
    if (isLoadingSDK) {
      return
    }

    const isWalletAddressAvailable = walletAddress?.length > 0

    setIsWalletConnected(isWalletAddressAvailable)
  }, [isLoadingSDK, walletAddress])

  useEffect(() => {
    if (location.pathname === '/exercise1') {
      enablePreviousStep(false)
    } else {
      enablePreviousStep(true)
    }
  }, [location])

  const goToPreviousStep = () => {
    navigate(-1)
  }

  const goToNextStep = useCallback(() => {
    switch (location.pathname) {
      case '/exercise1': {
        navigate('/exercise2')
        break
      }
      case '/exercise2': {
        navigate('/exercise3')
        break
      }
      case '/exercise3': {
        break
      }
    }
  }, [location])

  return (
    <AppContext.Provider
      value={{
        isWalletConnected,
        connectWallet: loginMetamask,
        isPreviousStepEnabled,
        isNextStepEnabled,
        enableNextStep,
        goToPreviousStep,
        goToNextStep,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
