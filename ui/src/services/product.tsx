import { createAsyncThunk } from '@reduxjs/toolkit'
import http from 'src/api/apiService'
import { FetchDataResult } from 'src/api/interface/IApiService'
import { IManyResult } from 'src/api/response-interface/IManyResult'
import { ISingleResult } from 'src/api/response-interface/ISingleResult'
import { ERROR_MESSAGE_COMMON, ERROR_MESSAGE_NETWORK } from 'src/common/constants'
import { IBrand } from 'src/form/admin/product/interface/IBrand'
import { IProduct } from 'src/form/admin/product/interface/IProduct'
import { IProductCategory } from 'src/form/admin/product/interface/IProductCategory'
import { IProductInList } from 'src/form/admin/product/interface/IProductInList'
import { IProductAdmin, IProductCategoryAdminCreateBody } from 'src/redux/admin/interface/IProductAdmin'
import { showSnackbar } from 'src/redux/admin/slice/snackbarSlice'

export const getProductList = createAsyncThunk('getProductList', async (_, { dispatch, rejectWithValue }) => {
  const response = await http.getWithAuth<IManyResult<IProductInList>>('/product')
  if (response.data) {
    return response.data
  }
  const error = response.error?.message || ERROR_MESSAGE_COMMON
  dispatch(showSnackbar({ message: error, severity: 'error' }))
  return rejectWithValue(error)
})

export const getProduct = async (id: string): Promise<FetchDataResult<IProduct>> => {
  return await http.getWithAuth<IProduct>(`/product/${id}`)
}

export const getProductCategoryList = createAsyncThunk('getProductCategoryList', async (_, { dispatch, rejectWithValue }) => {
  const response = await http.getWithAuth<IManyResult<IProductCategory>>('/product/category')
  if (response.data) {
    return response.data
  }
  const error = response.error?.message || ERROR_MESSAGE_COMMON
  dispatch(showSnackbar({ message: error, severity: 'error' }))
  return rejectWithValue(error)
})

export const getProductTags = createAsyncThunk('getProductTags', async (_, { dispatch, rejectWithValue }) => {
  const response = await http.getWithAuth<IManyResult<string>>('/product/tags')
  if (response.data) {
    return response.data
  }
  const error = response.error?.message || ERROR_MESSAGE_COMMON
  dispatch(showSnackbar({ message: error, severity: 'error' }))
  return rejectWithValue(error)
})

export const getBrandList = createAsyncThunk('getBrandList', async (_, { dispatch, rejectWithValue }) => {
  const response = await http.getWithAuth<IManyResult<IBrand>>('/product/brand')
  if (response.data) {
    return response.data
  }
  const error = response.error?.message || ERROR_MESSAGE_COMMON
  dispatch(showSnackbar({ message: error, severity: 'error' }))
  return rejectWithValue(error)
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
