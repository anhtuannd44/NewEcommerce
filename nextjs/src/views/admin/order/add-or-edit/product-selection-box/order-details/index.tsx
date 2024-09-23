'use client'

// React Imports
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

// MUI Imports
import {
  Box,
  Checkbox,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'

// Style Imports

// Third-party Imports
import { NumericFormat } from 'react-number-format'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Icon } from '@iconify/react'
import lodash from 'lodash'

import tableStyles from '@core/styles/table.module.css'

// Util Imports
import { currencyVNDFormatter } from '@/utils/formatCurrency'

// Enum Imports
import { DiscountType } from '@/enums/product-enums'

// Type Imports
import type { IProductInList } from '@/interface/admin/product/IProductInList'
import type { IOrder, IProductItem } from '@/interface/admin/order'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Form Imports
import { defaultOrderItem } from '@/form/admin/order/default-value/orderDefaultValue'

// Component Imports
import NumberInputWithButton from '@/components/input-form/NumberInputWithButton'
import EmptyBox from '@/views/shared/EmptyBox'
import DiscountOrderPopover from './DiscountOrderPopover'

export interface IOrderDetailsRef {
  handleOnChangeSelectProduct: (value: IProductInList) => void
}

const OrderDetailsBox = forwardRef<IOrderDetailsRef>((_, ref) => {
  const { dictionary } = useDictionary()

  const [discountPercent, setDiscountPercent] = useState<number>(0)

  const { control, setValue, getValues, watch } = useFormContext<IOrder>()

  const { append, update, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const watchItemsState = useWatch<IOrder>({ name: 'items' }) as IProductItem[]

  const watchItems = watch('items')

  useEffect(() => {
    let preTotal = 0

    watchItemsState?.map(item => {
      preTotal += item.totalPriceAfterDiscount
    })

    setValue('preTotal', preTotal)
  }, [watchItemsState])

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
    const updateField = lodash.clone(field)

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

  const handleCalculateTotalItem = (item: IProductItem): IProductItem => {
    const price = item.price ?? 0
    const preTotal = price * item.quantity

    const finalPriceAfterDiscount =
      price - (item.discountType === DiscountType.Value ? item.discountValue : (price * item.discountValue) / 100)

    const totalPriceAfterDiscount = finalPriceAfterDiscount * item.quantity

    const discountPercent =
      item.discountType === DiscountType.Percent ? item.discountValue : (item.discountValue / price) * 100

    setDiscountPercent(discountPercent)

    return {
      ...item,
      preTotal,
      totalPriceAfterDiscount
    }
  }

  return (
    <Box>
      {!!watchItems?.length ? (
        <TableContainer>
          <Table
            aria-labelledby='productSelectionTable'
            aria-label='sticky table'
            className={tableStyles.table}
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell width='4%'>
                  <Typography variant='h6' textAlign='center'>
                    {dictionary.adminArea.order.orderDetailsBox.productListTable.header.no}
                  </Typography>
                </TableCell>
                <TableCell width='6%'>
                  <Typography variant='h6' textAlign='center'>
                    {dictionary.adminArea.order.orderDetailsBox.productListTable.header.picture}
                  </Typography>
                </TableCell>
                <TableCell width='40%'>
                  <Typography variant='h6'>
                    {dictionary.adminArea.order.orderDetailsBox.productListTable.header.productDetails}
                  </Typography>
                </TableCell>
                <TableCell align='right' width='10%'>
                  <Typography variant='h6' textAlign='center'>
                    {dictionary.adminArea.order.orderDetailsBox.productListTable.header.quantity}
                  </Typography>{' '}
                </TableCell>
                <TableCell align='right' width='10%'>
                  <Typography variant='h6' textAlign='right'>
                    {dictionary.adminArea.order.orderDetailsBox.productListTable.header.price}
                  </Typography>
                </TableCell>
                <TableCell align='right' width='10%'>
                  <Typography variant='h6' textAlign='right'>
                    {dictionary.adminArea.order.orderDetailsBox.productListTable.header.sale}
                  </Typography>
                </TableCell>
                <TableCell align='right' width='10%'>
                  <Typography variant='h6' textAlign='right'>
                    {dictionary.adminArea.order.orderDetailsBox.productListTable.header.total}
                  </Typography>
                </TableCell>
                <TableCell width='5%'>
                  <Typography variant='h6' textAlign='center'>
                    {dictionary.adminArea.order.orderDetailsBox.productListTable.header.VAT}
                  </Typography>
                </TableCell>
                <TableCell width='5%' align='center'></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {watchItems.map((ordPrDt, index) => (
                <TableRow
                  hover
                  role='grid'
                  tabIndex={-1}
                  key={index}
                  sx={{
                    verticalAlign: 'top'
                  }}
                >
                  <TableCell key={`no-${index}`} align='center'>
                    {index + 1}
                  </TableCell>
                  <TableCell key={`img-${index}`} align='center'>
                    <img
                      src={
                        ordPrDt.imgUrl
                          ? ordPrDt.imgUrl
                          : 'https://sapo.dktcdn.net/100/689/126/variants/dinh-am-tuong-1675674468493.jpg'
                      }
                      width={50}
                      height={50}
                    />
                  </TableCell>
                  <TableCell key={`details-${index}`}>
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
                      >{`${
                        ordPrDt.isShowNote
                          ? dictionary.adminArea.order.orderDetailsBox.productListTable.body.hide
                          : dictionary.adminArea.order.orderDetailsBox.productListTable.body.show
                      } ${dictionary.adminArea.order.orderDetailsBox.productListTable.body.note}`}</Typography>
                      {ordPrDt.isShowNote && (
                        <Controller
                          name={`items.${index}.note`}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <TextField
                              size='small'
                              fullWidth
                              multiline
                              rows={2}
                              variant='outlined'
                              style={{ minWidth: 400 }}
                              slotProps={{
                                input: {
                                  style: {
                                    fontSize: '.8125rem'
                                  }
                                }
                              }}
                              placeholder={dictionary.adminArea.order.orderDetailsBox.productListTable.body.note}
                              type='text'
                              value={value}
                              onChange={event => {
                                onChange(event.target.value)
                              }}
                            />
                          )}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell key={`quantity-${index}`} align='center'>
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field: { value, onChange }, fieldState }) => (
                        <NumberInputWithButton
                          onIncrease={() => onChange(value + 1)}
                          onDecrease={() => onChange(value - 1)}
                        >
                          <NumericFormat
                            variant='standard'
                            type='text'
                            valueIsNumericString={true}
                            onValueChange={values => {
                              handleUpdateItem(index, { quantity: values.floatValue })
                            }}
                            slotProps={{
                              htmlInput: {
                                style: {
                                  textAlign: 'center'
                                }
                              }
                            }}
                            sx={{
                              margin: 'auto'
                            }}
                            isAllowed={values => Number(values.floatValue) < 1000000}
                            value={value}
                            customInput={TextField}
                            thousandSeparator=','
                            decimalScale={0}
                            allowLeadingZeros={false}
                            allowNegative={false}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        </NumberInputWithButton>
                      )}
                    />
                  </TableCell>
                  <TableCell key={`pirce-${index}`} align='right'>
                    <Controller
                      name={`items.${index}.price`}
                      control={control}
                      render={({ field: { value }, fieldState }) => (
                        <NumericFormat
                          variant='standard'
                          type='text'
                          slotProps={{
                            htmlInput: {
                              min: 0,
                              style: { textAlign: 'right' }
                            }
                          }}
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
                  </TableCell>
                  <TableCell key={`discount-${index}`}>
                    <DiscountOrderPopover
                      handleUpdateItem={handleUpdateItem}
                      index={index}
                      discountPercent={discountPercent}
                    />
                  </TableCell>
                  <TableCell key={`total-${index}`} align='right'>
                    <TextField
                      value={currencyVNDFormatter(ordPrDt.totalPriceAfterDiscount || 0)}
                      variant='standard'
                      type='text'
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          style: { textAlign: 'right' }
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell key={`isVat-${index}`} align='center'>
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
                  </TableCell>
                  <TableCell key={`delete-${index}`} align='center'>
                    <IconButton
                      aria-label='delete'
                      onClick={() => {
                        handleRemoveItem(index)
                      }}
                    >
                      <Icon icon='mdi:close' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box textAlign='center' py={20}>
          <EmptyBox />
          <Typography variant='body2'>
            {dictionary.adminArea.order.orderDetailsBox.productListTable.noProductSelected}
          </Typography>
        </Box>
      )}
    </Box>
  )
})

export default OrderDetailsBox
