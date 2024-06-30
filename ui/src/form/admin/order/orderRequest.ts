import { DiscountType, OrderStatus } from 'src/common/enums'
import { IOrderRequestBody, IProductItemRequestBody } from '../interface/IOrderRequest'
import * as Yup from 'yup'

export const defaultOrderItem: IProductItemRequestBody = {
  productId: '',
  quantity: 1,
	price: null,
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
  customerId: '',
  orderCode: '',
  deliveryAddress: '',
  billingAddress: '',
  picStaffId: '',
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
  problem: '',
  rootCause: '',
  solution: '',
  responsibleStaffIds: [],
  tags: [],
  status: OrderStatus.Processing,
  items: []
}

export const productItemSchema = Yup.object().shape({
  productId: Yup.string().required().default('123123123'),
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

export const orderRequestSchema = Yup.object<IOrderRequestBody>().shape({
  customerId: Yup.string().required('Vui lòng chọn khách hàng'),
  orderCode: Yup.string(),
  deliveryAddress: Yup.string().required('Vui lòng chọn địa chỉ giao hàng'),
  billingAddress: Yup.string(),
  picStaffId: Yup.string().required('Vui lòng chọn người phụ trách'),
  dateDelivery: Yup.date().nullable().default(null).required('Vui lòng nhập ngày hẹn giao hàng'),
  dateActualDelivery: Yup.date().nullable().default(null),
  dateAcceptance: Yup.date().nullable().default(null),
  dateAppointedDelivery: Yup.date().nullable().default(null),
  constructionStaffIds: Yup.array().of(Yup.string().required()).required(),
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
    .min(0, 'Số phải lớn hơn hoặc bằng 0')
    .when('discountType', (discountType: any) =>
      discountType === DiscountType.Percent
        ? Yup.number().max(100, 'Giá trị phần trăm phải nhỏ hơn hoặc bằng 100').required('Giá trị chiết khấu là bắt buộc')
        : Yup.number().required('Giá trị chiết khấu là bắt buộc')
    ),
  discountNote: Yup.string(),
  note: Yup.string(),
  problem: Yup.string(),
  rootCause: Yup.string(),
  solution: Yup.string(),
  responsibleStaffIds: Yup.array().of(Yup.string().required()).required(),
  tags: Yup.array(),
  status: Yup.mixed<OrderStatus>()
    .oneOf(Object.values(OrderStatus) as OrderStatus[])
    .required()
    .default(OrderStatus.Processing),
  items: Yup.array().of(productItemSchema).required()
})
