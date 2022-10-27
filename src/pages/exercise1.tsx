import React, { useContext, useEffect } from 'react'
import { AppContext } from 'utils/app-context'

export const Exercise1 = () => {
  const { isWalletConnected, enableNextStep } = useContext(AppContext)

  useEffect(() => {
    [
      'https://unpkg.com/widget-poap@0.0.5/452.js',
      'https://unpkg.com/widget-poap@0.0.5/widget-poap.js',
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
        nvm-did="did:nv:2c66b9b65c71951b0c5155bfe6c374d68cc7483d715b11e27a39f286ca3d0722"
      ></div>
    </>
  )
}
