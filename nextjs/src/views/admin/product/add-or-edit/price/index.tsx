'use client'

// MUI Imports
import { Box, FormControlLabel, Paper, Switch, Tooltip, Typography } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'
import { Icon } from '@iconify-icon/react'

// Type Imports
import type { IProduct } from '@interface/admin/product/IProduct'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Enum Imports
import { ProductType } from '@/enums/product-enums'

// Component Imports
import PaperHeader from '@components/paper/PaperHeader'
import PaperContent from '@components/paper/PaperContent'
import ProductPriceSingle from './ProductPriceSingle'
import ProductPriceGroup from './ProductPriceGroup'

const PriceProduct = () => {
  const { control, watch } = useFormContext<IProduct>()

  const productType = watch('productType')

  const { dictionary } = useDictionary()

  return (
    <Paper>
      <PaperHeader
        leftHeader={<Typography variant='h6'>{dictionary.adminArea.product.pricePanel.title}</Typography>}
        rightHeader={
          <>
            <Typography variant='body1' justifyContent='center'>
              {dictionary.adminArea.product.pricePanel.isProductAttributionQuestion}
            </Typography>
            <Tooltip
              sx={{ marginX: 1, cursor: 'pointer' }}
              title={
                <>
                  <Typography variant='body1' fontSize='.75rem' color='white'>
                    {dictionary.adminArea.product.pricePanel.productAttributDescriptionFirst}
                  </Typography>
                  <Typography variant='body2' fontSize='.7rem' color='white'>
                    {dictionary.adminArea.product.pricePanel.productAttributDescriptionSecond}
                  </Typography>
                </>
              }
              placement='top'
            >
              <Icon icon='ri:information-2-line' />
            </Tooltip>
            <Controller
              name={'productType'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Switch
                  color='primary'
                  checked={value === ProductType.GroupedProduct}
                  onChange={event => {
                    onChange(event.target.checked ? ProductType.GroupedProduct : ProductType.SimpleProduct)
                  }}
                />
              )}
            />
          </>
        }
      />
      <PaperContent>
        <Box mb={5}>
          <Controller
            name={'manageStockQuantity'}
            control={control}
            render={({ field: { onChange } }) => (
              <FormControlLabel
                control={
                  <Switch
                    color='primary'
                    onChange={event => {
                      onChange(event.target.checked)
                    }}
                  />
                }
                label={dictionary.adminArea.product.field.manageStockQuantity.questionTitle}
                labelPlacement='end'
              />
            )}
          />
        </Box>
        {productType === ProductType.SimpleProduct ? <ProductPriceSingle /> : <ProductPriceGroup />}
      </PaperContent>
    </Paper>
  )
}

export default PriceProduct
