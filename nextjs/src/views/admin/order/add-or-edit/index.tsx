'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { createFilterOptions, Grid2 as Grid } from '@mui/material'

// Third-party Imports
import { useForm, FormProvider } from 'react-hook-form'
import type { FieldErrors } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'

// Form Imports
import { orderRequestSchema } from '@/form/admin/order/schema/createOrUpdateOrderSchema'

// Type Imports
import type { IUser } from '@/interface/admin/user'
import type { IProductInList } from '@/interface/admin/product/IProductInList'
import type { IOrder, IOrderAttribute, IOrderOrigin } from '@/interface/admin/order'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// API Imports
import { getUsers } from '@/services/admin/user'
import { getProducts } from '@/services/admin/product'
import { createOrUpdateOrder, getOrderAttributes, getOrderOrigins, getOrderTags } from '@/services/admin/order'

// Component Imports
import CreateOrEditLoadingBox from '@/views/shared/CreateOrEditLoadingBox'
import CustomerSelectBox from './CustomerSelectBox'
import AdditionalInfoBox from './additional-box'
import ProductSelectionBox from './product-selection-box'

const CreateOrUpdateOrderAdmin = () => {
  // Context
  const { dictionary } = useDictionary()

  const [users, setUsers] = useState<IUser[]>()
  const [products, setProducts] = useState<IProductInList[]>()
  const [orderAttributes, setOrderAttributes] = useState<IOrderAttribute[]>()
  const [orderOrigins, setOrderOrigins] = useState<IOrderOrigin[]>()
  const [orderTags, setOrderTags] = useState<string[]>()

  const initOtherData = async () => {
    try {
      const [usersResponse, productsResponse, orderAttributesResponse, orderOriginsResponse, orderTagsResponse] =
        await Promise.all([getUsers(), getProducts(), getOrderAttributes(), getOrderOrigins(), getOrderTags()])

      if (
        !usersResponse.data ||
        !productsResponse.data ||
        !orderAttributesResponse.data ||
        !orderOriginsResponse.data ||
        !orderTagsResponse.data
      ) {
        toast.error(dictionary.messageNotification.apiMessageNotification.error.common)

        return
      }

      setUsers(usersResponse.data.data)
      setProducts(productsResponse.data.data)
      setOrderAttributes(orderAttributesResponse.data.data)
      setOrderOrigins(orderOriginsResponse.data.data)
      setOrderTags(orderTagsResponse.data.data)
    } catch (error: any) {
      toast.error(error || dictionary.messageNotification.apiMessageNotification.error.common)
    }
  }

  useEffect(() => {
    initOtherData()
  }, [])

  const createOrderForm = useForm<IOrder>({
    resolver: yupResolver<IOrder>(orderRequestSchema(dictionary)),
    mode: 'onChange',
    reValidateMode: 'onChange',
    progressive: true
  })

  const filterUserOptions = createFilterOptions({
    ignoreAccents: false,
    stringify: (option: IUser) => `${option.fullName} ${option.phoneNumber}`
  })

  const onSubmit = (data: IOrder) => {
    // console.log('data', data)
    createOrUpdateOrder(data)
  }

  const onError = (errors: FieldErrors<IOrder>) => {
    console.log(createOrderForm.getValues())
    console.log('Validation Errors:', errors)
  }

  if (!(users && products && orderAttributes && orderOrigins && orderTags)) {
    return <CreateOrEditLoadingBox />
  }

  return (
    <FormProvider {...createOrderForm}>
      <form onSubmit={createOrderForm.handleSubmit(onSubmit, onError)}>
        <Grid container spacing={6} columns={20}>
          <Grid size={13.5}>
            <CustomerSelectBox filterUserOptions={filterUserOptions} users={users} />
          </Grid>
          <Grid size={6.5}>
            <AdditionalInfoBox
              users={users}
              orderAttributes={orderAttributes}
              orderOrigins={orderOrigins}
              orderTags={orderTags}
              filterUserOptions={filterUserOptions}
            />
          </Grid>
          <Grid size={20}>
            <ProductSelectionBox users={users} products={products} />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default CreateOrUpdateOrderAdmin
