import { APIServer } from './apiEnums'
import { FetchDataResult, IApiServices } from './interface/IApiService'
import { isTokenExpired } from '../auth/service/authServices'
import { logout } from 'src/auth/service/authServices'
import { getTokenInfoFromLocalCookie, setStoredAuthState } from 'src/auth/service/storedAuthState'
import { parseAuthResponse, refreshAccessToken } from './authApi'

const serverMapping = {
  [APIServer.IdentityServer]: process.env.API_IDENTITY,
  [APIServer.RootApiServer]: process.env.API_ROOT,
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
  if (tokenInfo) {
    let { refreshToken, expireIn, accessToken } = tokenInfo

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
      } else {
        return new Promise<string | null>(resolve => {
          subscribeTokenRefresh((newToken: string) => {
            resolve(newToken)
          })
        })
      }
    }

    return accessToken
  } else {
    return null
  }
}

const fetchData = async <T>(configs: RequestInit, url: string, server: APIServer, auth: boolean = false): Promise<FetchDataResult<T>> => {
  try {
    let headers: HeadersInit = {
      ...configs.headers,
      'Content-Type': 'application/json'
    }

    const baseUrl = serverMapping[server]
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
      const error = response as FetchDataResult<T>
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
  if (!params) return ''
  return '?' + new URLSearchParams(params as any).toString()
}

const http: IApiServices = {
  get: <T>(url: string, params?: object, server: APIServer = APIServer.RootApiServer) => {
    const queryParams = buildQueryParams(params)
    return fetchData<T>({ method: 'GET' }, `${url}${queryParams}`, server)
  },
  getWithAuth: <T>(url: string, params?: object, server: APIServer = APIServer.RootApiServer) => {
    const queryParams = buildQueryParams(params)
    return fetchData<T>({ method: 'GET' }, `${url}${queryParams}`, server, true)
  },
  post: <T>(url: string, body: object, server: APIServer = APIServer.RootApiServer) => {
    return fetchData<T>({ method: 'POST', body: JSON.stringify(body) }, url, server)
  },
  postWithAuth: <T>(url: string, body: object, server: APIServer = APIServer.RootApiServer) => {
    return fetchData<T>({ method: 'POST', body: JSON.stringify(body) }, url, server, true)
  },
  put: <T>(url: string, body: any, server: APIServer = APIServer.RootApiServer) => {
    return fetchData<T>({ method: 'PUT', body: JSON.stringify(body) }, url, server)
  },
  putWithAuth: <T>(url: string, body: any, server: APIServer = APIServer.RootApiServer) => {
    return fetchData({ method: 'PUT', body: JSON.stringify(body) }, url, server, true)
  },
  delete: <T>(url: string, body: any, server: APIServer = APIServer.RootApiServer) => {
    return fetchData<T>({ method: 'DELETE', body: JSON.stringify(body) }, url, server)
  },
  deleteWithAuth: <T>(url: string, body: any, server: APIServer = APIServer.RootApiServer) => {
    return fetchData<T>({ method: 'DELETE', body: JSON.stringify(body) }, url, server, true)
  }
}

export default http
