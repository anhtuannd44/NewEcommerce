import { setStoredAuthState } from 'src/auth/service/storedAuthState'
import { ILoginData, ITokenInfo, IGetTokenResponse, IUserInfo } from './interface/IAuthApi'
import http from './apiService'
import { FetchDataResult } from './interface/IApiService'
import { APIServer } from './apiEnums'

export const getToken = async (loginData: ILoginData): Promise<FetchDataResult<IGetTokenResponse>> => {
  const response = await http.post<IGetTokenResponse>(
    '/login',
    {
      grantType: 'password',
      email: loginData.email,
      password: loginData.password
    },
    APIServer.IdentityServer
  )
  if (response.data) {
    const newInfo = parseAuthResponse(response.data)
    setStoredAuthState(newInfo.tokenInfo, newInfo.userInfo)
  }
  return response
}

export const refreshAccessToken = async (refreshToken: string): Promise<FetchDataResult<IGetTokenResponse>> => {
  const response = await http.post<IGetTokenResponse>(
    '/login',
    {
      grantType: 'refresh_token',
      refreshToken: refreshToken
    },
    APIServer.IdentityServer
  )
  return response
}

export const parseAuthResponse = (response: IGetTokenResponse): { tokenInfo: ITokenInfo; userInfo: IUserInfo } => {
  const currentTime = new Date()

  const tokenInfo: ITokenInfo = {
    tokenType: response.tokenInfo.tokenType,
    accessToken: response.tokenInfo.accessToken,
    refreshToken: response.tokenInfo.refreshToken,
    expires: response.tokenInfo.expires,
    expireIn: currentTime.setSeconds(currentTime.getSeconds() + response.tokenInfo.expireIn)
  }
  const userInfo: IUserInfo = response.userInfo
  return { tokenInfo, userInfo }
}
