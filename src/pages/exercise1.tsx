import React, { useContext, useEffect } from 'react'
import { AppContext } from 'utils/app-context'

export const Exercise1 = () => {
  const { isWalletConnected, enableNextStep } = useContext(AppContext)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'http://localhost:8080/widget-poap.js'
    script.defer = true
    document.body.appendChild(script)
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
