'use client'

// MUI Imports
import { Autocomplete, Avatar, Grid2 as Grid, ListItem, ListItemAvatar, ListItemText, TextField } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Type Imports
import type { IOrder } from '@/interface/admin/order'
import type { IUser } from '@/interface/admin/user'

interface IOrderComplainBoxProps {
  users: IUser[]
}

const OrderComplainBox = (props: IOrderComplainBoxProps) => {
  const { users } = props

  const { dictionary } = useDictionary()
  const { control } = useFormContext<IOrder>()

  return (
    <Grid container spacing={5} mt={5}>
      <Grid size={6}>
        <Controller
          name='problem'
          control={control}
          render={({ field: { onChange }, fieldState }) => (
            <TextField
              fullWidth
              error={!!fieldState.error}
              multiline
              size='small'
              rows={4}
              label={dictionary.adminArea.order.field.problem.label}
              onChange={onChange}
              helperText={fieldState.error?.message}
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
              label={dictionary.adminArea.order.field.rootCause.label}
              helperText={fieldState.error?.message}
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
              label={dictionary.adminArea.order.field.solution.label}
              helperText={fieldState.error?.message}
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
                id='responsibleStaffIds'
                size='small'
                multiple
                options={users}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={!!fieldState.error}
                    label={dictionary.adminArea.order.field.responsibleStaffIds.label}
                    helperText={fieldState.error?.message}
                  />
                )}
                onChange={(event, newValue) => {
                  onChange(newValue.map(x => x.id))
                }}
                getOptionLabel={option => option.fullName}
                renderOption={(props, option) => (
                  <ListItem {...props} key={option.id}>
                    <ListItemAvatar>
                      <Avatar src='/images/avatars/1.png' sx={{ width: '2.2rem', height: '2.2rem' }} />
                    </ListItemAvatar>
                    <ListItemText primary={option.fullName} />
                  </ListItem>
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
