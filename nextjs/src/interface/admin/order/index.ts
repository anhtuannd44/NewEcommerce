import type { DiscountType, OrderStatus } from '@/enums/product-enums'

export interface IOrder {
  customerId: string | null
  orderCode?: string
  deliveryAddress: string
  billingAddress?: string
  picStaffId: string
  dateDelivery?: Date
  dateActualDelivery?: Date | null
  dateAcceptance?: Date | null
  dateAppointedDelivery?: Date | null
  constructionStaffIds: string[]
  preTotal: number
  totalPriceAfterDiscount: number
  shippingFee: number | null
  deposit: number | null
  orderAttributeId?: string
  orderOriginId: string
  discountType: DiscountType
  discountValue?: number
  discountNote?: string
  note?: string
  isComplain: boolean
  problem?: string
  rootCause?: string
  solution?: string
  responsibleStaffIds?: string[] | null
  tags?: string[]
  status: OrderStatus
  items: IProductItem[]
}

export interface IProductItem {
  productId: string
  price: number | null
  quantity: number
  discountType: DiscountType
  discountValue: number
  preTotal: number
  totalPriceAfterDiscount: number
  note?: string
  isVat: boolean
  vatValue: number
  imgUrl?: string
  name: string
  productCode: string
  productUrl: string
  isShowNote?: boolean
}

export interface IOrderOrigin {
  id: string
  name: string
  isActive: boolean
}

export interface IOrderAttribute {
  id: string
  name: string
}

export interface IOrderOriginRequest {
  id?: string
  name: string
  isActive: boolean
}
