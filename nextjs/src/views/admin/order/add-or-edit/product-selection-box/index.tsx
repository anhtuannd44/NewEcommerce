'use client'

// React Imports
import { Fragment, useRef } from 'react'

// MUI Imports
import {
  Autocomplete,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid2 as Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
}

const ProductSelectionBox = (props: IProductSelectionBoxProps) => {
  const { users, products } = props

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
      <CardContent>
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
                      startAdornment: <Icon icon='mdi:magnify' style={{ marginRight: '8px' }} fontSize='1.5em' />
                    }
                  }}
                />
              )}
              filterOptions={filterProductOption}
              getOptionLabel={option => option.name}
              renderOption={(props, option) => (
                <ListItem
                  {...props}
                  key={option.id}
                  onMouseDown={() => {
                    handleSelectProduct(option)
                  }}
                  secondaryAction={
                    <Fragment>
                      <Typography sx={{ fontWeight: 600 }} color='success.main'>
                        {option.price
                          ? currencyVNDFormatter(option.price)
                          : dictionary.adminArea.order.field.productSelectList.noPrice}
                      </Typography>
                      <Typography color='secondary'>
                        {dictionary.adminArea.order.field.productSelectList.stockQuantity}: {option.stockQuantity}
                      </Typography>
                    </Fragment>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      variant='square'
                      src={
                        option.imgUrl ?? 'https://sapo.dktcdn.net/100/689/126/variants/dinh-am-tuong-1675674468493.jpg'
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography fontWeight={600}>{option.name}</Typography>}
                    secondary={
                      <Typography variant='body2' color='text.disabled'>
                        {option.sku}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            />
          </Grid>
        </Grid>
        <Divider sx={{ mt: 5, mb: 0 }} />
        <OrderDetailsBox ref={childRef} />
        <Grid container p={4} spacing={5}>
          <Grid size={8}>
            <div>
              <Grid container spacing={5}>
                <Grid size={12}>
                  <Controller
                    name='note'
                    control={control}
                    render={({ field: { onChange }, fieldState }) => (
                      <TextField
                        rows={3}
                        fullWidth
                        multiline
                        size='small'
                        type='text'
                        label={dictionary.adminArea.order.field.note.label}
                        helperText={fieldState.error?.message}
                        error={!!fieldState.error}
                        onChange={onChange}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {isComplainWatch && <OrderComplainBox users={users} />}
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
