import { Draft, createSlice } from '@reduxjs/toolkit'
import {
  IAttributeJson,
  ICreateOrUpdateProductCategoryRequest,
  IProductGeneralControl,
  IProductAdminState,
  IProductAttribute,
  IProductAttributeCombination,
  IProductAttributeCombinationControls,
  IProductAttributeCombinationValidateControls,
  IProductAttributeControl,
  IProductAttributeValidateControl,
  IProductAdmin,
  ICreateOrUpdateBrandRequest
} from '../interface/IProductAdmin'
import { createOrUpdateBrand, createProductAdmin, createProductCategory, getBrandList, getProductAdmin, getProductCategoryListAdmin, getProductTagsAdmin } from 'src/services/product'
import { MessageType, ProductStatus, ProductType } from 'src/common/enums'
import { IValidationResult, checkValidity } from 'src/utils/utility'
import { SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT } from 'src/common/constants'
import { v4 as uuidv4 } from 'uuid'

export const initialCreateProductCategoryState: ICreateOrUpdateProductCategoryRequest = {
  category: {
    name: '',
    seoUrl: '',
    shortDescription: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: ''
  },
  submitted: false,
  loading: false,
  isSuccess: false
}

const initProductAttributeId = uuidv4()

const productGeneralControl: IProductGeneralControl = {
  name: {
    validation: {
      required: true
    },
    result: {
      isValid: true,
      errorMessage: ''
    }
  },
  sku: {
    validation: {
      required: true
    },
    result: {
      isValid: true,
      errorMessage: ''
    }
  },
  price: {
    validation: {
      isNumeric: true,
      minNumber: 0
    },
    result: {
      isValid: true,
      errorMessage: ''
    }
  },
  unit: {
    validation: {
      required: true
    },
    result: {
      isValid: true,
      errorMessage: ''
    }
  },
  stockQuantity: {
    validation: {
      isNumeric: true,
      minNumber: 0
    },
    result: {
      isValid: true,
      errorMessage: ''
    }
  }
}

const initProductAttribute: IProductAttribute = {
  id: initProductAttributeId,
  name: '',
  productAttributeValues: []
}

const initCreateOrUpdateBrand: ICreateOrUpdateBrandRequest = {
  brand: {
    id: null,
    name: ''
  },
  isLoading: false,
  isSubmitted: false,
  isSuccess: false
}

