import { IProductCategory } from 'src/form/admin/product/interface/IProductCategory'
import { IMessageCommon } from './ICommon'
import { IProductInList } from 'src/form/admin/product/interface/IProductInList'
import { IBrand } from 'src/form/admin/product/interface/IBrand'

export interface IUser {
  id: string
  fullName: string
  phoneNumber: string
  email: string
  address: string
  role: string
}

export interface IOrderAttribute {
  id: string
  name: string
}

export interface IOrderOrigin {
  id: string
  name: string
  isActive: boolean
}

export interface IOrderOriginList {
  orderOrigins?: IOrderOrigin[]
  total?: number
  status: IRequestStatus
}

export interface IProductList {
  products?: IProductInList[]
  status: IRequestStatus
}

export interface IOrderAttributeList {
  orderAttributes?: IOrderAttribute[]
  total?: number
  status: IRequestStatus
}

export interface IOrderTagList {
  orderTags?: string[]
  status: IRequestStatus
}

export interface IUsersResponse {}

export interface IUserList {
  users?: IUser[]
  status: IRequestStatus
}

export interface IRequestStatus {
  isSubmitted: boolean
  isLoading: boolean
  isSuccess: boolean
  isSentRequest: boolean
}

export interface IProductCategoryList {
  productCategories?: IProductCategory[]
  status: IRequestStatus
}

export interface IProductTagList {
  productTags?: string[]
  status: IRequestStatus
}

export interface IProductBrandList {
  brands?: IBrand[]
  status: IRequestStatus
}

export interface IAdminGeneralState {
  userList: IUserList
  productList: IProductList
  productCategoryList: IProductCategoryList
  productTagList: IProductTagList
  productBrandList: IProductBrandList
  orderAttributeList: IOrderAttributeList
  orderOriginList: IOrderOriginList
  orderTagList: IOrderTagList
}
