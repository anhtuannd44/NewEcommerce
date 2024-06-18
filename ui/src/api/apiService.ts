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

async function fetchData<T>(configs: AxiosRequestConfig, auth: boolean = false): Promise<FetchDataResult<T>> {
  try {
    let axiosHeaders = {
      ...configs.headers,
      'Content-Type': 'application/json'
    }

    if (auth) {
      const currentUrl = window.location.href
      const tokenInfo = getTokenInfoFromLocalCookie()

      if (tokenInfo) {
        let { refreshToken, expireIn, accessToken } = tokenInfo

        if (!accessToken || isTokenExpired(expireIn)) {
          if (!refreshToken) {
            logout(currentUrl)
          }

          try {
            accessToken = '' // await getNewAccessToken(refreshToken);
            // saveToken(newAccessToken, refreshToken, 3600); // Giả sử token có hiệu lực trong 1 giờ
          } catch {
            logout(currentUrl)
          }
        }

        axiosHeaders = {
          ...axiosHeaders,
          Authorization: `Bearer ${accessToken}`
        }
      } else {
        logout(currentUrl)
      }
    }

    const axiosConfigs = {
      ...configs,
      headers: axiosHeaders
    }

    const response = await requestSerivceInstance.request<T>(axiosConfigs)

    return { data: response.data }
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK') {
      return {
        error: {
          status: 500,
          statusText: 'ERR_NETWORK',
          message: ERROR_MESSAGE_COMMON,
          title: 'ERR_NETWORK'
        }
      }
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      logout()
    }

    return { error: handleAPIError(error as AxiosResponse) }
  }
}

const http: IApiServices = {
  get(url, params, auth) {
    return fetchData({
      url,
      method: 'get',
      params: params
    })
  },
  getWithAuth(url, params) {
    return this.get(url, params, true)
  },

  post(url, payload, auth) {
    return fetchData({
      url,
      method: 'post',
      data: payload
    })
  },
  postWithAuth(url, payload) {
    return this.post(url, payload, true)
  },

  put(url, payload, auth) {
    return fetchData({
      url,
      method: 'put',
      data: payload
    })
  },
  putWithAuth(url, payload) {
    return this.put(url, payload, true)
  },

  delete(url, payload, auth) {
    return fetchData({
      url,
      method: 'delete',
      data: payload
    })
  },
  deleteWithAuth(url, payload) {
    return this.delete(url, payload, true)
  }
}

export default http
