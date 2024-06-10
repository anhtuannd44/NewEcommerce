import { DiscountType, OrderStatus } from 'src/common/enums'
import { IValidationRequest } from 'src/utils/utility'
import { IMessageCommon } from './ICommon'

export interface IOrderRequestBodyItemControl {
  price: IValidationRequest
  quantity: IValidationRequest
  discountType: IValidationRequest
  discountValue: IValidationRequest
  preTotal: IValidationRequest
  totalPriceAfterDiscount: IValidationRequest
}

export interface IOrderRequestBody {
  customerId: string | null
  orderCode: string
  deliveryAddress: string
  billingAddress: string
  picStaffId: string
  dateDelivery: Date | null
	dateActualDelivery?: Date | null
	dateAcceptance?: Date | null
	DateAppointedDelivery?: Date | null
  constructionStaffIds: string[]
  preTotal: number
  totalPriceAfterDiscount: number
  shippingFee: number
  deposit: number
  orderAttributeId: string | null
  orderOriginId: string | null
  discountType: DiscountType
  discountValue: number
  discountNote: string
  note: string
  isComplain: boolean
  problem: string
  rootCause: string
  solution: string
  responsibleStaffIds: string[]
  tags: string[]
	status: OrderStatus
  items: IProductItemRequestBody[] | undefined
}

export interface IProductItemRequestBody {
  productId: string
  price: number | null
  quantity: number
  discountType: DiscountType
  discountValue: number
  preTotal: number
  totalPriceAfterDiscount: number
  note: string
  isVat: boolean
  vatValue: number
  discountPercent: number
  imgUrl?: string
  name: string
  productCode: string
  productUrl: string
  isShowNote?: boolean
}

export interface IOrderRequestBodyControl {
  customerId: IValidationRequest
  orderCode: IValidationRequest
  deliveryAddress: IValidationRequest
  billingAddress: IValidationRequest
  picStaffId: IValidationRequest
  dateDelivery: IValidationRequest
  constructionStaffIds: IValidationRequest
  preTotal: IValidationRequest
  totalPriceAfterDiscount: IValidationRequest
  shippingFee: IValidationRequest
  discountType: IValidationRequest
  discountValue: IValidationRequest
}

export interface  IOrderRequestBodyItemControls {
	productId: string
	controls: IOrderRequestBodyItemControl
}

export interface IOrderRequestControl {
	order: IOrderRequestBodyControl
	product?: IOrderRequestBodyItemControls[]
}

export interface IOrderAdminState {
  orderRequest: IOrderRequestBody
	controls: IOrderRequestControl
	isLoading: boolean
	isSubmitted: boolean
	isSuccess: boolean
  message: IMessageCommon
  id: string
}