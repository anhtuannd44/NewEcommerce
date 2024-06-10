import { DiscountType, OrderStatus } from 'src/common/enums'
import { IOrderRequestBody, IProductItemRequestBody } from '../interface/IOrderRequest'
import * as Yup from 'yup'

export const defaultOrderItem: IProductItemRequestBody = {
  productId: '',
  price: null,
  quantity: 1,
  discountType: DiscountType.Value,
  discountValue: 0,
  preTotal: 0,
  totalPriceAfterDiscount: 0,
  note: '',
  isVat: false,
  vatValue: 0,
  discountPercent: 0,
  imgUrl: '',
  name: '',
  productCode: '',
  productUrl: '',
  isShowNote: false
}

export const defaultOrderRequest: IOrderRequestBody = {
  customerId: null,
  orderCode: '',
  deliveryAddress: '',
  billingAddress: '',
  picStaffId: '',
  dateDelivery: null,
  dateActualDelivery: null,
  dateAcceptance: null,
  dateAppointedDelivery: null,
  constructionStaffIds: [],
  preTotal: 0,
  totalPriceAfterDiscount: 0,
  shippingFee: 0,
  deposit: 0,
  orderAttributeId: '',
  orderOriginId: '',
  discountType: DiscountType.Value,
  discountValue: 0,
  discountNote: '',
  note: '',
  isComplain: false,
  problem: '',
  rootCause: '',
  solution: '',
  responsibleStaffIds: [],
  tags: [],
  status: OrderStatus.Processing,
  items: []
}

const orderItemSchema = Yup.object().shape({
  price: Yup.number().required('Price is required').nullable(),
  quantity: Yup.number().min(1).required('Quantity is required'),
  discountValue: Yup.number().min(0).required('Discount value is required'),
  preTotal: Yup.number().min(0).required('Pre-total is required'),
  totalPriceAfterDiscount: Yup.number().min(0).required('Total price after discount is required'),
  note: Yup.string(),
  isVat: Yup.boolean().required('VAT flag is required'),
  vatValue: Yup.number().min(0).required('VAT value is required'),
  discountPercent: Yup.number().min(0).max(100).required('Discount percent is required'),
  imgUrl: Yup.string().url('Must be a valid URL'),
  name: Yup.string().required('Product name is required'),
  productCode: Yup.string().required('Product code is required'),
  productUrl: Yup.string().url('Must be a valid URL'),
  isShowNote: Yup.boolean()
})

export const orderRequestSchema = Yup.object().shape({
  customerId: Yup.string().nullable(),
  orderCode: Yup.string().required('Order code is required'),
  deliveryAddress: Yup.string().required('Delivery address is required'),
  billingAddress: Yup.string().required('Billing address is required'),
  picStaffId: Yup.string().required('Người phụ trách không được để trống'),
  dateDelivery: Yup.date().required('Date of delivery is required').nullable(),
  dateActualDelivery: Yup.date().nullable(),
  dateAcceptance: Yup.date().nullable(),
  dateAppointedDelivery: Yup.date().nullable(),
  constructionStaffIds: Yup.array().of(Yup.string()).required('Construction staff IDs are required'),
  preTotal: Yup.number().min(0).required('Pre-total is required'),
  totalPriceAfterDiscount: Yup.number().min(0).required('Total price after discount is required'),
  shippingFee: Yup.number().min(0).required('Shipping fee is required'),
  deposit: Yup.number().min(0).required('Deposit is required'),
  orderAttributeId: Yup.string().required('Loại đơn hàng không được để trống'),
  orderOriginId: Yup.string().required('Nguồn đơn hàng không được để trống'),
  discountValue: Yup.number().min(0).required('Discount value is required'),
  discountNote: Yup.string(),
  note: Yup.string(),
  isComplain: Yup.boolean().required('Complain flag is required'),
  problem: Yup.string(),
  rootCause: Yup.string(),
  solution: Yup.string(),
  responsibleStaffIds: Yup.array().of(Yup.string()).required('Responsible staff IDs are required'),
  tags: Yup.array().of(Yup.string()),
  items: Yup.array().of(orderItemSchema).required('Items are required')
})
