import React, { useContext, useEffect } from 'react'
import { AppContext } from 'utils/app-context'

export const Exercise1 = () => {
  const { isWalletConnected, enableNextStep } = useContext(AppContext)

  useEffect(() => {
    enableNextStep(isWalletConnected)
  }, [isWalletConnected])

  return (
    <>
      {/* https://github.com/nevermined-io/nvm-one-widgets */}
      <script
        defer
        type="text/javascript"
        src="/lib/widget-poap.js"
      ></script>
      <div
        id="poap-widget"
        nvm-did="did:nv:2c66b9b65c71951b0c5155bfe6c374d68cc7483d715b11e27a39f286ca3d0722"
      ></div>
    </>
  )
}
