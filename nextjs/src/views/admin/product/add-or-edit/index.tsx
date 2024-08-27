'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { Grid } from '@mui/material'

// Third-party Imports
import type { FieldErrors } from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'

// APIs Request Imports
import { getBrandList, getProduct, getProductCategoryList, getProductTags } from '@/services/admin/product'

// Type Imports
import type { Mode } from '@core/types'
import type { IProductCategory } from '@/interface/admin/product/IProductCategory'
import type { IBrand } from '@/interface/admin/product/IBrand'
import type { IManyResult } from '@/interface/api-base/IManyResult'
import type { IProduct } from '@/interface/admin/product/IProduct'

// Data Imports
import { createOrUpdateProductSchema } from '@/form/admin/product/schema/createOrUpdateProductSchema'
import { initProductDefaultValue } from '@/form/admin/product/default-value/productDefaultValue'

// Component Imports
import NotFound from '@/views/NotFound'
import CreateOrEditProductLoadingBox from './CreateOrEditLoadingBox'
import GeneralInfoProduct from './GeneralInfoProduct'
import ProductDescriptionBox from './ProductDescriptionBox'
import PriceProduct from './price'
import { useDictionary } from '@/contexts/dictionaryContext'

interface IEditProductProps {
  id?: string
  mode: Mode
}

const AddOrEditProduct = (props: IEditProductProps) => {
  const { id, mode } = props

  const { dictionary } = useDictionary()

  const [loading, setLoading] = useState<boolean>(true)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [product, setProduct] = useState<IProduct | null>(null)
  const [productCategoryList, setProductCategoryList] = useState<IManyResult<IProductCategory>>()
  const [productBrandList, setProductBrandList] = useState<IManyResult<IBrand>>()
  const [productTagList, setProductTagList] = useState<IManyResult<string>>()

  const getProductById = async (id: string) => {
    setLoading(true)

    const productData = await getProduct(id)

    if (!productData.data) {
      toast.error(productData.error?.message || dictionary.messageNotification.apiMessageNotification.error.common)
      setLoading(false)

      return
    }

    setProduct(productData.data.data)

    await initOtherData()
  }

  const initOtherData = async () => {
    setLoading(true)

    try {
      const [categoriesResponse, brandsResponse, tagsResponse] = await Promise.all([
        getProductCategoryList(),
        getBrandList(),
        getProductTags()
      ])

      if (!categoriesResponse.data || !brandsResponse.data || !tagsResponse.data) {
        toast.error(dictionary.messageNotification.apiMessageNotification.error.common)

        return
      }

      setProductCategoryList(categoriesResponse.data)
      setProductBrandList(brandsResponse.data)
      setProductTagList(tagsResponse.data)
      setLoading(false)
    } catch (error: any) {
      toast.error(error || dictionary.messageNotification.apiMessageNotification.error.common)
    }
  }

  useEffect(() => {
    if (id) {
      setIsEdit(true)
      getProductById(id)
    } else {
      initOtherData()
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

  if (loading) {
    return <CreateOrEditProductLoadingBox />
  }

  if (isEdit && !product) {
    return <NotFound mode={mode} />
  }

  return (
    <FormProvider {...createOrUpdateProductForm}>
      <form onSubmit={createOrUpdateProductForm.handleSubmit(onSubmit, onError)}>
        <Grid container spacing={6}>
          <Grid item xs={9}>
            <GeneralInfoProduct />
            <ProductDescriptionBox />
            <PriceProduct />
          </Grid>
          <Grid item xs={3}>
            {/* <AdditionalProductBox
              productCategoryList={productCategoryList.productCategories}
              productTagList={productTagList.productTags}
              brandList={productBrandList.brands}
            /> */}
            {/* <ImageProductBox /> */}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {/* {productType === ProductType.GroupedProduct && <ProductAttributeCombinationBox />} */}
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

export default AddOrEditProduct
