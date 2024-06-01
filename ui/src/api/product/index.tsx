import { createAsyncThunk } from '@reduxjs/toolkit'
import http from 'src/api/requestApi'
import { ERROR_MESSAGE_COMMON, ERROR_MESSAGE_NETWORK } from 'src/common/constants'
import { IBrand, IProductAdmin, IProductCategoryAdminCreateBody } from 'src/redux/admin/interface/IProductAdmin'

export const getProductAdmin = createAsyncThunk('getProductAdmin', async (id: string) => {
  const response = await http.get(`/product/${id}`)
  return response
})

export const getProductCategoryListAdmin = createAsyncThunk('getProductCategoryListAdmin', async () => {
  const response = await http.get('/product/category')
  return response
})

export const getProductTagsAdmin = createAsyncThunk('getProductTagsAdmin', async () => {
  const response = await http.get('/product/tags')
  return response
})

export const getBrandList = createAsyncThunk('getBrandList', async () => {
  const response = await http.get('/product/brand')
  return response
})

export const createProductCategory = createAsyncThunk('createProductCategory', async (category: IProductCategoryAdminCreateBody, { rejectWithValue }) => {
  try {
    const response = await http.post('product/category/createorupdate', category)
    return response.data
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

export const createOrUpdateBrand = createAsyncThunk('createOrUpdateBrand', async (brand: IBrand, { rejectWithValue }) => {
  try {
    const response = await http.post('product/brand/createorupdate', brand)
    return response.data
  } catch (error: any) {
    if (!error.response) {
      return rejectWithValue(ERROR_MESSAGE_NETWORK)
    }
    const { data } = error.response
    if (data && data.message) {
      return rejectWithValue(data.message)
    } else {
      return rejectWithValue(ERROR_MESSAGE_COMMON)
    }
  }
})

export const createProductAdmin = createAsyncThunk('createProductAdmin', async (product: IProductAdmin, { rejectWithValue }) => {
  try {
    const response = await http.post('product/createorupdate', product)
    return response.data
  } catch (error: any) {
    if (!error.response) {
      return rejectWithValue(ERROR_MESSAGE_NETWORK)
    }
    const { data } = error.response
    if (data && data.message) {
      return rejectWithValue(data.message)
    }
    return rejectWithValue(ERROR_MESSAGE_COMMON)
  }
})
