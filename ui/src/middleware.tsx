import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isTokenExpired } from './api/service/authServices'

const privatePaths = ['/admin']
const authPaths = ['/login', '/register']

// This function can be marked `async` if using `await` inside
export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('access_token')?.value

  if (privatePaths.some(path => pathname.startsWith(path)) && !accessToken) {
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // handle call API refresh token
  }

  if (authPaths.some(path => pathname.startsWith(path)) && accessToken) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  const responseWithCookie = NextResponse.next()
  responseWithCookie.cookies.set('access_token', 'token', { httpOnly: true })
  return responseWithCookie
}
