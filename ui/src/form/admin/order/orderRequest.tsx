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

export const productItemSchema = Yup.object().shape({
  productId: Yup.string().required(),
  price: Yup.number().nullable().default(null),
  quantity: Yup.number().required(),
  discountType: Yup.mixed<DiscountType>()
    .oneOf(Object.values(DiscountType) as DiscountType[])
    .required(),
  discountValue: Yup.number().required(),
  preTotal: Yup.number().required(),
  totalPriceAfterDiscount: Yup.number().required(),
  note: Yup.string().required(),
  isVat: Yup.boolean().required(),
  vatValue: Yup.number().required(),
  discountPercent: Yup.number().required(),
  imgUrl: Yup.string().optional(),
  name: Yup.string().required(),
  productCode: Yup.string().required(),
  productUrl: Yup.string().required(),
  isShowNote: Yup.boolean().optional()
})

export const orderRequestSchema = Yup.object().shape({
  customerId: Yup.string().required().nullable(),
  orderCode: Yup.string().required(),
  deliveryAddress: Yup.string().required(),
  billingAddress: Yup.string().required(),
  picStaffId: Yup.string().required(),
  dateDelivery: Yup.date().nullable().default(null),
  dateActualDelivery: Yup.date().nullable().default(null),
  dateAcceptance: Yup.date().nullable().default(null),
  dateAppointedDelivery: Yup.date().nullable().default(null),
  constructionStaffIds: Yup.array().of(Yup.string().required()).required(),
  preTotal: Yup.number().required(),
  totalPriceAfterDiscount: Yup.number().required(),
  shippingFee: Yup.number().required(),
  deposit: Yup.number().required(),
  orderAttributeId: Yup.string().required(),
  orderOriginId: Yup.string().required(),
  discountType: Yup.mixed<DiscountType>()
    .oneOf(Object.values(DiscountType) as DiscountType[])
    .required(),
  discountValue: Yup.number().required(),
  discountNote: Yup.string().required(),
  note: Yup.string().required(),
  isComplain: Yup.boolean().required(),
  problem: Yup.string().required(),
  rootCause: Yup.string().required(),
  solution: Yup.string().required(),
  responsibleStaffIds: Yup.array().of(Yup.string().required()).required(),
  tags: Yup.array().of(Yup.string().required()).required(),
  status: Yup.mixed<OrderStatus>()
    .oneOf(Object.values(OrderStatus) as OrderStatus[])
    .required().default(OrderStatus.Processing),
  items: Yup.array().of(productItemSchema).required()
})
