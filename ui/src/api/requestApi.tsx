import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import apiConfig from 'src/apiConfig.json'
import { ITokenInfo, IUserInfo } from './IAuthApi'
import { getTokenInfoFromLocalStorage, removeStoredAuthState, setStoredAuthState } from './service/storedAuthState'
import { isTokenExpired } from './service/authServices'
import { refreshAccessToken } from './authApi'

import { redirect } from 'next/navigation'

const requestSerivceInstance = axios.create({
	baseURL: apiConfig.apiRoot
})

const saveTokenInfo = function* (tokenInfo: ITokenInfo, userInfo: IUserInfo): Generator<any, void, any> {
	setStoredAuthState(tokenInfo, userInfo)
}

export const isClient = () => typeof window !== 'undefined'

export type CustomOptions = Omit<RequestInit, 'method'> & {
	baseUrl?: string | undefined
}

const request = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: CustomOptions) => {
	let body: FormData | string | undefined = undefined
	if (options?.body instanceof FormData) {
		body = options.body
	} else if (options?.body) {
		body = JSON.stringify(options.body)
	}
	const baseHeaders: { [key: string]: string } =
		body instanceof FormData
			? {}
			: {
					'Content-Type': 'application/json'
			  }

	// if (isClient()) {

	//   let token: string
	//   const tokenInfo = getTokenInfoFromLocalStorage()

	//   if (!tokenInfo?.accessToken) {
	//     location.href = '/login'
	//     return
	//   }

	//   token = tokenInfo?.accessToken

	//   if (isTokenExpired(tokenInfo.expireIn)) {
	//     const tokenRes = await refreshAccessToken(tokenInfo.accessToken)
	//     if (!(tokenRes?.tokenInfo?.accessToken)) {
	//       location.href = '/login'
	//       return
	//     }
	//     setStoredAuthState(tokenRes.tokenInfo, tokenRes.userInfo)
	//     token = tokenRes.tokenInfo.accessToken
	//   }

	//   baseHeaders.Authorization = `Bearer ${token}`
	// }

	const axiosConfig: AxiosRequestConfig = {
		method: method,
		url,
		headers: {
			...baseHeaders,
			...options?.headers
		} as any,
		data: body
	}

	const res = await requestSerivceInstance.request(axiosConfig)

	return res.data
}

const http = {
	get(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
		return request('GET', url, options)
	},
	post(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
		return request('POST', url, { ...options, body })
	},
	put(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
		return request('PUT', url, { ...options, body })
	},
	delete(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
		return request('DELETE', url, { ...options })
	}
}

export default http
