// Third-party Imports
import * as Yup from 'yup'

// Enum Imports
import { DiscountType, OrderStatus } from '@/enums/product-enums'

// Type Imports
import type { IOrder } from '@/interface/admin/order'

export const productItemSchema = Yup.object().shape({
  productId: Yup.string().required(),
  price: Yup.number().nullable().required('Vui lòng nhập giá sản phẩm').min(0, 'Giá không được bé hơn 0'),
  quantity: Yup.number().required('Vui lòng nhập số lượng').min(1, 'Số lượng phải lớn hơn 0'),
  discountType: Yup.mixed<DiscountType>()
    .oneOf(Object.values(DiscountType) as DiscountType[])
    .required(),
  discountValue: Yup.number().required(),
  preTotal: Yup.number().required(),
  totalPriceAfterDiscount: Yup.number().required(),
  note: Yup.string().optional(),
  isVat: Yup.boolean().required(),
  vatValue: Yup.number().required(),
  discountPercent: Yup.number().required(),
  imgUrl: Yup.string().optional(),
  name: Yup.string().required(),
  productCode: Yup.string().required(),
  productUrl: Yup.string().required(),
  isShowNote: Yup.boolean().optional()
})

export const orderRequestSchema = Yup.object<IOrder>().shape({
  customerId: Yup.string().required('Vui lòng chọn khách hàng'),
  orderCode: Yup.string(),
  deliveryAddress: Yup.string().required('Vui lòng chọn địa chỉ giao hàng'),
  billingAddress: Yup.string(),
  picStaffId: Yup.string().required('Vui lòng chọn người phụ trách'),
  dateDelivery: Yup.date().nullable().default(null).required('Vui lòng nhập ngày hẹn giao hàng'),
  dateActualDelivery: Yup.date().nullable().default(null),
  dateAcceptance: Yup.date().nullable().default(null),
  dateAppointedDelivery: Yup.date().nullable().default(null),
  constructionStaffIds: Yup.array().of(Yup.string().required()).required('Vui lòng chọn người thi công'),
  preTotal: Yup.number().required(),
  totalPriceAfterDiscount: Yup.number().required(),
  shippingFee: Yup.number().nullable().default(0).min(0, 'Số tiền phải lớn hơn hoặc bằng 0'),
  deposit: Yup.number().nullable().default(0).min(0, 'Số tiền phải lớn hơn hoặc bằng 0'),
  orderAttributeId: Yup.string(),
  orderOriginId: Yup.string().required('Vui lòng chọn nguồn đơn hàng'),
  discountType: Yup.mixed<DiscountType>()
    .oneOf(Object.values(DiscountType) as DiscountType[])
    .default(DiscountType.Value)
    .required(),
  discountValue: Yup.number()
    .default(0)
    .min(0, 'Số phải lớn hơn hoặc bằng 0')
    .when('discountType', (discountType: any) =>
      discountType === DiscountType.Percent
        ? Yup.number().max(100, 'Giá trị phần trăm phải nhỏ hơn hoặc bằng 100')
        : Yup.number()
    ),
  discountPercent: Yup.number().required(),
  discountNote: Yup.string(),
  note: Yup.string(),
  isComplain: Yup.boolean().default(false),
  problem: Yup.string(),
  rootCause: Yup.string(),
  solution: Yup.string(),
  responsibleStaffIds: Yup.array().of(Yup.string().required()),
  tags: Yup.array(),
  status: Yup.mixed<OrderStatus>()
    .oneOf(Object.values(OrderStatus) as OrderStatus[])
    .required()
    .default(OrderStatus.Processing),
  items: Yup.array()
    .min(1, 'Vui lòng chọn ít nhất 1 sản phẩm')
    .required('Vui lòng chọn ít nhất 1 sản phẩm cho đơn hàng')
    .of(productItemSchema)
})
