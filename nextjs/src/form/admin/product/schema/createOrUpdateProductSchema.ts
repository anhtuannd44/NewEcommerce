import * as Yup from 'yup'

import { ProductStatus, ProductType } from '@/enums/product-enums'
import type { IProduct } from '@/interface/admin/product/IProduct'
import type { IProductAttribute } from '@/interface/admin/product/IProductAttribute'
import type { IAttributeJson, IProductAttributeCombination } from '@/interface/admin/product/IProductCombination'
import type { IProductFile } from '@/interface/admin/product/IProductFile'

export const productFileSchema = Yup.object<IProductFile>().shape({
  fileId: Yup.string().required(),
  virtualPath: Yup.string().required()
})

export const productAttributeSchema = Yup.object<IProductAttribute>().shape({
  id: Yup.string().required(),
  name: Yup.string().required(),
  productAttributeValues: Yup.array().min(1, 'Vui lòng nhập ít nhất 1 giá trị').required()
})

export const productAttributeCombinationSchema = Yup.object<IProductAttributeCombination>().shape({
  id: Yup.string().required(),
  name: Yup.string().required('Không được để trống'),
  sku: Yup.string().required('Không được để trống'),
  barCode: Yup.string().required('Không được để trống'),
  price: Yup.number().min(0, 'Giá phải lớn hơn 0').nullable().default(null),
  stockQuantity: Yup.number().min(0, 'Số lượng phải lớn hơn 0').nullable().default(0),
  productCost: Yup.number().min(0, 'Chi phí phải lớn hơn 0').nullable().default(0),
  attributeJson: Yup.array()
    .required()
    .of(
      Yup.object<IAttributeJson>().shape({
        productAttributeId: Yup.string().required(),
        productAttributeValue: Yup.string().required()
      })
    )
})

export const createOrUpdateProductSchema = Yup.object<IProduct>().shape({
  id: Yup.string().optional(),
  name: Yup.string().required('Name is required'),
  body: Yup.string().required('Body is required'),
  shortDescription: Yup.string().required('Short description is required'),
  allowComments: Yup.boolean().required('Allow comments is required'),
  metaTitle: Yup.string().required('Meta title is required'),
  metaKeywords: Yup.string().required('Meta keywords are required'),
  metaDescription: Yup.string().required('Meta description is required'),
  unit: Yup.string().required('Unit is required'),
  seoUrl: Yup.string().required('SEO URL is required'),
  status: Yup.mixed<ProductStatus>()
    .oneOf(Object.values(ProductStatus) as ProductStatus[])
    .default(ProductStatus.Drafted)
    .required('Status is required'),
  tags: Yup.array(),
  productType: Yup.mixed<ProductType>()
    .oneOf(Object.values(ProductType) as ProductType[])
    .required('Product type is required'),
  allowCustomerReviews: Yup.boolean().required('Allow customer reviews is required'),
  sku: Yup.string().required('SKU is required'),
  barcode: Yup.string().optional(),
  manageStockQuantity: Yup.boolean().required('Manage stock quantity is required'),
  stockQuantity: Yup.number().nullable().optional(),
  callForPrice: Yup.boolean().required('Call for price is required'),
  price: Yup.number().nullable().optional(),
  oldPrice: Yup.number().nullable().optional(),
  wholesalePrice: Yup.number().nullable().optional(),
  productCost: Yup.number().nullable().optional(),
  productCategoryId: Yup.string().nullable().optional(),
  brandId: Yup.string().nullable().required('Brand ID is required'),
  mainPicture: productFileSchema,
  album: Yup.array().of(productFileSchema),
  productAttributes: Yup.array().of(productAttributeSchema),
  productAttributeCombinations: Yup.array().required().of(productAttributeCombinationSchema)
})
