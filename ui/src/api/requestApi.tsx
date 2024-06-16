import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { get } from 'lodash'
import { ERROR_MESSAGE_COMMON } from 'src/common/constants'

const requestSerivceInstance = axios.create({
  baseURL: `${process.env.API_ROOT}/api/admin`
})

export interface APIError {
  status?: number
  statusText?: string
  message?: string
  title?: string
}

export interface FetchDataResult<T> {
  data?: T
  error?: APIError
}

export interface IApiServices {
  get: <T>(url: string, params?: object) => Promise<FetchDataResult<T>>
  getWithAuth: <T>(url: string, params?: object) => Promise<FetchDataResult<T>>
  post: <T>(url: string, payload: object) => Promise<FetchDataResult<T>>
  put: <T>(url: string, payload: object) => Promise<FetchDataResult<T>>
  delete: <T>(url: string, payload: object) => Promise<FetchDataResult<T>>
}

export const isClient = () => typeof window !== 'undefined'

export type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

export enum APIMessages {
  incorrectPassword = 'Incorrect Password',
  emailAlreadyExists = 'Email Already Exists',
  emailNotExists = 'Email Not Exists'
}

export enum APIStatus {
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500
}

export const APIStatusMessages = {
  [APIStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [APIStatus.BAD_REQUEST]: 'Bad Request'
}

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
  console.log(dataError)
  return dataError
}
export const baseService = axios.create({
  timeout: 60000,
  baseURL: `${process.env.API_ROOT}/api/admin`
})

async function fetchData<T>(configs: AxiosRequestConfig): Promise<FetchDataResult<T>> {
  try {
    const response = await requestSerivceInstance.request<T>({
      ...configs,
      headers: {
        ...configs.headers,
        'Content-Type': 'application/json'
        // Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })

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
      // await signOut({ redirect: true });
    }

    return { error: handleAPIError(error as AxiosResponse) }
  }
}

const http: IApiServices = {
  get(url, params) {
    return fetchData({
      url,
      method: 'get',
      params: params
    })
  },
  getWithAuth(url, params) {
    return this.get(url, params)
  },

  post(url, payload) {
    return fetchData({
      url,
      method: 'post',
      data: payload
    })
  },

  put(url) {
    return fetchData({
      url,
      method: 'put'
    })
  },

  delete(url, payload) {
    return fetchData({
      url,
      method: 'delete',
      data: payload
    })
  }
}

export default http
