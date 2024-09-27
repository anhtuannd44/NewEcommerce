'use client'

// React Imports
import type { SetStateAction } from 'react'

// MUI Imports
import {
  Button,
  Dialog,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  TextField,
  CardActions,
  Switch,
  Divider
} from '@mui/material'

// Third-party Imports
import { Icon } from '@iconify/react'
import { toast } from 'react-toastify'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Form Imports
import orderOriginSchema from '@/form/admin/order/schema/createOrUpdateOrderOriginSchema'

// Type Imports
import type { IOrderOriginRequest } from '@/interface/admin/order'

// API Service Imports
import { createOrUpdateOrigin } from '@/services/admin/order'
import InputLabelOneline from '@/components/input-form/InputLabelOneline'

interface ICreateOrderOriginDialog {
  open: boolean
  setIsOpenOrderOriginDialog: (isOpen: boolean) => void
  setLoading: (value: SetStateAction<boolean>) => void
  updateOrderOrigins: (data: IOrderOriginRequest, isEdit: boolean) => void
}

const CreateOrderOriginDialog = (props: ICreateOrderOriginDialog) => {
  const { open, setIsOpenOrderOriginDialog, setLoading, updateOrderOrigins } = props

  const { dictionary } = useDictionary()

  const createForm = useForm<IOrderOriginRequest>({
    resolver: yupResolver(orderOriginSchema(dictionary))
  })

  const handleCloseCreateOrderOriginDialog = () => {
    setIsOpenOrderOriginDialog(false)
  }

  const handleClickCreateOrderOrigin = () => {
    createForm.handleSubmit(handleEditOrderOriginSubmit)()
  }

  const handleEditOrderOriginSubmit = async (data: IOrderOriginRequest) => {
    const itemUpdate: IOrderOriginRequest = {
      id: data.id,
      name: data.name,
      isActive: data.isActive
    }

    setLoading(true)

    try {
      const response = await createOrUpdateOrigin(itemUpdate)

      if (response.error) {
        toast.error(response.error.message || dictionary.messageNotification.apiMessageNotification.error.common)
        setLoading(false)

        return
      }

      response.data?.data && updateOrderOrigins(response.data?.data, false)

      toast.success(dictionary.messageNotification.apiMessageNotification.success.commonUpdate)

      createForm.reset()

      handleCloseCreateOrderOriginDialog()
    } catch {
      toast.error(dictionary.messageNotification.apiMessageNotification.error.common)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog fullWidth maxWidth='md' open={open} onClose={handleCloseCreateOrderOriginDialog}>
      <Card>
        <CardHeader
          title={dictionary.adminArea.order.orderOriginDialog.cardHeaderTitle}
          action={
            <IconButton
              onClick={() => {
                handleCloseCreateOrderOriginDialog()
              }}
            >
              <Icon icon='mdi:window-close' />
            </IconButton>
          }
        />
        <CardContent>
          <InputLabelOneline
            labelColumnNumber={2}
            label={dictionary.adminArea.order.orderOriginDialog.createOrderOriginDialog.field.name.label}
          >
            <Controller
              name='name'
              control={createForm.control}
              render={({ field: { value, onChange }, fieldState }) => (
                <TextField
                  fullWidth
                  size='small'
                  value={value}
                  type='text'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  onChange={onChange}
                />
              )}
            />
          </InputLabelOneline>
          <InputLabelOneline
            labelColumnNumber={2}
            label={dictionary.adminArea.order.orderOriginDialog.createOrderOriginDialog.field.status.label}
          >
            <Controller
              name={'isActive'}
              control={createForm.control}
              render={({ field: { onChange } }) => (
                <Switch
                  color='primary'
                  size='medium'
                  onChange={event => {
                    onChange(event.target.checked)
                  }}
                />
              )}
            />
          </InputLabelOneline>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'right' }}>
          <Button variant='contained' size='small' onClick={handleClickCreateOrderOrigin}>
            {dictionary.adminArea.common.button.submit}
          </Button>
          <Button variant='contained' size='small' onClick={handleCloseCreateOrderOriginDialog} color='error'>
            {dictionary.adminArea.common.button.cancel}
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  )
}

export default CreateOrderOriginDialog
