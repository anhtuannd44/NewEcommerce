import { Button, FormControl, FormHelperText, Grid, Paper, TextField, Typography } from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import { IcreateOrUpdateProductAdminRequest, IProductAdmin, IProductGeneralControl } from 'src/redux/admin/interface/IProductAdmin'
import { updateGeneralField } from 'src/redux/admin/slice/productAdminSlice'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import { useCallback } from 'react'
import _ from 'lodash'

export interface IGeneralInfoProductProps {
  createOrUpdateProductAdminRequest: IcreateOrUpdateProductAdminRequest
  productControl: IProductGeneralControl
  updateGeneralField: (field: keyof IProductAdmin, value: string) => void
  handleCreateProductAdminSubmit: () => void
}

const GeneralInfoProduct = (props: IGeneralInfoProductProps) => {
  const { updateGeneralField, createOrUpdateProductAdminRequest, productControl, handleCreateProductAdminSubmit } = props
  const { isSubmitted, product } = createOrUpdateProductAdminRequest

  const updateGeneralFieldDebounce = useCallback(_.debounce((field: keyof IProductAdmin, value: string) => updateGeneralField(field, value), 1000), [])

  return (
    <Paper>
      <PaperHeader
        leftHeader={<Typography variant='h6'>Thông tin chung</Typography>}
        rightHeader={
          <Button
            type='button'
            variant='contained'
						color='success'
            onClick={() => {
              handleCreateProductAdminSubmit()
            }}>
            Hoàn Tất
          </Button>
        }
      />
      <PaperContent>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <FormControl error={isSubmitted && !productControl.name.result.isValid} variant='standard' fullWidth>
              <TextField
                fullWidth
                type='text'
                label='Tên sản phẩm'
                placeholder='VD: Tủ áo Decor 3 tầng'
                helperText={isSubmitted && !productControl.name.result.isValid ? '' : 'Tên sản phẩm thường KHÔNG bao gồm các thuộc tính như màu sắc, kích cỡ, ...'}
                onChange={event => {
					updateGeneralFieldDebounce('name', event.target?.value)
                }}
                error={isSubmitted && !productControl.name.result.isValid}
              />
              <FormHelperText>{isSubmitted && productControl.name.result.errorMessage}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type='text'
              label='Đường dẫn tĩnh'
              placeholder='VD: san-pham-01'
              helperText='Đường dẫn tĩnh để tối ưu hóa SEO. Nếu để trống, hệ thống tự sinh ra theo tên sản phẩm'
              sx={{
                fontSize: '0.4rem !important'
              }}
              onChange={event => {
                updateGeneralFieldDebounce('seoUrl', event.target?.value)
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl error={isSubmitted && !productControl.sku.result.isValid} variant='standard' fullWidth>
              <TextField
                fullWidth
                type='text'
                label='Mã sản phẩm'
                placeholder='VD: FIVO0293'
                helperText={isSubmitted && !productControl.sku.result.isValid ? '' : 'Mã không trùng lặp để định danh sản phẩm'}
                sx={{
                  fontSize: '0.4rem !important'
                }}
                onChange={event => {
					updateGeneralFieldDebounce('sku', event.target?.value)
                }}
                error={isSubmitted && !productControl.sku.result.isValid}
              />
              <FormHelperText>{isSubmitted && productControl.sku.result.errorMessage}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl error={isSubmitted && !productControl.unit.result.isValid} variant='standard' fullWidth>
              <TextField
                fullWidth
                type='text'
                label='Đơn vị tính'
                placeholder='VD: Cái, chai, ly, ...'
                helperText={isSubmitted && !productControl.unit.result.isValid ? '' : 'Đơn vị tính của sản phẩm (Cái, chai, ly, ...)'}
                sx={{
                  fontSize: '0.4rem !important'
                }}
                onChange={event => {
					updateGeneralFieldDebounce('unit', event.target?.value)
                }}
                error={isSubmitted && !productControl.unit.result.isValid}
              />
              <FormHelperText>{isSubmitted && productControl.unit.result.errorMessage}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </PaperContent>
    </Paper>
  )
}

const mapStateToProps = (state: RootState) => ({
  productControl: state.productAdmin.controls.createEditProductAdminControls.productGeneralControl,
  createOrUpdateProductAdminRequest: state.productAdmin.createOrUpdateProductAdminRequest
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateGeneralField: (field: keyof IProductAdmin, value: string) => dispatch(updateGeneralField({ field, value }))
})

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInfoProduct)
