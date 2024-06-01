import { Close } from '@mui/icons-material'
import { Box, Checkbox, FormControl, FormHelperText, Grid, IconButton, Link, TextField, Typography, styled } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import EmptyBox from 'src/views/shared/EmptyBox'
import { IOrderRequestBodyItemControls, IProductItemRequestBody } from 'src/redux/admin/interface/IOrderAdmin'
import { connect } from 'react-redux'
import DiscountItemPopover from './DiscountItemPopover'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import { convertStringToNumber, currencyVNDFormatter } from 'src/utils/formatCurrency'
import { AppDispatch, RootState } from 'src/redux/store'
import { updateRequestItems } from 'src/redux/admin/slice/orderAdminSlice'
import { DiscountType } from 'src/common/enums'
import _ from 'lodash'

export interface IOrderDetailsBoxProps {
  isSubmitted: boolean
  orderProductData: IProductItemRequestBody[] | undefined
  orderProductControls: IOrderRequestBodyItemControls[] | undefined
  updateRequestItems: (items: IProductItemRequestBody[]) => void
  handleCalculateTotalItems: (list: IProductItemRequestBody[]) => IProductItemRequestBody[]
}

const CustomBoxStyled = styled(Box)(({ theme }) => ({
  transition: 'all ease .3s',
  ':hover': {
    background: '#f7f7fc'
  }
}))

interface ICurrentDiscountEdit {
  productId: string | null | undefined
  discountType: DiscountType
  value: number
  isChangingDiscountType: boolean
}

