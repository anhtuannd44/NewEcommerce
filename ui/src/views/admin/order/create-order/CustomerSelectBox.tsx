import { Autocomplete, Avatar, Badge, Box, Button, FilterOptionsState, FormControl, FormHelperText, Grid, Link, Paper, TextField, Typography, styled } from '@mui/material'
import { IOrderRequestBody } from 'src/form/admin/order/interface/IOrderRequest'
import { RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import EmptyBox from '../../../shared/EmptyBox'
import ProductBorrowInfo, { IProductBorrowProps } from './ProductBorrowInfo'
import { Magnify } from 'mdi-material-ui'
import { IUser } from 'src/redux/admin/interface/IAdminGeneralState'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import { Controller, useFormContext } from 'react-hook-form'

export interface ICustomerSelectBoxProps {
  filterUserOptions: (options: IUser[], state: FilterOptionsState<IUser>) => IUser[]
  userList: IUser[] | undefined
}

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const CustomerSelectBox = (props: ICustomerSelectBoxProps) => {
  const { userList, filterUserOptions } = props
  console.log('sssss')
  const { control, setValue } = useFormContext<IOrderRequestBody>()

  const productBorrowInfo: IProductBorrowProps = {
    borrow: '1',
    totalPay: '2',
    returnOrder: '3',
    shippingFail: '4'
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
              <Controller
                name='customerId'
                control={control}
                render={({ field: { onChange, value }, fieldState }) => {
                  const user = userList.find(x => x.id === value)
                  setValue('deliveryAddress', user?.address || '', { shouldValidate: true })
                  return user ? (
                    <>
                      <Box mb={4}>
                        <Typography sx={{ fontSize: '1rem' }}>
                          <Link color='primary' href={`admin/user/${value}`}>
                            {user.fullName}
                          </Link>{' '}
                          - {user.phoneNumber} {user.email && `- ${user.email}`}
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
                              {user.address}
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
                              setValue('customerId', null, { shouldValidate: true })
                            }}>
                            Chọn lại khác hàng
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Autocomplete
                        fullWidth
                        id='customerId'
                        options={userList}
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
                          onChange(newValue?.id)
                        }}
                        filterOptions={filterUserOptions}
                        getOptionLabel={option => option.fullName || ''}
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
                              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                                {option.phoneNumber} - {option.email} - {option.address}
                              </Typography>
                            </Box>
                          </li>
                        )}
                      />
                      <Box pt={5} textAlign='center'>
                        <EmptyBox />
                        <Typography variant='body2'>Vui lòng chọn thông tin khác hàng</Typography>
                      </Box>
                    </>
                  )
                }}
              />
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
  userList: state.adminGeneral.userList.users
})

export default connect(mapStateToProps)(CustomerSelectBox)
