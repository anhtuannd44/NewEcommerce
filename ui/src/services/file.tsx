import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileLibraryListItem } from 'react-media-library'
import http from 'src/api/apiService'

export const getFileList = createAsyncThunk('getFileList', async (_, { dispatch, rejectWithValue }) => {
  const response = await http.get<FileLibraryListItem[]>('/file?pageSize=12')
  if (response.data) {
    return response.data
  }
	return rejectWithValue(response.error)
})

export const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await http.post('/file/upload', formData)
  return response
}
