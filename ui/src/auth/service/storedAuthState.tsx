import { ITokenInfo, IUserInfo } from 'src/api/interface/IAuthApi'
import Cookies, { CookieAttributes } from 'js-cookie'

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

export const getUserInfoFromLocalStorage = () => {
  try {
    const userInfo = localStorage.getItem('userInfo')

    if (userInfo === null || typeof userInfo === 'undefined' || userInfo === 'undefined' || userInfo === '') {
      return null
    }

    return JSON.parse(userInfo)
  } catch (error) {
    return null
  }
}
