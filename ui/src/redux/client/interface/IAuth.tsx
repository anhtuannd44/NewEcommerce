export interface IAuthState {
	userInfo: IUserInfo | null
	isLoggedIn: boolean
	isInitialised: boolean
	loginState: {
		isLoading: boolean
	}
	signInState: {
		isLoading: boolean
		isRegisted: boolean
	}
	resetPwState: {
		isLoading: boolean
		isSent: boolean
	}
	changePasswordState: {
		isLoading: boolean
		isSuccessed: boolean
	}
}

export interface IUserInfo {
	email: string
	fullName: string
	userId: string
	userPermissions: Array<string>
}

export interface ISignUpData {
	email: string
	password: string
	confirmPassword: string
	phoneNumber: string
	fullName: string
	remember: boolean
}

export interface ILoginData {
	email: string
	password: string
	remember: boolean
}

export interface IChangePasswordAuth {
	email: string
	token: string
	new_password: string
	confirm_new_password: string
}

//Action Interface
export interface ILoginAction {
	type: string
	loginData: ILoginData
}

export interface IRefreshAccessTokenAction {
	type: string
	refreshToken: string
}

export interface ISignUpAction {
	type: string
	signUpData: ISignUpData
}
