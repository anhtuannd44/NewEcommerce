import { Box, FormControlLabel, Paper, Switch, Tooltip, Typography } from '@mui/material'
import PriceSingleProduct from './price/PriceSingleProduct'
import { ProductType } from 'src/common/enums'
import PriceGroupProduct from './price/PriceGroupProduct'
import { InformationOutline } from 'mdi-material-ui'
import PaperContent from 'src/views/shared/paper/PaperContent'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import { Controller, useFormContext } from 'react-hook-form'
import { IProduct } from 'src/form/admin/product/interface/IProduct'

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
              placement='top'>
              <InformationOutline color='info' fontSize='small' />
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
        {productType === ProductType.SimpleProduct ? <PriceSingleProduct /> : <PriceGroupProduct />}
      </PaperContent>
    </Paper>
  )
}

export default PriceProduct
