export interface FetchDataResult<T> {
  data?: T
  error?: FetchDataError
}

export interface FetchDataError {
  status: number
  statusText: string
  message: string
  title: string
}
