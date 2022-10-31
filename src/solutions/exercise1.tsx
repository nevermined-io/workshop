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
      nvm-did="did:nv:586a7fece25c9bff23b72f257ce2ab1495778921dedeb2a416dbbe07d62cc223"
    ></div>
  )
}
