import { Box, FormControl, FormHelperText, List, ListItem, ListItemText, TextField, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import { currencyWithoutVNDFormatter } from 'src/utils/formatCurrency'
import { DiscountType } from 'src/common/enums'
import { IOrderRequestBody, IProductItemRequestBody } from 'src/form/admin/order/interface/IOrderRequest'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import DiscountTotalBoxPopover from './DiscountTotalBoxPopover'

interface IVatInfo {
  vat: number
  productList: string[]
}

const TotalBoxDetail = () => {
  const { control, setValue, watch, getValues } = useFormContext<IOrderRequestBody>()

  const itemsWatch = useWatch<IOrderRequestBody>({ name: 'items' }) as IProductItemRequestBody[]
  const totalPriceAfterDiscount = (useWatch<IOrderRequestBody>({ name: 'totalPriceAfterDiscount' }) as number) ?? 0

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
    const discount = formValues.discountType === DiscountType.Percent ? ((formValues.discountValue ?? 0) * formValues.preTotal) / 100 : formValues.discountValue
    const discountPercent = formValues.discountType === DiscountType.Percent ? formValues.discountValue : ((formValues.discountValue || 0) * 100) / formValues.preTotal
    const finalTotal = formValues.preTotal - (discount ?? 0) + (formValues.shippingFee ?? 0) + (calVat ?? vatInfo.vat) - (formValues.deposit ?? 0)
    setValue('totalPriceAfterDiscount', finalTotal)
    setValue('discountPercent', discountPercent)
  }

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
          sx={{
            height: 35
          }}
          secondaryAction={<Controller name='preTotal' control={control} render={({ field: { value } }) => <Typography variant='body1'>{currencyWithoutVNDFormatter(value)}</Typography>} />}>
          <ListItemText primary={`Tạm tính:`} />
        </ListItem>
        <ListItem
          key={2}
          sx={{
            height: 35
          }}
          secondaryAction={
            <Controller
              name='shippingFee'
              control={control}
              render={({ field: { value }, fieldState }) => (
                <FormControl error={!!fieldState.error?.message} variant='standard' fullWidth>
                  <NumericFormat
                    value={value ?? 0}
                    variant='standard'
                    type='text'
                    inputProps={{
                      min: 0,
                      style: { textAlign: 'right' }
                    }}
                    onValueChange={values => handleShippingFeeChange(values)}
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
          sx={{
            height: 35
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
              <Typography variant='body1'>{currencyWithoutVNDFormatter(vatInfo.vat)}</Typography>
            </Tooltip>
          }>
          <ListItemText primary={'Thuế GTGT (VAT 8%):'} />
        </ListItem>
        <ListItem
          key={3}
          sx={{
            height: 35
          }}
          secondaryAction={<DiscountTotalBoxPopover handleCalculateTotal={handleCalculateTotal} />}>
          <ListItemText primary={'Chiết khấu đơn hàng:'} />
        </ListItem>

        <ListItem
          key={4}
          sx={{
            height: 35
          }}
          secondaryAction={
            <Controller
              name='deposit'
              control={control}
              render={({ field: { value }, fieldState }) => (
                <FormControl error={!!fieldState.error?.message} variant='standard' fullWidth>
                  <NumericFormat
                    value={value ?? 0}
                    variant='standard'
                    type='text'
                    inputProps={{
                      min: 0,
                      style: { textAlign: 'right' }
                    }}
                    onValueChange={values => handleDepositChange(values)}
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
          <ListItemText primary={'Khách đã đặt cọc:'} />
        </ListItem>

        <ListItem
          key={6}
          sx={{
            height: 35
          }}
          secondaryAction={
            <Typography fontWeight={600} variant='body1'>
              {currencyWithoutVNDFormatter(totalPriceAfterDiscount)}
            </Typography>
          }>
          <ListItemText primary={'Tổng khách phải trả:'} />
        </ListItem>
      </List>
    </Box>
  )
}

export default TotalBoxDetail
