'use client'

// MUI Imports
import { Box, Card, CardContent, CardHeader, FormControlLabel, Switch, Tooltip, Typography } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'
import { Icon } from '@iconify/react'

// Type Imports
import type { IProduct } from '@interface/admin/product/IProduct'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Enum Imports
import { ProductType } from '@/enums/product-enums'

// Component Imports
import ProductPriceSingle from './ProductPriceSingle'
import ProductPriceGroup from './ProductPriceGroup'

const PriceProduct = () => {
  const { dictionary } = useDictionary()
  const { control, watch } = useFormContext<IProduct>()

  const productType = watch('productType')

  return (
    <Card>
      <CardHeader
        title={dictionary.adminArea.product.pricePanel.title}
        action={
          <Controller
            name={'productType'}
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={
                  <Switch
                    color='primary'
                    checked={value === ProductType.GroupedProduct}
                    onChange={event => {
                      onChange(event.target.checked ? ProductType.GroupedProduct : ProductType.SimpleProduct)
                    }}
                  />
                }
                labelPlacement='start'
                label={
                  <Typography variant='body1' justifyContent='center'>
                    {dictionary.adminArea.product.pricePanel.isProductAttributionQuestion}
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
                      <Icon icon='ri:information-2-line' inline style={{ marginLeft: 3 }} />
                    </Tooltip>
                  </Typography>
                }
              />
            )}
          />
        }
      />
      <CardContent>
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
      </CardContent>
    </Card>
  )
}

export default PriceProduct
