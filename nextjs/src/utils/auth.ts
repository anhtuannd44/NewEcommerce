import Cookies from 'js-cookie'
import type { CookieAttributes } from 'js-cookie'

import type { ITokenInfo, IUserInfo } from '@/interface/auth'

export const isTokenExpired = (exp: number): boolean => {
  const expDate = new Date(exp)

  if (expDate === null) {
    return false
  }

  return !(expDate.valueOf() > new Date().valueOf())
}

export const setStoredAuthState = (tokenInfo: ITokenInfo, userInfo: IUserInfo) => {
  const options: CookieAttributes = {
    path: '/',
    sameSite: 'strict',
    domain: '.localhost',
    secure: false
  }

  Cookies.set('tokenInfo', JSON.stringify(tokenInfo), options)
  Cookies.set('userInfo', JSON.stringify(userInfo), options)
}

export const removeStoredAuthState = () => {
  Cookies.remove('tokenInfo')
  Cookies.remove('userInfo')
}

export const getTokenInfoFromLocalCookie = (): ITokenInfo | null => {
  try {
    const tokenInfo = Cookies.get('tokenInfo')

    if (tokenInfo === null || typeof tokenInfo === 'undefined' || tokenInfo === 'undefined' || tokenInfo === '') {
      return null
    }

    return JSON.parse(tokenInfo)
  } catch (error) {
    removeStoredAuthState()

    return null
  }
}

export const logout = (returnUrl?: string): string => {
  removeStoredAuthState()

  return returnUrl ? `login?returnUrl=${encodeURIComponent(returnUrl)}` : 'login'
}
