/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useEffect, useState } from 'react'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { Catalog } from '@nevermined-io/catalog-core'
import { useLocation, useNavigate } from 'react-router-dom'
import { poapDIDZeroX } from 'config/config'

export const AppContext = React.createContext({
  isWalletConnected: false,
  connectWallet: () => {},
  isPreviousStepEnabled: false,
  isNextStepEnabled: false,
  enableNextStep: (value: boolean) => {},
  goToPreviousStep: () => {},
  goToNextStep: () => {},
  poapsOwned: 0,
  nftsOwned: 0,
})

export const AppProvider = ({ children }: { children: any }) => {
  const { isLoadingSDK, sdk } = Catalog.useNevermined()
  const { loginMetamask, walletAddress } = MetaMask.useWallet()
  const navigate = useNavigate()
  const location = useLocation()
  const [isPreviousStepEnabled, enablePreviousStep] = useState(false)
  const [isNextStepEnabled, enableNextStep] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(true)
  const [poapsOwned, setPoapsOwned] = useState(0)
  const [nftsOwned, setNftsOwned] = useState(0)

  useEffect(() => {
    if (isLoadingSDK) {
      return
    }

    const isWalletAddressAvailable = walletAddress?.length > 0
    console.log('wallet is connected')

    setIsWalletConnected(isWalletAddressAvailable)
  }, [isLoadingSDK, walletAddress])

  useEffect(() => {
    if (location.pathname === '/exercise1') {
      enablePreviousStep(false)
    } else {
      enablePreviousStep(true)
    }
  }, [location])

  // Get owned poaps
  useEffect(() => {
    if (!walletAddress || isLoadingSDK) {
      console.log('no wallet address')
      return
    }

    console.log('walletAddress: ', walletAddress)
    console.log('poapDID:', poapDIDZeroX)
    const getPoapOwned = async () => {
      const eventOptions = {
        methodName: 'getFulfilleds',
        filterSubgraph: {
          where: {
            _did: poapDIDZeroX,
            _receiver: walletAddress,
          },
        },
        result: {
          id: true,
        },
      }

      const events = await sdk.keeper.conditions.transferNft721Condition.events.once(
        (e) => e,
        eventOptions,
      )
      console.log('events', events, events.length)
      setPoapsOwned(events.length)
    }

    getPoapOwned().catch(console.error)
  }, [walletAddress, isLoadingSDK])

  // Get owned nfts
  useEffect(() => {
    if (!walletAddress || isLoadingSDK) {
      console.log('no wallet address')
      return
    }

    console.log('walletAddress: ', walletAddress)
    const getNftOwned = async () => {
      const eventOptions = {
        methodName: 'getFulfilleds',
        filterSubgraph: {
          where: {
            _receiver: walletAddress,
          },
        },
        result: {
          id: true,
        },
      }

      const events = await sdk.keeper.conditions.transferNftCondition.events.once(
        (e) => e,
        eventOptions,
      )
      console.log('events', events, events.length)
      setNftsOwned(events.length)
    }

    getNftOwned().catch(console.error)
  }, [walletAddress, isLoadingSDK])

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
        poapsOwned,
        nftsOwned,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
