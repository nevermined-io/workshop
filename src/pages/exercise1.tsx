import React, { useContext, useEffect } from 'react'
import { AppContext } from 'utils/app-context'

export const Exercise1 = () => {
  const { isWalletConnected, enableNextStep } = useContext(AppContext)

  useEffect(() => {
    [
      'https://unpkg.com/widget-poap@0.0.6/452.js',
      'https://unpkg.com/widget-poap@0.0.6/widget-poap.js',
    ].forEach((s) => {
      const script = document.createElement('script')
      script.src = s
      script.defer = true
      document.body.appendChild(script)
    })
  }, [])

  useEffect(() => {
    enableNextStep(isWalletConnected)
  }, [isWalletConnected])

  return (
    <>
      <div
        id="poap-widget"
        nvm-did="did:nv:c6ad11d31da9baeebf2b827a0bbe6c3883c5de2b764d0fc48ed4ef5dfa249ba6"
      ></div>
    </>
  )
}
