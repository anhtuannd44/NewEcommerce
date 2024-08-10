export interface ILoginData {
  email: string
  password: string
}

export interface ITokenInfo {
  tokenType: string
  accessToken: string
  refreshToken: string
  expires: string
  expireIn: number
}

export interface IGetTokenResponse {
  userInfo: IUserInfo
  tokenInfo: ITokenInfo
}

export interface IUserInfo {
  userId: string
  fullname: string
  userPermission: string[]
  email: string
}
