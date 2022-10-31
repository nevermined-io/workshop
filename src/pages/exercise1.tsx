import React, { useContext, useEffect } from 'react'
import { AppContext } from 'utils/app-context'
import 'utils/widget-poap'

export const Exercise1 = () => {
  const { isWalletConnected, enableNextStep, poapsOwned } = useContext(AppContext)

  useEffect(() => {
    // enable next step based on the number of POAPs
    enableNextStep(isWalletConnected && poapsOwned > 0)
  }, [isWalletConnected, poapsOwned])

  return (
    <div className="widget">
      <div
        id="nvm-poap-widget"
        nvm-did="did:nv:c6ad11d31da9baeebf2b827a0bbe6c3883c5de2b764d0fc48ed4ef5dfa249ba6"
      ></div>
    </div>
  )
}
