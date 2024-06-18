import { NextApiRequest, NextApiResponse } from 'next/types'
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'

let isRefreshing = false
let refreshTokenPromise: Promise<string> | '' = ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
		const { method, headers, body, cookies, url } = req

		if (method !== 'POST') {
			
			return res.status(404).json({ message: 'Not found' })
		}
		
    const backendUrl = process.env.API_ROOT
    const authToken = cookies['access_token']
    const refreshToken = cookies['refresh_token']

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is missing' })
    }

    let validAuthToken = authToken

    if (!authToken || tokenExpired(authToken)) {
      if (!isRefreshing) {
        isRefreshing = true
        refreshTokenPromise = refreshAccessToken(refreshToken)
      }
      validAuthToken = await refreshTokenPromise
      isRefreshing = false

      if (validAuthToken) {
        res.setHeader('Set-Cookie', `access_token=${validAuthToken}; HttpOnly; Path=/`)
        req.cookies['access_token'] = validAuthToken
      } else {
        return res.status(401).json({ message: 'Invalid refresh token' })
      }
    }

    // Cấu hình axios request
    const axiosConfig: AxiosRequestConfig = {
      url: backendUrl,
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `Bearer ${validAuthToken}` // Sử dụng access token mới
      },
      data: body
    }

    const response: AxiosResponse = await axios(axiosConfig)
    res.status(response.status).json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  try {
    const response = await axios.post<{ accessToken: string }>(`${process.env.BACKEND_URL}/refresh-token`, { refreshToken })
    if (response.status === 200) {
      return response.data.accessToken
    }
    return ''
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return ''
  }
}

// Hàm kiểm tra token hết hạn
function tokenExpired(token: string): boolean {
  // Thực hiện logic kiểm tra token hết hạn
  // Ví dụ: kiểm tra thời gian hết hạn của token trong payload của JWT
  // Trả về true nếu token đã hết hạn, false nếu chưa hết hạn
  return false
}
