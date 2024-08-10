export interface FetchDataResult<T> {
  data?: T
  error?: {
    status: number
    statusText: string
    message: string
    title: string
  }
}
