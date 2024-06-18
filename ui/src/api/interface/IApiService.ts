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
  get: <T>(url: string, params?: object, auth?: boolean) => Promise<FetchDataResult<T>>
  getWithAuth: <T>(url: string, params?: object) => Promise<FetchDataResult<T>>
  post: <T>(url: string, payload: object, auth?: boolean) => Promise<FetchDataResult<T>>
  postWithAuth: <T>(url: string, payload: object) => Promise<FetchDataResult<T>>
  put: <T>(url: string, payload: object, auth?: boolean) => Promise<FetchDataResult<T>>
  putWithAuth: <T>(url: string, payload: object) => Promise<FetchDataResult<T>>
  delete: <T>(url: string, payload: object, auth?: boolean) => Promise<FetchDataResult<T>>
  deleteWithAuth: <T>(url: string, payload: object) => Promise<FetchDataResult<T>>
}