import axios, { AxiosInstance, AxiosResponse } from 'axios'
import apiConfig from 'src/apiConfig.json'
import { CONTENT_TYPE_APPLICATION_JSON } from 'src/api/constants/apiContants'
import { ILoginData, ITokenInfo, IGetTokenResponse, IUserInfo } from './IAuthApi'

const domain: string = apiConfig.apiIdentity

const requestIdentity: AxiosInstance = axios.create({
  baseURL: domain,
  headers: {
    'Content-Type': CONTENT_TYPE_APPLICATION_JSON
  }
})

export const getToken = async (loginData: ILoginData) => {
  try {
    const response = await requestIdentity.post('/login', {
      grantType: 'password',
      email: loginData.email,
      password: loginData.password
    })
    return response.data
  } catch (error) {
    location.href = '/login'
    return
  }
}

export const refreshAccessToken = async (refreshToken: string): Promise<IGetTokenResponse | null> => {
  try {
    const response = await requestIdentity.post('/login', {
      grantType: 'refresh_token',
      refreshToken: refreshToken
    })
    return response.data
  } catch (error) {
    location.href = '/login'
    return null
  }
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
