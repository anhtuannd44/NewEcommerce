import { Autocomplete, Avatar, Badge, Box, Button, FilterOptionsState, FormControl, FormHelperText, Grid, Link, Paper, TextField, Typography, styled } from '@mui/material'
import { IOrderRequestBody, IOrderRequestBodyControl } from 'src/redux/admin/interface/IOrderAdmin'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import EmptyBox from '../../shared/EmptyBox'
import ProductBorrowInfo, { IProductBorrowProps } from './ProductBorrowInfo'
import { Magnify } from 'mdi-material-ui'
import { IUser } from 'src/redux/admin/interface/IAdminGeneralState'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import { updateCustomerSelected, updateGeneralField } from 'src/redux/admin/slice/orderAdminSlice'
import { Controller, useFormContext } from 'react-hook-form'
import _ from 'lodash'

export interface ICustomerSelectBoxProps {
  filterUserOptions: (options: IUser[], state: FilterOptionsState<IUser>) => IUser[]
  handleSubmit: () => void
  orderRequestBodyControls: IOrderRequestBodyControl
  orderRequestBody: IOrderRequestBody
  userList: IUser[] | undefined
  isSubmitted: boolean
  updateGeneralField: (field: keyof IOrderRequestBody, id: string) => void
  updateCustomerSelected: (user: IUser | null) => void
}

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const CustomerSelectBox = (props: ICustomerSelectBoxProps) => {
  const { userList, isSubmitted, orderRequestBody, orderRequestBodyControls, handleSubmit, filterUserOptions, updateGeneralField, updateCustomerSelected } = props

  const { control, watch } = useFormContext()

  const productBorrowInfo: IProductBorrowProps = {
    borrow: '1',
    totalPay: '2',
    returnOrder: '3',
    shippingFail: '4'
  }

  const handleSelectCustomer = (user: IUser | null) => {
    updateCustomerSelected(user)
  }

  return (
    <Paper>
      <PaperHeader
        leftHeader={<Typography variant='h6'>Thông tin khách hàng</Typography>}
        rightHeader={
          <Button
            type='submit'
            variant='contained'
            size='large'
            fullWidth
            // onClick={() => {
            //   handleSubmit()
            // }}>
          >
            Hoàn Tất
          </Button>
        }
      />
      <PaperContent
        sx={{
          height: 435,
          overflowY: 'auto'
        }}>
        {userList ? (
          <Grid container spacing={12}>
            <Grid item xs={12}>
              {orderRequestBody.customerId ? (
                <>
                  <Box mb={4}>
                    <Typography sx={{ fontSize: '1rem' }}>
                      <Link color='primary' href={`admin/user/${orderRequestBody.customerId}`}>
                        {userList.find(x => x.id === orderRequestBody.customerId)?.fullName}
                      </Link>{' '}
                      - {userList.find(x => x.id === orderRequestBody.customerId)?.phoneNumber}{' '}
                      {userList.find(x => x.id === orderRequestBody.customerId)?.email && `- ${userList.find(x => x.id === orderRequestBody.customerId)?.email}`}
                    </Typography>
                  </Box>
                  <Grid container spacing={5} mb={4}>
                    <Grid item xs={8}>
                      <Box
                        component='section'
                        sx={{
                          p: 2,
                          mb: 5,
                          border: '1px dashed grey',
                          borderRadius: 2
                        }}>
                        <Typography variant='h6' mb={2} sx={{ fontWeight: 500 }}>
                          ĐỊA CHỈ GIAO HÀNG
                        </Typography>
                        <Typography variant='body1' mb={3}>
                          {userList.find(x => x.id === orderRequestBody.customerId)?.address}
                        </Typography>
                        <Button variant='contained' size='small' color='warning'>
                          Thay đổi
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box
                        component='section'
                        sx={{
                          px: 4,
                          py: 0,
                          mb: 5,
                          border: '1px dashed grey',
                          borderRadius: 2
                        }}>
                        <ProductBorrowInfo {...productBorrowInfo} />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} textAlign='center'>
                      <Button
                        variant='contained'
                        size='small'
                        onClick={() => {
                          updateGeneralField('customerId', '')
                        }}>
                        Chọn lại khác hàng
                      </Button>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Controller
                    name='customerId'
                    control={control}
                    render={({ field: { onChange }, fieldState }) => {
                      const users = _.clone(userList || [])
                      const userIds = users.map(item => item.id)
                      return (
                        <>
                          <Autocomplete
                            fullWidth
                            id='customerId'
                            options={userIds}
                            renderInput={params => (
                              <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                                <TextField
                                  {...params}
                                  error={!!fieldState.error}
                                  label='Tìm theo tên, SĐT hoặc Mã khách hàng ...'
                                  InputProps={{
                                    ...params.InputProps,
                                    startAdornment: <Magnify color='action' style={{ marginRight: '8px' }} />
                                  }}
                                />
                                <FormHelperText>{fieldState.error?.message}</FormHelperText>
                              </FormControl>
                            )}
                            onChange={(event, newValue, reason) => {
                              if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                                return
                              }
                              onChange(newValue)
                            }}
                            // filterOptions={filterUserOptions}
                            getOptionLabel={option => users.find(x => x.id === option)?.fullName || ''}
                            renderOption={(props, option) => {
                              const item = users.find(x => x.id === option)
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
                                    <Typography sx={{ fontWeight: 600 }}>{item?.fullName}</Typography>
                                    <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                                      {item?.phoneNumber} - {item?.email} - {item?.address}
                                    </Typography>
                                  </Box>
                                </li>
                              )
                            }}
                          />
                          <Box pt={5} textAlign='center'>
                            <EmptyBox />
                            <Typography variant='body2'>Vui lòng chọn thông tin khác hàng</Typography>
                          </Box>
                        </>
                      )
                    }}
                  />
                </>
              )}
            </Grid>
          </Grid>
        ) : (
          <Box pt={5} textAlign='center'>
            <EmptyBox />
            <Typography variant='body2'>Danh sách khách hàng trống</Typography>
          </Box>
        )}
      </PaperContent>
    </Paper>
  )
}

const mapStateToProps = (state: RootState) => ({
  orderRequestBody: state.orderAdmin.orderRequest,
  orderRequestBodyControls: state.orderAdmin.controls.order,
  userList: state.adminGeneral.userList.users,
  isSubmitted: state.orderAdmin.isSubmitted
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateGeneralField: (field: keyof IOrderRequestBody, value: string) => dispatch(updateGeneralField({ field, value })),
  updateCustomerSelected: (user: IUser | null) => dispatch(updateCustomerSelected(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomerSelectBox)
