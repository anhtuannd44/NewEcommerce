import { Box, FormControlLabel, Paper, Switch, Tooltip, Typography } from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import { IProductAdmin } from 'src/redux/admin/interface/IProductAdmin'
import { updateGeneralField, updateProductType } from 'src/redux/admin/slice/productAdminSlice'
import { ChangeEvent, useCallback } from 'react'
import PriceSingleProduct from './price/PriceSingleProduct'
import { ProductType } from 'src/common/enums'
import PriceGroupProduct from './price/PriceGroupProduct'
import { InformationOutline } from 'mdi-material-ui'
import PaperContent from 'src/views/shared/paper/PaperContent'
import PaperHeader from 'src/views/shared/paper/PaperHeader'

export interface IPriceProductProps {
  product: IProductAdmin
  updateGeneralField: (field: keyof IProductAdmin, value: boolean) => void
  updateProductType: (productType: ProductType) => void
}

const PriceProduct = (props: IPriceProductProps) => {
  const { product, updateGeneralField, updateProductType } = props

  const handleManageStockQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked
    updateGeneralField('manageStockQuantity', value)
  }

  const handleChangeProductType = (event: ChangeEvent<HTMLInputElement>) => {
    const productType = event.target.checked ? ProductType.GroupedProduct : ProductType.SimpleProduct
    updateProductType(productType)
  }

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
            <Switch color='primary' checked={product.productType == ProductType.GroupedProduct} onChange={handleChangeProductType} />
          </>
        }
      />
      <PaperContent>
        <Box mb={5}>
          <FormControlLabel
            control={<Switch color='primary' checked={product.manageStockQuantity} onChange={handleManageStockQuantityChange} />}
            label='Quản lý số lượng tồn kho?'
            labelPlacement='end'
          />
        </Box>
        {product.productType == ProductType.SimpleProduct ? <PriceSingleProduct /> : <PriceGroupProduct />}
      </PaperContent>
    </Paper>
  )
}

const mapStateToProps = (state: RootState) => ({
  product: state.productAdmin.createOrUpdateProductAdminRequest.product
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateGeneralField: (field: keyof IProductAdmin, value: boolean) => dispatch(updateGeneralField({ field, value })),
  updateProductType: (productType: ProductType) => dispatch(updateProductType(productType))
})

export default connect(mapStateToProps, mapDispatchToProps)(PriceProduct)
