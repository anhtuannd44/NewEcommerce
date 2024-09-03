// Type Imports
import { DiscountType, OrderStatus } from '@/enums/product-enums'

// Enum Imports
import type { IOrder, IProductItem } from '@/interface/admin/order'

export const defaultOrderItem: IProductItem = {
  productId: '',
  quantity: 1,
  price: null,
  discountType: DiscountType.Value,
  discountValue: 0,
  preTotal: 0,
  totalPriceAfterDiscount: 0,
  isVat: false,
  vatValue: 0,
  discountPercent: 0,
  name: '',
  productCode: '',
  productUrl: ''
}

export const defaultOrderRequest: IOrder = {
  customerId: null,
  deliveryAddress: '',
  billingAddress: '',
  picStaffId: '',
  constructionStaffIds: [],
  preTotal: 0,
  totalPriceAfterDiscount: 0,
  shippingFee: 0,
  deposit: 0,
  isComplain: false,
  orderOriginId: '',
  discountType: DiscountType.Value,
  discountValue: 0,
  discountPercent: 0,
  status: OrderStatus.Processing,
  items: []
}
