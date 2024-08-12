import { APIServer } from '@/enums/api-enums'
import type { IApiServices } from '@/interface/api-base/IAptServices'
import type { FetchDataResult } from '@/interface/api-base/IFetchDataResult'

import { parseAuthResponse, refreshAccessToken } from '@/services/auth'
import { getTokenInfoFromLocalCookie, isTokenExpired, logout, setStoredAuthState } from '@/utils/auth'

const serverMapping = {
  [APIServer.IdentityServer]: process.env.NEXT_PUBLIC_API_IDENTITY_URL,
  [APIServer.RootApiServer]: process.env.NEXT_PUBLIC_API_ROOT,
  [APIServer.Other]: undefined
}

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (cb: (token: string) => void): void => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

const checkAuthentication = async (): Promise<string | null> => {
  const tokenInfo = getTokenInfoFromLocalCookie()

  if (!tokenInfo) {
    return null
  }

  const { refreshToken, expireIn } = tokenInfo
  let { accessToken } = tokenInfo

  if (!accessToken || isTokenExpired(expireIn)) {
    if (!refreshToken) {
      return null
    }

    if (!isRefreshing) {
      isRefreshing = true

      try {
        const newTokenInfo = await refreshAccessToken(refreshToken)

        if (!newTokenInfo.data) {
          return null
        }

        const saveInfo = parseAuthResponse(newTokenInfo.data)

        setStoredAuthState(saveInfo.tokenInfo, saveInfo.userInfo)

        accessToken = saveInfo.tokenInfo.accessToken
        isRefreshing = false
        onRefreshed(accessToken)

        return accessToken
      } catch (error) {
        isRefreshing = false

        return null
      }
    }

    return new Promise<string | null>(resolve => {
      subscribeTokenRefresh((newToken: string) => {
        resolve(newToken)
      })
    })
  }

  return accessToken
}

const fetchData = async <T>(
  configs: RequestInit,
  url: string,
  server: APIServer,
  auth: boolean = false
): Promise<FetchDataResult<T>> => {
  try {
    let headers: HeadersInit = {
      ...configs.headers,
      'Content-Type': 'application/json'
    }

    const baseUrl = serverMapping[server]

    console.log('baseUrl', process.env.NEXT_PUBLIC_API_IDENTITY_URL)
    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

    const currentHref = window.location.href

    if (auth) {
      const accessToken = await checkAuthentication()

      if (!accessToken) {
        logout(currentHref)

        return { error: { status: 401, statusText: 'Unauthorized', message: 'No token info', title: 'Unauthorized' } }
      }

      headers = {
        ...headers,
        Authorization: `Bearer ${accessToken}`
      }
    }

    const fetchConfigs: RequestInit = {
      ...configs,
      headers
    }

    const response = await fetch(fullUrl, fetchConfigs)

    if (!response.ok) {
      if (response.status === 401) {
        logout(currentHref)
      }

      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: (await response.json())?.message?.toString(),
          title: response.statusText
        }
      }
    }

    const data = await response.json()

    return { data }
  } catch (error: any) {
    if (error.name === 'TypeError') {
      // Handle network errors
      return {
        error: {
          status: 500,
          statusText: 'ERR_NETWORK',
          message: 'Network error occurred',
          title: 'ERR_NETWORK'
        }
      }
    }

    return {
      error: {
        status: 500,
        statusText: 'Internal Server Error',
        message: error.message || 'An unknown error occurred',
        title: 'Internal Server Error'
      }
    }
  }
}

const buildQueryParams = (params?: object): string => {
  return params ? `?${new URLSearchParams(params as any).toString()}` : ''
}

export const http: IApiServices = {
  get: <T>(url: string, params?: object, server: APIServer = APIServer.RootApiServer) => {
    const queryParams = buildQueryParams(params)

    return fetchData<T>({ method: 'GET' }, `${url}${queryParams}`, server)
  },
  post: <T>(url: string, body: object, server: APIServer = APIServer.RootApiServer) => {
    return fetchData<T>({ method: 'POST', body: JSON.stringify(body) }, url, server)
  },
  put: <T>(url: string, body: any, server: APIServer = APIServer.RootApiServer) => {
    return fetchData<T>({ method: 'PUT', body: JSON.stringify(body) }, url, server)
  },
  delete: <T>(url: string, body: any, server: APIServer = APIServer.RootApiServer) => {
    return fetchData<T>({ method: 'DELETE', body: JSON.stringify(body) }, url, server)
  }
}

export const httpWithAuth: IApiServices = {
  get: <T>(url: string, params?: object, server: APIServer = APIServer.RootApiServer) => {
    const queryParams = buildQueryParams(params)

    return fetchData<T>({ method: 'GET' }, `${url}${queryParams}`, server, true)
  },
  post: <T>(url: string, body: object, server: APIServer = APIServer.RootApiServer) => {
    return fetchData<T>({ method: 'POST', body: JSON.stringify(body) }, url, server, true)
  },
  put: <T>(url: string, body: any, server: APIServer = APIServer.RootApiServer) => {
    return fetchData<T>({ method: 'PUT', body: JSON.stringify(body) }, url, server, true)
  },
  delete: <T>(url: string, body: any, server: APIServer = APIServer.RootApiServer) => {
    return fetchData<T>({ method: 'DELETE', body: JSON.stringify(body) }, url, server, true)
  }
}
