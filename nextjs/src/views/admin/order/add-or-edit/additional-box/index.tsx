'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import {
  Autocomplete,
  Avatar,
  Backdrop,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField
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

// Component Imports
import InputLabelOneline from '@/components/input-form/InputLabelOneline'
import OrderOriginDialog from './OrderOriginDialog'

interface IAdditionalInfoBoxProps {
  users: IUser[]
  orderAttributes: IOrderAttribute[]
  orderOrigins: IOrderOrigin[]
  orderTags: string[]
  filterUserOptions: (options: IUser[], state: FilterOptionsState<IUser>) => IUser[]
}

const AdditionalInfoBox = (props: IAdditionalInfoBoxProps) => {
  const { users, orderAttributes, orderOrigins, orderTags } = props

  const [isOpenOrderOriginDialog, setIsOpenOrderOriginDialog] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const { dictionary } = useDictionary()
  const { control, setValue } = useFormContext<IOrder>()

  const handleOpenOrderOriginDialog = () => {
    setIsOpenOrderOriginDialog(true)
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={dictionary.adminArea.order.additionalPanelTitle} />
      <CardContent>
        <InputLabelOneline label={dictionary.adminArea.order.field.orderCode.label}>
          <Controller
            name='orderCode'
            control={control}
            render={({ field: { onChange } }) => (
              <TextField
                id='orderCode'
                fullWidth
                size='small'
                type='text'
                placeholder={dictionary.adminArea.order.field.orderCode.placeholder}
                onChange={event => {
                  onChange(event.target.value)
                }}
              />
            )}
          />
        </InputLabelOneline>
        <InputLabelOneline label={dictionary.adminArea.order.field.picStaffId.label}>
          <Controller
            name='picStaffId'
            control={control}
            render={({ field: { onChange }, fieldState }) => (
              <Autocomplete
                fullWidth
                size='small'
                options={users}
                renderInput={params => (
                  <TextField {...params} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
                onChange={(event, newValue) => {
                  onChange(newValue?.id)
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
        </InputLabelOneline>
        <InputLabelOneline label={dictionary.adminArea.order.field.orderOriginId.label}>
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
                  <TextField {...params} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
                onChange={(event, newValue) => {
                  onChange(newValue?.id)
                }}
                renderOption={(props, option) => (
                  <ListItem {...props} key={option.id}>
                    <ListItemText primary={option.name} />
                  </ListItem>
                )}
                getOptionLabel={option => option.name}
                PaperComponent={({ children }) => (
                  <Paper>
                    <Button
                      fullWidth
                      startIcon={<Icon icon='mdi:plus' style={{ border: '1px solid', borderRadius: '99px' }} />}
                      onMouseDown={() => {
                        handleOpenOrderOriginDialog()
                      }}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {dictionary.adminArea.order.field.orderOriginId.addOrderOriginButton}
                    </Button>
                    <Divider sx={{ margin: 0 }} />
                    {children}
                  </Paper>
                )}
              />
            )}
          />
        </InputLabelOneline>
        <InputLabelOneline label={dictionary.adminArea.order.field.dateDelivery.label}>
          <Controller
            name='dateDelivery'
            control={control}
            render={({ field: { onChange, value, ref }, fieldState }) => (
              <DatePickerWrapper
                selected={value}
                showTimeSelect
                timeIntervals={15}
                timeFormat='HH:mm'
                showYearDropdown
                showMonthDropdown
                dateFormat='dd-MM-yyyy hh:mm:aa'
                placeholderText='DD-MM-YYYY hh:mm:aa'
                onChange={date => onChange(date)}
                customInput={
                  <TextField
                    error={!!fieldState.error}
                    fullWidth
                    size='small'
                    slotProps={{ input: { ref } }}
                    helperText={fieldState.error?.message}
                  />
                }
              />
            )}
          />
        </InputLabelOneline>
        <InputLabelOneline label={dictionary.adminArea.order.field.constructionStaffIds.label}>
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
                  <TextField {...params} error={!!fieldState.error} helperText={fieldState.error?.message} />
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
        </InputLabelOneline>
        <InputLabelOneline label={dictionary.adminArea.order.field.orderAttributeId.label}>
          <Controller
            name='orderAttributeId'
            control={control}
            render={({ field: { onChange }, fieldState }) => (
              <Autocomplete
                fullWidth
                size='small'
                options={orderAttributes}
                renderInput={params => (
                  <TextField {...params} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
                onChange={(event, newValue) => {
                  setValue('isComplain', newValue?.name === 'Đơn khiếu nại', {
                    shouldDirty: true,
                    shouldValidate: true
                  })
                  onChange(newValue?.id)
                }}
                renderOption={(props, option) => (
                  <ListItem {...props} key={option.id}>
                    <ListItemText primary={option.name} />
                  </ListItem>
                )}
                getOptionLabel={option => option.name}
                PaperComponent={({ children }) => (
                  <Paper>
                    <Button
                      fullWidth
                      startIcon={<Icon icon='mdi:plus' style={{ border: '1px solid', borderRadius: '99px' }} />}
                      sx={{ justifyContent: 'flex-start' }}
                      onMouseDown={() => {
                        setIsOpenOrderOriginDialog(true)
                      }}
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
        </InputLabelOneline>
        <InputLabelOneline label={dictionary.adminArea.order.field.tags.label}>
          <Controller
            name='tags'
            control={control}
            render={({ field: { onChange }, fieldState }) => (
              <Autocomplete
                fullWidth
                size='small'
                multiple
                freeSolo
                options={orderTags}
                renderInput={params => (
                  <TextField {...params} fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
                onChange={(event, newValue) => {
                  onChange(newValue)
                }}
                getOptionLabel={option => option}
                renderOption={(props, option) => (
                  <ListItem {...props} key={option}>
                    <ListItemText primary={option} />
                  </ListItem>
                )}
              />
            )}
          />
        </InputLabelOneline>
        <OrderOriginDialog
          open={isOpenOrderOriginDialog}
          setIsOpenOrderOriginDialog={setIsOpenOrderOriginDialog}
          setLoading={setLoading}
        />
        <Backdrop sx={{ color: '#fff', zIndex: 99999 }} open={loading}>
          <CircularProgress color='inherit' />
        </Backdrop>
        {/* <OrderAttributeDialog open={isOpenOrderOriginDialog} handleClose={handleCloseOrderOriginDialog} /> */}
      </CardContent>
    </Card>
  )
}

export default AdditionalInfoBox
