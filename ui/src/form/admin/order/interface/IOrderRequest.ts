import { DiscountType, OrderStatus } from 'src/common/enums'

export interface IOrderRequestBody {
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
  discountType?: DiscountType
  discountValue?: number
  discountPercent?: number
  discountNote?: string
  note?: string
  isComplain: boolean
  problem?: string
  rootCause?: string
  solution?: string
  responsibleStaffIds?: string[] | null
  tags?: string[]
  status: OrderStatus
  items: IProductItemRequestBody[]
}

export interface IProductItemRequestBody {
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
  discountPercent: number
  imgUrl?: string
  name: string
  productCode: string
  productUrl: string
  isShowNote?: boolean
}
