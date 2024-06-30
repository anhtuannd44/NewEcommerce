import { Alert, Backdrop, CircularProgress, Grid, Snackbar } from '@mui/material'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { getBrandList, getProductAdmin, getProductCategoryListAdmin, getProductTagsAdmin, createProductAdmin } from 'src/api/services/product'
import {
  IcreateOrUpdateProductAdminRequest,
  IProductAdmin,
  IProductGeneralControl,
  IProductCategoryAdmin,
  IProductAttributeCombinationControls,
  IProductAttributeCombination,
  IProductAttributeCombinationValidateControls,
  IProductAttributeControl,
  IProductAttribute,
  IProductAttributeValidateControl
} from 'src/redux/admin/interface/IProductAdmin'
import { AppDispatch, RootState } from 'src/redux/store'
import CreateOrEditLoadingBox from 'src/views/admin/loading-box/CreateOrEditLoadingBox'
import GeneralInfoProduct from './GeneralInfoProduct'
import PriceProduct from './PriceProduct'
import AdditionalProductBox from './AdditionalProductBox'
import ImageProductBox from './ImageProductBox'
import DescriptionBox from './DescriptionBox'
import BodyContentBox from './BodyContentBox'
import { IValidationResult, checkValidity } from 'src/utils/utility'
import {
  resetAll,
  resetMessage,
  updateIsSubmittedCreateEditProductAdmin,
  updateProductAttributeCombinationControl,
  updateProductAttributeControl,
  updateProductControl,
  validateProductAtributeCombinations
} from 'src/redux/admin/slice/productAdminSlice'
import { IMessageCommon } from 'src/redux/admin/interface/ICommon'
import { MessageType, ProductType } from 'src/common/enums'
import ProductAttributeCombinationBox from './price/product-attribute-combination/ProductAttributeCombinationBox'

interface ICreateOrUpdateProductPageProps {
  id?: string
  isUpdate: boolean
  createOrUpdateProductAdminRequest: IcreateOrUpdateProductAdminRequest
  productGeneralControl: IProductGeneralControl
  productAttributeCombinationControl: IProductAttributeCombinationControls[]
  productAttributeControl: IProductAttributeControl[]
  productCategoryList: IProductCategoryAdmin[]
  message: IMessageCommon
  getProductAdmin: (id: string) => void
  getProductCategoryListAdmin: () => void
  getProductTagsAdmin: () => void
  getBrandList: () => void
  createProductAdmin: (product: IProductAdmin) => void
  updateProductControl: (field: keyof IProductGeneralControl, value: IValidationResult) => void
  updateProductAttributeCombinationControl: (newProdAttrCombControl: IProductAttributeCombinationControls[]) => void
  updateProductAttributeControl: (newProdAttrControl: IProductAttributeControl[]) => void
  resetMessage: () => void
  updateIsSubmittedCreateEditProductAdmin: (isSubmitted: boolean) => void
  resetAll: () => void
}

