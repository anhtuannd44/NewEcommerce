'use client'

// MUI Imports
import { FormControl, FormHelperText, FormLabel, Grid, TextField } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

// Type Imports
import type { IProduct } from '@/interface/admin/product/IProduct'

const ProductPriceSingle = () => {
  const { control, watch } = useFormContext<IProduct>()

  const manageStockQuantity = watch('manageStockQuantity')

  return (
    <>
      <Grid container spacing={8} mb={5}>
        <Grid item xs={4}>
          <Controller
            name={'price'}
            control={control}
            render={({ field: { onChange }, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <FormLabel id='product-price'>Giá sản phẩm</FormLabel>
                <NumericFormat
                  error={!!fieldState.error}
                  aria-labelledby='product-price'
                  fullWidth
                  suffix=' ₫'
                  variant='standard'
                  type='text'
                  inputProps={{ min: 0, style: { textAlign: 'right' } }}
                  onValueChange={values => {
                    onChange(values.floatValue)
                  }}
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
        </Grid>
        <Grid item xs={4}>
          <Controller
            name={'wholesalePrice'}
            control={control}
            render={({ field: { onChange }, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <FormLabel id='wholesale-price'>Giá bán sỉ</FormLabel>
                <NumericFormat
                  fullWidth
                  variant='standard'
                  type='text'
                  suffix=' ₫'
                  inputProps={{ min: 0, style: { textAlign: 'right' } }}
                  onValueChange={values => {
                    onChange(values.floatValue)
                  }}
                  customInput={TextField}
                  decimalScale={2}
                  thousandSeparator=','
                  allowLeadingZeros={false}
                  allowNegative={false}
                  error={!!fieldState.error}
                />
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
      {manageStockQuantity && (
        <Grid container spacing={8}>
          <Grid item xs={4}>
            <Controller
              name={'stockQuantity'}
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <FormLabel id='product-price'>Số lượng tồn kho</FormLabel>
                  <NumericFormat
                    fullWidth
                    variant='standard'
                    type='text'
                    inputProps={{ style: { textAlign: 'right' } }}
                    onValueChange={values => {
                      onChange(values.floatValue)
                    }}
                    customInput={TextField}
                    decimalScale={0}
                    thousandSeparator=','
                    allowLeadingZeros={false}
                    allowNegative={false}
                    error={!!fieldState.error}
                  />
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name={'productCost'}
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <FormLabel id='product-cost'>Giá nhập</FormLabel>
                  <NumericFormat
                    fullWidth
                    variant='standard'
                    type='text'
                    inputProps={{ style: { textAlign: 'right' } }}
                    onValueChange={values => {
                      onChange(values.floatValue)
                    }}
                    customInput={TextField}
                    decimalScale={2}
                    thousandSeparator=','
                    allowLeadingZeros={false}
                    allowNegative={false}
                    error={!!fieldState.error}
                  />
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default ProductPriceSingle
