import type { ProductStatus, ProductType } from '@/enums/product-enums'
import type { IProductFile } from './IProductFile'
import type { IProductAttribute } from './IProductAttribute'
import type { IProductAttributeCombination } from './IProductCombination'

export interface IProduct {
  id?: string
  name: string
  body: string | null
  shortDescription: string | null
  allowComments?: boolean
  metaTitle: string | null
  metaKeywords: string | null
  metaDescription: string | null
  unit: string | null
  seoUrl: string
  status: ProductStatus
  tags?: string[] | null
  productType: ProductType
  allowCustomerReviews: boolean
  sku: string
  barcode?: string
  manageStockQuantity: boolean
  stockQuantity?: number | null
  callForPrice?: boolean
  price?: number | null
  wholesalePrice?: number | null
  oldPrice?: number | null
  productCost?: number | null
  productCategoryId?: string | null
  brandId: string | null
  mainPicture?: IProductFile | null
  album?: IProductFile[] | null
  productAttributes?: IProductAttribute[]
  productAttributeCombinations?: IProductAttributeCombination[]
}
