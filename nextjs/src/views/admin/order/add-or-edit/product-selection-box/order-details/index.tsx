'use client'

// MUI Imports
import { forwardRef, useImperativeHandle } from 'react'

import { Box, Checkbox, Grid2 as Grid, IconButton, Link, TextField, Typography } from '@mui/material'

// React Imports

// Third-party Imports
import { NumericFormat } from 'react-number-format'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import _ from 'lodash'

// Util Imports
import { Icon } from '@iconify/react/dist/iconify.js'

import { currencyVNDFormatter } from '@/utils/formatCurrency'

// Enum Imports
import { DiscountType } from '@/enums/product-enums'

// Type Imports
import type { IProductInList } from '@/interface/admin/product/IProductInList'
import type { IOrder, IProductItem } from '@/interface/admin/order'

// Form Imports
import { defaultOrderItem } from '@/form/admin/order/default-value/orderDefaultValue'

// Component Imports
import DiscountOrderPopover from './DiscountOrderPopover'
import EmptyBox from '@/views/shared/EmptyBox'

interface IOrderDetailsBoxProps {}

export interface IOrderDetailsRef {
  handleOnChangeSelectProduct: (value: IProductInList) => void
}

const OrderDetailsBox = forwardRef<IOrderDetailsRef, IOrderDetailsBoxProps>((props, ref) => {
  const { control, setValue, getValues, watch } = useFormContext<IOrder>()

  const { append, update, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const watchItems = watch('items')

  useImperativeHandle(ref, () => ({
    handleOnChangeSelectProduct: (value: IProductInList) => {
      const existingProductIndex = watchItems.findIndex(item => item.productId === value.id)

      if (existingProductIndex !== -1) {
        handleUpdateItem(existingProductIndex, { quantity: watchItems[existingProductIndex].quantity + 1 })
      } else {
        const newProduct = {
          ...defaultOrderItem,
          productId: value.id,
          productCode: value.sku,
          name: value.name,
          price: value.price,
          productUrl: value.seoUrl || '/'
        }

        const finalUpdatedProducts = handleCalculateTotalItem(newProduct)

        append(finalUpdatedProducts)
      }
    }
  }))

  const handleShowHideNote = (index: number, field: IProductItem, value: boolean) => {
    const updateField = _.clone(field)

    updateField.isShowNote = value
    update(index, updateField)
  }

  const handleRemoveItem = (index: number) => {
    remove(index)
  }

  const handleUpdateItem = (index: number, newValue: Partial<IProductItem>) => {
    const currentItem = getValues(`items.${index}`)

    const updateItem = {
      ...currentItem,
      ...newValue
    }

    const finalItemUpdate = handleCalculateTotalItem(updateItem)

    setValue(`items.${index}`, finalItemUpdate)
  }

  const handleCalculateTotalItem = (item: IProductItem) => {
    const price = item.price ?? 0
    const preTotal = price * item.quantity

    const finalPriceAfterDiscount =
      price - (item.discountType === DiscountType.Value ? item.discountValue : (price * item.discountValue) / 100)

    const totalPriceAfterDiscount = finalPriceAfterDiscount * item.quantity

    const discountPercent =
      item.discountType === DiscountType.Percent ? item.discountValue : (item.discountValue / price) * 100

    return {
      ...item,
      discountPercent,
      preTotal,
      totalPriceAfterDiscount
    }
  }

  return (
    <Box>
      {watchItems && watchItems.length > 0 ? (
        <>
          <Box className='box-header' sx={{ backgroundColor: '#eeedff' }}>
            <Grid container>
              <Grid textAlign='center' px={2} py={3} size={0.5}>
                <Typography variant='h6'>STT</Typography>
              </Grid>
              <Grid textAlign='center' p={2} py={3} size={1}>
                <Typography variant='h6'>Ảnh</Typography>
              </Grid>
              <Grid p={2} py={3} size={4}>
                <Typography variant='h6'>Chi tiết sản phẩm</Typography>
              </Grid>
              <Grid textAlign='center' p={2} py={3} size={1}>
                <Typography variant='h6'>Số lượng</Typography>
              </Grid>
              <Grid textAlign='right' p={2} py={3} size={1}>
                <Typography variant='h6'>Đơn giá</Typography>
              </Grid>
              <Grid textAlign='right' p={2} py={3} size={1.5}>
                <Typography variant='h6'>Chiết khấu SP</Typography>
              </Grid>

              <Grid textAlign='right' p={2} py={3} size={1}>
                <Typography variant='h6'>Thành tiền</Typography>
              </Grid>
              <Grid textAlign='center' p={2} py={3} size={1}>
                <Typography variant='h6'>
                  VAT<span style={{ fontSize: '0.75rem' }}>(8%)</span>
                </Typography>
              </Grid>
              <Grid p={2} py={3} size={1}></Grid>
            </Grid>
          </Box>
          {watchItems.map((ordPrDt, index) => (
            <Box className='box-item' key={index}>
              <Grid container>
                <Grid textAlign='center' px={2} py={3} size={0.5}>
                  {index + 1}
                </Grid>
                <Grid textAlign='center' p={2} py={3} size={1}>
                  <img
                    src={
                      ordPrDt.imgUrl
                        ? ordPrDt.imgUrl
                        : 'https://sapo.dktcdn.net/100/689/126/variants/dinh-am-tuong-1675674468493.jpg'
                    }
                    width={40}
                    height={40}
                  />
                </Grid>
                <Grid p={2} py={3} size={4}>
                  <Box>
                    <Typography variant='h6'>{ordPrDt.name}</Typography>
                    <Typography variant='body1'>
                      Mã: <Link href={ordPrDt.productUrl}>{ordPrDt.productCode}</Link>
                    </Typography>
                    <Typography
                      variant='body2'
                      onClick={() => {
                        handleShowHideNote(index, ordPrDt, !ordPrDt.isShowNote)
                      }}
                      sx={{ cursor: 'pointer' }}
                    >{`${ordPrDt.isShowNote ? 'Ẩn' : 'Hiện'} ghi chú`}</Typography>
                    {ordPrDt.isShowNote && (
                      <Controller
                        name={`items.${index}.note`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            size='small'
                            variant='standard'
                            sx={{ minWidth: 400 }}
                            placeholder='Ghi chú'
                            type='text'
                            value={value}
                            onChange={event => {
                              onChange(event.target.value)
                            }}
                            inputProps={{ style: { fontSize: '0.75rem' } }}
                          />
                        )}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid textAlign='center' p={2} py={3} size={1}>
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field: { value }, fieldState }) => (
                      <TextField
                        error={!!fieldState.error}
                        variant='standard'
                        type='number'
                        value={value}
                        onChange={event => {
                          handleUpdateItem(index, { quantity: Number(event.target.value) })
                        }}
                        helperText={fieldState.error?.message}
                        inputProps={{ min: 0, style: { textAlign: 'center' } }}
                      />
                    )}
                  />
                </Grid>
                <Grid textAlign='right' p={2} py={3} size={1}>
                  <Controller
                    name={`items.${index}.price`}
                    control={control}
                    render={({ field: { value }, fieldState }) => (
                      <NumericFormat
                        variant='standard'
                        type='text'
                        inputProps={{ min: 0, style: { textAlign: 'right' } }}
                        valueIsNumericString={true}
                        onValueChange={value => {
                          handleUpdateItem(index, { price: value.floatValue })
                        }}
                        min={0}
                        value={value}
                        customInput={TextField}
                        decimalScale={2}
                        thousandSeparator=','
                        allowLeadingZeros={false}
                        allowNegative={false}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid textAlign='right' p={2} py={3} aria-describedby={''} size={1.5}>
                  <DiscountOrderPopover handleUpdateItem={handleUpdateItem} index={index} />
                </Grid>

                <Grid textAlign='right' p={2} py={3} size={1}>
                  <TextField
                    value={currencyVNDFormatter(ordPrDt.totalPriceAfterDiscount || 0)}
                    variant='standard'
                    type='text'
                    inputProps={{ min: 0, style: { textAlign: 'right' } }}
                  />
                </Grid>

                <Grid textAlign='center' p={2} py={3} size={1}>
                  <Controller
                    name={`items.${index}.isVat`}
                    control={control}
                    render={() => (
                      <Checkbox
                        checked={ordPrDt.isVat}
                        onChange={event => {
                          handleUpdateItem(index, { isVat: event.target.checked })
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid p={2} py={3} textAlign='center' size={1}>
                  <IconButton
                    aria-label='delete'
                    onClick={() => {
                      handleRemoveItem(index)
                    }}
                  >
                    <Icon icon='mdi:close' />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </>
      ) : (
        <Box textAlign='center' py={20}>
          <EmptyBox />
          <Typography variant='body2'>Bạn chưa chọn sản phẩm, vui lòng tìm kiếm và chọn sản phẩm ở trên</Typography>
        </Box>
      )}
    </Box>
  )
})

export default OrderDetailsBox
