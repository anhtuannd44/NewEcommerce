// snackbarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SnackbarState {
  message: string
  severity: 'success' | 'info' | 'warning' | 'error'
  open: boolean
}

const initialState: SnackbarState = {
  message: '',
  severity: 'info',
  open: false
}

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<{ message: string; severity: 'success' | 'info' | 'warning' | 'error' }>) => {
      state.message = action.payload.message
      state.severity = action.payload.severity
      state.open = true
    },
    hideSnackbar: state => {
      state.open = false
    }
  }
})

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions

const snackbarReducer = snackbarSlice.reducer

export default snackbarReducer
