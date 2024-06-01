export interface ILoginData {
    email: string
    password: string
}

export interface IGetTokenResponse {
    userInfo: IUserInfo
    tokenInfo: ITokenInfo
}

export interface ITokenInfo {
    tokenType: string
    accessToken: string
    refreshToken: string
    expires: string
    expireIn: number
}

export interface IUserInfo {
    userId: string
    fullname: string
    userPermission: string[]
    email: string
}

export interface IRequestOptions {
    [key: string] : any
}

export interface RequestType {
    url: string
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
    options: IRequestOptions
}