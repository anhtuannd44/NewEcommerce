import { Autocomplete, Avatar, Badge, Box, Button, Divider, FilterOptionsState, FormControl, FormHelperText, Grid, Link, Paper, TextField, Typography, styled } from '@mui/material'
import { forwardRef, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { IOrderAdminState, IOrderRequestBody, IOrderRequestBodyControl } from 'src/redux/admin/interface/IOrderAdmin'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import { Plus } from 'mdi-material-ui'
import OrderOriginDialog from 'src/views/admin/order/create-order/order-origin-dialog/OrderOriginDialog'
import { IOrderAttribute, IOrderOrigin, IUser } from 'src/redux/admin/interface/IAdminGeneralState'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import { Controller, useFormContext } from 'react-hook-form'
import _ from 'lodash'

export interface IAdditionalInfoBoxProps {
  userList: IUser[] | undefined
  orderAttributeList: IOrderAttribute[] | undefined
  orderOriginList: IOrderOrigin[] | undefined
  filterUserOptions: (options: IUser[], state: FilterOptionsState<IUser>) => IUser[]
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
  const { userList, orderAttributeList, orderOriginList } = props
  const [isOpenOrderOriginDialog, setIsOpenOrderOriginDialog] = useState<boolean>(false)
  const { control } = useFormContext<IOrderRequestBody>()

  const handleOpenOrderOriginDialog = () => {
    setIsOpenOrderOriginDialog(true)
  }

  console.log('re-render')

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
            <Controller
              name='orderCode'
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <TextField
                    name='orderCode'
                    id='orderCode'
                    fullWidth
                    size='small'
                    type='text'
                    label='Mã đơn'
                    placeholder='VD: 2024xxxxxx'
                    helperText='Tự sinh nếu để trống'
                    sx={{
                      fontSize: '0.4rem !important'
                    }}
                    onChange={event => {
                      onChange(event.target.value)
                    }}
                  />
                )
              }}
            />
          </Grid>
          {userList && (
            <Grid item xs={12}>
              <Controller
                name='picStaffId'
                control={control}
                render={({ field: { onChange, value }, fieldState }) => {
                  return (
                    <Autocomplete
                      fullWidth
                      size='small'
                      options={userList}
                      renderInput={params => (
                        <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                          <TextField {...params} error={!!fieldState.error} label='Người phụ trách' />
                          <FormHelperText>{fieldState.error?.message}</FormHelperText>
                        </FormControl>
                      )}
                      onChange={(event, newValue) => {
                        onChange(newValue?.id)
                      }}
                      getOptionLabel={option => option.fullName}
                      renderOption={(props, option) => {
                        return (
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
                              <Typography sx={{ fontWeight: 600 }}>{option?.fullName}</Typography>
                            </Box>
                          </li>
                        )
                      }}
                    />
                  )
                }}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Controller
              name='orderOriginId'
              control={control}
              render={({ field: { onChange, value }, fieldState }) => {
                const orderOrigins = _.clone(orderOriginList || [])
                const orderOriginIds = orderOrigins.filter(x => x.isActive).map(item => item.id)
                return (
                  <Autocomplete
                    fullWidth
                    size='small'
                    id='orderOriginId'
                    options={orderOriginIds}
                    renderInput={params => (
                      <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                        <TextField {...params} error={!!fieldState.error} label='Nguồn' />
                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                      </FormControl>
                    )}
                    onChange={(event, newValue, reason) => {
                      if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                        return
                      }
                      onChange(newValue)
                    }}
                    renderOption={(props, option) => {
                      const item = orderOrigins.find(x => x.id === option)
                      return (
                        <li key={item?.id} {...props}>
                          <Box
                            sx={{
                              display: 'flex',
                              marginLeft: 3,
                              alignItems: 'flex-start',
                              flexDirection: 'column'
                            }}>
                            <Typography sx={{ fontWeight: 400, py: 1 }}>{item?.name}</Typography>
                          </Box>
                        </li>
                      )
                    }}
                    getOptionLabel={option => orderOrigins.find(x => x.id === option)?.name || ''}
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
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name='dateDelivery'
              control={control}
              render={({ field: { onChange, value }, fieldState }) => (
                <DatePickerWrapper>
                  <DatePicker
                    selected={value}
                    showTimeInput
                    showPopperArrow
                    timeFormat='HH:MM'
                    showYearDropdown
                    showMonthDropdown
                    placeholderText='DD-MM-YYYY hh:mm:aa'
                    customInput={<CustomInputs />}
                    dateFormat='dd-MM-yyyy hh:mm:aa'
                    onChange={date => onChange(date)}
                  />
                </DatePickerWrapper>
              )}
            />
          </Grid>
          {userList && (
            <Grid item xs={12}>
              <Controller
                name='constructionStaffIds'
                control={control}
                render={({ field: { onChange }, fieldState }) => (
                  <Autocomplete
                    fullWidth
                    size='small'
                    id='constructionStaffIds'
                    multiple
                    options={userList}
                    renderInput={params => (
                      <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                        <TextField {...params} error={!!fieldState.error} label='Người thi công' />
                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                      </FormControl>
                    )}
                    onChange={(event, newValue, reason) => {
                      if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                        return
                      }
                      onChange(newValue.map(x => x.id))
                    }}
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
                )}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Controller
              name='orderAttributeId'
              control={control}
              render={({ field: { onChange }, fieldState }) => {
                const orderAttributes = _.clone(orderAttributeList || [])
                const orderAttributueIds = orderAttributes.map(item => item.id)
                return (
                  <Autocomplete
                    fullWidth
                    size='small'
                    id='orderAttribute'
                    options={orderAttributueIds}
                    renderInput={params => (
                      <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                        <TextField {...params} error={!!fieldState.error} label='Loại đơn hàng' />
                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                      </FormControl>
                    )}
                    noOptionsText='Chưa có dữ liệu'
                    onChange={(event, newValue) => {
                      onChange(newValue)
                    }}
                    renderOption={(props, option) => {
                      const orderAttribute = orderAttributes.find(x => x.id === option)
                      return (
                        <li key={option} {...props}>
                          <Box
                            sx={{
                              display: 'flex',
                              marginLeft: 3,
                              alignItems: 'flex-start',
                              flexDirection: 'column'
                            }}>
                            <Typography sx={{ fontWeight: 400, py: 1 }}>{orderAttribute?.name}</Typography>
                          </Box>
                        </li>
                      )
                    }}
                    getOptionLabel={option => orderAttributes.find(x => x.id === option)?.name || ''}
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
                              setIsOpenOrderOriginDialog(true)
                            }}
                            style={{ justifyContent: 'flex-start' }}>
                            Quản lý loại đơn hàng
                          </Button>
                          <Divider sx={{ margin: 0 }} />
                          {children}
                        </Paper>
                      )
                    }}
                  />
                )
              }}
            />
          </Grid>
        </Grid>
        <OrderOriginDialog open={isOpenOrderOriginDialog} setIsOpenOrderOriginDialog={setIsOpenOrderOriginDialog} />
        {/* <OrderAttributeDialog open={isOpenOrderOriginDialog} handleClose={handleCloseOrderOriginDialog} /> */}
      </PaperContent>
    </Paper>
  )
}

const mapStateToProps = (state: RootState) => ({
  userList: state.adminGeneral.userList.users,
  orderOriginList: state.adminGeneral.orderOriginList.orderOrigins,
  orderAttributeList: state.adminGeneral.orderAttributeList.orderAttributes
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalInfoBox)
