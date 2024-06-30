import { Close } from '@mui/icons-material'
import { Box, Checkbox, FormControl, FormHelperText, Grid, IconButton, Link, TextField, Typography, styled } from '@mui/material'
import { forwardRef, useImperativeHandle } from 'react'
import EmptyBox from 'src/views/shared/EmptyBox'
import { NumericFormat } from 'react-number-format'
import { currencyVNDFormatter } from 'src/utils/formatCurrency'
import { DiscountType } from 'src/common/enums'
import _ from 'lodash'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { IOrderRequestBody, IProductItemRequestBody } from 'src/form/admin/interface/IOrderRequest'
import { IProduct } from 'src/redux/admin/interface/IAdminGeneralState'
import { defaultOrderItem } from 'src/form/admin/order/orderRequest'
import DiscountOrderPopover from './DiscountOrderPopover'

export interface IOrderDetailsBoxProps {}

const CustomBoxStyled = styled(Box)(({ theme }) => ({
  transition: 'all ease .3s',
  ':hover': {
    background: '#f7f7fc'
  }
}))

export interface IOrderDetailsRef {
  handleOnChangeSelectProduct: (value: IProduct) => void
}

const OrderDetailsBox = forwardRef<IOrderDetailsRef, IOrderDetailsBoxProps>((props, ref) => {
  // const { handleCalculateTotalItem, handleRemoveItem, items, onUpdate } = props
  const { control, setValue, getValues, watch, register } = useFormContext<IOrderRequestBody>()

  const { append, update, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const watchItems = watch('items')

  useImperativeHandle(ref, () => ({
    handleOnChangeSelectProduct: (value: IProduct) => {
      const existingProductIndex = watchItems.findIndex(item => item.productId === value.id)

      if (existingProductIndex !== -1) {
        handleUpdateItem(existingProductIndex, { quantity: watchItems[existingProductIndex].quantity + 1 })
      } else {
        const newProduct = {
          ...defaultOrderItem,
          productId: value.id,
          name: value.name,
          price: value.price
        }
        const finalUpdatedProducts = handleCalculateTotalItem(newProduct)
        append(finalUpdatedProducts)
      }
    }
  }))

  const handleShowHideNote = (index: number, field: IProductItemRequestBody, value: boolean) => {
    const updateField = _.clone(field)
    updateField.isShowNote = value
    update(index, updateField)
  }

  const handleRemoveItem = (index: number) => {
    remove(index)
  }

  const handleUpdateItem = (index: number, newValue: Partial<IProductItemRequestBody>) => {
    const currentItem = getValues(`items.${index}`)
    const updateItem = {
      ...currentItem,
      ...newValue
    }
    const finalItemUpdate = handleCalculateTotalItem(updateItem)
    setValue(`items.${index}`, finalItemUpdate, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
  }

  const handleCalculateTotalItem = (item: IProductItemRequestBody) => {
    const price = item.price ?? 0
    const preTotal = price * item.quantity
    const finalPriceAfterDiscount = price - (item.discountType === DiscountType.Value ? item.discountValue : price * (1 - item.discountValue / 100))
    const totalPriceAfterDiscount = finalPriceAfterDiscount * item.quantity
    const discountPercent = item.discountType === DiscountType.Percent ? item.discountValue : (item.discountValue / price) * 100
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
              <Grid item xs={0.5} textAlign='center' px={2} py={3}>
                <Typography variant='h6'>STT</Typography>
              </Grid>
              <Grid item xs={1} textAlign='center' p={2} py={3}>
                <Typography variant='h6'>Ảnh</Typography>
              </Grid>
              <Grid item xs={4} p={2} py={3}>
                <Typography variant='h6'>Chi tiết sản phẩm</Typography>
              </Grid>
              <Grid item xs={1} textAlign='center' p={2} py={3}>
                <Typography variant='h6'>Số lượng</Typography>
              </Grid>
              <Grid item xs={1} textAlign='right' p={2} py={3}>
                <Typography variant='h6'>Đơn giá</Typography>
              </Grid>
              <Grid item xs={1.5} textAlign='right' p={2} py={3}>
                <Typography variant='h6'>Chiết khấu SP</Typography>
              </Grid>

              <Grid item xs={1} textAlign='right' p={2} py={3}>
                <Typography variant='h6'>Thành tiền</Typography>
              </Grid>
              <Grid item xs={1} textAlign='center' p={2} py={3}>
                <Typography variant='h6'>
                  VAT<span style={{ fontSize: '0.75rem' }}>(8%)</span>
                </Typography>
              </Grid>
              <Grid item xs={1} p={2} py={3}></Grid>
            </Grid>
          </Box>
          {watchItems.map((ordPrDt, index) => {
            const fieldWatch = watch(`items.${index}`)
            console.log(ordPrDt.totalPriceAfterDiscount)
            return (
              <CustomBoxStyled className='box-item' key={index}>
                <Grid container>
                  <Grid item xs={0.5} textAlign='center' px={2} py={3}>
                    {index + 1}
                  </Grid>
                  <Grid item xs={1} textAlign='center' p={2} py={3}>
                    <img src={ordPrDt.imgUrl ? ordPrDt.imgUrl : 'https://sapo.dktcdn.net/100/689/126/variants/dinh-am-tuong-1675674468493.jpg'} width={40} height={40} />
                  </Grid>
                  <Grid item xs={4} p={2} py={3}>
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
                        sx={{ cursor: 'pointer' }}>{`${ordPrDt.isShowNote ? 'Ẩn' : 'Hiện'} ghi chú`}</Typography>
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
                  <Grid item xs={1} textAlign='center' p={2} py={3}>
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field: { onChange, value }, fieldState }) => {
                        return (
                          <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                            <TextField
                              error={!!fieldState.error}
                              variant='standard'
                              type='number'
                              value={value}
                              onChange={event => {
                                onChange(Number(event.target.value))
                              }}
                              inputProps={{ style: { textAlign: 'center' } }}
                            />
                            <FormHelperText>{fieldState.error?.message}</FormHelperText>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={1} textAlign='right' p={2} py={3}>
                    <Controller
                      name={`items.${index}.price`}
                      control={control}
                      render={({ field: { onChange, value }, fieldState }) => {
                        return (
                          <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                            <NumericFormat
                              variant='standard'
                              type='text'
                              inputProps={{ min: 0, style: { textAlign: 'right' } }}
                              valueIsNumericString={true}
                              onValueChange={value => {
                                onChange(value.floatValue ?? null)
                              }}
                              min={0}
                              value={value}
                              customInput={TextField}
                              decimalScale={2}
                              thousandSeparator=','
                              allowLeadingZeros={false}
                              allowNegative={false}
                              error={!!fieldState.error}
                            />
                            <FormHelperText>{fieldState.error?.message}</FormHelperText>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={1.5} textAlign='right' p={2} py={3} aria-describedby={''}>
                    <DiscountOrderPopover index={index} />
                  </Grid>

                  <Grid item xs={1} textAlign='right' p={2} py={3}>
                    <TextField value={currencyVNDFormatter(fieldWatch.totalPriceAfterDiscount || 0)} variant='standard' type='text' inputProps={{ min: 0, style: { textAlign: 'right' } }} />
                  </Grid>

                  <Grid item xs={1} textAlign='center' p={2} py={3}>
                    <Controller
                      name={`items.${index}.isVat`}
                      control={control}
                      render={({ field: { onChange, value }, fieldState }) => {
                        return (
                          <Checkbox
                            checked={ordPrDt.isVat}
                            onChange={event => {
                              onChange(event.target.checked)
                            }}
                          />
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={1} p={2} py={3} textAlign='center'>
                    <IconButton
                      aria-label='delete'
                      onClick={() => {
                        handleRemoveItem(index)
                      }}>
                      <Close />
                    </IconButton>
                  </Grid>
                </Grid>
              </CustomBoxStyled>
            )
          })}
        </>
      ) : (
        <>
          <Box textAlign='center' py={20}>
            <EmptyBox />
            <Typography variant='body2'>Bạn chưa chọn sản phẩm, vui lòng tìm kiếm và chọn sản phẩm ở trên</Typography>
          </Box>
        </>
      )}
    </Box>
  )
})

export default OrderDetailsBox
