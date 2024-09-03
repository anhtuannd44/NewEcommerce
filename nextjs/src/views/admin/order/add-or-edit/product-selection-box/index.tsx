'use client'

// React Imports
import { useRef } from 'react'

// MUI Imports
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid2 as Grid,
  TextField,
  Typography,
  createFilterOptions
} from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'
import { Icon } from '@iconify/react'

// Type Imports
import type { IProductInList } from '@/interface/admin/product/IProductInList'
import type { IOrder } from '@/interface/admin/order'
import type { IUser } from '@/interface/admin/user'
import type { IOrderDetailsRef } from './order-details'

// Util Imports
import { currencyVNDFormatter } from '@/utils/formatCurrency'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Component Imports
import OrderDetailsBox from './order-details'
import OrderComplainBox from './OrderComplainBox'
import TotalBoxDetail from './total-box'

interface IProductSelectionBoxProps {
  users: IUser[]
  products: IProductInList[]
  orderTags: string[]
}

const ProductSelectionBox = (props: IProductSelectionBoxProps) => {
  const { users, products, orderTags } = props

  const { dictionary } = useDictionary()
  const { control, watch } = useFormContext<IOrder>()

  const isComplainWatch = watch('isComplain')

  const filterProductOption = createFilterOptions({
    stringify: (option: IProductInList) => `${option.name} ${option.sku}`
  })

  const childRef = useRef<IOrderDetailsRef>(null)

  const handleSelectProduct = (value: IProductInList) => {
    if (childRef.current) {
      childRef.current.handleOnChangeSelectProduct(value)
    }
  }

  return (
    <Card>
      <CardHeader title={dictionary.adminArea.order.productInformationPanelTitle} />
      <CardContent sx={{ paddingX: 0 }}>
        <Grid container px={5}>
          <Grid size={9}>
            <Autocomplete
              id='productSelectList'
              options={products}
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder={dictionary.adminArea.order.field.productSelectList.label}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: <Icon icon='mdi:magnify' style={{ marginRight: '8px' }} />
                    }
                  }}
                />
              )}
              filterOptions={filterProductOption}
              getOptionLabel={option => option.name}
              renderOption={(props, option) => (
                <li
                  {...props}
                  key={option.id}
                  onMouseDown={() => {
                    handleSelectProduct(option)
                  }}
                >
                  <Grid container sx={{ width: '100%' }}>
                    <Grid size={1}>
                      <img
                        src={
                          option.imgUrl ??
                          'https://sapo.dktcdn.net/100/689/126/variants/dinh-am-tuong-1675674468493.jpg'
                        }
                        width={40}
                        height={40}
                      />
                    </Grid>
                    <Grid size={7}>
                      <Typography sx={{ fontWeight: 600 }}>{option.name}</Typography>
                      <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                        {option.sku}
                      </Typography>
                    </Grid>
                    <Grid textAlign='right' size={4}>
                      <Typography sx={{ fontWeight: 600 }} color='success.main'>
                        {option.price
                          ? currencyVNDFormatter(option.price)
                          : dictionary.adminArea.order.field.productSelectList.noPrice}
                      </Typography>
                      <Typography color='secondary'>
                        {dictionary.adminArea.order.field.productSelectList.stockQuantity}: {option.stockQuantity}
                      </Typography>
                    </Grid>
                  </Grid>
                </li>
              )}
            />
          </Grid>
        </Grid>
        <Divider sx={{ mt: 5, mb: 0 }} />
        <OrderDetailsBox ref={childRef} />
        <Divider sx={{ mt: 5, mb: 0 }} />
        <Grid container p={4} spacing={5}>
          <Grid size={8}>
            {isComplainWatch && <OrderComplainBox users={users} />}
            <div>
              <Grid container spacing={5}>
                <Grid size={6}>
                  <Controller
                    name='note'
                    control={control}
                    render={({ field: { onChange }, fieldState }) => (
                      <TextField
                        rows={6}
                        fullWidth
                        multiline
                        size='small'
                        type='text'
                        label={dictionary.adminArea.order.field.note.label}
                        helperText={fieldState.error?.message || dictionary.adminArea.order.field.note.helperText}
                        error={!!fieldState.error}
                        onChange={onChange}
                      />
                    )}
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    name='tags'
                    control={control}
                    render={({ field: { onChange }, fieldState }) => (
                      <Autocomplete
                        fullWidth
                        size='small'
                        multiple
                        freeSolo
                        options={orderTags}
                        renderInput={params => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!fieldState.error}
                            label={dictionary.adminArea.order.field.tags.label}
                            helperText={fieldState.error?.message}
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

                          onChange(newValue)
                        }}
                        getOptionLabel={option => option}
                        renderOption={(props, option) => (
                          <li {...props} key={option}>
                            <Box
                              sx={{
                                display: 'flex',
                                marginLeft: 3,
                                alignItems: 'flex-start',
                                flexDirection: 'column'
                              }}
                            >
                              <Typography sx={{ fontWeight: 400, py: 1 }}>{option}</Typography>
                            </Box>
                          </li>
                        )}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid size={4}>
            <TotalBoxDetail />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductSelectionBox
