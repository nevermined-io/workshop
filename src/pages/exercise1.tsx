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
        async
        defer
        type="text/javascript"
        src="http://localhost:8080/poap-widget.js"
      ></script>
      <div
        id="poap-widget"
        nvm-did="did:nv:48e9193249c5c394436c0191aa3f6bf3e640032c2031b7adc89675669a41cfd2"
      ></div>
    </>
  )
}