export const initProductAttributeControl: IProductAttributeControl = {
  id: initProductAttributeId,
  validate: {
    name: {
      validation: {
        required: true
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    },
    productAttributeValues: {
      validation: {
        required: true
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    }
  }
}

const productAttributeCombinationControls: IProductAttributeCombinationControls = {
  id: '',
  validate: {
    sku: {
      validation: {
        required: true
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    },
    barCode: {
      validation: {
        required: true
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    },
    price: {
      validation: {
        required: false,
        isNumeric: true,
        minNumber: 0
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    },
    stockQuantity: {
      validation: {
        required: false,
        isNumeric: true,
        minNumber: 0
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    },
    productCost: {
      validation: {
        required: false,
        isNumeric: true,
        minNumber: 0
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    }
  }
}

const initialState: IProductAdminState = {
  createOrUpdateProductAdminRequest: {
    product: {
      name: '',
      body: '',
      shortDescription: '',
      allowComments: true,
      metaTitle: '',
      metaKeywords: '',
      metaDescription: '',
      unit: '',
      seoUrl: '',
      status: ProductStatus.Drafted,
      tags: [],
      productType: ProductType.SimpleProduct,
      allowCustomerReviews: true,
      sku: '',
      manageStockQuantity: false,
      stockQuantity: null,
      callForPrice: false,
      price: null,
      oldPrice: null,
      productCost: null,
      productCategoryId: null,
      brandId: null,
      mainPicture: {
        fileId: null,
        virtualPath: ''
      },
      album: [],
      productAttributes: [initProductAttribute],
      productAttributeCombinations: []
    },
    isLoading: false,
    isSubmitted: false,
    isValid: false,
    isSuccess: false
  },
  controls: {
    createEditProductAdminControls: {
      productGeneralControl: productGeneralControl,
      productAttributeControls: [initProductAttributeControl]
    }
  },
  productCategoryList: [],
  productTags: [],
  brandList: [],
  createOrUpdateProductCategoryRequest: initialCreateProductCategoryState,
  createOrUpdateBrandRequest: initCreateOrUpdateBrand,
  isInitRequestSent: false,
  valid: false,
  submitted: false,
  message: {
    type: MessageType.Success,
    text: ''
  }
}

const generateProductAttributeCombinations = (attributes: Draft<IProductAttribute[]>, productSku: string) => {
  const attributeHasValues = ([...attributes] as IProductAttribute[]).filter(x => x.productAttributeValues.length > 0)
  if (attributeHasValues.length <= 0) {
    return { combinationReturn: [], combinationControlsReturn: [] }
  }
  const combinationsResult = attributeHasValues.reduce(
    (acc, attribute) => {
      const combinations: IAttributeJson[][] = []
      acc.forEach(existingCombination => {
        attribute.productAttributeValues.forEach(value => {
          combinations.push([
            ...existingCombination,
            {
              productAttributeId: attribute.id,
              productAttributeValue: value
            }
          ])
        })
      })
      return combinations
    },
    [[]] as IAttributeJson[][]
  )

  const combinationControlsReturn: IProductAttributeCombinationControls[] = []

  const combinationReturn = combinationsResult.map((combination, index) => {
    const id = uuidv4()
    const name = combination.map(attr => attr.productAttributeValue).join(' - ')
    combinationControlsReturn.push({ ...productAttributeCombinationControls, id })
    const result: IProductAttributeCombination = {
      id,
      sku: productSku ? `${productSku}-${index}` : '',
      barCode: '',
      price: null,
      stockQuantity: null,
      productCost: null,
      attributeJson: combination,
      name
    }
    return result
  })

  return { combinationReturn, combinationControlsReturn }
}

export const validateProductAtributeCombinations = (values: IProductAttributeCombination[], controls: IProductAttributeCombinationControls[] | undefined) => {
  let isValid = true

  const controlUpdate = controls?.map(control => {
    const value = values.find(value => control.id === value.id)
    if (value) {
      let updateControlValidate = { ...control.validate }
      for (const field in control.validate) {
        const result = checkValidity(value[field as keyof IProductAttributeCombination], control.validate[field as keyof IProductAttributeCombinationValidateControls].validation)

        updateControlValidate = {
          ...updateControlValidate,
          [field]: {
            ...updateControlValidate[field as keyof IProductAttributeCombinationValidateControls],
            result: result
          }
        }

        if (!result) {
          isValid = false
        }
      }
      return {
        ...control,
        validate: updateControlValidate
      }
    }
    return control
  })
  return { isValid, controls: controlUpdate }
}

const productAdminSlice = createSlice({
  name: 'ProductAdminSlice',
  initialState,
  reducers: {
    resetAll: state => {
      state = initialState
    },
    updateGeneralField: (state, action: { payload: { field: keyof IProductAdmin; value: any } }) => {
      const product = { ...state.createOrUpdateProductAdminRequest.product } as any
      const { field } = action.payload
      product[field] = action.payload.value
      state.createOrUpdateProductAdminRequest.product = product

      if (field in state.controls.createEditProductAdminControls.productGeneralControl) {
        const fieldCheck = action.payload.field as keyof Draft<IProductGeneralControl>
        state.controls.createEditProductAdminControls.productGeneralControl[fieldCheck].result = checkValidity(
          action.payload.value,
          state.controls.createEditProductAdminControls.productGeneralControl[fieldCheck].validation
        )
      }
    },
    updateProductTags: (state, action) => {
      state.createOrUpdateProductAdminRequest.product.tags = action.payload
    },
    updateMainPicture: (state, action) => {
      state.createOrUpdateProductAdminRequest.product.mainPicture = action.payload
    },
    updateProductType: (state, action) => {
      const productType = action.payload as ProductType
      state.createOrUpdateProductAdminRequest.product.productType = productType

      if (productType === ProductType.GroupedProduct) {
        // Reset Price if Group Product
        state.createOrUpdateProductAdminRequest.product.price = null
      } else {
        // Reset Attribute if Single Product
        state.createOrUpdateProductAdminRequest.product.productAttributes = [initProductAttribute]
        state.controls.createEditProductAdminControls.productAttributeControls = [initProductAttributeControl]
        state.createOrUpdateProductAdminRequest.product.productAttributeCombinations = []
        state.controls.createEditProductAdminControls.productAttributeCombinationControls = undefined
      }
    },
    updateAlbum: (state, action) => {
      state.createOrUpdateProductAdminRequest.product.album = action.payload
    },
    updateProductCategoryBody: (state, action) => {
      state.createOrUpdateProductCategoryRequest.category = action.payload
    },
    resetCreateProductCategoryState: state => {
      state.createOrUpdateProductCategoryRequest = initialCreateProductCategoryState
    },
    handleSubmitCreateProductCategory: state => {
      state.createOrUpdateProductCategoryRequest.submitted = true
    },
    resetMessage: state => {
      state.message.text = ''
    },
    updateProductControl: (state, action: { payload: { field: keyof IProductGeneralControl; value: IValidationResult } }) => {
      const fieldCheck = action.payload.field as keyof Draft<IProductGeneralControl>
      state.controls.createEditProductAdminControls.productGeneralControl[fieldCheck].result = action.payload.value
    },
    updateIsSubmittedCreateEditProductAdmin: (state, action) => {
      state.createOrUpdateProductAdminRequest.isSubmitted = action.payload
    },
    updateProductAttributes: (state, action) => {
      const { values, ignoreGenCombination } = action.payload
      state.createOrUpdateProductAdminRequest.product.productAttributes = values
      if (!ignoreGenCombination) {
        const { combinationReturn, combinationControlsReturn } = generateProductAttributeCombinations(values, state.createOrUpdateProductAdminRequest.product.sku)
        state.createOrUpdateProductAdminRequest.product.productAttributeCombinations = combinationReturn
        state.controls.createEditProductAdminControls.productAttributeCombinationControls = combinationControlsReturn
      }

      const currentState = values as Draft<IProductAttribute>[]
      const currentStateControls = state.controls.createEditProductAdminControls.productAttributeControls

      if (currentState.length > 0 && currentStateControls && currentStateControls.length > 0) {
        currentState.forEach(x => {
          const productAttr = currentStateControls.find(item => x.id === item.id)?.validate
          if (productAttr) {
            for (const field in productAttr) {
              const validateRs = checkValidity(x[field as keyof IProductAttribute], productAttr[field as keyof IProductAttributeValidateControl].validation)
              state.controls.createEditProductAdminControls.productAttributeControls?.forEach(item => {
                if (x.id === item.id) {
                  item.validate[field as keyof IProductAttributeValidateControl].result = validateRs
                }
              })
            }
          }
        })
      }
    },
    updateProductAttributeCombinationField: (state, action) => {
      const currentProAttrCom = [...state.createOrUpdateProductAdminRequest.product.productAttributeCombinations] as IProductAttributeCombination[]
      const currentProAttrComControls = [...(state.controls.createEditProductAdminControls.productAttributeCombinationControls || [])]
      const field = action.payload.field as keyof IProductAttributeCombination
      if (currentProAttrCom.length > 0) {
        const newState = currentProAttrCom.map(item => {
          if (item.id === action.payload.rowId) {
            return { ...item, [field]: action.payload.value }
          }
          return item
        })
        state.createOrUpdateProductAdminRequest.product.productAttributeCombinations = newState
        const { controls } = validateProductAtributeCombinations(newState, currentProAttrComControls)
        state.controls.createEditProductAdminControls.productAttributeCombinationControls = controls
      }
    },
    updateProductAttributeCombinationControl: (state, action) => {
      state.controls.createEditProductAdminControls.productAttributeCombinationControls = action.payload
    },
    updateProductAttributeControl: (state, action) => {
      state.controls.createEditProductAdminControls.productAttributeControls = action.payload
    },
    updateCreateOrUpdateBrandRequest: (state, action) => {
      state.createOrUpdateBrandRequest = action.payload
    },
    handleSubmitCreateOrUpdateBrand: state => {
      if (state.createOrUpdateBrandRequest) {
        state.createOrUpdateBrandRequest.isSubmitted = true
      }
    },
    handlePushMessageSnackbar: (state, action) => {
      state.message = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getProductAdmin.pending, state => {
        state.isInitRequestSent = true
      })
      .addCase(getProductAdmin.fulfilled, (state, action) => {
        state.createOrUpdateProductAdminRequest.product = action.payload
      })
      .addCase(getProductAdmin.rejected, state => {})
      .addCase(getProductCategoryListAdmin.pending, state => {
        state.isInitRequestSent = true
      })
      .addCase(getProductCategoryListAdmin.fulfilled, (state, action) => {
        state.productCategoryList = action.payload.data
      })
      .addCase(getProductCategoryListAdmin.rejected, state => {})
      .addCase(getProductTagsAdmin.pending, state => {
        state.isInitRequestSent = true
      })
      .addCase(getProductTagsAdmin.fulfilled, (state, action) => {
        state.productTags = action.payload
      })
      .addCase(getProductTagsAdmin.rejected, state => {})
      .addCase(getBrandList.pending, state => {
        state.isInitRequestSent = true
      })
      .addCase(getBrandList.fulfilled, (state, action) => {
        state.brandList = action.payload
      })
      .addCase(getBrandList.rejected, state => {})
      .addCase(createProductCategory.pending, state => {
        state.createOrUpdateProductCategoryRequest.submitted = true
        state.createOrUpdateProductCategoryRequest.loading = true
        state.createOrUpdateProductCategoryRequest.isSuccess = false
      })
      .addCase(createProductCategory.fulfilled, (state, action) => {
        state.productCategoryList.push(action.payload)
        state.createOrUpdateProductCategoryRequest.loading = false
        state.createOrUpdateProductCategoryRequest.isSuccess = true
        state.message.type = MessageType.Success
        state.message.text = action.payload.message || SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT
      })
      .addCase(createProductCategory.rejected, (state, action) => {
        state.createOrUpdateProductCategoryRequest.loading = false
        state.createOrUpdateProductCategoryRequest.isSuccess = false
        state.message.type = MessageType.Error
        state.message.text = action.payload as string
      })
      .addCase(createOrUpdateBrand.pending, state => {
        state.createOrUpdateBrandRequest.isSubmitted = true
        state.createOrUpdateBrandRequest.isLoading = true
        state.createOrUpdateBrandRequest.isSuccess = false
      })
      .addCase(createOrUpdateBrand.fulfilled, (state, action) => {
        const brandList = [...state.brandList]
        const index = brandList.findIndex(item => item.id === action.payload.id)

        if (index !== -1) {
          brandList[index] = { ...brandList[index], name: action.payload.name }
        } else {
          brandList.push(action.payload)
        }

        state.brandList = brandList
        state.createOrUpdateBrandRequest.isLoading = false
        state.createOrUpdateBrandRequest.isSuccess = true
        state.message.type = MessageType.Success
        state.message.text = action.payload.message || SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT
      })
      .addCase(createOrUpdateBrand.rejected, (state, action) => {
        state.createOrUpdateBrandRequest.isLoading = false
        state.createOrUpdateBrandRequest.isSuccess = false
        state.message.type = MessageType.Error
        state.message.text = action.payload as string
      })
      .addCase(createProductAdmin.pending, state => {
        state.createOrUpdateProductAdminRequest.isSubmitted = true
        state.createOrUpdateProductAdminRequest.isLoading = true
        state.createOrUpdateProductAdminRequest.isSuccess = false
      })
      .addCase(createProductAdmin.fulfilled, (state, action) => {
        state.createOrUpdateProductAdminRequest.isLoading = false
        state.createOrUpdateProductAdminRequest.isSuccess = true
        state.message.type = MessageType.Success
        state.message.text = action.payload?.message || SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT
      })
      .addCase(createProductAdmin.rejected, (state, action) => {
        state.createOrUpdateProductAdminRequest.isLoading = false
        state.createOrUpdateProductAdminRequest.isSuccess = false
        state.message.type = MessageType.Error
        state.message.text = action.payload as string
      })
  }
})

export const {
  resetAll,
  updateGeneralField,
  updateProductTags,
  updateMainPicture,
  updateAlbum,
  updateProductCategoryBody,
  updateProductControl,
  updateProductType,
  updateProductAttributeCombinationField,
  updateProductAttributeCombinationControl,
  updateProductAttributeControl,
  resetCreateProductCategoryState,
  handleSubmitCreateProductCategory,
  updateIsSubmittedCreateEditProductAdmin,
  resetMessage,
  updateProductAttributes,
  updateCreateOrUpdateBrandRequest,
  handleSubmitCreateOrUpdateBrand,
  handlePushMessageSnackbar
} = productAdminSlice.actions

const productAdminReducer = productAdminSlice.reducer

export default productAdminReducer
