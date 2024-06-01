import { combineReducers } from '@reduxjs/toolkit'
import orderAdminReducer from 'src/redux/admin/slice/orderAdminSlice'
import productAdminReducer from './admin/slice/productAdminSlice'
import fileManagerReducer from './admin/slice/fileSlice'
import adminGeneralReducer from './admin/slice/adminGeneralSlice'

const rootReducer = combineReducers({
	adminGeneral: adminGeneralReducer,
	orderAdmin: orderAdminReducer,
	productAdmin: productAdminReducer,
	fileAdmin: fileManagerReducer
})

export default rootReducer
