import { Autocomplete, Avatar, Badge, Box, FormControl, FormHelperText, Grid, TextField, Typography, styled } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { connect } from 'react-redux'
import { IUser } from 'src/redux/admin/interface/IAdminGeneralState'
import { RootState } from 'src/redux/store'
import { IOrderRequestBody } from 'src/form/admin/order/interface/IOrderRequest'

export interface IOrderComplainBoxProps {
  userList: IUser[] | undefined
}

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const OrderComplainBox = (props: IOrderComplainBoxProps) => {
  const { userList } = props

  const { control } = useFormContext<IOrderRequestBody>()

  return (
    <Grid container spacing={5} mb={5}>
      <Grid item xs={6}>
        <Controller
          name='problem'
          control={control}
          render={({ field: { onChange }, fieldState }) => (
            <FormControl error={!!fieldState.error} variant='standard' fullWidth>
              <TextField
                error={!!fieldState.error}
                multiline
                rows={4}
                label='Vấn đề'
                placeholder='Vấn đề'
                sx={{
                  fontSize: '0.4rem !important'
                }}
                onChange={onChange}
                helperText='Ghi chú vấn đề gặp phải'
              />
              <FormHelperText>{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='rootCause'
          control={control}
          render={({ field: { onChange }, fieldState }) => (
            <FormControl error={!!fieldState.error} variant='standard' fullWidth>
              <TextField fullWidth multiline rows={4} size='small' type='text' label='Nguyên nhân' placeholder='Nguyên nhân' helperText='Ghi chú nguyên nhân' onChange={onChange} />
              <FormHelperText>{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='solution'
          control={control}
          render={({ field: { onChange }, fieldState }) => (
            <FormControl error={!!fieldState.error} variant='standard' fullWidth>
              <TextField
                fullWidth
                multiline
                rows={4}
                size='small'
                type='text'
                label='Cách giải quyết'
                placeholder='Cách giải quyết'
                helperText='Ghi chú cách giải quyết'
                sx={{
                  fontSize: '0.4rem !important'
                }}
                onChange={onChange}
              />
              <FormHelperText>{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>
      {userList && (
        <Grid item xs={6}>
          <Controller
            name='responsibleStaffIds'
            control={control}
            render={({ field: { onChange }, fieldState }) => (
              <Autocomplete
                fullWidth
                size='small'
                id='responsibleStaffIds'
                multiple
                options={userList}
                renderInput={params => (
                  <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                    <TextField {...params} error={!!fieldState.error} label='Người chịu trách nhiệm' />
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
    </Grid>
  )
}

const mapStateToProps = (state: RootState) => ({
  userList: state.adminGeneral.userList.users
})

export default connect(mapStateToProps)(OrderComplainBox)
