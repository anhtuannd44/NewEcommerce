'use client'

// MUI Imports
import { Autocomplete, Avatar, Grid2 as Grid, TextField, Typography } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'

// Type Imports
import type { IOrder } from '@/interface/admin/order'
import type { IUser } from '@/interface/admin/user'

interface IOrderComplainBoxProps {
  users: IUser[]
}

const OrderComplainBox = (props: IOrderComplainBoxProps) => {
  const { users } = props

  const { control } = useFormContext<IOrder>()

  return (
    <Grid container spacing={5} mb={5}>
      <Grid size={{ xs: 6 }}>
        <Controller
          name='problem'
          control={control}
          render={({ field: { onChange }, fieldState }) => (
            <TextField
              error={!!fieldState.error}
              multiline
              rows={4}
              label='Vấn đề'
              placeholder='Vấn đề'
              onChange={onChange}
              helperText={fieldState.error?.message || 'Ghi chú vấn đề gặp phải'}
            />
          )}
        />
      </Grid>
      <Grid size={6}>
        <Controller
          name='rootCause'
          control={control}
          render={({ field: { onChange }, fieldState }) => (
            <TextField
              fullWidth
              multiline
              rows={4}
              size='small'
              type='text'
              label='Nguyên nhân'
              placeholder='Nguyên nhân'
              helperText={fieldState.error?.message || 'Ghi chú nguyên nhân'}
              onChange={onChange}
            />
          )}
        />
      </Grid>
      <Grid size={6}>
        <Controller
          name='solution'
          control={control}
          render={({ field: { onChange }, fieldState }) => (
            <TextField
              fullWidth
              multiline
              rows={4}
              size='small'
              type='text'
              label='Cách giải quyết'
              placeholder='Cách giải quyết'
              helperText={fieldState.error?.message || 'Ghi chú cách giải quyết'}
              onChange={onChange}
            />
          )}
        />
      </Grid>
      {users && (
        <Grid size={6}>
          <Controller
            name='responsibleStaffIds'
            control={control}
            render={({ field: { onChange }, fieldState }) => (
              <Autocomplete
                fullWidth
                size='small'
                id='responsibleStaffIds'
                multiple
                options={users}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={!!fieldState.error}
                    label='Người chịu trách nhiệm'
                    helperText={fieldState.error?.message}
                  />
                )}
                onChange={(event, newValue, reason) => {
                  if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Backspace' ||
                      (event as React.KeyboardEvent).key === 'Delete') &&
                    reason === 'removeOption'
                  ) {
                    return
                  }

                  onChange(newValue.map(x => x.id))
                }}
                getOptionLabel={option => option.fullName}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <div className='flex items-center plb-2 pli-4 gap-2'>
                      <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
                      <div className='flex items-start flex-col'>
                        <Typography sx={{ fontWeight: 600 }}>{option.fullName}</Typography>
                      </div>
                    </div>
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

export default OrderComplainBox
