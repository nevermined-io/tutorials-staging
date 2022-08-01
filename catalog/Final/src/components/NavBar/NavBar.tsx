import { MetaMask } from '@nevermined-io/catalog-providers'
import Catalog from '@nevermined-io/catalog-core'
import React, { useEffect, useState } from 'react'
import './NavBar.scss'
import ChainConfig from '../../ChainConfig'
import Web3 from 'web3'
import { UiButton, UiText } from '@nevermined-io/styles'

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
      <ul className="navbar-list">
        <li className="nav-li">
          <a className="nav-link" href="/">
            <UiText>Home</UiText>
          </a>
        </li>
        <li className="nav-li">
          <a className="nav-link" href="/publish">
            <UiText>New</UiText>
          </a>
        </li>
        <li className=" nav-right">
          <div className="nav-item">
            {!walletAddress ? (
              <UiButton onClick={loginMetamask}>Login</UiButton>
            ) : (
              <UiButton onClick={logout}>logout</UiButton>
            )}
          </div>
        </li>
        {walletAddress ? (
          <>
            <li className="nav-right">
              <UiText className="nav-item">
                {ChainConfig.returnConfig(window.ethereum.chainId).chainName}
              </UiText>
            </li>
            <li className="nav-right">
              <UiText className="nav-item">{walletAddress}</UiText>
            </li>
            <li className="nav-right">
              <UiText className="nav-item">{`${balance}  ${
                ChainConfig.returnConfig(window.ethereum.chainId).nativeCurrency.symbol
              }`}</UiText>
            </li>
          </>
        ) : (
          <></>
        )}
        <li className="nav-right">
          <UiText className="nav-item">
            <div>
              {!isLoadingSDK ? (
                <span className="logged-in"> ●</span>
              ) : (
                <span className="logged-out"> ●</span>
              )}
            </div>
          </UiText>
        </li>
      </ul>
    </div>
  )
}
