import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { get } from 'lodash'
import { ERROR_MESSAGE_COMMON } from 'src/common/constants'
import { APIMessages } from './enums/apiEnums'
import { APIStatusMessages } from './constants/apiContants'
import { APIError, FetchDataResult, IApiServices } from './interface/IApiService'
import { isTokenExpired } from '../auth/service/authServices'
import { logout } from 'src/auth/service/authServices'
import { getTokenInfoFromLocalCookie } from 'src/auth/service/storedAuthState'

const requestSerivceInstance = axios.create({
  baseURL: `${process.env.API_ROOT}/api/admin`,
  timeout: 60000
})

type APIMessagesKey = keyof typeof APIMessages
type APIStatusMessagesKey = keyof typeof APIStatusMessages

const getMessageFromKeyErrors = (data: { errors: Record<string, APIMessagesKey> }): string | null => {
  if (data?.errors) {
    const keyMessage: APIMessagesKey = data?.errors[Object.keys(data?.errors)[0]]
    const message = APIMessages[keyMessage]
    if (message) {
      return message
    }
  } else {
    return get(data, 'message', '')
  }
  return null
}

const handleAPIError = (error: AxiosResponse): APIError => {
  const data = error?.data

  const dataError: APIError = {}
  if (data) {
    dataError.status = data?.status
    dataError.message = getMessageFromKeyErrors(data) || error?.statusText
  } else {
    dataError.status = error?.status || get(error, 'response.status') || get(error, 'response.data.error.code')

    dataError.message = APIStatusMessages[error?.status as APIStatusMessagesKey] || error?.statusText || get(error, 'response.data.error.message') || get(error, 'response.data')
    ;('')
    dataError.title = get(error, 'response.data.error.title')
  }
  dataError.statusText = error?.statusText
  return dataError
}

export interface ITokenInfo {
  tokenType: string
  accessToken: string
  refreshToken: string
  expires: string
  expireIn: number
}

async function fetchData<T>(configs: RequestInit, url: string, auth: boolean = false): Promise<FetchDataResult<T>> {
  try {
    let headers: HeadersInit = {
      ...configs.headers,
      'Content-Type': 'application/json'
    }

    const baseUrl = `${process.env.API_ROOT}/api/admin`
		const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

    const currentHref = window.location.href

    if (auth) {
      const tokenInfo = getTokenInfoFromLocalCookie()

      if (tokenInfo) {
        let { refreshToken, expireIn, accessToken } = tokenInfo

        if (!accessToken || isTokenExpired(expireIn)) {
          if (!refreshToken) {
            logout(currentHref)
            return { error: { status: 401, statusText: 'Unauthorized', message: 'No refresh token', title: 'Unauthorized' } }
          }

          try {
            // const newTokenInfo = await getNewAccessToken(refreshToken);
            // accessToken = newTokenInfo.accessToken;
            // refreshToken = newTokenInfo.refreshToken;
            // expireIn = newTokenInfo.expireIn;
            // saveToken(accessToken, refreshToken, expireIn);
          } catch {
            logout(currentHref)
            return { error: { status: 401, statusText: 'Unauthorized', message: 'Failed to refresh token', title: 'Unauthorized' } }
          }
        }

        headers = {
          ...headers,
          Authorization: `Bearer ${accessToken}`
        }
      } else {
        logout(currentHref)
        return { error: { status: 401, statusText: 'Unauthorized', message: 'No token info', title: 'Unauthorized' } }
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
          message: await response.text(),
          title: response.statusText
        }
      }
    }

    const data = await response.json()
    console.log(response)
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
  get: async <T>(url: string, params?: object, auth: boolean = false): Promise<FetchDataResult<T>> => {
    const queryParams = buildQueryParams(params)
    return await fetchData<T>({ method: 'GET' }, `${url}${queryParams}`, auth)
  },
  getWithAuth(url, params) {
    return this.get(url, params, true)
  },

  post: async <T>(url: string, body: object, auth: boolean = false): Promise<FetchDataResult<T>> => {
    return await fetchData<T>({ method: 'POST', body: JSON.stringify(body) }, url, auth)
  },
  postWithAuth(url, body) {
    return this.post(url, body, true)
  },

  put: async <T>(url: string, body: any, auth: boolean = false): Promise<FetchDataResult<T>> => {
    return await fetchData<T>({ method: 'PUT', body: JSON.stringify(body) }, url, auth)
  },
  putWithAuth(url, body) {
    return this.put(url, body, true)
  },

  delete: async <T>(url: string, body: any, auth: boolean = false): Promise<FetchDataResult<T>> => {
    return await fetchData<T>({ method: 'DELETE', body: JSON.stringify(body) }, url, auth)
  },
  deleteWithAuth(url, body) {
    return this.delete(url, body, true)
  }
}

export default http
