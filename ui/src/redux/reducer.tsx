import { combineReducers } from '@reduxjs/toolkit'
import fileManagerReducer from './admin/slice/fileSlice'
import adminGeneralReducer from './admin/slice/adminGeneralSlice'
import snackbarReducer from './admin/slice/snackbarSlice'

const rootReducer = combineReducers({
  adminGeneral: adminGeneralReducer,
  fileAdmin: fileManagerReducer,
  snackbar: snackbarReducer
})

export default rootReducer
