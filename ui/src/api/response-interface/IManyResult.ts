export interface IManyResult<T> {
  data?: T[]
  isSuccess: boolean
  message: string
  total: number
}
