'use client'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useForm, FormProvider, FieldErrors } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createFilterOptions, Grid } from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import { createOrUpdateOrder, getOrderAttributeList, getOrderOriginList, getOrderTagList, getUserList } from 'src/services/order'
import { AppDispatch, RootState } from 'src/redux/store'
import AdditionalInfoBox from 'src/views/admin/order/create-order/AdditionalInfoBox'
import CustomerSelectBox from 'src/views/admin/order/create-order/CustomerSelectBox'
import ProductSelectionBox from 'src/views/admin/order/create-order/ProductSelectionBox'
import CreateOrEditLoadingBox from 'src/views/admin/loading-box/CreateOrEditLoadingBox'
import { IOrderAttributeList, IOrderOriginList, IOrderTagList, IProductList, IUser, IUserList } from 'src/redux/admin/interface/IAdminGeneralState'
import { IOrderRequestBody } from 'src/form/admin/order/interface/IOrderRequest'
import { getProductList } from 'src/services/product'
import { orderRequestSchema } from 'src/form/admin/order/scheme/orderRequestSchema'

interface ICreateOrUpdateOrderAdminProps {
  userList: IUserList
  productList: IProductList
  orderAttributeList: IOrderAttributeList
  orderOriginList: IOrderOriginList
  orderTagList: IOrderTagList
  getProductList: () => void
  getUserList: () => void
  getOrderAttributeList: () => void
  getOrderOriginList: () => void
  getOrderTagList: () => void
  createOrUpdateOrder: (order: IOrderRequestBody) => void
}

const CreateOrUpdateOrderAdmin = (props: ICreateOrUpdateOrderAdminProps) => {
  const { userList, productList, orderAttributeList, orderOriginList, orderTagList, getProductList, getUserList, getOrderAttributeList, getOrderOriginList, getOrderTagList, createOrUpdateOrder } =
    props

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
  }

  const onError = (errors: FieldErrors<IOrderRequestBody>) => {
    console.log(createOrderForm.getValues())
    console.log('Validation Errors:', errors)
  }

  console.log('sssssacasjkbcas')

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
  createOrUpdateOrder: (order: IOrderRequestBody) => dispatch(createOrUpdateOrder(order))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrUpdateOrderAdmin)
