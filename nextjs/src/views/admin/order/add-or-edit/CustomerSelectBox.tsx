'use client'

// MUI Imports
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Grid2 as Grid,
  CardContent,
  CardHeader,
  Link,
  TextField,
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  useTheme
} from '@mui/material'

import type { FilterOptionsState } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'
import { Icon } from '@iconify/react'

// Type Imports
import type { IOrder } from '@/interface/admin/order'
import type { IUser } from '@/interface/admin/user'
import type { IProductBorrowProps } from './ProductBorrowInfo'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Component Imports
import EmptyBox from '@/views/shared/EmptyBox'
import ProductBorrowInfo from './ProductBorrowInfo'

interface ICustomerSelectBoxProps {
  filterUserOptions: (options: IUser[], state: FilterOptionsState<IUser>) => IUser[]
  users: IUser[]
}

const CustomerSelectBox = (props: ICustomerSelectBoxProps) => {
  const { users, filterUserOptions } = props

  const { dictionary } = useDictionary()
  const { palette } = useTheme()

  const { control, setValue } = useFormContext<IOrder>()

  const productBorrowInfo: IProductBorrowProps = {
    borrow: '1',
    totalPay: '2',
    returnOrder: '3',
    shippingFail: '4'
  }

  return (
    <Card sx={{ height: '100%' }}>
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
        {!!users.length ? (
          <Grid container spacing={12}>
            <Grid size={12}>
              <Controller
                name='customerId'
                control={control}
                render={({ field: { onChange, value }, fieldState }) => {
                  const user = users.find(x => x.id === value)

                  setValue('deliveryAddress', user?.address || '', { shouldValidate: true })

                  return user ? (
                    <Grid container spacing={6}>
                      <Grid size={12}>
                        <Typography>
                          <Link color='primary' href={`admin/user/${value}`}>
                            {user.fullName}
                          </Link>
                          {` - ${user.phoneNumber} ${user.email && '-' + user.email}`}
                        </Typography>
                      </Grid>
                      <Grid size={8}>
                        <Box component='section' borderRadius={1} p={4} mb={5} border='1px dashed grey'>
                          <Typography variant='h6' mb={2} fontWeight={500}>
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
                        <ProductBorrowInfo {...productBorrowInfo} />
                      </Grid>
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
                  ) : (
                    <Box>
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
                            slotProps={{
                              input: {
                                ...params.InputProps,
                                startAdornment: (
                                  <Icon
                                    icon='mdi:magnify'
                                    style={{ marginRight: '8px' }}
                                    fontSize='1.5em'
                                    color={!!fieldState.error ? palette.error.main : palette.text.secondary}
                                  />
                                )
                              }
                            }}
                          />
                        )}
                        onChange={(event, newValue) => {
                          onChange(newValue?.id)
                        }}
                        filterOptions={filterUserOptions}
                        getOptionLabel={option => option.fullName}
                        renderOption={(props, option) => (
                          <ListItem {...props} key={option.id}>
                            <ListItemAvatar>
                              <Avatar src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={option.fullName}
                              secondary={
                                <Typography variant='body2' color='text.disabled' fontSize='.8rem'>
                                  {option.phoneNumber} - {option.email} - {option.address}
                                </Typography>
                              }
                            />
                          </ListItem>
                        )}
                      />
                      <Box pt={12} pb={10} textAlign='center'>
                        <EmptyBox />
                        <Typography variant='body2'>
                          {dictionary.adminArea.order.field.customerId.helperText}
                        </Typography>
                      </Box>
                    </Box>
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
