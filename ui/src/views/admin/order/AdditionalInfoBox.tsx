import { Autocomplete, Avatar, Badge, Box, Button, Divider, FilterOptionsState, FormControl, FormHelperText, Grid, Link, Paper, TextField, Typography, styled } from '@mui/material'
import { forwardRef, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { IOrderAdminState, IOrderRequestBody, IOrderRequestBodyControl } from 'src/redux/admin/interface/IOrderAdmin'
import { AppDispatch, RootState } from 'src/redux/store'
import { updateDateDelivery, updateOrderAttribute, updateGeneralField } from 'src/redux/admin/slice/orderAdminSlice'
import { connect } from 'react-redux'
import { Plus } from 'mdi-material-ui'
import OrderOriginDialog from './order-origin/OrderOriginDialog'
import { IOrderAttribute, IOrderOrigin, IUser } from 'src/redux/admin/interface/IAdminGeneralState'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'

export interface IAdditionalInfoBoxProps {
  userList: IUser[] | undefined
  orderRequest: IOrderAdminState
  orderAttributeList: IOrderAttribute[] | undefined
  orderOriginList: IOrderOrigin[] | undefined
  orderRequestBody: IOrderRequestBody
  orderRequestBodyControls: IOrderRequestBodyControl
  filterUserOptions: (options: IUser[], state: FilterOptionsState<IUser>) => IUser[]
  updateGeneralField: (field: keyof IOrderRequestBody, value: string | string[]) => void
  updateDateDelivery: (value: Date | null | undefined) => void
  updateOrderAttribute: (id: string, isComplain: boolean) => void
}
const CustomInputs = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Ngày hẹn giao' fullWidth size='small' {...props} />
})

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const AdditionalInfoBox = (props: IAdditionalInfoBoxProps) => {
  const { userList, orderRequest, orderRequestBody, orderRequestBodyControls, orderAttributeList, orderOriginList, filterUserOptions, updateDateDelivery, updateOrderAttribute, updateGeneralField } =
    props

  const [isOpenOrderOriginDialog, setIsOpenOrderOriginDialog] = useState<boolean>(false)

  const handleOnChangeOrderAttribute = (value: IOrderAttribute | null | undefined) => {
    let isComplain = false
    if (value && value.name === 'Đơn khiếu nại') {
      isComplain = true
    }
    updateOrderAttribute(value?.id || '', isComplain)
  }

  const handleConstructionStaffsChange = (values: IUser[]) => {
    const idList = values.map(item => {
      return item.id
    })
    updateGeneralField('constructionStaffIds', idList)
  }

  const handleOpenOrderOriginDialog = () => {
    setIsOpenOrderOriginDialog(true)
  }

  const handleCloseOrderOriginDialog = () => {
    setIsOpenOrderOriginDialog(false)
  }

  return (
    <Paper>
      <PaperHeader leftHeader={<Typography variant='h6'>Thông tin bổ sung</Typography>} />
      <PaperContent
        sx={{
          height: '450px',
          overflowY: 'auto'
        }}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              value={orderRequestBody.orderCode}
              size='small'
              type='text'
              label='Mã đơn'
              placeholder='VD: 2024xxxxxx'
              helperText='Nếu để trống, mã đơn sẽ tự động sinh ra với định dạng: Năm + Thứ tự tăng dần'
              sx={{
                fontSize: '0.4rem !important'
              }}
              onChange={event => {
                updateGeneralField('orderCode', event.target?.value)
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              size='small'
              options={userList || []}
              renderInput={params => (
                <FormControl error={orderRequest.isSubmitted && !orderRequestBodyControls.picStaffId.result.isValid} variant='standard' fullWidth>
                  <TextField {...params} error={orderRequest.isSubmitted && !orderRequestBodyControls.picStaffId.result.isValid} label='Người phụ trách' />
                  <FormHelperText>{orderRequest.isSubmitted && orderRequestBodyControls.picStaffId.result.errorMessage}</FormHelperText>
                </FormControl>
              )}
              onChange={(event, newValue, reason) => {
                if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                  return
                }
                updateGeneralField('picStaffId', newValue?.id || '')
              }}
              filterOptions={filterUserOptions}
              getOptionLabel={option => option.fullName}
              renderOption={(props, option) => (
                <li key={option.id} {...props}>
                  <Badge
                    overlap='circular'
                    badgeContent={<BadgeContentSpan />}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}>
                    <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
                  </Badge>
                  <Box
                    sx={{
                      display: 'flex',
                      marginLeft: 3,
                      alignItems: 'flex-start',
                      flexDirection: 'column'
                    }}>
                    <Typography sx={{ fontWeight: 600 }}>{option.fullName}</Typography>
                  </Box>
                </li>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              size='small'
              id='orderOriginId'
              options={orderOriginList?.filter(x => x.isActive) || []}
              renderInput={params => (
                <FormControl variant='standard' fullWidth>
                  <TextField {...params} label='Nguồn' />
                </FormControl>
              )}
              onChange={(event, newValue, reason) => {
                if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                  return
                }
                updateGeneralField('orderOriginId', newValue?.id || '')
              }}
              renderOption={(props, option) => (
                <li key={option.id} {...props}>
                  <Box
                    sx={{
                      display: 'flex',
                      marginLeft: 3,
                      alignItems: 'flex-start',
                      flexDirection: 'column'
                    }}>
                    <Typography sx={{ fontWeight: 400, py: 1 }}>{option.name}</Typography>
                  </Box>
                </li>
              )}
              getOptionLabel={option => option.name}
              PaperComponent={({ children }) => {
                return (
                  <Paper>
                    <Button
                      fullWidth
                      startIcon={
                        <Plus
                          sx={{
                            border: '1px solid',
                            borderRadius: '99px'
                          }}
                        />
                      }
                      sx={{
                        fontSize: '.85rem',
                        fontWeight: 400,
                        px: 7,
                        py: 2,
                        m: 0
                      }}
                      onMouseDown={() => {
                        handleOpenOrderOriginDialog()
                      }}
                      style={{ justifyContent: 'flex-start' }}>
                      Thêm/Chỉnh sửa nguồn
                    </Button>
                    <Divider sx={{ margin: 0 }} />
                    {children}
                  </Paper>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <DatePickerWrapper>
              <DatePicker
                selected={orderRequestBody.dateDelivery}
                showTimeInput
                timeFormat='HH:MM'
                showYearDropdown
                showMonthDropdown
                placeholderText='DD-MM-YYYY hh:mm:aa'
                customInput={<CustomInputs />}
                dateFormat='dd-MM-yyyy hh:mm:aa'
                onChange={(date: Date | null | undefined) => updateDateDelivery(date || null)}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              size='small'
              id='ConstructionStaff'
              multiple
              options={userList || []}
              renderInput={params => (
                <FormControl error={!orderRequestBodyControls.constructionStaffIds.result.isValid} variant='standard' fullWidth>
                  <TextField {...params} error={!orderRequestBodyControls.constructionStaffIds.result.isValid} label='Người thi công' />
                  <FormHelperText>{orderRequestBodyControls.constructionStaffIds.result.errorMessage}</FormHelperText>
                </FormControl>
              )}
              onChange={(event, newValue, reason) => {
                if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                  return
                }
                handleConstructionStaffsChange(newValue)
              }}
              filterOptions={filterUserOptions}
              getOptionLabel={option => option.fullName}
              renderOption={(props, option) => (
                <li key={option.id} {...props}>
                  <Badge
                    overlap='circular'
                    badgeContent={<BadgeContentSpan />}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}>
                    <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
                  </Badge>
                  <Box
                    sx={{
                      display: 'flex',
                      marginLeft: 3,
                      alignItems: 'flex-start',
                      flexDirection: 'column'
                    }}>
                    <Typography sx={{ fontWeight: 600 }}>{option.fullName}</Typography>
                  </Box>
                </li>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              size='small'
              id='orderAttribute'
              options={orderAttributeList || []}
              renderInput={params => <TextField {...params} label='Loại đơn hàng' />}
              noOptionsText='Chưa có dữ liệu'
              onChange={(event, newValue, reason) => {
                handleOnChangeOrderAttribute(newValue)
              }}
              getOptionLabel={option => option.name}
              renderOption={(props, option) => (
                <li key={option.id} {...props}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexDirection: 'column'
                    }}>
                    <Typography>{option.name}</Typography>
                  </Box>
                </li>
              )}
            />
            <Typography variant='body2'>
              Bạn có thể thêm mới loại sản phẩm tại{' '}
              <Link onClick={() => {}} sx={{ cursor: 'pointer' }}>
                đây
              </Link>
            </Typography>
          </Grid>
        </Grid>
        <OrderOriginDialog open={isOpenOrderOriginDialog} handleClose={handleCloseOrderOriginDialog} />
      </PaperContent>
    </Paper>
  )
}

const mapStateToProps = (state: RootState) => ({
  userList: state.adminGeneral.userList.users,
  orderOriginList: state.adminGeneral.orderOriginList.orderOrigins,
  orderAttributeList: state.adminGeneral.orderAttributeList.orderAttributes,
  orderRequest: state.orderAdmin,
  orderRequestBody: state.orderAdmin.orderRequest,
  orderRequestBodyControls: state.orderAdmin.controls.order
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateGeneralField: (field: keyof IOrderRequestBody, value: string | string[]) => dispatch(updateGeneralField({ field, value })),
  updateDateDelivery: (value: Date | null | undefined) => dispatch(updateDateDelivery(value)),
  updateOrderAttribute: (id: string, isComplain: boolean) => dispatch(updateOrderAttribute({ id, isComplain }))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalInfoBox)
