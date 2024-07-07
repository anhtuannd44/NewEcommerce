import { createSlice } from '@reduxjs/toolkit'

import { getFileList, uploadFile } from 'src/services/file'
import { IFileManagerState } from '../interface/IFile'

const initialState: IFileManagerState = {
  fileLibraryList: [],
  isInitRequestSent: false,
  isInitDataSuccess: false,
  isCreateSuccess: false,
  loading: false
}

const fileManagerSlice = createSlice({
  name: 'FileManagerSlice',
  initialState: initialState,
  reducers: {
    updateStringField: (state, action) => {},
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getFileList.pending, state => {
        state.isInitRequestSent = true
        state.loading = true
      })
      .addCase(getFileList.fulfilled, (state, action) => {
        state.fileLibraryList = action.payload.data
        state.loading = false
      })
      .addCase(getFileList.rejected, state => {
        state.loading = false
      })
    // .addCase(uploadFile.pending, state => {
    //   state.isInitRequestSent = true
    // })
    // .addCase(uploadFile.fulfilled, (state, action) => {
    //   state.fileLibraryList.push(action.payload)
    // })
    // .addCase(uploadFile.rejected, state => {})
  }
})

export const { setLoading } = fileManagerSlice.actions

const fileManagerReducer = fileManagerSlice.reducer

export default fileManagerReducer
