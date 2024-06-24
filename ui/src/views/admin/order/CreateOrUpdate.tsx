'use client'
import { FormEvent, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useForm, FormProvider, FieldErrors } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, createFilterOptions, Grid, Snackbar } from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import { IOrderAdminState, IOrderRequestBodyControl, IOrderRequestBodyItemControls } from 'src/redux/admin/interface/IOrderAdmin'
import { createOrUpdateOrder, getOrderAttributeList, getOrderOriginList, getOrderTagList, getProductList, getUserList } from 'src/api/order'
import { AppDispatch, RootState } from 'src/redux/store'
import { handleValidateOrderBody, handleValidateOrderItems, resetMessage, setSubmitted, updateOrderBodyControls, updateOrderItemControls } from 'src/redux/admin/slice/orderAdminSlice'
import AdditionalInfoBox from 'src/views/admin/order/AdditionalInfoBox'
import CustomerSelectBox from 'src/views/admin/order/CustomerSelectBox'
import ProductSelectionBox from 'src/views/admin/order/ProductSelectionBox'
import CreateOrEditLoadingBox from 'src/views/admin/loading-box/CreateOrEditLoadingBox'
import { IOrderAttributeList, IOrderOriginList, IOrderTagList, IProductList, IUser, IUserList } from 'src/redux/admin/interface/IAdminGeneralState'
import { IMessageCommon } from 'src/redux/admin/interface/ICommon'
import { MessageType } from 'src/common/enums'
import _ from 'lodash'
import { defaultOrderRequest, orderRequestSchema } from 'src/form/admin/order/orderRequest'
import { IOrderRequestBody } from 'src/form/admin/interface/IOrderRequest'
import OrderOriginDialog from './order-origin/OrderOriginDialog'

interface ICreateOrUpdateOrderAdminProps {
  userList: IUserList
  productList: IProductList
  orderAttributeList: IOrderAttributeList
  orderOriginList: IOrderOriginList
  orderTagList: IOrderTagList
  orderAdmin: IOrderAdminState
  message: IMessageCommon
  getProductList: () => void
  getUserList: () => void
  getOrderAttributeList: () => void
  getOrderOriginList: () => void
  getOrderTagList: () => void
  updateOrderItemControls: (controls: IOrderRequestBodyItemControls[]) => void
  updateOrderBodyControls: (control: IOrderRequestBodyControl) => void
  resetMessage: () => void
  setSubmitted: () => void
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
    message,
    getProductList,
    getUserList,
    updateOrderItemControls,
    updateOrderBodyControls,
    resetMessage,
    getOrderAttributeList,
    getOrderOriginList,
    getOrderTagList,
    setSubmitted,
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

  const [isOpenOrderOriginDialog, setIsOpenOrderOriginDialog] = useState<boolean>(false)
  const handleCloseOrderOriginDialog = () => {
    setIsOpenOrderOriginDialog(false)
  }

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

    setSubmitted()
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
    console.log('Validation Errors:', errors)
  }

  const handleCloseSnackbar = () => {
    resetMessage()
  }

  if (!(userList.users && productList.products && orderAttributeList.orderAttributes)) {
    return <CreateOrEditLoadingBox />
  }

  return (
    <>
      <FormProvider {...createOrderForm}>
        <form onSubmit={createOrderForm.handleSubmit(onSubmit, onError)}>
          <Grid container spacing={6}>
            <Grid item xs={9}>
              <CustomerSelectBox filterUserOptions={filterUserOptions} />
            </Grid>
            <Grid item xs={3}>
              <AdditionalInfoBox filterUserOptions={filterUserOptions} setIsOpenOrderOriginDialog={setIsOpenOrderOriginDialog} />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <ProductSelectionBox />
            </Grid>
          </Grid>
          {/* <Backdrop sx={{ color: '#fff', zIndex: 99999 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop> */}
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
        </form>
      </FormProvider>
      <OrderOriginDialog open={isOpenOrderOriginDialog} setIsOpenOrderOriginDialog={setIsOpenOrderOriginDialog} />
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  orderAdmin: state.orderAdmin,
  userList: state.adminGeneral.userList,
  productList: state.adminGeneral.productList,
  orderOriginList: state.adminGeneral.orderOriginList,
  orderTagList: state.adminGeneral.orderTagList,
  orderAttributeList: state.adminGeneral.orderAttributeList,
  message: state.orderAdmin.message
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  getUserList: () => dispatch(getUserList()),
  getProductList: () => dispatch(getProductList()),
  getOrderAttributeList: () => dispatch(getOrderAttributeList()),
  getOrderOriginList: () => dispatch(getOrderOriginList()),
  getOrderTagList: () => dispatch(getOrderTagList()),
  updateOrderItemControls: (controls: IOrderRequestBodyItemControls[]) => dispatch(updateOrderItemControls(controls)),
  updateOrderBodyControls: (control: IOrderRequestBodyControl) => dispatch(updateOrderBodyControls(control)),
  resetMessage: () => dispatch(resetMessage()),
  setSubmitted: () => dispatch(setSubmitted()),
  createOrUpdateOrder: (order: IOrderRequestBody) => dispatch(createOrUpdateOrder(order))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrUpdateOrderAdmin)
