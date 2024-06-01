import { call, put, takeLatest } from 'redux-saga/effects'
import { getToken, refreshAccessToken } from '../../../api/authApi'
import request from 'src/api/requestApi'
import {
  removeStoredAuthState,
  setStoredAuthState,
} from '../../../api/service/storedAuthState'
import * as actions from '../actions/authAction'
import * as actionTypes from '../action-types/authActionType'
import { ILoginAction, IRefreshAccessTokenAction, ISignUpAction } from '../interface/IAuth'
import http from 'src/api/requestApi'

export function* authWatcher() {
  yield takeLatest(actionTypes.LOGIN, loginSaga)
  yield takeLatest(actionTypes.LOGOUT, logoutSaga)
  yield takeLatest(actionTypes.REFRESH_ACCESS_TOKEN, refreshAccessTokenSaga)
  yield takeLatest(actionTypes.SIGN_UP, signUpSaga)
  //yield takeLatest(actionTypes.RESET_PASSWORD, resetPasswordSaga)
  //yield takeLatest(actionTypes.CHANGE_PASSWORD_AUTH, changePasswordAuthSaga)
}

const loginSaga = function* (action: ILoginAction): Generator<any, void, any> {
  yield put(actions.loginBegin())
  try {
    const response = yield call(getToken, action.loginData)
    yield setStoredAuthState(response.data.tokenInfo, response.data.userInfo)
    yield put(actions.loginSuccess(response.data.userInfo))
  } catch (error: any) {
    yield put(actions.loginFail())
    // if (error.message) {
    //   yield put(snackbar.openSnackbar(snackbarActionTypes.SNACKBAR_ERROR, error.message))
    // }
    // else {
    //   yield put(snackbar.openSnackbar(snackbarActionTypes.SNACKBAR_ERROR, error))
    // }
  }
}

const refreshAccessTokenSaga = function* (action: IRefreshAccessTokenAction): Generator<any, void, any> {
  yield put(actions.loginBegin())
  try {
    const response = yield call(refreshAccessToken, action.refreshToken)
    yield setStoredAuthState(response.data.tokenInfo, response.data.userInfo)
    yield put(actions.loginSuccess(response.data.userInfo))
  } catch (error: any) {
    yield put(actions.loginFail())
    // if (error.message) {
    //   yield put(snackbar.openSnackbar(snackbarActionTypes.SNACKBAR_ERROR, error.message))
    // }
    // else {
    //   yield put(snackbar.openSnackbar(snackbarActionTypes.SNACKBAR_ERROR, error))
    // }
  }
}

const logoutSaga = function* () {
  yield removeStoredAuthState()
  yield put(actions.initAuthenticationInfo(false))
}

const signUpSaga = function* (action: ISignUpAction) {
  yield put(actions.signUpBegin())
  try {
	const option: Omit<RequestInit, 'method'> = {
		body: action.signUpData as any
	}
    yield call(http.post, '/register', option)
    yield put(actions.signUpSuccess())
  } catch (error: any) {
    yield put(actions.signUpFail())
    // if (error.message) {
    //   yield put(snackbar.openSnackbar(snackbarActionTypes.SNACKBAR_ERROR, error.message))
    // }
    // else if (error.messages) {
    //   for (const element of error.messages) {
    //     yield put(snackbar.openSnackbar(snackbarActionTypes.SNACKBAR_ERROR, element.description))
    //   }
    // }
    // else {
    //   yield put(snackbar.openSnackbar(snackbarActionTypes.SNACKBAR_ERROR, error))
    // }
  }
}

// const resetPasswordSaga = function* (action: any) {
//   yield put(actions.resetPasswordBegin())
//   try {
//     const resetPwData = {
//       email: action.email
//     }
//     yield axios.post('/resetpassword', resetPwData)
//     yield put(actions.resetPasswordSuccess())
//   } catch (error: any) {
//     yield put(actions.resetPasswordFail())
//     if (error.message) {
//       yield put(snackbar.openSnackbar(snackbarActionTypes.SNACKBAR_ERROR, error.message))
//     }
//     else {
//       yield put(snackbar.openSnackbar(snackbarActionTypes.SNACKBAR_ERROR, error))
//     }
//   }
// }

// function* changePasswordAuthSaga(action: any) {
//   yield put(actions.changePasswordAuthBegin())
//   try {
//     yield axios.put('/changepassword', action.data)
//     yield put(actions.changePasswordAuthSuccess())
//   } catch (error: any) {
//     yield put(actions.changePasswordAuthFail())
//     if (error.message) {
//       yield put(snackbar.openSnackbar(snackbarActionTypes.SNACKBAR_ERROR, error.message))
//     }
//     else {
//       yield put(snackbar.openSnackbar(snackbarActionTypes.SNACKBAR_ERROR, error))
//     }
//   }
//}
