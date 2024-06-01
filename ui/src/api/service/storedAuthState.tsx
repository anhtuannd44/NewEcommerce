import { IncomingMessage } from "http"
import { ITokenInfo, IUserInfo } from "src/api/IAuthApi"
import Cookies from "js-cookie"

export const setStoredAuthState = (tokenInfo: ITokenInfo, userInfo: IUserInfo) => {
    const options = {
        path: '/',
        sameSite: 'strict',
        httpOnly: true,
        domain: '.locahost:3000'
    }

    Cookies.set('tokenInfo', JSON.stringify(tokenInfo), { options })
    Cookies.set('userInfo', JSON.stringify(userInfo), { options })

    localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo))
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export const removeStoredAuthState = (): void => {
    Cookies.remove('tokenInfo')
    Cookies.remove('userInfo')

    window.localStorage.removeItem('tokenInfo')
    window.localStorage.removeItem('userInfo')
}

export const getTokenInfoFromLocalStorage = () : ITokenInfo | null => {
    try {
        const tokenInfo = localStorage.getItem('tokenInfo')

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