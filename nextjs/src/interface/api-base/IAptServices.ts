import type { APIServer } from '@/enums/api-enums'
import type { FetchDataResult } from './IFetchDataResult'

export interface IApiServices {
  get: <T>(url: string, params?: object, server?: APIServer) => Promise<FetchDataResult<T>>
  post: <T>(url: string, body: object, server?: APIServer) => Promise<FetchDataResult<T>>
  put: <T>(url: string, body: object, server?: APIServer) => Promise<FetchDataResult<T>>
  delete: <T>(url: string, body: object, server?: APIServer) => Promise<FetchDataResult<T>>
}
