'use client'

import { useEffect, useState } from 'react'

import { Grid } from '@mui/material'

import type { FieldErrors } from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// import { createOrUpdateProductSchema } from 'src/form/admin/product/scheme/createOrUpdateProductSchema'

import { toast } from 'react-toastify'

import type { Mode } from '@core/types'

// import AdditionalProductBox from './AdditionalProductBox'

import type { IProductCategory } from '@/interface/admin/product/IProductCategory'
import type { IBrand } from '@/interface/admin/product/IBrand'

import { getBrandList, getProduct, getProductCategoryList, getProductTags } from '@/services/admin/product'
import type { getDictionary } from '@/utils/getDictionary'
import CreateOrEditProductLoadingBox from './CreateOrEditLoadingBox'
import type { IManyResult } from '@/interface/api-base/IManyResult'
import type { IProduct } from '@/interface/admin/product/IProduct'
import { createOrUpdateProductSchema } from '@/form/admin/product/schema/createOrUpdateProductSchema'
import { initProductDefaultValue } from '@/form/admin/product/default-value/productDefaultValue'
import NotFound from '@/views/NotFound'

interface IEditProductProps {
  id?: string
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  mode: Mode
}

const AddOrEditEditProduct = (props: IEditProductProps) => {
  const { id, dictionary, mode } = props

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
        throw new Error(dictionary.messageNotification.apiMessageNotification.error.common)
      }

      setProductCategoryList(categoriesResponse.data)
      setProductBrandList(brandsResponse.data)
      setProductTagList(tagsResponse.data)
      setLoading(true)
    } catch (error: any) {
      toast.error(dictionary.messageNotification.apiMessageNotification.error.common)
    } finally {
      setLoading(false)
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

  if (id && !product) {
    return <NotFound mode={mode} />
  }

  return (
    <FormProvider {...createOrUpdateProductForm}>
      <form onSubmit={createOrUpdateProductForm.handleSubmit(onSubmit, onError)}>
        <Grid container spacing={6}>
          <Grid item xs={9}>
            {/* <GeneralInfoProduct />
            <DescriptionBox />
            <PriceProduct /> */}
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

export default AddOrEditEditProduct
