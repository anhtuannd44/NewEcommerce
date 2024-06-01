import { Reducer } from 'redux'
import * as actionTypes from '../action-types/authActionType'
import { IAuthState } from '../interface/IAuth'

export const initialAuthState: IAuthState = {
	userInfo: null,
	isLoggedIn: false,
	isInitialised: false,
	loginState: {
		isLoading: false
	},
	signInState: {
		isLoading: false,
		isRegisted: false
	},
	resetPwState: {
		isLoading: false,
		isSent: false
	},
	changePasswordState: {
		isLoading: false,
		isSuccessed: false
	}
}

const AuthReducer: Reducer<IAuthState> = (state: IAuthState = initialAuthState, action: any) => {
	switch (action.type) {
		case actionTypes.INIT_AUTH_INFO:
			return {
				...state,
				isLoggedIn: action.isLoggedIn,
				userInfo: action.userInfo,
				isInitialised: true
			}

		case actionTypes.LOGIN_BEGIN:
			return {
				...state,
				loginState: {
					...state.loginState,
					isLoading: true
				}
			}

		case actionTypes.LOGIN_SUCCESS:
			return {
				...state,
				isLoggedIn: true,
				userInfo: action.userInfo,
				loginState: {
					...state.loginState,
					isLoading: false
				}
			}

		case actionTypes.LOGIN_FAIL:
			return {
				...state,
				isLoggedIn: false,
				userInfo: null,
				loginState: {
					...state.loginState,
					isLoading: false
				}
			}

		case actionTypes.UPDATE_CURRENT_USER_NAME:
			return {
				...state,
				userInfo: action.userInfo
			}

		case actionTypes.SIGN_UP_BEGIN:
			return {
				...state,
				isLoading: true,
				isRegisted: false
			}

		case actionTypes.SIGN_UP_SUCCESS:
			return {
				...state,
				isLoading: false,
				isRegisted: true
			}

		case actionTypes.SIGN_UP_FAIL:
			return {
				...state,
				isLoading: false,
				isRegisted: false
			}

		case actionTypes.RESET_PASSWORD_BEGIN:
			return {
				...state,
				resetPwState: {
					...state.resetPwState,
					isLoading: true,
					isSent: false
				}
			}

		case actionTypes.RESET_PASSWORD_SUCCESS:
			return {
				...state,
				resetPwState: {
					...state.resetPwState,
					isLoading: false,
					isSent: true
				}
			}

		case actionTypes.RESET_PASSWORD_FAIL:
			return {
				...state,
				resetPwState: {
					...state.resetPwState,
					isLoading: false,
					isSent: false
				}
			}

		case actionTypes.CHANGE_PASSWORD_AUTH_BEGIN:
			return {
				...state,
				changePasswordState: {
					...state.changePasswordState,
					isLoading: true,
					isSuccessed: false
				}
			}

		case actionTypes.CHANGE_PASSWORD_AUTH_SUCCESS:
			return {
				...state,
				changePasswordState: {
					...state.changePasswordState,
					isLoading: false,
					isSuccessed: true
				}
			}

		case actionTypes.CHANGE_PASSWORD_AUTH_FAIL:
			return {
				...state,
				changePasswordState: {
					...state.changePasswordState,
					isLoading: false,
					isSuccessed: false
				}
			}

		default:
			return state
	}
}

export default AuthReducer
