import _ from 'lodash'
import { Draft, createSlice } from '@reduxjs/toolkit'
import { IOrderAdminState, IOrderRequestBody, IOrderRequestBodyControl, IOrderRequestBodyItemControl, IOrderRequestBodyItemControls, IProductItemRequestBody } from '../interface/IOrderAdmin'
import { DiscountType, MessageType, OrderStatus } from 'src/common/enums'
import { checkValidity } from 'src/utils/utility'
import { SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT } from 'src/common/constants'
import { IUser } from '../interface/IAdminGeneralState'

export const initOrderRequestItemControls: IOrderRequestBodyItemControl = {
  price: {
    validation: {
      required: true,
      isNumeric: true,
      minNumber: 0
    },
    result: {
      isValid: true
    }
  },
  preTotal: {
    validation: {
      required: false,
      isNumeric: true,
      minNumber: 0
    },
    result: {
      isValid: true
    }
  },
  totalPriceAfterDiscount: {
    validation: {
      required: false,
      isNumeric: true,
      minNumber: 0
    },
    result: {
      isValid: true
    }
  },
  quantity: {
    validation: {
      required: false,
      isNumeric: true,
      minNumber: 1
    },
    result: {
      isValid: true
    }
  },
  discountType: {
    validation: {
      required: true
    },
    result: {
      isValid: true
    }
  },
  discountValue: {
    validation: {
      required: true
    },
    result: {
      isValid: true
    }
  }
}

export const initialOrderRequestBodyControl: IOrderRequestBodyControl = {
  customerId: {
    validation: {
      required: true
    },
    result: {
      isValid: true
    }
  },
  orderCode: {
    validation: {
      required: false
    },
    result: {
      isValid: true
    }
  },
  deliveryAddress: {
    validation: {
      required: true
    },
    result: {
      isValid: true
    }
  },
  billingAddress: {
    validation: {
      required: true
    },
    result: {
      isValid: true
    }
  },
  picStaffId: {
    validation: {
      required: true
    },
    result: {
      isValid: true
    }
  },
  dateDelivery: {
    validation: {
      required: true
    },
    result: {
      isValid: true
    }
  },
  constructionStaffIds: {
    validation: {
      required: true
    },
    result: {
      isValid: true
    }
  },
  preTotal: {
    validation: {
      required: true,
      isNumeric: true,
      minNumber: 0
    },
    result: {
      isValid: true
    }
  },
  totalPriceAfterDiscount: {
    validation: {
      required: true,
      isNumeric: true,
      minNumber: 0
    },
    result: {
      isValid: true
    }
  },
  shippingFee: {
    validation: {
      required: false,
      isNumeric: true,
      minNumber: 0
    },
    result: {
      isValid: true
    }
  },
  discountType: {
    validation: {
      required: true
    },
    result: {
      isValid: true
    }
  },
  discountValue: {
    validation: {
      required: false,
      isNumeric: true,
      minNumber: 0
    },
    result: {
      isValid: true
    }
  }
}

const initialOrderAdminState: IOrderAdminState = {
  orderRequest: {
    customerId: '',
    orderCode: '',
    deliveryAddress: '',
    billingAddress: '',
    picStaffId: '',
    dateDelivery: null,
    constructionStaffIds: [],
    preTotal: 0,
    totalPriceAfterDiscount: 0,
    shippingFee: 0,
    orderAttributeId: null,
    orderOriginId: null,
    discountType: DiscountType.Value,
    discountValue: 0,
    discountNote: '',
    deposit: 0,
    note: '',
    isComplain: false,
    problem: '',
    rootCause: '',
    solution: '',
    responsibleStaffIds: [],
    tags: [],
    status: OrderStatus.Processing,
    items: undefined
  },
  controls: {
    order: initialOrderRequestBodyControl
  },
  isLoading: false,
  isSubmitted: false,
  isSuccess: false,
  id: '',
  message: {
    type: MessageType.Success,
    text: ''
  }
}

const handleCalculateTotal = (orderRequestBodyState: IOrderRequestBody) => {
  const orderRequestBody = { ...orderRequestBodyState }
  const orderProductData = orderRequestBody.items ? [...orderRequestBody.items] : []
  let preTotal = 0
  let calVat = 0
  let total = 0
  const calProductList: string[] = []
  orderProductData.map(item => {
    preTotal += item.totalPriceAfterDiscount
    if (item.isVat) {
      calVat += (item.totalPriceAfterDiscount / 100) * 8
      calProductList.push(item.name)
    }
  })
  total = preTotal + calVat

  if (orderRequestBody.discountValue > 0 && total > 0) {
    const newDiscountValue = orderRequestBody.discountType === DiscountType.Value ? orderRequestBody.discountValue : (total / 100) * orderRequestBody.discountValue
    total = total - newDiscountValue
  }
  if (orderRequestBody.shippingFee && orderRequestBody.shippingFee && orderRequestBody.shippingFee > 0) {
    total += orderRequestBody.shippingFee
  }

  if (orderRequestBody.deposit) {
    total -= orderRequestBody.deposit
  }

  return { ...orderRequestBody, preTotal: preTotal, totalPriceAfterDiscount: total }
}

