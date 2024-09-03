'use client'

// MUI Imports
import { Grid2 as Grid, TextField } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

// Type Imports
import type { IProduct } from '@/interface/admin/product/IProduct'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

const ProductPriceSingle = () => {
  const { dictionary } = useDictionary()
  const { control, watch } = useFormContext<IProduct>()

  const manageStockQuantity = watch('manageStockQuantity')

  return (<>
    <Grid container spacing={8} mb={5}>
      <Grid size={4}>
        <Controller
          name={'price'}
          control={control}
          render={({ field: { onChange }, fieldState }) => (
            <NumericFormat
              label={dictionary.adminArea.product.field.productGroup.priceTitle}
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
              helperText={fieldState.error?.message}
              customInput={TextField}
              decimalScale={2}
              thousandSeparator=','
              allowLeadingZeros={false}
              allowNegative={false}
            />
          )}
        />
      </Grid>
      <Grid size={4}>
        <Controller
          name={'wholesalePrice'}
          control={control}
          render={({ field: { onChange }, fieldState }) => (
            <NumericFormat
              fullWidth
              variant='standard'
              type='text'
              label={dictionary.adminArea.product.field.productGroup.wholesalePrice}
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
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>
    </Grid>
    {manageStockQuantity && (
      <Grid container spacing={8}>
        <Grid size={4}>
          <Controller
            name={'stockQuantity'}
            control={control}
            render={({ field: { onChange }, fieldState }) => (
              <NumericFormat
                fullWidth
                variant='standard'
                type='text'
                label={dictionary.adminArea.product.field.manageStockQuantity.label}
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
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid size={4}>
          <Controller
            name={'productCost'}
            control={control}
            render={({ field: { onChange }, fieldState }) => (
              <NumericFormat
                fullWidth
                variant='standard'
                type='text'
                label={dictionary.adminArea.product.field.productGroup.productCost}
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
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    )}
  </>);
}

export default ProductPriceSingle
