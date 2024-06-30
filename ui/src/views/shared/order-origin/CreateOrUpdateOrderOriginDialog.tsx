import { Button, Dialog, TextField, FormControl, FormHelperText, IconButton, Paper, Typography, Grid, CircularProgress, DialogActions, Box, FormControlLabel, Switch, Backdrop } from '@mui/material'
import { WindowClose } from 'mdi-material-ui'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form'
import { IOrderOriginRequest } from 'src/form/admin/interface/ICreateOrEditOrderOrigin'
import { yupResolver } from '@hookform/resolvers/yup'
import { orderOriginSchema } from 'src/form/admin/order/createOrUpdateOrderOrigin'
import { useEffect, useState } from 'react'
import { FetchDataResult } from 'src/api/interface/IApiService'
import { IOrderOrigin } from 'src/redux/admin/interface/IAdminGeneralState'
import { dispatch } from 'src/redux/store'
import { showSnackbar } from 'src/redux/admin/slice/snackbarSlice'
import { ERROR_MESSAGE_COMMON, SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT } from 'src/common/constants'
import { updateOriginList } from 'src/redux/admin/slice/adminGeneralSlice'
import { ISingleResult } from 'src/api/response-interface/ISingleResult'

interface ICreateOrUpdateOrderOriginDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: IOrderOriginRequest) => Promise<FetchDataResult<ISingleResult<IOrderOrigin>>>
  orderOrigin?: IOrderOriginRequest
  mode: 'create' | 'update'
}

const CreateOrUpdateOrderOriginDialog = (props: ICreateOrUpdateOrderOriginDialogProps) => {
  const { open, onClose, onSubmit, orderOrigin, mode } = props
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState<boolean>(orderOrigin ? orderOrigin.isActive : true)

  const defaultValue: IOrderOriginRequest = {
    name: orderOrigin?.name || '',
    isActive: orderOrigin ? orderOrigin.isActive : true
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<IOrderOriginRequest>({
    resolver: yupResolver(orderOriginSchema)
  })

  useEffect(() => {
    if (open) {
      reset(defaultValue)
      setIsActive(orderOrigin ? orderOrigin.isActive : true)
    }
  }, [open, orderOrigin, reset])

  const handleClose = () => {
    reset()
    onClose()
  }
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.checked)
    setValue('isActive', event.target.checked)
  }

  const handleFormSubmit: SubmitHandler<IOrderOriginRequest> = async data => {
    setLoading(true)
    const response = await onSubmit(data)
    setLoading(false)
    if (response.data) {
      dispatch(showSnackbar({ message: SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT, severity: 'success' }))
      dispatch(updateOriginList(response.data.data))
      handleClose()
    } else {
      dispatch(showSnackbar({ message: response.error?.message || ERROR_MESSAGE_COMMON, severity: 'error' }))
    }
  }

  const onError = (errors: FieldErrors<IOrderOriginRequest>) => {
    console.log('Validation Errors:', errors)
  }

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={open} onClose={handleClose}>
        <Paper sx={{ margin: 0 }}>
          <PaperHeader
            leftHeader={
              <Box>
                <Typography variant='h6'>{`${mode === 'create' ? 'Thêm' : 'Chỉnh sửa'} nguồn đơn hàng`}</Typography>
                {mode === 'update' && <Typography variant='body1'>Đang chỉnh sửa cho: {orderOrigin?.name}</Typography>}
              </Box>
            }
            rightHeader={
              <IconButton
                onClick={() => {
                  handleClose()
                }}>
                <WindowClose />
              </IconButton>
            }
          />
          <PaperContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl error={!!errors.name} variant='standard' fullWidth>
                  <TextField {...register('name')} autoFocus margin='dense' label='Tên nguồn' fullWidth variant='filled' error={!!errors.name} />
                  <FormHelperText>{errors.name?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <FormControlLabel
                    sx={{ margin: 0 }}
                    labelPlacement='start'
                    control={<Switch {...register('isActive')} checked={isActive} onChange={handleSwitchChange} color='primary' />}
                    label='Trạng thái (Hiện/Ẩn)'
                  />
                </FormControl>
              </Grid>
            </Grid>
          </PaperContent>
        </Paper>
        <DialogActions>
          <Button variant='outlined' size='medium' onClick={handleClose} disabled={loading || isSubmitting}>
            Thoát
          </Button>
          <Button type='button' onClick={handleSubmit(handleFormSubmit, onError)} variant='contained' size='medium' color='primary' disabled={loading || isSubmitting}>
            {loading ? <CircularProgress size={24} /> : mode === 'update' ? 'Cập Nhật' : 'Thêm Mới'}
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop sx={{ color: '#fff', zIndex: 99999 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default CreateOrUpdateOrderOriginDialog
