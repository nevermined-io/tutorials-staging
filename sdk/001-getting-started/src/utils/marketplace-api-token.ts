import { Nevermined, Logger, Account } from '@nevermined-io/sdk'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const MARKETPLACE_API_TOKEN = 'marketplaceAPIToken'

/**
 * Get Marketplace API token to local storage
 *
 *
 * @return Auth token object which generated from Marketplace API
 */
export const fetchMarketplaceApiTokenFromLocalStorage = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  if (!window?.localStorage) {
    Logger.warn('Fetching Marketplace Api token: Window object is not ready or missing')
    return ''
  }

  return localStorage.getItem(`${address}_${chainId}_${MARKETPLACE_API_TOKEN}`)
}

export const setMarketplaceApiTokenOnLocalStorage = ({
  address,
  chainId,
  token,
}: {
  address: string
  chainId: number
  token: string
}) => {
  if (!window?.localStorage) {
    Logger.warn('Set Marketplace Api token: Window object is not ready or missing')
    return ''
  }

  return localStorage.setItem(`${address}_${chainId}_${MARKETPLACE_API_TOKEN}`, token)
}

/**
 * Generate new Marketplace API token
 *
 * @param address account address of the wallet
 * @param chainId the network id
 * @param message Optional message to be included. Usually to be displayed in metamask
 * @param sdk Instance of SDK object
 *
 * @return Auth token object which generated from Marketplace API
 */
export const newMarketplaceApiToken = async ({
  neverminedAccount,
  chainId,
  message,
  sdk,
}: {
  neverminedAccount: Account
  chainId: number
  message?: string
  sdk: Nevermined
}) => {
  if (!window?.localStorage) {
    Logger.warn('Setting Marketplace Api token: Window object is not ready or it is missed')
    return false
  }

  try {
    const credential = await sdk.utils.jwt.generateClientAssertion(neverminedAccount, message)
    const token = await sdk.services.marketplace.login(credential)

    setMarketplaceApiTokenOnLocalStorage({ address: neverminedAccount.getId(), chainId, token })
    // eslint-disable-next-line consistent-return
    return true
  } catch (error: any) {
    Logger.error(error as string)
    return false
  }
}

/**
 * @param address account address of the wallet
 * @param chainId the network Id
 * Check if Marketplace API Token is valid
 * @return Return `true` if token is valid
 */
export const isTokenValid = ({ address, chainId }: { address: string; chainId: number }) => {
  const token = fetchMarketplaceApiTokenFromLocalStorage({ address, chainId })

if (token) {
    const decodedToken = jwt.decode(token);
    if (!decodedToken) {
        return false;
    }

    const expiry = (decodedToken as JwtPayload)?.exp;
    if (expiry) {
        const now = new Date();
        return now.getTime() < Number(expiry) * 1000;
    }
}

  return false
}
