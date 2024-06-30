import { Autocomplete, Avatar, Badge, Box, FormControl, FormHelperText, Grid, TextField, Typography, styled } from '@mui/material'
import { connect } from 'react-redux'
import { IUser } from 'src/redux/admin/interface/IAdminGeneralState'
import { IOrderRequestBody } from 'src/redux/admin/interface/IOrderAdmin'
import { updateGeneralField, updateResponseibleStaffIds } from 'src/redux/admin/slice/orderAdminSlice'
import { AppDispatch, RootState } from 'src/redux/store'

export interface IOrderComplainBoxProps {
  userList: IUser[] | undefined
  responsibleStaffIds: string[]
  updateGeneralField: (field: keyof IOrderRequestBody, id: string) => void
  updateResponseibleStaffIds: (values: string[]) => void
}

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const OrderComplainBox = (props: IOrderComplainBoxProps) => {
  const { updateGeneralField, userList, responsibleStaffIds, updateResponseibleStaffIds } = props

  const handleOnChangeResponsibleStaffId = (values: IUser[]) => {
    const newIds = values.map(item => {
      return item.id
    })
    updateResponseibleStaffIds(newIds)
  }
  return (
    <>
      <Grid container spacing={5} mb={5}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            multiline
            rows={4}
            size='small'
            type='text'
            label='Vấn đề'
            placeholder='Vấn đề'
            helperText='Ghi chú vấn đề gặp phải'
            sx={{
              fontSize: '0.4rem !important'
            }}
            onChange={event => {
              updateGeneralField('problem', event.target?.value || '')
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            multiline
            rows={4}
            size='small'
            type='text'
            label='Nguyên nhân'
            placeholder='Nguyên nhân'
            helperText='Ghi chú nguyên nhân'
            sx={{
              fontSize: '0.4rem !important'
            }}
            onChange={event => {
              updateGeneralField('rootCause', event.target?.value || '')
            }}
          />
        </Grid>
        <Grid item xs={6}>
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
            onChange={event => {
              updateGeneralField('solution', event.target?.value || '')
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            fullWidth
            size='small'
            id='ConstructionStaffIds'
            multiple
            options={userList || []}
            renderInput={params => <TextField {...params} label='Người chịu trách nhiệm' />}
            onChange={(event, newValue, reason) => {
              if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                return
              }
              handleOnChangeResponsibleStaffId(newValue)
            }}
            getOptionLabel={option => option.fullName}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
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
      </Grid>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  userList: state.adminGeneral.userList.users,
  responsibleStaffIds: state.orderAdmin.orderRequest.responsibleStaffIds
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateResponseibleStaffIds: (values: string[]) => dispatch(updateResponseibleStaffIds(values)),
  updateGeneralField: (field: keyof IOrderRequestBody, value: string) => dispatch(updateGeneralField({ field, value }))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderComplainBox)
