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
import OrderAttributeDialog from './order-attribute/OrderAttributeDialog'
import { Controller, Control, FieldValues, useFormContext } from 'react-hook-form'
import _ from 'lodash'

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

  const { control } = useFormContext()

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
              helperText='Tự sinh nếu để trống'
              sx={{
                fontSize: '0.4rem !important'
              }}
              onChange={event => {
                updateGeneralField('orderCode', event.target?.value)
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name='picStaffId'
              control={control}
              render={({ field: { onChange, value }, fieldState }) => {
                const users = [...(userList || [])]
                const userIds = users.map(item => item.id)
                return (
                  <Autocomplete
                    fullWidth
                    size='small'
                    options={userIds}
                    renderInput={params => (
                      <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                        <TextField {...params} error={!!fieldState.error} label='Người phụ trách' />
                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                      </FormControl>
                    )}
                    onChange={(event, newValue, reason) => {
                      onChange(newValue)
                    }}
                    getOptionLabel={option => users.find(x => x.id === option)?.fullName || ''}
                    renderOption={(props, option) => {
                      const user = users.find(x => x.id === option)
                      return (
                        <li key={option} {...props}>
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
                            <Typography sx={{ fontWeight: 600 }}>{user?.fullName}</Typography>
                          </Box>
                        </li>
                      )
                    }}
                  />
                )
              }}
            />
          </Grid>
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
                    id='≈å'
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
                        <li key={option} {...props}>
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
                      const a = 1
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
          </Grid>
        </Grid>
        <OrderOriginDialog open={isOpenOrderOriginDialog} setIsOpenOrderOriginDialog={setIsOpenOrderOriginDialog} />
        <OrderAttributeDialog open={isOpenOrderOriginDialog} handleClose={handleCloseOrderOriginDialog} />
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
