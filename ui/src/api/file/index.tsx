import { createAsyncThunk } from '@reduxjs/toolkit'
import http from 'src/api/requestApi'

export const getFileList = createAsyncThunk('getFileList', async () => {
  const response = await http.get('/file?pageSize=12')
  return response
})

export const uploadFile = async (file: File) => {
		const formData = new FormData()
		formData.append('file', file)
		const response = await http.post('/file/upload', formData)
		return response
}