const OrderDetailsBox = (props: IOrderDetailsBoxProps) => {
  const { orderProductData, orderProductControls, updateRequestItems, handleCalculateTotalItems, isSubmitted } = props

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [currentDiscountEdit, setCurrentDiscountEdit] = useState<ICurrentDiscountEdit>({
    productId: '',
    value: 0,
    discountType: DiscountType.Value,
    isChangingDiscountType: false
  })

  const handleUpdateRequestItems = (newState: IProductItemRequestBody[]) => {
    const updateItems = handleCalculateTotalItems(newState)
    updateRequestItems(updateItems)
  }

  const handleQuantityChange = (id: string | null | undefined, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.currentTarget.value
    if (!orderProductData) {
      return
    }
    const prepareState: IProductItemRequestBody[] = [...orderProductData]
    const newState = prepareState.map(ordRq => {
      if (ordRq.productId === id) {
        return {
          ...ordRq,
          quantity: Number(value)
        }
      }
      return ordRq
    })

    handleUpdateRequestItems(newState)
  }

  const handleNoteChange = (id: string | null | undefined, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    if (!orderProductData) {
      return
    }
    const newState: IProductItemRequestBody[] = [...orderProductData]
    newState.map(ordRq => {
      if (ordRq.productId === id) {
        ordRq.note = value
      }
      return ordRq
    })
    handleUpdateRequestItems(newState)
  }

  const handlePriceChange = (id: string | null | undefined, str: string) => {
    const value = convertStringToNumber(str)
    if (orderProductData) {
      const currentState: IProductItemRequestBody[] = _.cloneDeep(orderProductData)
      const newState = currentState.map(ordRq => {
        if (ordRq.productId === id) {
          return {
            ...ordRq,
            price: value
          }
        }
        return ordRq
      })
      handleUpdateRequestItems(newState)
    }
  }

  const handleDiscountValueChange = (id: string | null | undefined, value: number) => {
    if (!orderProductData) {
      return
    }

    if (currentDiscountEdit.isChangingDiscountType) {
      setCurrentDiscountEdit({
        ...currentDiscountEdit,
        isChangingDiscountType: false
      })
      return
    }
    const currentState: IProductItemRequestBody[] = [...orderProductData]
    const newState = currentState.map(ordRq => {
      if (ordRq.productId === id) {
        setCurrentDiscountEdit({
          productId: id,
          value: value,
          discountType: ordRq.discountType,
          isChangingDiscountType: false
        })
        return {
          ...ordRq,
          discountValue: value
        }
      }
      return ordRq
    })
    handleUpdateRequestItems(newState)
  }

  const handleRemoveRecord = (id: string | null | undefined) => {
    if (!orderProductData) {
      return
    }
    const newState: IProductItemRequestBody[] = [...orderProductData].filter(ordPrDt => ordPrDt.productId !== id)

    handleUpdateRequestItems(newState)
  }

  const handleIsVatChange = (id: string, isChecked: boolean) => {
    if (orderProductData) {
      const currentState = [...orderProductData]
      const newState = currentState.map(item => {
        if (item.productId === id) {
          return { ...item, isVat: isChecked }
        }
        return item
      })

      handleUpdateRequestItems(newState)
    }
  }

  const handleOpenDiscountModule = (id: string | null | undefined, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    orderProductData?.map(ordPrDt => {
      if (ordPrDt.productId === id) {
        setCurrentDiscountEdit({
          productId: id,
          value: ordPrDt.discountValue || 0,
          discountType: ordPrDt.discountType || DiscountType.Value,
          isChangingDiscountType: false
        })
      }
    })
    setAnchorEl(event.currentTarget)
  }

  const handleCloseDiscountTypeModule = () => {
    setAnchorEl(null)
  }

  const handleChangeDiscountType = (productId: string, value: DiscountType) => {
    if (!orderProductData) {
      return
    }
    const currentState: IProductItemRequestBody[] = [...orderProductData]
    let newDiscountValue = 0

    const newState = currentState.map(ordRq => {
      if (ordRq.productId === productId) {
        const discountValue = ordRq.discountValue

        if (value == DiscountType.Percent) {
          newDiscountValue = discountValue > 100 ? 100 : discountValue < 0 ? 0 : discountValue
        } else {
          newDiscountValue = discountValue < 0 ? 0 : discountValue
        }

        setCurrentDiscountEdit({
          productId: productId,
          value: newDiscountValue,
          discountType: value,
          isChangingDiscountType: discountValue !== newDiscountValue
        })

        return {
          ...ordRq,
          discountValue: newDiscountValue,
          discountType: value
        }
      }
      return ordRq
    })

    handleUpdateRequestItems(newState)
  }

  const handleShowHideNote = (id: string | null | undefined) => {
    if (orderProductData) {
      const newState: IProductItemRequestBody[] = [...orderProductData].map(item => ({ ...item }))
      newState.forEach(ordRq => {
        if (ordRq.productId === id) {
          ordRq.isShowNote = !ordRq.isShowNote
        }
      })
      handleUpdateRequestItems(newState)
    }
  }

  const open = Boolean(anchorEl)

  return (
    <Box>
      {orderProductData && orderProductData.length > 0 ? (
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
          {orderProductData.map((ordPrDt, index) => (
            <CustomBoxStyled className='box-item' key={ordPrDt.productId}>
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
                        handleShowHideNote(ordPrDt.productId)
                      }}
                      sx={{ cursor: 'pointer' }}>{`${ordPrDt.isShowNote ? 'Ẩn' : 'Hiện'} ghi chú`}</Typography>
                    {ordPrDt.isShowNote && (
                      <TextField
                        size='small'
                        variant='standard'
                        sx={{ minWidth: 400 }}
                        value={ordPrDt.note}
                        placeholder='Ghi chú'
                        type='text'
                        onChange={event => {
                          handleNoteChange(ordPrDt.productId, event)
                        }}
                        inputProps={{ style: { fontSize: '0.75rem' } }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={1} textAlign='center' p={2} py={3}>
                  <FormControl error={isSubmitted && !orderProductControls?.find(x => x.productId === ordPrDt.productId)?.controls.quantity.result.isValid} variant='standard' fullWidth>
                    <TextField
                      error={isSubmitted && !orderProductControls?.find(x => x.productId === ordPrDt.productId)?.controls.quantity.result.isValid}
                      variant='standard'
                      value={ordPrDt.quantity}
                      type='number'
                      onChange={event => {
                        handleQuantityChange(ordPrDt.productId, event)
                      }}
                      inputProps={{ min: 1, style: { textAlign: 'center' } }}
                    />
                    <FormHelperText>{isSubmitted && orderProductControls?.find(x => x.productId === ordPrDt.productId)?.controls.quantity.result.errorMessage}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={1} textAlign='right' p={2} py={3}>
                  <FormControl error={isSubmitted && !orderProductControls?.find(x => x.productId === ordPrDt.productId)?.controls.price.result.isValid} variant='standard' fullWidth>
                    <NumericFormat
                      value={ordPrDt.price}
                      variant='standard'
                      type='text'
                      inputProps={{ min: 0, style: { textAlign: 'right' } }}
                      onChange={event => {
                        handlePriceChange(ordPrDt.productId, event.currentTarget.value)
                      }}
                      min={0}
                      customInput={TextField}
                      decimalScale={2}
                      thousandSeparator=','
                      allowLeadingZeros={false}
                      allowNegative={false}
                      error={isSubmitted && !orderProductControls?.find(x => x.productId === ordPrDt.productId)?.controls.price.result.isValid}
                    />
                    <FormHelperText>{isSubmitted && orderProductControls?.find(x => x.productId === ordPrDt.productId)?.controls.price.result.errorMessage}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={1.5} textAlign='right' p={2} py={3} aria-describedby={''}>
                  <NumericFormat
                    onClick={(event: any) => {
                      handleOpenDiscountModule(ordPrDt.productId, event)
                    }}
                    value={ordPrDt.discountType == DiscountType.Value ? ordPrDt.discountValue : (((ordPrDt.price || 0) * (ordPrDt.quantity || 0)) / 100) * (ordPrDt.discountValue || 0)}
                    variant='standard'
                    type='text'
                    inputProps={{
                      min: 0,
                      style: { textAlign: 'right' },
                      readOnly: true
                    }}
                    customInput={TextField}
                    decimalScale={2}
                    thousandSeparator=','
                    allowLeadingZeros={false}
                    allowNegative={false}
                  />
                  {(ordPrDt.discountValue || 0) > 0 && (ordPrDt.quantity || 0) > 0 && (
                    <Typography color={(ordPrDt.totalPriceAfterDiscount || 0) < 0 ? 'error' : 'success'} fontSize='0.725rem'>
                      {`${ordPrDt.discountPercent?.toFixed(2)} %`}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={1} textAlign='right' p={2} py={3}>
                  <TextField value={currencyVNDFormatter(ordPrDt.totalPriceAfterDiscount || 0)} variant='standard' type='text' inputProps={{ min: 0, style: { textAlign: 'right' } }} />
                </Grid>
                <Grid item xs={1} textAlign='center' p={2} py={3}>
                  <Checkbox
                    checked={ordPrDt.isVat}
                    onChange={event => {
                      const isChecked = event.target.checked
                      handleIsVatChange(ordPrDt.productId, isChecked)
                    }}
                  />
                </Grid>
                <Grid item xs={1} p={2} py={3} textAlign='center'>
                  <IconButton
                    aria-label='delete'
                    onClick={() => {
                      handleRemoveRecord(ordPrDt.productId)
                    }}>
                    <Close />
                  </IconButton>
                </Grid>
              </Grid>
            </CustomBoxStyled>
          ))}
        </>
      ) : (
        <>
          <Box textAlign='center' py={20} border={isSubmitted ? '1px solid #e33232' : 'unset'}>
            <EmptyBox />
            <Typography variant='body2'>Bạn chưa chọn sản phẩm, vui lòng tìm kiếm và chọn sản phẩm ở trên</Typography>
          </Box>
        </>
      )}
      <DiscountItemPopover
        open={open}
        productId={currentDiscountEdit?.productId || ''}
        discountType={currentDiscountEdit?.discountType}
        anchorEl={anchorEl}
        value={currentDiscountEdit?.value || 0}
        handleCloseDiscountTypeModule={handleCloseDiscountTypeModule}
        handleChangeDiscountType={handleChangeDiscountType}
        handleDiscountValueChange={handleDiscountValueChange}
      />
    </Box>
  )
}

const mapStateToProps = (state: RootState) => ({
  isSubmitted: state.orderAdmin.isSubmitted,
  orderProductData: state.orderAdmin.orderRequest.items,
  orderProductControls: state.orderAdmin.controls.product
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateRequestItems: (items: IProductItemRequestBody[]) => dispatch(updateRequestItems(items))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailsBox)
