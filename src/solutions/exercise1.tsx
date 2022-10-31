/**
 * Solution for exercise 1
 *
 * Meant to be used as reference
 */

import React, { useEffect } from 'react'
import loadPoapWidget from 'utils/poap-widget'

export const Solution1 = () => {
  useEffect(() => {
    loadPoapWidget()
  }, [])

  return (
    <div
      id="nvm-poap-widget"
      nvm-did="did:nv:c6ad11d31da9baeebf2b827a0bbe6c3883c5de2b764d0fc48ed4ef5dfa249ba6"
    ></div>
  )
}
