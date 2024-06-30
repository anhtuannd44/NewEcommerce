'use client'
import { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { useForm, FormProvider, FieldErrors } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createFilterOptions, Grid } from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import { IOrderAdminState, IOrderRequestBodyControl, IOrderRequestBodyItemControls } from 'src/redux/admin/interface/IOrderAdmin'
import { createOrUpdateOrder, getOrderAttributeList, getOrderOriginList, getOrderTagList, getProductList, getUserList } from 'src/services/order'
import { AppDispatch, RootState } from 'src/redux/store'
import { handleValidateOrderBody, handleValidateOrderItems, updateOrderBodyControls, updateOrderItemControls } from 'src/redux/admin/slice/orderAdminSlice'
import AdditionalInfoBox from 'src/views/admin/order/create-order/AdditionalInfoBox'
import CustomerSelectBox from 'src/views/admin/order/create-order/CustomerSelectBox'
import ProductSelectionBox from 'src/views/admin/order/create-order/ProductSelectionBox'
import CreateOrEditLoadingBox from 'src/views/admin/loading-box/CreateOrEditLoadingBox'
import { IOrderAttributeList, IOrderOriginList, IOrderTagList, IProductList, IUser, IUserList } from 'src/redux/admin/interface/IAdminGeneralState'
import _ from 'lodash'
import { orderRequestSchema } from 'src/form/admin/order/orderRequest'
import { IOrderRequestBody } from 'src/form/admin/interface/IOrderRequest'

interface ICreateOrUpdateOrderAdminProps {
  userList: IUserList
  productList: IProductList
  orderAttributeList: IOrderAttributeList
  orderOriginList: IOrderOriginList
  orderTagList: IOrderTagList
  orderAdmin: IOrderAdminState
  getProductList: () => void
  getUserList: () => void
  getOrderAttributeList: () => void
  getOrderOriginList: () => void
  getOrderTagList: () => void
  updateOrderItemControls: (controls: IOrderRequestBodyItemControls[]) => void
  updateOrderBodyControls: (control: IOrderRequestBodyControl) => void
  createOrUpdateOrder: (order: IOrderRequestBody) => void
}

const CreateOrUpdateOrderAdmin = (props: ICreateOrUpdateOrderAdminProps) => {
  const {
    userList,
    productList,
    orderAttributeList,
    orderOriginList,
    orderTagList,
    orderAdmin,
    getProductList,
    getUserList,
    updateOrderItemControls,
    updateOrderBodyControls,
    getOrderAttributeList,
    getOrderOriginList,
    getOrderTagList,
    createOrUpdateOrder
  } = props

  useEffect(() => {
    if (!userList.users) {
      getUserList()
    }
    if (!productList.products) {
      getProductList()
    }
    if (!orderAttributeList.orderAttributes) {
      getOrderAttributeList()
    }
    if (!orderOriginList.orderOrigins) {
      getOrderOriginList()
    }
    if (!orderTagList.orderTags) {
      getOrderTagList()
    }
  }, [])

  const createOrderForm = useForm<IOrderRequestBody>({
    resolver: yupResolver<IOrderRequestBody>(orderRequestSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    progressive: true
  })

  const filterUserOptions = createFilterOptions({ ignoreAccents: false, stringify: (option: IUser) => `${option.fullName} ${option.phoneNumber}` })

  const onSubmit = (data: IOrderRequestBody) => {
    // console.log('data', data)
    createOrUpdateOrder(data)
    const currentOrderState = _.cloneDeep(orderAdmin)

    let isAllValid = true

    const validateOrderBody = handleValidateOrderBody(currentOrderState.orderRequest, currentOrderState.controls.order)

    isAllValid = validateOrderBody.isValid
    updateOrderBodyControls(validateOrderBody.controlReturn)

    if (currentOrderState.orderRequest.items && currentOrderState.orderRequest.items.length > 0) {
      const validateOrderItems = handleValidateOrderItems(currentOrderState.orderRequest.items, currentOrderState.controls.product)
      isAllValid = validateOrderItems.isValid
      if (validateOrderItems.itemsControls) {
        updateOrderItemControls(validateOrderItems.itemsControls)
      }
    } else {
      isAllValid = false
    }

    if (isAllValid) {
      // createOrUpdateOrder(currentOrderState.orderRequest)
    }
  }

  const onError = (errors: FieldErrors<IOrderRequestBody>) => {
    console.log(createOrderForm.getValues())
    console.log('Validation Errors:', errors)
  }

  if (!(userList.users && productList.products && orderAttributeList.orderAttributes)) {
    return <CreateOrEditLoadingBox />
  }

  return (
    <FormProvider {...createOrderForm}>
      <form onSubmit={createOrderForm.handleSubmit(onSubmit, onError)}>
        <Grid container spacing={6}>
          <Grid item xs={9}>
            <CustomerSelectBox filterUserOptions={filterUserOptions} />
          </Grid>
          <Grid item xs={3}>
            <AdditionalInfoBox filterUserOptions={filterUserOptions} />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <ProductSelectionBox />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

const mapStateToProps = (state: RootState) => ({
  orderAdmin: state.orderAdmin,
  userList: state.adminGeneral.userList,
  productList: state.adminGeneral.productList,
  orderOriginList: state.adminGeneral.orderOriginList,
  orderTagList: state.adminGeneral.orderTagList,
  orderAttributeList: state.adminGeneral.orderAttributeList
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  getUserList: () => dispatch(getUserList()),
  getProductList: () => dispatch(getProductList()),
  getOrderAttributeList: () => dispatch(getOrderAttributeList()),
  getOrderOriginList: () => dispatch(getOrderOriginList()),
  getOrderTagList: () => dispatch(getOrderTagList()),
  updateOrderItemControls: (controls: IOrderRequestBodyItemControls[]) => dispatch(updateOrderItemControls(controls)),
  updateOrderBodyControls: (control: IOrderRequestBodyControl) => dispatch(updateOrderBodyControls(control)),
  createOrUpdateOrder: (order: IOrderRequestBody) => dispatch(createOrUpdateOrder(order))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrUpdateOrderAdmin)
