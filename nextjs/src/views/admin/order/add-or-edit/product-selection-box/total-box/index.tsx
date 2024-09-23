'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { Box, Divider, List, ListItem, ListItemText, TextField, Tooltip, Typography } from '@mui/material'

// Third-party Imports
import { NumericFormat } from 'react-number-format'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import type { NumberFormatValues } from 'react-number-format'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Util Imports
import { currencyWithoutVNDFormatter } from '@/utils/formatCurrency'

// Enum Imports
import { DiscountType } from '@/enums/product-enums'

// Type Imports
import type { IOrder, IProductItem } from '@/interface/admin/order'
import DiscountTotalBoxPopover from './DiscountTotalBoxPopover'

interface IVatInfo {
  vat: number
  productList: string[]
}

const TotalBoxDetail = () => {
  const { dictionary } = useDictionary()
  const { control, setValue, getValues } = useFormContext<IOrder>()

  const itemsWatch = useWatch<IOrder>({ name: 'items' }) as IProductItem[]
  const preTotal = (useWatch<IOrder>({ name: 'preTotal' }) as number) ?? 0
  const totalPriceAfterDiscount = (useWatch<IOrder>({ name: 'totalPriceAfterDiscount' }) as number) ?? 0

  const [vatInfo, setVatInfo] = useState<IVatInfo>({ vat: 0, productList: [] })
  const [discountPercent, setDiscountPercent] = useState<number>(0)

  useEffect(() => {
    let calVat = 0
    const calProductList: string[] = []

    itemsWatch?.map(item => {
      if (item.isVat && item.price && item.quantity > 0) {
        calVat += (item.price / 100) * 8 * item.quantity

        calProductList.push(item.name)
      }
    })
    setVatInfo({ vat: calVat, productList: calProductList })
    handleCalculateTotal(calVat)
  }, [itemsWatch])

  const handleCalculateTotal = (calVat?: number) => {
    const formValues = getValues()

    let finalTotal =
      formValues.preTotal + (formValues.shippingFee ?? 0) + (calVat ?? vatInfo.vat) - (formValues.deposit ?? 0)

    const discountValue = formValues.discountValue

    if (discountValue) {
      const discount =
        formValues.discountType === DiscountType.Percent ? (discountValue * formValues.preTotal) / 100 : discountValue

      const discountPercent = (discount * 100) / formValues.preTotal

      finalTotal -= discount

      setDiscountPercent(discountPercent)
    }

    setValue('totalPriceAfterDiscount', finalTotal)
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
    <Box p={5} border='1px dashed grey' borderRadius={1}>
      <List disablePadding>
        <ListItem
          disablePadding
          disableGutters
          key={1}
          sx={{
            height: 35
          }}
          secondaryAction={<Typography variant='body1'>{currencyWithoutVNDFormatter(preTotal)}</Typography>}
        >
          <ListItemText primary={dictionary.adminArea.order.totalBox.field.preTotal} />
        </ListItem>
        <ListItem
          disablePadding
          disableGutters
          key={2}
          sx={{
            height: 35
          }}
          secondaryAction={
            <Controller
              name='shippingFee'
              control={control}
              render={({ field: { value }, fieldState }) => (
                <NumericFormat
                  fullWidth
                  value={value ?? 0}
                  variant='standard'
                  type='text'
                  slotProps={{
                    htmlInput: {
                      style: { textAlign: 'right' }
                    }
                  }}
                  onValueChange={values => handleShippingFeeChange(values)}
                  customInput={TextField}
                  decimalScale={2}
                  thousandSeparator=','
                  allowLeadingZeros={false}
                  allowNegative={false}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          }
        >
          <ListItemText primary={dictionary.adminArea.order.totalBox.field.shippingFee.label} />
        </ListItem>
        <ListItem
          disablePadding
          disableGutters
          key={5}
          sx={{
            height: 35
          }}
          secondaryAction={
            <Tooltip
              title={
                <>
                  <Typography color='white'>{dictionary.adminArea.order.totalBox.field.VAT.vatList.label}</Typography>
                  {!!vatInfo.productList.length ? (
                    vatInfo.productList.map(item => (
                      <Typography color='white' key={item}>
                        {item}
                      </Typography>
                    ))
                  ) : (
                    <Typography color='white'>
                      {dictionary.adminArea.order.totalBox.field.VAT.vatList.noProductVAT}
                    </Typography>
                  )}
                </>
              }
              placement='top'
            >
              <Typography variant='body1'>{currencyWithoutVNDFormatter(vatInfo.vat)}</Typography>
            </Tooltip>
          }
        >
          <ListItemText primary={dictionary.adminArea.order.totalBox.field.VAT.label} />
        </ListItem>
        <ListItem
          disablePadding
          disableGutters
          key={3}
          sx={{
            marginBottom: 1,
            height: 35
          }}
          secondaryAction={
            <DiscountTotalBoxPopover handleCalculateTotal={handleCalculateTotal} discountPercent={discountPercent} />
          }
        >
          <ListItemText primary={dictionary.adminArea.order.totalBox.field.discount.label} />
        </ListItem>

        <ListItem
          disablePadding
          disableGutters
          key={4}
          sx={{
            height: 35
          }}
          secondaryAction={
            <Controller
              name='deposit'
              control={control}
              render={({ field: { value }, fieldState }) => (
                <NumericFormat
                  fullWidth
                  value={value ?? 0}
                  variant='standard'
                  type='text'
                  slotProps={{
                    htmlInput: {
                      style: { textAlign: 'right' }
                    }
                  }}
                  onValueChange={values => handleDepositChange(values)}
                  customInput={TextField}
                  decimalScale={2}
                  thousandSeparator=','
                  allowLeadingZeros={false}
                  allowNegative={false}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          }
        >
          <ListItemText primary={dictionary.adminArea.order.totalBox.field.deposit.label} />
        </ListItem>
        <Divider
          sx={{
            marginY: 2
          }}
        />
        <ListItem
          disablePadding
          disableGutters
          key={6}
          sx={{
            height: 35
          }}
          secondaryAction={
            <Typography fontWeight={600} variant='h6'>
              {currencyWithoutVNDFormatter(totalPriceAfterDiscount)}
            </Typography>
          }
        >
          <ListItemText
            primary={
              <Typography variant='h6' fontWeight={600}>
                {dictionary.adminArea.order.totalBox.field.total}
              </Typography>
            }
          />
        </ListItem>
      </List>
    </Box>
  )
}

export default TotalBoxDetail
