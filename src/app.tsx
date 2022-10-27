import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { AppContext } from 'utils/app-context'
import 'app.scss'

export const App = () => {
  const { isNextStepEnabled, isWalletConnected, connectWallet } = useContext(AppContext)

  return (
    <>
      <section>
        <Outlet />
      </section>
      <footer>
        <div className="navigation">
          <button disabled={!isNextStepEnabled}>Next Step</button>
        </div>
        {!isWalletConnected && (
          <div className="actions">
            <button onClick={connectWallet}>Connect to Nevermined</button>
          </div>
        )}
      </footer>
    </>
  )
}