export const handleValidateOrderItems = (productItems: IProductItemRequestBody[] | undefined, productControls: IOrderRequestBodyItemControls[] | undefined) => {
  const itemsControls = _.cloneDeep(productControls)
  let isValid = true
  if (productItems && itemsControls && itemsControls.length > 0 && productControls && productControls.length > 0) {
    for (const itemControl of productControls) {
      const productItem = productItems.find(x => x.productId === itemControl.productId)
      if (productItem) {
        for (const field in itemControl.controls) {
          _.forEach(itemsControls, x => {
            if (x.productId === productItem.productId) {
              const result = checkValidity(productItem[field as keyof IProductItemRequestBody], itemControl.controls[field as keyof IOrderRequestBodyItemControl].validation)
              x.controls[field as keyof IOrderRequestBodyItemControl].result = result

              if (!result.isValid) {
                isValid = false
              }
            }
          })
        }
      }
    }
  }
  return { isValid, itemsControls }
}

export const handleValidateOrderBody = (order: IOrderRequestBody, control: IOrderRequestBodyControl) => {
  const controlReturn = _.cloneDeep(control)
  let isValid = true
  for (const field in control) {
    const result = checkValidity(order[field as keyof IOrderRequestBody], control[field as keyof IOrderRequestBodyControl].validation)
    controlReturn[field as keyof IOrderRequestBodyControl].result = result

    if (!result.isValid) {
      isValid = false
    }
  }
  return { isValid, controlReturn }
}

const orderAdminSlice = createSlice({
  name: 'OrderAdminSlice',
  initialState: initialOrderAdminState,
  reducers: {
    updateGeneralField: (state, action: { payload: { field: keyof IOrderRequestBody; value: string | string[] | boolean | number | DiscountType | IUser[] } }) => {
      const order = { ...state.orderRequest } as any
      const { field } = action.payload
      order[field] = action.payload.value
      state.orderRequest = handleCalculateTotal(order)

      if (field in state.controls.order) {
        state.controls.order[field as keyof Draft<IOrderRequestBodyControl>].result = checkValidity(
          action.payload.value,
          state.controls.order[field as keyof Draft<IOrderRequestBodyControl>].validation
        )
      }
    },
    updateCustomerSelected: (state, action) => {
      const user: IUser | null = action.payload
      state.orderRequest.customerId = user?.id || null
      if (user) {
        state.orderRequest.deliveryAddress = user.address
        state.orderRequest.billingAddress = user.address
      }
    },
    updateOrderItemControls: (state, action) => {
      state.controls.product = action.payload
    },
    updateOrderBodyControls: (state, action) => {
      state.controls.order = action.payload
    },
    updateRequestItems: (state, action) => {
      const currentRequest = _.cloneDeep(state.orderRequest)
      currentRequest.items = action.payload
      state.orderRequest = handleCalculateTotal(currentRequest)

      const productItems = _.cloneDeep(state.orderRequest.items)
      const validateResult = handleValidateOrderItems(productItems, state.controls.product)
      state.controls.product = validateResult.itemsControls
    },
    updateDateDelivery: (state, action) => {
      state.orderRequest.dateDelivery = action.payload
    },
    updateOrderAttribute: (state, action) => {
      state.orderRequest.orderAttributeId = action.payload.id
      state.orderRequest.isComplain = action.payload.isComplain
    },
    updateResponseibleStaffIds: (state, action) => {
      state.orderRequest.responsibleStaffIds = action.payload
    },
    updateShippingFee: (state, action) => {
      const currentRequestBodyState = { ...state.orderRequest }
      currentRequestBodyState.shippingFee = action.payload
      state.orderRequest = handleCalculateTotal(currentRequestBodyState)
    },
    setSubmitted: state => {
      state.isSubmitted = true
    },
    handlePushMessageSnackbar: (state, action) => {
      state.message = action.payload
    },
    resetMessage: state => {
      state.message.text = ''
    }
  },
  extraReducers: builder => {
    builder
  }
})

export const {
  updateGeneralField,
  updateCustomerSelected,
  updateRequestItems,
  updateOrderItemControls,
  updateOrderBodyControls,
  updateDateDelivery,
  updateOrderAttribute,
  updateShippingFee,
  updateResponseibleStaffIds,
  handlePushMessageSnackbar,
  resetMessage,
  setSubmitted
} = orderAdminSlice.actions

const orderAdminReducer = orderAdminSlice.reducer

export default orderAdminReducer
