import { httpWithAuth } from '@/apis/api-services'

import type { IProduct } from '@/interface/admin/product/IProduct'
import type { FetchDataResult } from '@/interface/api-base/IFetchDataResult'

// export const getProductList = () : Promise<FetchDataResult<IProduct>> => {
//   const response = await httpWithAuth.get<IManyResult<IProductInList>>('/product')

//   return await httpWithAuth.get<IProduct>(`/product/${id}`)
// })

export const getProduct = async (id: string): Promise<FetchDataResult<IProduct>> => {
  return await httpWithAuth.get<IProduct>(`/product/${id}`)
}

// export const getProductCategoryList = createAsyncThunk(
//   'getProductCategoryList',
//   async (_, { dispatch, rejectWithValue }) => {
//     const response = await httpWithAuth.get<IManyResult<IProductCategory>>('/product/category')

//     if (response.data) {
//       return response.data
//     }

//     const error = response.error?.message || ERROR_MESSAGE_COMMON

//     dispatch(showSnackbar({ message: error, severity: 'error' }))

//     return rejectWithValue(error)
//   }
// )

// export const getProductTags = createAsyncThunk('getProductTags', async (_, { dispatch, rejectWithValue }) => {
//   const response = await httpWithAuth.get<IManyResult<string>>('/product/tags')

//   if (response.data) {
//     return response.data
//   }

//   const error = response.error?.message || ERROR_MESSAGE_COMMON

//   dispatch(showSnackbar({ message: error, severity: 'error' }))

//   return rejectWithValue(error)
// })

// export const getBrandList = createAsyncThunk('getBrandList', async (_, { dispatch, rejectWithValue }) => {
//   const response = await httpWithAuth.get<IManyResult<IBrand>>('/product/brand')

//   if (response.data) {
//     return response.data
//   }

//   const error = response.error?.message || ERROR_MESSAGE_COMMON

//   dispatch(showSnackbar({ message: error, severity: 'error' }))

//   return rejectWithValue(error)
// })

// export const createProductCategory = createAsyncThunk(
//   'createProductCategory',
//   async (category: IProductCategoryAdminCreateBody, { rejectWithValue }) => {
//     try {
//       const response = await httpWithAuth.post('product/category/createorupdate', category)

//       return response.data
//     } catch (error: any) {
//       if (!error.response) {
//         return rejectWithValue(ERROR_MESSAGE_NETWORK)
//       }

//       const { data } = error.response

//       if (data) {
//         return rejectWithValue(data.message)
//       }

//       return rejectWithValue(ERROR_MESSAGE_COMMON)
//     }
//   }
// )

// export const createOrUpdateBrand = createAsyncThunk(
//   'createOrUpdateBrand',
//   async (brand: IBrand, { rejectWithValue }) => {
//     try {
//       const response = await httpWithAuth.post('product/brand/createorupdate', brand)

//       return response.data
//     } catch (error: any) {
//       if (!error.response) {
//         return rejectWithValue(ERROR_MESSAGE_NETWORK)
//       }

//       const { data } = error.response

//       if (data && data.message) {
//         return rejectWithValue(data.message)
//       } else {
//         return rejectWithValue(ERROR_MESSAGE_COMMON)
//       }
//     }
//   }
// )

// export const createProductAdmin = createAsyncThunk(
//   'createProductAdmin',
//   async (product: IProductAdmin, { rejectWithValue }) => {
//     try {
//       const response = await httpWithAuth.post('product/createorupdate', product)

//       return response.data
//     } catch (error: any) {
//       if (!error.response) {
//         return rejectWithValue(ERROR_MESSAGE_NETWORK)
//       }

//       const { data } = error.response

//       if (data && data.message) {
//         return rejectWithValue(data.message)
//       }

//       return rejectWithValue(ERROR_MESSAGE_COMMON)
//     }
//   }
// )
