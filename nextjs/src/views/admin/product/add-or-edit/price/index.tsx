'use client'

// MUI Imports
import { Box, FormControlLabel, Paper, Switch, Tooltip, Typography } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'
import { Icon } from '@iconify-icon/react'

// Type Imports
import type { IProduct } from '@interface/admin/product/IProduct'

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

  return (
    <Paper>
      <PaperHeader
        leftHeader={<Typography variant='h6'>Giá sản phẩm</Typography>}
        rightHeader={
          <>
            <Typography variant='body1' justifyContent='center'>
              Sản phẩm có biến thể?
            </Typography>
            <Tooltip
              sx={{ marginX: 1, cursor: 'pointer' }}
              title={
                <>
                  <Typography variant='body1' fontSize='.75rem' color='white'>
                    Tạo các thuộc tính để phân biệt các phiên bản khác nhau của từng sản phẩm
                  </Typography>
                  <Typography variant='body2' fontSize='.7rem' color='white'>
                    Ví dụ: Màu sắc, Kích thước, Chất liệu,...
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
                label='Quản lý số lượng tồn kho?'
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
