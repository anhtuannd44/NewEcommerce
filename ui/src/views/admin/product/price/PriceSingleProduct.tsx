import { FormControl, FormLabel, Grid, TextField } from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import { IProductAdmin } from 'src/redux/admin/interface/IProductAdmin'
import { updateGeneralField } from 'src/redux/admin/slice/productAdminSlice'
import { NumericFormat } from 'react-number-format'

export interface IPriceSingleProductProps {
  product: IProductAdmin
  updateGeneralField: (field: keyof IProductAdmin, value: number) => void
}

const PriceSingleProduct = (props: IPriceSingleProductProps) => {
  const { product, updateGeneralField } = props

  return (
    <>
      <Grid container spacing={8} mb={5}>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <FormLabel id='product-price'>Giá sản phẩm</FormLabel>
            <NumericFormat
              aria-labelledby='product-price'
              fullWidth
              value={product.price || ''}
              suffix=' ₫'
              variant='standard'
              type='text'
              inputProps={{ min: 0, style: { textAlign: 'right' } }}
              onValueChange={values => {
                const value = values.floatValue || 0
                updateGeneralField('price', value)
              }}
              customInput={TextField}
              decimalScale={2}
              thousandSeparator=','
              allowLeadingZeros={false}
              allowNegative={false}
            />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <FormLabel id='wholesale-price'>Giá bán sỉ</FormLabel>
            <NumericFormat
              fullWidth
              value={product.oldPrice || ''}
              variant='standard'
              type='text'
              suffix=' ₫'
              inputProps={{ min: 0, style: { textAlign: 'right' } }}
              onValueChange={values => {
                const value = values.floatValue || 0
                updateGeneralField('oldPrice', value)
              }}
              customInput={TextField}
              decimalScale={2}
              thousandSeparator=','
              allowLeadingZeros={false}
              allowNegative={false}
            />
          </FormControl>
        </Grid>
      </Grid>
      {product.manageStockQuantity && (
        <Grid container spacing={8}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <FormLabel id='product-price'>Số lượng tồn kho</FormLabel>
              <NumericFormat
                fullWidth
                value={product.stockQuantity || ''}
                variant='standard'
                type='text'
                inputProps={{ style: { textAlign: 'right' } }}
                onValueChange={values => {
                  const value = values.floatValue || 0
                  updateGeneralField('stockQuantity', value)
                }}
                customInput={TextField}
                decimalScale={2}
                thousandSeparator=','
                allowLeadingZeros={false}
                allowNegative={false}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <FormLabel id='product-cost'>Giá nhập</FormLabel>
              <NumericFormat
                fullWidth
                value={product.productCost || ''}
                variant='standard'
                type='text'
                suffix=' ₫'
                inputProps={{ style: { textAlign: 'right' } }}
                onValueChange={values => {
                  const value = values.floatValue || 0
                  updateGeneralField('productCost', value)
                }}
                defaultValue={null}
                customInput={TextField}
                decimalScale={2}
                thousandSeparator=','
                allowLeadingZeros={false}
                allowNegative={false}
              />
            </FormControl>
          </Grid>
        </Grid>
      )}
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  product: state.productAdmin.createOrUpdateProductAdminRequest.product
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateGeneralField: (field: keyof IProductAdmin, value: number) => dispatch(updateGeneralField({ field, value }))
})

export default connect(mapStateToProps, mapDispatchToProps)(PriceSingleProduct)
