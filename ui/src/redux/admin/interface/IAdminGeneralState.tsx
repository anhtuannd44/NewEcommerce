import { IMessageCommon } from './ICommon'

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

export interface IProduct {
  id: string
  name: string
  sku: string
  seoUrl: string
  price: number
  stockQuantity: number
  imgUrl: string
}

export interface IOrderOriginList {
	orderOrigins?: IOrderOrigin[]
	total?: number
	status: IRequestStatus
}

export interface IProductList {
  products?: IProduct[]
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

export interface IUsersResponse {
	
}

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

export interface IAdminGeneralState {
  userList: IUserList
  productList: IProductList
  orderAttributeList: IOrderAttributeList
	orderOriginList: IOrderOriginList
	orderTagList: IOrderTagList
	message: IMessageCommon
}
