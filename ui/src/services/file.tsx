import { createAsyncThunk } from '@reduxjs/toolkit'
import { FileLibraryListItem } from 'react-media-library'
import http from 'src/api/apiService'
import { FetchDataResult } from 'src/api/interface/IApiService'
import { IManyResult } from 'src/api/response-interface/IManyResult'

export const getFileList = createAsyncThunk('getFileList', async (_, { dispatch, rejectWithValue }) => {
  const response = await http.getWithAuth<IManyResult<FileLibraryListItem>>('/file?pageSize=12')
  console.log(response.data)
  if (response.data) {
    return response.data
  }
  return rejectWithValue(response.error)
})

export const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await http.postWithAuth('/file/upload', formData)
  return response
}
