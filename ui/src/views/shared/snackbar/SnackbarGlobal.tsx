import React from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'
import { hideSnackbar } from 'src/redux/admin/slice/snackbarSlice'

const GlobalSnackbar: React.FC = () => {
  const dispatch = useDispatch()
  const { message, severity, open } = useSelector((state: RootState) => state.snackbar)

  const handleClose = () => {
    dispatch(hideSnackbar())
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }} variant='filled'>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default GlobalSnackbar
