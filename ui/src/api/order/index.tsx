import { createAsyncThunk } from '@reduxjs/toolkit'
import http from 'src/api/requestApi'
import { ERROR_MESSAGE_COMMON, ERROR_MESSAGE_NETWORK } from 'src/common/constants'
import { IOrderOrigin } from 'src/redux/admin/interface/IAdminGeneralState'
import { IOrderRequestBody } from 'src/redux/admin/interface/IOrderAdmin'

export const getProductList = createAsyncThunk('getProductList', async () => {
  const response = await http.get('/product')
  return response
})

export const getUserList = createAsyncThunk('getUserList', async () => {
  const response = await http.get('/user')
  return response
})

export const getOrderAttributeList = createAsyncThunk('getOrderAttributeList', async (_, { rejectWithValue }) => {
  try {
    const response = await http.get('order/attribute')
    return response
  } catch (error: any) {
    if (!error.response) {
      return rejectWithValue(ERROR_MESSAGE_NETWORK)
    }
    const { data } = error.response
    if (data) {
      return rejectWithValue(data.message)
    } else {
      return rejectWithValue(ERROR_MESSAGE_COMMON)
    }
  }
})

export const getOrderOriginList = createAsyncThunk('getOrderOriginList', async (_, { rejectWithValue }) => {
  try {
    const response = await http.get('order/orderOrigin')
    return response
  } catch (error: any) {
    if (!error.response) {
      return rejectWithValue(ERROR_MESSAGE_NETWORK)
    }
    const { data } = error.response
    if (data) {
      return rejectWithValue(data.message)
    } else {
      return rejectWithValue(ERROR_MESSAGE_COMMON)
    }
  }
})

export const getOrderTagList = createAsyncThunk('getOrderTagList', async (_, { rejectWithValue }) => {
  try {
    const response = await http.get('order/tags')
    return response
  } catch (error: any) {
    if (!error.response) {
      return rejectWithValue(ERROR_MESSAGE_NETWORK)
    }
    const { data } = error.response
    if (data) {
      return rejectWithValue(data.message)
    } else {
      return rejectWithValue(ERROR_MESSAGE_COMMON)
    }
  }
})

export const createOrUpdateOrder = createAsyncThunk('createOrUpdateOrder', async (order: IOrderRequestBody, { rejectWithValue }) => {
  try {
    const response = await http.post('order/create', order)
    return response
  } catch (error: any) {
    if (!error.response) {
      return rejectWithValue(ERROR_MESSAGE_NETWORK)
    }
    const { data } = error.response
    if (data) {
      return rejectWithValue(data.message)
    } else {
      return rejectWithValue(ERROR_MESSAGE_COMMON)
    }
  }
})

export const createOrUpdateOrigin = async (item: IOrderOrigin) => {
  try {
    console.log('sss')
    const response = await http.post('order/orderOrigin/createOrUpdate', item)
    return { isSuccess: true, data: response.data }
  } catch (error: any) {
    if (!error.response) {
      return {
        isSuccess: false,
        message: ERROR_MESSAGE_NETWORK
      }
    }
    const { data } = error.response
    if (data) {
      return { isSuccess: false, message: data.message }
    } else {
      return { isSuccess: false, message: ERROR_MESSAGE_COMMON }
    }
  }
}
