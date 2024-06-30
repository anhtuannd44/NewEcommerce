import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isTokenExpired } from './auth/service/authServices'
import { ITokenInfo } from './api/interface/IAuthApi'
import { parseAuthResponse, refreshAccessToken } from './api/authApi'

const privatePaths = ['/admin']
const authPaths = ['/login', '/register']

// This function can be marked `async` if using `await` inside
export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const tokenInfoFromCookie = request.cookies.get('tokenInfo')?.value

  if (privatePaths.some(path => pathname.startsWith(path))) {
    if (tokenInfoFromCookie) {
      const tokenInfo = JSON.parse(tokenInfoFromCookie) as ITokenInfo

      let { refreshToken, expireIn, accessToken } = tokenInfo

      if (!accessToken || isTokenExpired(expireIn)) {
        if (!refreshToken) {
          return NextResponse.redirect(new URL('/login', request.url))
        }

        const newTokenInfo = await refreshAccessToken(refreshToken)

        if (!newTokenInfo.data) {
          return NextResponse.redirect(new URL('/login', request.url))
        }

        const saveToken = parseAuthResponse(newTokenInfo.data)

        const responseWithCookie = NextResponse.next()
        responseWithCookie.cookies.set('tokenInfo', JSON.stringify(saveToken.tokenInfo), { httpOnly: true })
        responseWithCookie.cookies.set('userInfo', JSON.stringify(saveToken.userInfo), { httpOnly: true })
        return responseWithCookie
      }
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (authPaths.some(path => pathname.startsWith(path)) && tokenInfoFromCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  const responseWithCookie = NextResponse.next()
  return responseWithCookie
}
