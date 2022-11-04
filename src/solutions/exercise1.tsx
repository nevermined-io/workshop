/**
 * Solution for exercise 1
 *
 * Meant to be used as reference
 */

import React, { useEffect } from 'react'

export const Solution1 = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'http://localhost:8080/poap-widget-loader.js'
    script.defer = true

    const widgetNode = document.getElementById('nvm-poap-widget')
    const widgetParentNode = widgetNode?.parentNode
    widgetParentNode?.insertBefore(script, widgetNode)
  }, [])

  return (
    <div
      id="nvm-poap-widget"
      nvm-did="did:nv:586a7fece25c9bff23b72f257ce2ab1495778921dedeb2a416dbbe07d62cc223"
    ></div>
  )
}
