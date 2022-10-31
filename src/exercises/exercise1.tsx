import React, { useContext, useEffect } from 'react'
import { AppContext } from 'utils/app-context'

const Solution1 = () => {
  /**
   * Add your code here for exercise 1.
   *
   * 1. Render the POAP widget located in utils/poap-widget.js.
   * Create a block element with "nvm-poap-widget" id and a "nvm-widget"="did:nv:c6ad11d31da9baeebf2b827a0bbe6c3883c5de2b764d0fc48ed4ef5dfa249ba6" attribute
   *
   * 2. Once rendered redeem the POAP
   */
  return <></>
}

export const Exercise1 = () => {
  const { isWalletConnected, enableNextStep, poapsOwned } = useContext(AppContext)

  useEffect(() => {
    // enable next step based on the number of POAPs
    enableNextStep(isWalletConnected && poapsOwned > 0)
  }, [isWalletConnected, poapsOwned])

  return <div className="widget">{<Solution1 />}</div>
}
