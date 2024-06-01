import { IUserInfo } from 'src/api/IAuthApi'
import * as actionTypes from '../action-types/authActionType'
import { IChangePasswordAuth, ILoginAction, ILoginData, IRefreshAccessTokenAction, ISignUpAction, ISignUpData } from '../interface/IAuth'

export const initAuthenticationInfo = (isLoggedIn: boolean, userInfo?: IUserInfo) => ({
  type: actionTypes.INIT_AUTH_INFO,
  isLoggedIn: isLoggedIn,
  userInfo: userInfo
})

export const login = (loginData: ILoginData) : ILoginAction => ({
  type: actionTypes.LOGIN,
  loginData: loginData
})

export const loginBegin = () => ({
  type: actionTypes.LOGIN_BEGIN
})

export const loginSuccess = (userInfo: IUserInfo) => ({
  type: actionTypes.LOGIN_SUCCESS,
  userInfo: userInfo
})

export const loginFail = () => ({
  type: actionTypes.LOGIN_FAIL
})

export const logout = () => ({
  type: actionTypes.LOGOUT
})

export const updateCurrentUserAuth = (userInfo: IUserInfo) => ({
  type: actionTypes.UPDATE_CURRENT_USER_NAME,
  userInfo: userInfo
})

export const signUp = (data: ISignUpData) : ISignUpAction => ({
  type: actionTypes.SIGN_UP,
  signUpData: data
})

export const signUpBegin = () => ({
  type: actionTypes.SIGN_UP_BEGIN,
})

export const signUpSuccess = () => ({
  type: actionTypes.SIGN_UP_SUCCESS
})

export const signUpFail = () => ({
  type: actionTypes.SIGN_UP_FAIL
})

export const resetPassword = (email: string) => ({
  type: actionTypes.RESET_PASSWORD,
  email: email
})

export const resetPasswordBegin = () => ({
  type: actionTypes.RESET_PASSWORD_BEGIN
})

export const resetPasswordSuccess = () => ({
  type: actionTypes.RESET_PASSWORD_SUCCESS
})

export const resetPasswordFail = () => ({
  type: actionTypes.RESET_PASSWORD_FAIL
})

export const changePasswordAuth = (data: IChangePasswordAuth) => ({
  type: actionTypes.CHANGE_PASSWORD_AUTH,
  data: data
})

export const changePasswordAuthBegin = () => ({
  type: actionTypes.CHANGE_PASSWORD_AUTH_BEGIN
})

export const changePasswordAuthSuccess = () => ({
  type: actionTypes.CHANGE_PASSWORD_AUTH_SUCCESS
})

export const changePasswordAuthFail = () => ({
  type: actionTypes.CHANGE_PASSWORD_AUTH_FAIL
})