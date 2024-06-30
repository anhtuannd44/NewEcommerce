import { createAsyncThunk } from '@reduxjs/toolkit'
import http from 'src/api/apiService'
import { ERROR_MESSAGE_COMMON, SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT } from 'src/common/constants'
import { IOrderRequestBody } from 'src/form/admin/interface/IOrderRequest'
import { IOrderAttribute, IOrderOrigin, IProduct, IUser } from 'src/redux/admin/interface/IAdminGeneralState'
import { IManyResult } from 'src/api/response-interface/IManyResult'
import { showSnackbar } from 'src/redux/admin/slice/snackbarSlice'
import { IOrderOriginRequest } from 'src/form/admin/interface/ICreateOrEditOrderOrigin'
import { ISingleResult } from 'src/api/response-interface/ISingleResult'
import { FetchDataResult } from 'src/api/interface/IApiService'

export const getProductList = createAsyncThunk('getProductList', async (_, { dispatch, rejectWithValue }) => {
  const response = await http.getWithAuth<IManyResult<IProduct>>('/product')
  if (response.data) {
    return response.data
  }
  const error = response.error?.message || ERROR_MESSAGE_COMMON
  dispatch(showSnackbar({ message: error, severity: 'error' }))
  return rejectWithValue(error)
})

export const getUserList = createAsyncThunk('getUserList', async (_, { dispatch, rejectWithValue }) => {
  const response = await http.getWithAuth<IManyResult<IUser>>('/user')
  if (response.data) {
    return response.data
  }
  const error = response.error?.message || ERROR_MESSAGE_COMMON
  dispatch(showSnackbar({ message: error, severity: 'error' }))
  return rejectWithValue(error)
})

export const getOrderAttributeList = createAsyncThunk('getOrderAttributeList', async (_, { dispatch, rejectWithValue }) => {
  const response = await http.getWithAuth<IManyResult<IOrderAttribute>>('order/attribute')
  if (response.data) {
    return response.data
  }

  const error = response.error?.message || ERROR_MESSAGE_COMMON
  dispatch(showSnackbar({ message: error, severity: 'error' }))
  return rejectWithValue(error)
})

export const getOrderOriginList = createAsyncThunk('getOrderOriginList', async (_, { dispatch, rejectWithValue }) => {
  const response = await http.getWithAuth<IManyResult<IOrderOrigin>>('order/orderOrigin')

  if (response.data) {
    return response.data
  }

  const error = response.error?.message || ERROR_MESSAGE_COMMON
  dispatch(showSnackbar({ message: error, severity: 'error' }))
  return rejectWithValue(error)
})

export const getOrderTagList = createAsyncThunk('getOrderTagList', async (_, { dispatch, rejectWithValue }) => {
  const response = await http.getWithAuth<IManyResult<string>>('order/tags')

  if (response.data) {
    return response.data
  }

  const error = response.error?.message || ERROR_MESSAGE_COMMON
  dispatch(showSnackbar({ message: error, severity: 'error' }))
  return rejectWithValue(error)
})

export const createOrUpdateOrder = createAsyncThunk('createOrUpdateOrder', async (order: IOrderRequestBody, { dispatch, rejectWithValue }) => {
  const response = await http.postWithAuth('order/create', order)
  if (response.data) {
    dispatch(showSnackbar({ message: SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT, severity: 'success' }))
    return response.data
  }

  return rejectWithValue(response.error?.message || ERROR_MESSAGE_COMMON)
})

export const createOrUpdateOrigin = async (item: IOrderOriginRequest): Promise<FetchDataResult<ISingleResult<IOrderOrigin>>> => {
  return await http.postWithAuth<ISingleResult<IOrderOrigin>>('order/orderOrigin/createOrUpdate', item)
}
