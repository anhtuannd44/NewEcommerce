// Next Imports
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Util Imports
import { withoutSuffix } from '@/utils/string'
import type { ITokenInfo, IUserInfo } from './interface/auth'
import { isTokenExpired } from './utils/auth'
import { parseAuthResponse, refreshAccessToken } from './services/auth'

// Constants
const HOME_PAGE_ADMIN_URL = '/admin'

const privatePaths = ['/apps']
const authPaths = ['/login', '/register']

const checkUserToken = async (request: NextRequest) => {
  const tokenInfoFromCookie = request.cookies.get('tokenInfo')?.value
  const userInfoFromCookie = request.cookies.get('userInfo')?.value

  if (!tokenInfoFromCookie) {
    return
  }

  const tokenInfo = JSON.parse(tokenInfoFromCookie) as ITokenInfo
  const userInfo = JSON.parse(userInfoFromCookie || '') as IUserInfo

  const { refreshToken, expireIn, accessToken } = tokenInfo

  if (!accessToken || isTokenExpired(expireIn)) {
    if (!refreshToken) {
      return
    }

    const newTokenInfo = await refreshAccessToken(refreshToken)

    if (!newTokenInfo.data) {
      return
    }

    const saveToken = parseAuthResponse(newTokenInfo.data)

    return saveToken
  }

  return { tokenInfo: tokenInfo, userInfo: userInfo }
}

export const middleware = async (request: NextRequest) => {
  // Get locale from request headers
  const pathname = request.nextUrl.pathname

  if (authPaths.some(path => pathname.startsWith(path))) {
    const userTokenInfo = await checkUserToken(request)

    if (userTokenInfo) {
      return NextResponse.redirect(new URL(HOME_PAGE_ADMIN_URL, request.url))
    }

    return NextResponse.next()
  }

  // If pathname are private path, check and add accessToken to request header
  if (privatePaths.some(path => pathname.slice(3).startsWith(path))) {
    let redirectUrl = '/login'

    if (pathname !== '/') {
      const searchParamsStr = new URLSearchParams({ redirectTo: withoutSuffix(pathname, '/') }).toString()

      redirectUrl += `?${searchParamsStr}`
    }

    const userTokenInfo = await checkUserToken(request)

    if (!userTokenInfo) {
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    const responseWithCookie = NextResponse.next()

    responseWithCookie.cookies.set('tokenInfo', JSON.stringify(userTokenInfo.tokenInfo), { httpOnly: true })
    responseWithCookie.cookies.set('userInfo', JSON.stringify(userTokenInfo.userInfo), { httpOnly: true })

    return responseWithCookie
  }

  // If pathname already contains a locale, return next() else redirect with localized URL

  return NextResponse.next()
}

// Matcher Config
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - all items inside the public folder
     *    - images (public images)
     *    - next.svg (Next.js logo)
     *    - vercel.svg (Vercel logo)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.+?/hook-examples|.+?/menu-examples|images|next.svg|vercel.svg).*)'
  ]
}
