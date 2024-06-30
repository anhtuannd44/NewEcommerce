import { Autocomplete, Divider, Grid, Paper, TextField, Typography, createFilterOptions } from '@mui/material'
import { RootState } from 'src/redux/store'
import { initOrderRequestItemControls, updateGeneralField, updateOrderItemControls, updateRequestItems } from 'src/redux/admin/slice/orderAdminSlice'
import { connect } from 'react-redux'
import { currencyVNDFormatter } from 'src/utils/formatCurrency'
import { Box, Magnify } from 'mdi-material-ui'
import OrderComplainBox from './OrderComplainBox'
import OrderDetailsBox, { IOrderDetailsRef } from './order-details-box/OrderDetailsBox'
import TotalBoxDetail from './TotalBoxDetail'
import { IProduct } from 'src/redux/admin/interface/IAdminGeneralState'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import { v4 as uuidv4 } from 'uuid'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { IOrderRequestBody, IProductItemRequestBody } from 'src/form/admin/interface/IOrderRequest'
import { useRef } from 'react'

export interface IProductSelectionBoxProps {
  productList: IProduct[] | undefined
  orderTags: string[] | undefined
}

const ProductSelectionBox = (props: IProductSelectionBoxProps) => {
  const { productList, orderTags } = props

  const filterProductOption = createFilterOptions({
    stringify: (option: IProduct) => `${option.name} ${option.sku}`
  })

  const childRef = useRef<IOrderDetailsRef>(null)

  const handleSelectProduct = (value: IProduct) => {
    if (childRef.current) {
      childRef.current.handleOnChangeSelectProduct(value)
    }
  }

  return (
    <Paper>
      <PaperHeader leftHeader={<Typography variant='h6'>Thông tin sản phẩm</Typography>} />
      <PaperContent sx={{ paddingX: 0 }}>
        <Grid container px={5}>
          <Grid item xs={9}>
            {productList && (
              <Autocomplete
                id='productSelectList'
                options={productList}
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder='Tìm theo tên, Mã SKU'
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <Magnify color='action' style={{ marginRight: '8px' }} />
                    }}
                  />
                )}
                filterOptions={filterProductOption}
                getOptionLabel={option => option.name}
                renderOption={(props, option) => (
                  <li
                    key={uuidv4()}
                    {...props}
                    onMouseDown={() => {
                      handleSelectProduct(option)
                    }}>
                    <Grid container justifyContent='center' alignItems='center'>
                      <Grid item xs={1}>
                        <img src={option.imgUrl ? option.imgUrl : 'https://sapo.dktcdn.net/100/689/126/variants/dinh-am-tuong-1675674468493.jpg'} width={40} height={40} />
                      </Grid>
                      <Grid item xs={7}>
                        <Typography sx={{ fontWeight: 600 }}>{option.name}</Typography>
                        <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                          {option.sku}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} textAlign='right'>
                        <Typography sx={{ fontWeight: 600 }} color='success.main'>
                          {option.price ? currencyVNDFormatter(option.price) : 'Không có giá'}
                        </Typography>
                        <Typography color='secondary'>Tồn kho: {option.stockQuantity}</Typography>
                      </Grid>
                    </Grid>
                  </li>
                )}
              />
            )}
          </Grid>
        </Grid>
        <Divider sx={{ mt: 5, mb: 0 }} />
        <OrderDetailsBox ref={childRef} />
        <Divider sx={{ mt: 5, mb: 0 }} />
        {/* <Grid container p={4} spacing={5}>
          <Grid item xs={8}>
            {orderRequest.isComplain && <OrderComplainBox />}
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <TextField
                  rows={6}
                  fullWidth
                  multiline
                  size='small'
                  type='text'
                  label='Ghi chú đơn hàng'
                  placeholder='Ghi chú đơn hàng'
                  helperText='Ghi chú cho tổng đơn hàng. Bạn cũng có thể ghi chú cho từng đơn hàng ở mỗi sản phẩm phía trên'
                  sx={{
                    fontSize: '0.4rem !important'
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Autocomplete
                  fullWidth
                  multiple
                  size='small'
                  options={orderTags}
                  value={orderRequest.tags}
                  freeSolo
                  renderInput={params => <TextField {...params} label='Tags' />}
                  onChange={(event, newValue, reason) => {
                    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                      return
                    }
                    updateGeneralField('tags', newValue)
                  }}
                  getOptionLabel={option => option}
                  renderOption={(props, option) => (
                    <li key={option} {...props}>
                      <Box
                        sx={{
                          display: 'flex',
                          marginLeft: 3,
                          alignItems: 'flex-start',
                          flexDirection: 'column'
                        }}>
                        <Typography sx={{ fontWeight: 400, py: 1 }}>{option}</Typography>
                      </Box>
                    </li>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <TotalBoxDetail />
          </Grid>
        </Grid> */}
      </PaperContent>
    </Paper>
  )
}

const mapStateToProps = (state: RootState) => ({
  orderRequest: state.orderAdmin.orderRequest,
  orderRequestItemControl: state.orderAdmin.controls.product,
  productList: state.adminGeneral.productList.products,
  orderTags: state.adminGeneral.orderTagList.orderTags
})

export default connect(mapStateToProps)(ProductSelectionBox)
