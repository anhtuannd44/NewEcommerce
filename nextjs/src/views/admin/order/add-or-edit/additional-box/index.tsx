'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid2 as Grid,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import type { FilterOptionsState } from '@mui/material'

// Third-party Imports
import { Icon } from '@iconify/react'
import { Controller, useFormContext } from 'react-hook-form'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Type Imports
import type { IUser } from '@/interface/admin/user'
import type { IOrder, IOrderAttribute, IOrderOrigin } from '@/interface/admin/order'

// Styled Component Imports
import DatePickerWrapper from '@/libs/styles/AppReactDatepicker'
import OrderOriginDialog from './OrderOriginDialog'

// Component Imports

interface IAdditionalInfoBoxProps {
  users: IUser[]
  orderAttributes: IOrderAttribute[]
  orderOrigins: IOrderOrigin[]
  filterUserOptions: (options: IUser[], state: FilterOptionsState<IUser>) => IUser[]
}

const AdditionalInfoBox = (props: IAdditionalInfoBoxProps) => {
  const { dictionary } = useDictionary()

  const { users, orderAttributes, orderOrigins } = props
  const [isOpenOrderOriginDialog, setIsOpenOrderOriginDialog] = useState<boolean>(false)
  const { control, setValue } = useFormContext<IOrder>()

  const handleOpenOrderOriginDialog = () => {
    setIsOpenOrderOriginDialog(true)
  }

  return (
    <Card>
      <CardHeader title={dictionary.adminArea.order.additionalPanelTitle} />
      <CardContent>
        <Grid container spacing={5}>
          <Grid size={12}>
            <Controller
              name='orderCode'
              control={control}
              render={({ field: { onChange } }) => (
                <TextField
                  id='orderCode'
                  fullWidth
                  size='small'
                  type='text'
                  label={dictionary.adminArea.order.field.orderCode.label}
                  placeholder={dictionary.adminArea.order.field.orderCode.placeholder}
                  onChange={event => {
                    onChange(event.target.value)
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name='picStaffId'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <Autocomplete
                  fullWidth
                  size='small'
                  options={users}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={!!fieldState.error}
                      label={dictionary.adminArea.order.field.picStaffId.label}
                      helperText={fieldState.error?.message}
                    />
                  )}
                  onChange={(event, newValue) => {
                    onChange(newValue?.id)
                  }}
                  getOptionLabel={option => option.fullName}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id}>
                        <div className='flex items-center plb-2 pli-4 gap-2'>
                          <Avatar
                            alt='John Doe'
                            src='/images/avatars/1.png'
                            sx={{ width: '2.5rem', height: '2.5rem' }}
                          />
                          <div className='flex items-start flex-col'>
                            <Typography sx={{ fontWeight: 600 }}>{option.fullName}</Typography>
                          </div>
                        </div>
                      </li>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name='orderOriginId'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <Autocomplete
                  fullWidth
                  size='small'
                  id='orderOriginId'
                  options={orderOrigins || []}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={!!fieldState.error}
                      label={dictionary.adminArea.order.field.orderOriginId.label}
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

                    onChange(newValue?.id)
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          marginLeft: 3,
                          alignItems: 'flex-start',
                          flexDirection: 'column'
                        }}
                      >
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
                            <Icon
                              icon='mdi:plus'
                              style={{
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
                          style={{ justifyContent: 'flex-start' }}
                        >
                          {dictionary.adminArea.order.field.orderOriginId.addOrderOriginButton}
                        </Button>
                        <Divider sx={{ margin: 0 }} />
                        {children}
                      </Paper>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name='dateDelivery'
              control={control}
              render={({ field: { onChange, value, ref }, fieldState }) => (
                <DatePickerWrapper
                  selected={value}
                  showTimeInput
                  showPopperArrow
                  timeFormat='HH:MM'
                  showYearDropdown
                  showMonthDropdown
                  placeholderText='DD-MM-YYYY hh:mm:aa'
                  customInput={
                    <TextField
                      error={!!fieldState.error}
                      label='Ngày và giờ'
                      fullWidth
                      size='small'
                      inputProps={{ ref }}
                      helperText={fieldState.error?.message}
                    />
                  }
                  dateFormat='dd-MM-yyyy hh:mm:aa'
                  onChange={date => onChange(date)}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name='constructionStaffIds'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <Autocomplete
                  fullWidth
                  size='small'
                  id='constructionStaffIds'
                  multiple
                  options={users}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={!!fieldState.error}
                      label={dictionary.adminArea.order.field.constructionStaffIds.label}
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
          <Grid size={12}>
            <Controller
              name='orderAttributeId'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <Autocomplete
                  fullWidth
                  size='small'
                  options={orderAttributes}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={!!fieldState.error}
                      label={dictionary.adminArea.order.field.orderAttributeId.label}
                      helperText={fieldState.error?.message}
                    />
                  )}
                  onChange={(event, newValue) => {
                    setValue('isComplain', newValue?.name === 'Đơn khiếu nại', {
                      shouldDirty: true,
                      shouldValidate: true
                    })
                    onChange(newValue?.id)
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          marginLeft: 3,
                          alignItems: 'flex-start',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography sx={{ fontWeight: 400, py: 1 }}>{option.name}</Typography>
                      </Box>
                    </li>
                  )}
                  getOptionLabel={option => option.name}
                  PaperComponent={({ children }) => (
                    <Paper>
                      <Button
                        fullWidth
                        startIcon={
                          <Icon
                            icon='mdi:plus'
                            style={{
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
                        style={{ justifyContent: 'flex-start' }}
                      >
                        {dictionary.adminArea.order.field.orderAttributeId.manageOrderAttribute}
                      </Button>
                      <Divider sx={{ margin: 0 }} />
                      {children}
                    </Paper>
                  )}
                />
              )}
            />
          </Grid>
        </Grid>
        <OrderOriginDialog open={isOpenOrderOriginDialog} setIsOpenOrderOriginDialog={setIsOpenOrderOriginDialog} />
        {/* <OrderAttributeDialog open={isOpenOrderOriginDialog} handleClose={handleCloseOrderOriginDialog} /> */}
      </CardContent>
    </Card>
  )
}

export default AdditionalInfoBox
