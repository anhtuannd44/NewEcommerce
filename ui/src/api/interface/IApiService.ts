import { APIServer } from '../enums/apiEnums'

export interface APIError {
  status?: number
  statusText?: string
  message?: string
  title?: string
}

export interface FetchDataResult<T> {
  data?: T
  error?: {
    status: number
    statusText: string
    message: string
    title: string
  }
}

export interface IApiServices {
  get: <T>(url: string, params?: object, server?: APIServer) => Promise<FetchDataResult<T>>
  getWithAuth: <T>(url: string, params?: object, server?: APIServer) => Promise<FetchDataResult<T>>
  post: <T>(url: string, body: object, server?: APIServer) => Promise<FetchDataResult<T>>
  postWithAuth: <T>(url: string, body: object, server?: APIServer) => Promise<FetchDataResult<T>>
  put: <T>(url: string, body: object, server?: APIServer) => Promise<FetchDataResult<T>>
  putWithAuth: <T>(url: string, body: object, server?: APIServer) => Promise<FetchDataResult<T>>
  delete: <T>(url: string, body: object, server?: APIServer) => Promise<FetchDataResult<T>>
  deleteWithAuth: <T>(url: string, body: object, server?: APIServer) => Promise<FetchDataResult<T>>
}
