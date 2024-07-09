import { ProductStatus, ProductType } from 'src/common/enums'
import { IProduct } from '../interface/IProduct'

export const initProductDefaultValue: IProduct = {
  name: '',
  body: null,
  shortDescription: null,
  metaTitle: null,
  metaKeywords: null,
  metaDescription: null,
  unit: null,
  seoUrl: '',
  status: ProductStatus.Drafted,
  productType: ProductType.SimpleProduct,
  allowCustomerReviews: false,
  sku: '',
  manageStockQuantity: false,
  stockQuantity: null,
  brandId: null
}
