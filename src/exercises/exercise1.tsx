import React, { useContext, useEffect } from 'react'
import { AppContext } from 'utils/app-context'
import { Solution1 } from 'solutions/exercise1'

export const Exercise1 = () => {
  const { isWalletConnected, enableNextStep, poapsOwned } = useContext(AppContext)

  useEffect(() => {
    // enable next step based on the number of POAPs
    enableNextStep(isWalletConnected && poapsOwned > 0)
  }, [isWalletConnected, poapsOwned])

  return <div className="widget">{<Solution1 />}</div>
}
