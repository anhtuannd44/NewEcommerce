import { httpWithAuth } from '@/apis/api-services'

import type { IBrand } from '@/interface/admin/product/IBrand'
import type { IProduct } from '@/interface/admin/product/IProduct'
import type { IProductCategory } from '@/interface/admin/product/IProductCategory'
import type { FetchDataResult } from '@/interface/api-base/IFetchDataResult'
import type { IManyResult } from '@/interface/api-base/IManyResult'
import type { ISingleResult } from '@/interface/api-base/ISingleResult'

// export const getProductList = () : Promise<FetchDataResult<IProduct>> => {
//   const response = await httpWithAuth.get<IManyResult<IProductInList>>('/product')

//   return await httpWithAuth.get<IProduct>(`/product/${id}`)
// })

export const getProduct = async (id: string): Promise<FetchDataResult<ISingleResult<IProduct>>> => {
  return await httpWithAuth.get<ISingleResult<IProduct>>(`/admin/product/${id}`)
}

export const getProductCategoryList = async (): Promise<FetchDataResult<IManyResult<IProductCategory>>> => {
  return await httpWithAuth.get<IManyResult<IProductCategory>>('/admin/product/category')
}

export const getProductTags = async (): Promise<FetchDataResult<IManyResult<string>>> => {
  return await httpWithAuth.get<IManyResult<string>>('/admin/product/tags')
}

export const getBrandList = async (): Promise<FetchDataResult<IManyResult<IBrand>>> => {
  return await httpWithAuth.get<IManyResult<IBrand>>('/admin/product/brand')
}

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