const CreateOrUpdateProductPage = (props: ICreateOrUpdateProductPageProps) => {
  const {
    id,
    isUpdate,
    createOrUpdateProductAdminRequest,
    productGeneralControl,
    productAttributeCombinationControl,
    productAttributeControl,
    message,
    getProductAdmin,
    getProductCategoryListAdmin,
    getProductTagsAdmin,
    getBrandList,
    createProductAdmin,
    updateProductControl,
    updateProductAttributeCombinationControl,
    updateProductAttributeControl,
    resetMessage,
    updateIsSubmittedCreateEditProductAdmin,
    resetAll
  } = props
  const { product, isValid, isLoading, isSubmitted, isSuccess } = createOrUpdateProductAdminRequest

  useEffect(() => {
    resetAll()
    getProductCategoryListAdmin()
    getProductTagsAdmin()
    getBrandList()
    if (isUpdate && id) {
      getProductAdmin(id)
    }
  }, [])

  const handleValidateProductAttribute = (controls: IProductAttributeControl[], currentProAttrList: IProductAttribute[]): boolean => {
    const currentProductAttribute = [...currentProAttrList]

    let currentProAttrControls = [...controls]
    let isValid = true

    if (currentProductAttribute.length > 0) {
      for (const currentProAttr of currentProductAttribute) {
        const control = currentProAttrControls.find(x => x.id === currentProAttr.id)?.validate
        if (control) {
          for (const field in control) {
            const rules = control[field as keyof IProductAttributeValidateControl].validation
            if (currentProAttr) {
              const validationRs = checkValidity(currentProAttr[field as keyof IProductAttribute], rules)
              currentProAttrControls = currentProAttrControls.map(x => {
                if (x.id === currentProAttr.id) {
                  return {
                    ...x,
                    validate: {
                      ...x.validate,
                      [field]: {
                        ...x.validate[field as keyof IProductAttributeValidateControl],
                        result: validationRs
                      }
                    }
                  }
                }
                return x
              })

              if (!validationRs.isValid) {
                isValid = false
              }
            }
          }
        }
      }
    }

    if (currentProAttrControls.length > 0) {
      updateProductAttributeControl(currentProAttrControls)
    }
    return isValid
  }

  const handleValidateProductGeneralField = (controls: IProductGeneralControl, currentProduct: IProductAdmin): boolean => {
    let isValid = true

    for (const item in productGeneralControl) {
      const field = item as keyof IProductGeneralControl
      const validationRs = checkValidity(currentProduct[field], controls[field].validation)
      updateProductControl(field, validationRs)

      if (!validationRs.isValid) {
        isValid = false
      }
    }

    return isValid
  }

  const handleCreateProductAdminSubmit = () => {
    const currentProductGeneralControl = { ...productGeneralControl }
    const currentProAttrCombControl = [...productAttributeCombinationControl]
    const currentProAttrControl = [...productAttributeControl]
    const currentProduct = { ...product }

    updateIsSubmittedCreateEditProductAdmin(true)

    let isAllValid = true

    isAllValid = handleValidateProductGeneralField(currentProductGeneralControl, currentProduct)

    if (currentProduct.productType === ProductType.GroupedProduct) {
      if (!handleValidateProductAttribute(currentProAttrControl, currentProduct.productAttributes)) {
        isAllValid = false
      }
      const { isValid, controls } = validateProductAtributeCombinations(currentProduct.productAttributeCombinations, currentProAttrCombControl)
      updateProductAttributeCombinationControl(controls || [])
      if (!isValid) {
        isAllValid = false
      }
    }

    if (isAllValid) {
      createProductAdmin(currentProduct)
    }
  }

  const handleCloseSnackbar = () => {
    resetMessage()
  }

  if (isUpdate && product.id) {
    return <CreateOrEditLoadingBox />
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={9}>
          <GeneralInfoProduct handleCreateProductAdminSubmit={handleCreateProductAdminSubmit} />
          <DescriptionBox />
          <PriceProduct />
        </Grid>
        <Grid item xs={3}>
          <AdditionalProductBox />
          <ImageProductBox />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {product.productType === ProductType.GroupedProduct && <ProductAttributeCombinationBox />}
        <BodyContentBox />
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          {/* <ProductSelectionBox /> */}
        </Grid>
      </Grid>
      <Backdrop sx={{ color: '#fff', zIndex: 99999 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Snackbar
        sx={{ zIndex: 9999 }}
        open={Boolean(message?.text)}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => {
          handleCloseSnackbar()
        }}>
        <Alert
          onClose={() => {
            handleCloseSnackbar()
          }}
          severity={message.type === MessageType.Success ? 'success' : message.type === MessageType.Error ? 'error' : 'warning'}
          variant='filled'
          sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  createOrUpdateProductAdminRequest: state.productAdmin.createOrUpdateProductAdminRequest,
  productGeneralControl: state.productAdmin.controls.createEditProductAdminControls.productGeneralControl,
  productAttributeCombinationControl: state.productAdmin.controls.createEditProductAdminControls.productAttributeCombinationControls || [],
  productAttributeControl: state.productAdmin.controls.createEditProductAdminControls.productAttributeControls || [],
  productCategoryList: state.productAdmin.productCategoryList,
  message: state.productAdmin.message
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  getProductAdmin: (id: string) => dispatch(getProductAdmin(id)),
  getProductCategoryListAdmin: () => dispatch(getProductCategoryListAdmin()),
  getBrandList: () => dispatch(getBrandList()),
  getProductTagsAdmin: () => dispatch(getProductTagsAdmin()),
  updateProductControl: (field: keyof IProductGeneralControl, value: IValidationResult) => dispatch(updateProductControl({ field, value })),
  updateProductAttributeCombinationControl: (newProdAttrCombControl: IProductAttributeCombinationControls[]) => dispatch(updateProductAttributeCombinationControl(newProdAttrCombControl)),
  updateProductAttributeControl: (newProdAttrControl: IProductAttributeControl[]) => dispatch(updateProductAttributeControl(newProdAttrControl)),
  resetMessage: () => dispatch(resetMessage()),
  updateIsSubmittedCreateEditProductAdmin: (isSubmitted: boolean) => dispatch(updateIsSubmittedCreateEditProductAdmin(isSubmitted)),
  createProductAdmin: (product: IProductAdmin) => dispatch(createProductAdmin(product)),
  resetAll: () => dispatch(resetAll())
})
export default connect(mapStateToProps, mapDispatchToProps)(CreateOrUpdateProductPage)
