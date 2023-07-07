import { ConnectKit, useWallet } from '@nevermined-io/providers'
import { BigNumber, Catalog } from '@nevermined-io/catalog'
import React, { useEffect, useState } from 'react'
import {chainConfig} from '../../ChainConfig'
import { UiButton, UiText } from '@nevermined-io/styles'
import Link from 'next/link'

const tokenAddress = '0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63'

// This component is used to display the navbar and integrate the connection with your Metamask wallet.
export const NavBar = () => {
  const { walletAddress, logout } = useWallet()
  const { isLoadingSDK, sdk } = Catalog.useNevermined()
  const [balance, setBalance] = useState<string>()
  const [symbol, setSymbol] = useState('')

  useEffect(() => {
    if(isLoadingSDK || !walletAddress) {
      return
    }
    const fetchBalance = async () => {
      const customErc20Token = await sdk.contracts.loadErc20(tokenAddress)
      const decimals = await customErc20Token.decimals()
      const balance = await customErc20Token.balanceOf(walletAddress)
      if (walletAddress) {
        setBalance(
          BigNumber.formatUnits(balance, decimals)
        )
        setSymbol(await customErc20Token.symbol())
      }
    }
    fetchBalance().catch(console.error)
    // eslint-disable-next-line
  }, [walletAddress, isLoadingSDK])

  return (
    <div className="navbar">
      <ul className="navbar-list">
        <li className="nav-li">
          <Link className="nav-link" href="/">
            <UiText>Home</UiText>
          </Link>
        </li>
        <li className="nav-li">
          <Link className="nav-link" href="/publish">
            <UiText>New</UiText>
          </Link>
        </li>
        <li className=" nav-right">
          <div className="nav-item">
            {!walletAddress ? (
              <ConnectKit.ConnectKitButton/>
            ) : (
              <UiButton onClick={logout}>logout</UiButton>
            )}
          </div>
        </li>
        {walletAddress ? (
          <>
            <li className="nav-right">
              <UiText className="nav-item">
                {chainConfig[0].name}
              </UiText>
            </li>
            <li className="nav-right">
              <Link href={`/user/${walletAddress}`}>
                <UiText className="nav-item">
                  {`${walletAddress.substr(0, 6)}...${walletAddress.substr(-4)}`}
                </UiText>{' '}
              </Link>
            </li>
            <li className="nav-right">
              <UiText className="nav-item">{`${balance}  ${
                symbol
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
