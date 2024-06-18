import { removeStoredAuthState } from './storedAuthState'

export const isTokenExpired = (exp: number): boolean => {
  const expDate = new Date(exp)
  if (expDate === null) {
    return false
  }
  return !(expDate.valueOf() > new Date().valueOf())
}

export const logout = (returnUrl?: string) => {
  removeStoredAuthState()
  const loginUrl = returnUrl ? `login?returnUrl=${encodeURIComponent(returnUrl)}` : 'login'
  location.href = loginUrl
}
