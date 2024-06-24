import { createAsyncThunk } from '@reduxjs/toolkit'
import http from 'src/api/apiService'
import { ERROR_MESSAGE_COMMON, ERROR_MESSAGE_NETWORK } from 'src/common/constants'
import { ICreateOrderOrigin } from 'src/form/admin/interface/ICreateOrEditOrderOrigin'
import { IOrderRequestBody } from 'src/form/admin/interface/IOrderRequest'
import { IOrderOrigin } from 'src/redux/admin/interface/IAdminGeneralState'

export const getProductList = createAsyncThunk('getProductList', async (_, { rejectWithValue }) => {
  const response = await http.getWithAuth('/product')
  if (response.data) {
    return response.data
  }

  return rejectWithValue(response.error?.message || ERROR_MESSAGE_COMMON)
})

export const getUserList = createAsyncThunk('getUserList', async (_, { rejectWithValue }) => {
  const response = await http.getWithAuth('/user')
  if (response.data) {
    return response.data
  }

  return rejectWithValue(response.error?.message || ERROR_MESSAGE_COMMON)
})

export const getOrderAttributeList = createAsyncThunk('getOrderAttributeList', async (_, { rejectWithValue }) => {
  const response = await http.getWithAuth('order/attribute')
  if (response.data) {
    return response.data
  }

  return rejectWithValue(response.error?.message || ERROR_MESSAGE_COMMON)
})

export const getOrderOriginList = createAsyncThunk('getOrderOriginList', async (_, { rejectWithValue }) => {
  const response = await http.getWithAuth('order/orderOrigin')

  if (response.data) {
    return response.data
  }

  return rejectWithValue(response.error?.message || ERROR_MESSAGE_COMMON)
})

export const getOrderTagList = createAsyncThunk('getOrderTagList', async (_, { rejectWithValue }) => {
  const response = await http.getWithAuth('order/tags')

  if (response.data) {
    return response.data
  }

  return rejectWithValue(response.error?.message || ERROR_MESSAGE_COMMON)
})

export const createOrUpdateOrder = createAsyncThunk('createOrUpdateOrder', async (order: IOrderRequestBody, { rejectWithValue }) => {
  const response = await http.postWithAuth('order/create', order)
  if (response.data) {
    return response.data
  }

  return rejectWithValue(response.error?.message || ERROR_MESSAGE_COMMON)
})

export const createOrUpdateOrigin = createAsyncThunk('createOrUpdateOrigin', async (item: IOrderOrigin, { rejectWithValue }) => {
  const response = await http.postWithAuth<IOrderOrigin>('order/orderOrigin/createOrUpdate', item)
  if (response.data) {
    return response.data
  }
  return rejectWithValue(response.error?.message || ERROR_MESSAGE_COMMON)
})
