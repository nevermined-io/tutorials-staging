import { MetaMask } from '@nevermined-io/catalog-providers' 
import Catalog from '@nevermined-io/catalog-core'
import React, { useEffect, useState } from 'react'
import './NavBar.scss'
import ChainConfig from '../../ChainConfig'
import Web3 from 'web3'

// This component is used to display the navbar and integrate the connection with your Metamask wallet.
export const NavBar = () => {
  const { loginMetamask, walletAddress, logout } = MetaMask.useWallet()
  const web3 = new Web3(window.ethereum)
  const { isLoadingSDK } = Catalog.useNevermined()
  const [balance, setBalance] = useState<string>()

  useEffect(() => {
    const fetchBalance = async () => {
      if (walletAddress) {
        setBalance(
          await web3.eth
            .getBalance(web3.utils.toChecksumAddress(walletAddress))
            .then((x) => web3.utils.fromWei(x, 'ether'))
        )
      }
    }
    fetchBalance().catch(console.error)
    // eslint-disable-next-line
  }, [walletAddress])

  return (
    <div className="navbar">
      <div>
        <ul className="navbar-list">
          <li className="nav-li">
            <a className="nav-link" href="/">
              Home
            </a>
          </li>
          <li className="nav-li">
            <a className="nav-link" href="/publish">
              New
            </a>
          </li>
          <li className="nav-li nav-right">
              {!walletAddress ? (
                <div className="nav-link" onClick={loginMetamask}>Login</div>
              ) : (
                <div className="nav-link" onClick={logout}>logout</div>
              )}
          </li>
          {walletAddress ? (
            <>
              <li className="nav-li nav-right">
                <div className="nav-item">
                  {ChainConfig.returnConfig(window.ethereum.chainId).chainName}
                </div>
              </li>
              <li className="nav-li nav-right">
                <div className="nav-item">{walletAddress}</div>
              </li>
              <li className="nav-li nav-right">
                <div className="nav-item">{`${balance}  ${
                  ChainConfig.returnConfig(window.ethereum.chainId).nativeCurrency.symbol
                }`}</div>
              </li>
            </>
          ) : (
            <></>
          )}
          <li className="nav-li nav-right">
            <div className="nav-item">
              <div>
                {!isLoadingSDK ? (
                  <span className="logged-in"> ●</span>
                ) : (
                  <span className="logged-out"> ●</span>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
