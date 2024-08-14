import { useEffect, useState } from 'react'

import { Alert, Backdrop, CircularProgress, Grid, Snackbar } from '@mui/material'
import { connect } from 'react-redux'
import { AppDispatch, RootState, dispatch } from 'src/redux/store'
import {
  getBrandList,
  getProduct,
  getProductCategoryList,
  getProductTags,
  createProductAdmin
} from 'src/services/product'
import CreateOrEditLoadingBox from 'src/views/admin/loading-box/CreateOrEditLoadingBox'

import type {
  IProductBrandList,
  IProductCategoryList,
  IProductTagList
} from 'src/redux/admin/interface/IAdminGeneralState'
import type { IProduct } from 'src/form/admin/product/interface/IProduct'
import { showSnackbar } from 'src/redux/admin/slice/snackbarSlice'
import { ERROR_MESSAGE_COMMON } from 'src/common/constants'
import type { FieldErrors } from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createOrUpdateProductSchema } from 'src/form/admin/product/scheme/createOrUpdateProductSchema'

import { ProductType } from 'src/common/enums'

import { initProductDefaultValue } from 'src/form/admin/product/default-value/productDefaultValue'

import DescriptionBox from './DescriptionBox'
import AdditionalProductBox from './AdditionalProductBox'
import ImageProductBox from './ImageProductBox'
import PriceProduct from './PriceProduct'
import ProductAttributeCombinationBox from './price/product-attribute-combination/ProductAttributeCombinationBox'

import GeneralInfoProduct from './GeneralInfoProduct'

interface ICreateOrUpdateProductPageProps {
  id?: string
  product?: IProduct
  productCategoryList: IProductCategoryList
  productBrandList: IProductBrandList
  productTagList: IProductTagList
  getProductCategoryList: () => void
  getProductTags: () => void
  getBrandList: () => void
}

const EditProduct = (props: ICreateOrUpdateProductPageProps) => {
  const {
    id,
    product,
    productCategoryList,
    productBrandList,
    productTagList,
    getProductCategoryList,
    getProductTags,
    getBrandList
  } = props

  const isUpdate: boolean = id !== undefined && id !== ''

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!productCategoryList.productCategories) {
      getProductCategoryList()
    }

    if (!productBrandList.brands) {
      getBrandList()
    }

    if (!productTagList.productTags) {
      getProductTags()
    }
  }, [])

  const createOrUpdateProductForm = useForm<IProduct>({
    defaultValues: product ?? initProductDefaultValue,
    resolver: yupResolver<IProduct>(createOrUpdateProductSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    progressive: true
  })

  const productType = createOrUpdateProductForm.watch('productType')

  const onSubmit = (data: IProduct) => {
    // console.log('data', data)
    // createOrUpdateOrder(data)
  }

  const onError = (errors: FieldErrors<IProduct>) => {
    console.log(createOrUpdateProductForm.getValues())
    console.log('Validation Errors:', errors)
  }

  if (
    (isUpdate && !product) ||
    !productCategoryList.productCategories ||
    !productTagList.productTags ||
    !productBrandList.brands ||
    loading
  ) {
    return <CreateOrEditLoadingBox />
  }

  return (
    <FormProvider {...createOrUpdateProductForm}>
      <form onSubmit={createOrUpdateProductForm.handleSubmit(onSubmit, onError)}>
        <Grid container spacing={6}>
          <Grid item xs={9}>
            <GeneralInfoProduct />
            <DescriptionBox />
            <PriceProduct />
          </Grid>
          <Grid item xs={3}>
            <AdditionalProductBox
              productCategoryList={productCategoryList.productCategories}
              productTagList={productTagList.productTags}
              brandList={productBrandList.brands}
            />
            <ImageProductBox />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {productType === ProductType.GroupedProduct && <ProductAttributeCombinationBox />}
          {/* <BodyContentBox /> */}
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            {/* <ProductSelectionBox /> */}
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default EditProduct
