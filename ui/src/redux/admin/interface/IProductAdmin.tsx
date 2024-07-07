import { MessageType, ProductStatus, ProductType } from 'src/common/enums'
import { IValidationRequest } from 'src/utils/utility'
import { IMessageCommon } from './ICommon'
import { v4 as uuidv4 } from 'uuid'
import { IBrand } from 'src/form/admin/product/interface/IBrand'

export interface IProductAdmin {
  id?: string
  name: string
  body: string
  shortDescription: string
  allowComments: boolean
  metaTitle: string
  metaKeywords: string
  metaDescription: string
  unit: string
  seoUrl: string
  status: ProductStatus
  tags: string[]
  productType: ProductType
  allowCustomerReviews: boolean
  sku: string
  barcode?: string
  manageStockQuantity: boolean
  stockQuantity?: number | null
  callForPrice: boolean
  price?: number | null
  oldPrice?: number | null
  productCost?: number | null
  productCategoryId?: string | null
  brandId: string | null
  mainPicture: IProductFile
  album: IProductFile[] | []
  productAttributes: IProductAttribute[]
  productAttributeCombinations: IProductAttributeCombination[]
}

export interface IProductAttribute {
  id: string
  name: string
  productAttributeValues: string[]
}

export interface IProductAttributeCombination {
  id: string
  name: string
  sku: string
  barCode: string
  price?: number | null
  stockQuantity?: number | null
  productCost?: number | null
  attributeJson: IAttributeJson[]
}

export interface IAttributeJson {
  productAttributeId: string
  productAttributeValue: string
}

export interface IcreateOrUpdateProductAdminRequest {
  product: IProductAdmin
  isSubmitted: boolean
  isValid: boolean
  isSuccess: boolean
  isLoading: boolean
}

export interface IProductFile {
  fileId: string | null
  virtualPath: string
}

export interface IProductGeneralControl {
  name: IValidationRequest
  sku: IValidationRequest
  price: IValidationRequest
  unit: IValidationRequest
  stockQuantity: IValidationRequest
}

export interface IProductCategoryAdmin {
  id: string
  name: string
  seoUrl: string
}

export interface IProductCategoryAdminCreateBody {
  name: string
  seoUrl: string
  shortDescription: string
  metaTitle: string
  metaKeywords: string
  metaDescription: string
}

export interface ICreateOrUpdateProductCategoryRequest {
  category: IProductCategoryAdminCreateBody
  submitted: boolean
  loading: boolean
  isSuccess: boolean
}

export interface ICreateEditProductAdminControls {
  productAttributeCombinationControls?: IProductAttributeCombinationControls[]
  productGeneralControl: IProductGeneralControl
  productAttributeControls?: IProductAttributeControl[]
}

export interface IProductAttributeCombinationControls {
  id: string
  validate: IProductAttributeCombinationValidateControls
}

export interface IProductAttributeCombinationValidateControls {
  sku: IValidationRequest
  barCode: IValidationRequest
  price: IValidationRequest
  stockQuantity: IValidationRequest
  productCost: IValidationRequest
}

export interface IProductAttributeControl {
  id: string
  validate: IProductAttributeValidateControl
}

export interface IProductAttributeValidateControl {
  name: IValidationRequest
  productAttributeValues: IValidationRequest
}

export interface IProductAdminControls {
  createEditProductAdminControls: ICreateEditProductAdminControls
}

export interface ICreateOrUpdateBrandRequest {
  brand: IBrand
  isSubmitted: boolean
  isSuccess: boolean
  isLoading: boolean
}

export interface IProductAdminState {
  createOrUpdateProductAdminRequest: IcreateOrUpdateProductAdminRequest
  controls: IProductAdminControls
  productCategoryList: IProductCategoryAdmin[]
  brandList: IBrand[]
  createOrUpdateBrandRequest: ICreateOrUpdateBrandRequest
  productTags: string[]
  createOrUpdateProductCategoryRequest: ICreateOrUpdateProductCategoryRequest
  isInitRequestSent: boolean
  valid: boolean
  submitted: boolean
  message: IMessageCommon
}
