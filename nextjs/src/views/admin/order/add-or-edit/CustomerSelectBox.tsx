'use client'

// MUI Imports
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  Grid2 as Grid,
  CardContent,
  CardHeader,
  Link,
  TextField,
  Typography
} from '@mui/material'

import type { FilterOptionsState } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'
import { Icon } from '@iconify/react'

// Type Imports
import type { IOrder } from '@/interface/admin/order'
import type { IUser } from '@/interface/admin/user'

// Component Imports
import type { IProductBorrowProps } from './ProductBorrowInfo'
import ProductBorrowInfo from './ProductBorrowInfo'
import EmptyBox from '@/views/shared/EmptyBox'
import { useDictionary } from '@/contexts/dictionaryContext'

interface ICustomerSelectBoxProps {
  filterUserOptions: (options: IUser[], state: FilterOptionsState<IUser>) => IUser[]
  users: IUser[]
}

const CustomerSelectBox = (props: ICustomerSelectBoxProps) => {
  const { users, filterUserOptions } = props

  const { dictionary } = useDictionary()

  const { control, setValue } = useFormContext<IOrder>()

  const productBorrowInfo: IProductBorrowProps = {
    borrow: '1',
    totalPay: '2',
    returnOrder: '3',
    shippingFail: '4'
  }

  return (
    <Card>
      <CardHeader
        title={dictionary.adminArea.order.customerSelectionPanelTitle}
        action={
          <Button
            type='submit'
            variant='contained'
            size='large'
            fullWidth

            // onClick={() => {
            //   handleSubmit()
            // }}>
          >
            {dictionary.adminArea.common.button.submit}
          </Button>
        }
      />
      <CardContent>
        {users.length > 0 ? (
          <Grid container spacing={12}>
            <Grid size={12}>
              <Controller
                name='customerId'
                control={control}
                render={({ field: { onChange, value }, fieldState }) => {
                  const user = users.find(x => x.id === value)

                  setValue('deliveryAddress', user?.address || '', { shouldValidate: true })

                  return user ? (
                    <>
                      <Box mb={4}>
                        <Typography sx={{ fontSize: '1rem' }}>
                          <Link color='primary' href={`admin/user/${value}`}>
                            {user.fullName}
                          </Link>{' '}
                          - {user.phoneNumber} {user.email && `- ${user.email}`}
                        </Typography>
                      </Box>
                      <Grid container spacing={5} mb={4}>
                        <Grid size={8}>
                          <Box
                            component='section'
                            sx={{
                              p: 2,
                              mb: 5,
                              border: '1px dashed grey',
                              borderRadius: 2
                            }}
                          >
                            <Typography variant='h6' mb={2} sx={{ fontWeight: 500 }}>
                              {dictionary.adminArea.order.field.customerId.details.addressDelivery}
                            </Typography>
                            <Typography variant='body1' mb={3}>
                              {user.address}
                            </Typography>
                            <Button variant='contained' size='small' color='warning'>
                              {dictionary.adminArea.common.button.change}
                            </Button>
                          </Box>
                        </Grid>
                        <Grid size={4}>
                          <Box
                            component='section'
                            sx={{
                              px: 4,
                              py: 0,
                              mb: 5,
                              border: '1px dashed grey',
                              borderRadius: 2
                            }}
                          >
                            <ProductBorrowInfo {...productBorrowInfo} />
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid textAlign='center' size={12}>
                          <Button
                            variant='contained'
                            size='small'
                            onClick={() => {
                              setValue('customerId', null, { shouldValidate: true })
                            }}
                          >
                            {dictionary.adminArea.order.field.customerId.changeCustomer}
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Autocomplete
                        fullWidth
                        id='customerId'
                        options={users}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={!!fieldState.error}
                            label={dictionary.adminArea.order.field.customerId.label}
                            helperText={fieldState.error?.message}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <Icon icon='mdi:magnify' style={{ marginRight: '8px' }} />
                            }}
                          />
                        )}
                        onChange={(event, newValue, reason) => {
                          if (
                            event.type === 'keydown' &&
                            ((event as React.KeyboardEvent).key === 'Backspace' ||
                              (event as React.KeyboardEvent).key === 'Delete') &&
                            reason === 'removeOption'
                          ) {
                            return
                          }

                          onChange(newValue?.id)
                        }}
                        filterOptions={filterUserOptions}
                        getOptionLabel={option => option.fullName}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            <div className='flex items-center plb-2 pli-4 gap-2'>
                              <Avatar
                                alt='John Doe'
                                src='/images/avatars/1.png'
                                sx={{ width: '2.5rem', height: '2.5rem' }}
                              />
                              <div className='flex items-start flex-col'>
                                <Typography sx={{ fontWeight: 600 }}>{option.fullName}</Typography>
                                <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                                  {option.phoneNumber} - {option.email} - {option.address}
                                </Typography>
                              </div>
                            </div>
                          </li>
                        )}
                      />
                      <Box pt={5} pb={5} textAlign='center'>
                        <EmptyBox />
                        <Typography variant='body2'>
                          {dictionary.adminArea.order.field.customerId.helperText}
                        </Typography>
                      </Box>
                    </>
                  )
                }}
              />
            </Grid>
          </Grid>
        ) : (
          <Box pt={5} textAlign='center'>
            <EmptyBox />
            <Typography variant='body2'>{dictionary.adminArea.order.field.customerId.emptyCustomerList}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default CustomerSelectBox
