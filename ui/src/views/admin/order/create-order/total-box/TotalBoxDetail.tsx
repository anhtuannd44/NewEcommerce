import { Box, FormControl, FormHelperText, List, ListItem, ListItemText, TextField, Tooltip, Typography } from '@mui/material'
import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import { currencyWithoutVNDFormatter } from 'src/utils/formatCurrency'
import DiscountOrderPopover from '../order-details-box/DiscountOrderPopover'
import { AppDispatch, RootState } from 'src/redux/store'
import { updateGeneralField } from 'src/redux/admin/slice/orderAdminSlice'
import { DiscountType } from 'src/common/enums'
import { IOrderRequestBody, IProductItemRequestBody } from 'src/form/admin/interface/IOrderRequest'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

export interface ITotalBoxDetailProps {}

interface IVatInfo {
  vat: number
  productList: string[]
}

const TotalBoxDetail = (props: ITotalBoxDetailProps) => {
  const { control, setValue, watch, getValues } = useFormContext<IOrderRequestBody>()

  const itemsWatch = useWatch<IOrderRequestBody>({ name: 'items' }) as IProductItemRequestBody[]
  // const discountTypeWatch = useWatch<IOrderRequestBody>({ name: 'discountType' }) as DiscountType
  // const discountValueWatch = useWatch<IOrderRequestBody>({ name: 'discountValue' }) as number
  // const preTotal = useWatch<IOrderRequestBody>({ name: 'preTotal' }) as number
  // const shippingFeeWatch = useWatch<IOrderRequestBody>({ name: 'shippingFee' }) as number
  const totalPriceAfterDiscount = (useWatch<IOrderRequestBody>({ name: 'totalPriceAfterDiscount' }) as number) ?? 0

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [vatInfo, setVatInfo] = useState<IVatInfo>({ vat: 0, productList: [] })

  useEffect(() => {
    let calVat = 0
    let calProductList: string[] = []
    let preTotal = 0
    itemsWatch &&
      itemsWatch.length > 0 &&
      itemsWatch?.map(item => {
        if (item.isVat) {
          calVat += (item.totalPriceAfterDiscount / 100) * 8
          calProductList.push(item.name)
        }
        preTotal += item.totalPriceAfterDiscount
      })
    setVatInfo({ vat: calVat, productList: calProductList })
    setValue('preTotal', preTotal)
    handleCalculateTotal(calVat)
  }, [itemsWatch])

  const handleCalculateTotal = (calVat?: number) => {
    const formValues = getValues()
    const finalTotal = formValues.preTotal + (formValues.shippingFee ?? 0) + (calVat ?? vatInfo.vat) - (formValues.deposit ?? 0)
    setValue('totalPriceAfterDiscount', finalTotal)
  }

  // const handleOpenDiscountModule = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleCloseDiscountTypeModule = () => {
  //   setAnchorEl(null)
  // }

  // const handleChangeDiscountType = (value: DiscountType) => {
  //   updateGeneralField('discountType', value)
  // }

  // const open = Boolean(anchorEl)

  // const handleDiscountValueChange = (value: number) => {
  //   updateGeneralField('discountValue', value)
  // }

  const handleDepositChange = (values: NumberFormatValues) => {
    const valueNumber = values.floatValue ?? 0
    setValue('deposit', valueNumber)
    handleCalculateTotal()
  }

  const handleShippingFeeChange = (values: NumberFormatValues) => {
    const valueNumber = values.floatValue ?? 0
    setValue('shippingFee', valueNumber)
    handleCalculateTotal()
  }

  return (
    <>
      <Box
        component='section'
        sx={{
          p: 2,
          mb: 5,
          border: '1px dashed grey',
          borderRadius: 2
        }}>
        <List>
          <ListItem
            key={1}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={<Controller name='preTotal' control={control} render={({ field: { value } }) => <Typography variant='body1'>{currencyWithoutVNDFormatter(value)}</Typography>} />}>
            <ListItemText primary={`Tạm tính:`} />
          </ListItem>
          <ListItem
            key={2}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={
              <Controller
                name='shippingFee'
                control={control}
                render={({ field: { value }, fieldState }) => (
                  <FormControl error={!!fieldState.error?.message} variant='standard' fullWidth>
                    <NumericFormat
                      value={value}
                      variant='standard'
                      type='text'
                      inputProps={{
                        min: 0,
                        style: { textAlign: 'right' }
                      }}
                      onValueChange={(values, source) => handleShippingFeeChange(values)}
                      customInput={TextField}
                      decimalScale={2}
                      thousandSeparator=','
                      allowLeadingZeros={false}
                      allowNegative={false}
                    />
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            }>
            <ListItemText primary={'Phí giao hàng:'} />
          </ListItem>
          <ListItem
            key={5}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={
              <Tooltip
                title={
                  <>
                    <Typography color='white'>SP Tính VAT:</Typography>
                    {vatInfo.productList.length > 0 &&
                      vatInfo.productList.map(item => (
                        <Typography color='white' key={item}>
                          {item}
                        </Typography>
                      ))}
                  </>
                }
                placement='top'>
                <Typography fontWeight={600} variant='body1'>
                  {currencyWithoutVNDFormatter(vatInfo.vat)}
                </Typography>
              </Tooltip>
            }>
            <ListItemText primary={'Thuế GTGT (VAT 8%):'} />
          </ListItem>
          <ListItem
            key={3}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={
              <NumericFormat
                // onClick={(event: any) => {
                //   handleOpenDiscountModule(event)
                // }}
                // value={discountTypeWatch === DiscountType.Value ? discountValueWatch : (preTotal / 100) * discountValueWatch}
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
            }>
            <ListItemText primary={'Chiết khấu đơn hàng:'} />
          </ListItem>

          <ListItem
            key={4}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={
              <Controller
                name='deposit'
                control={control}
                render={({ field: { value }, fieldState }) => (
                  <NumericFormat
                    value={value}
                    variant='standard'
                    type='text'
                    inputProps={{
                      min: 0,
                      style: { textAlign: 'right' }
                    }}
                    onValueChange={(values, source) => handleDepositChange(values)}
                    customInput={TextField}
                    decimalScale={2}
                    thousandSeparator=','
                    allowLeadingZeros={false}
                    allowNegative={false}
                  />
                )}
              />
            }>
            <ListItemText primary={'Khách đã đặt cọc:'} />
          </ListItem>

          <ListItem
            key={6}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={
              <Controller
                name='customerId'
                control={control}
                render={({ field: { onChange, value }, fieldState }) => (
                  <Typography fontWeight={600} variant='body1'>
                    {currencyWithoutVNDFormatter(totalPriceAfterDiscount)}
                  </Typography>
                )}
              />
            }>
            <ListItemText primary={'Tổng khách phải trả:'} />
          </ListItem>
        </List>
        {/* <DiscountTotalBoxPopover
          open={open}
          discountType={discountType}
          anchorEl={anchorEl}
          value={discountValue}
          handleCloseDiscountTypeModule={handleCloseDiscountTypeModule}
          handleChangeDiscountType={handleChangeDiscountType}
          handleDiscountValueChange={handleDiscountValueChange}
        /> */}
      </Box>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  orderProductData: state.orderAdmin.orderRequest.items,
  orderRequest: state.orderAdmin.orderRequest
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(TotalBoxDetail)
