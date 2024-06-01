import { Box, List, ListItem, ListItemText, TextField, Tooltip, Typography } from '@mui/material'
import { connect } from 'react-redux'
import { IProductItemRequestBody, IOrderRequestBody } from 'src/redux/admin/interface/IOrderAdmin'
import { useEffect, useState } from 'react'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import { currencyWithoutVNDFormatter } from 'src/utils/formatCurrency'
import DiscountOrderPopover from './DiscountOrderPopover'
import { AppDispatch, RootState } from 'src/redux/store'
import { updateGeneralField } from 'src/redux/admin/slice/orderAdminSlice'
import { DiscountType } from 'src/common/enums'

export interface ITotalBoxDetailProps {
  orderProductData: IProductItemRequestBody[] | undefined
  orderRequest: IOrderRequestBody
  updateGeneralField: (field: keyof IOrderRequestBody, value: number) => void
}

interface IVatInfo {
  vat: number
  productList: string[]
}

const TotalBoxDetail = (props: ITotalBoxDetailProps) => {
  const { orderProductData, orderRequest, updateGeneralField } = props

  const { shippingFee, discountType, discountValue, preTotal, totalPriceAfterDiscount, deposit } = orderRequest

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [vatInfo, setVatInfo] = useState<IVatInfo>({ vat: 0, productList: [] })

  useEffect(() => {
    let calVat = 0
    let calProductList: string[] = []
    orderProductData?.map(item => {
      if (item.isVat) {
        calVat += (item.totalPriceAfterDiscount / 100) * 8
        calProductList.push(item.name)
      }
    })
    setVatInfo({ vat: calVat, productList: calProductList })
  }, [orderProductData])

  const handleOpenDiscountModule = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseDiscountTypeModule = () => {
    setAnchorEl(null)
  }

  const handleChangeDiscountType = (value: DiscountType) => {
    updateGeneralField('discountType', value)
  }

  const open = Boolean(anchorEl)

  const handleDiscountValueChange = (value: number) => {
    updateGeneralField('discountValue', value)
  }

  const handleShippingFeeChange = (values: NumberFormatValues) => {
    const valueNumber = values.floatValue || 0
    updateGeneralField('shippingFee', valueNumber)
  }

  const handleOnChangeDeposit = (value: NumberFormatValues) => {
    const valueNumber = value.floatValue || 0
    updateGeneralField('deposit', valueNumber)
  }

  return (
    <>
      <Box
        component='section'
        sx={{
          p: 2,
          mb: 5,
          border: '1px dashed grey',
          borderRadius: 2
        }}>
        <List>
          <ListItem
            key={1}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={<Typography variant='body1'>{currencyWithoutVNDFormatter(preTotal)}</Typography>}>
            <ListItemText primary={`Tạm tính:`} />
          </ListItem>
          <ListItem
            key={2}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={
              <NumericFormat
                value={shippingFee}
                variant='standard'
                type='text'
                inputProps={{
                  min: 0,
                  style: { textAlign: 'right' }
                }}
                onValueChange={(values, source) => handleShippingFeeChange(values)}
                customInput={TextField}
                decimalScale={2}
                thousandSeparator=','
                allowLeadingZeros={false}
                allowNegative={false}
              />
            }>
            <ListItemText primary={'Phí giao hàng:'} />
          </ListItem>
          <ListItem
            key={5}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={
              <Tooltip
                title={
                  <>
                    <Typography color='white'>SP Tính VAT:</Typography>
                    {vatInfo.productList.length > 0 &&
                      vatInfo.productList.map(item => (
                        <Typography color='white' key={item}>
                          {item}
                        </Typography>
                      ))}
                  </>
                }
                placement='top'>
                <Typography fontWeight={600} variant='body1'>
                  {currencyWithoutVNDFormatter(vatInfo.vat)}
                </Typography>
              </Tooltip>
            }>
            <ListItemText primary={'Thuế GTGT (VAT 8%):'} />
          </ListItem>
          <ListItem
            key={3}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={
              <NumericFormat
                onClick={(event: any) => {
                  handleOpenDiscountModule(event)
                }}
                value={discountType === DiscountType.Value ? discountValue : (preTotal / 100) * discountValue}
                variant='standard'
                type='text'
                inputProps={{
                  min: 0,
                  style: { textAlign: 'right' },
                  readOnly: true
                }}
                customInput={TextField}
                decimalScale={2}
                thousandSeparator=','
                allowLeadingZeros={false}
                allowNegative={false}
              />
            }>
            <ListItemText primary={'Chiết khấu đơn hàng:'} />
          </ListItem>

          <ListItem
            key={4}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={
              <NumericFormat
                value={deposit}
                variant='standard'
                type='text'
                inputProps={{
                  min: 0,
                  style: { textAlign: 'right' }
                }}
                onValueChange={(values, source) => handleOnChangeDeposit(values)}
                customInput={TextField}
                decimalScale={2}
                thousandSeparator=','
                allowLeadingZeros={false}
                allowNegative={false}
              />
            }>
            <ListItemText primary={'Khách đã đặt cọc:'} />
          </ListItem>

          <ListItem
            key={6}
            disableGutters
            sx={{
              height: 30
            }}
            secondaryAction={
              <Typography fontWeight={600} variant='body1'>
                {currencyWithoutVNDFormatter(totalPriceAfterDiscount)}
              </Typography>
            }>
            <ListItemText primary={'Tổng khách phải trả:'} />
          </ListItem>
        </List>
        <DiscountOrderPopover
          open={open}
          discountType={discountType}
          anchorEl={anchorEl}
          value={discountValue}
          handleCloseDiscountTypeModule={handleCloseDiscountTypeModule}
          handleChangeDiscountType={handleChangeDiscountType}
          handleDiscountValueChange={handleDiscountValueChange}
        />
      </Box>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  orderProductData: state.orderAdmin.orderRequest.items,
  orderRequest: state.orderAdmin.orderRequest
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateGeneralField: (field: keyof IOrderRequestBody, value: number | DiscountType) => dispatch(updateGeneralField({ field, value }))
})

export default connect(mapStateToProps, mapDispatchToProps)(TotalBoxDetail)
