'use client'

// React Imports
import { useState, useEffect } from 'react'
import type { SetStateAction } from 'react'

// MUI Imports
import {
  Button,
  Dialog,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Stack,
  IconButton,
  Tooltip,
  Box,
  Typography,
  TablePagination,
  Card,
  CardHeader,
  CardContent,
  TextField
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

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
import type { IOrderOrigin, IOrderOriginRequest } from '@/interface/admin/order'

// API Service Imports
import { createOrUpdateOrigin, getOrderOrigins } from '@/services/admin/order'

// Component Imports
import EmptyBox from '@/views/shared/EmptyBox'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import CreateOrderOriginDialog from './create-order-origin-dialog'

interface IOrderOriginDialogProps {
  open: boolean
  setIsOpenOrderOriginDialog: (isOpen: boolean) => void
  setLoading: (value: SetStateAction<boolean>) => void
}

interface IPaging {
  page: number
  itemsPerPage: number
}

const OrderOriginDialog = (props: IOrderOriginDialogProps) => {
  const { open, setIsOpenOrderOriginDialog, setLoading } = props

  const { dictionary } = useDictionary()
  const theme = useTheme()

  const [orderOrigins, setOrderOrigins] = useState<IOrderOrigin[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [openCreateOrderOriginDialog, setOpenCreateOrderOriginDialog] = useState<boolean>(false)

  const { control, handleSubmit, reset, setValue } = useForm<IOrderOriginRequest>({
    resolver: yupResolver(orderOriginSchema(dictionary))
  })

  const [paging, setPaging] = useState<IPaging>({
    page: 0,
    itemsPerPage: 10
  })

  const initOrderOrigins = async () => {
    setLoading(true)
    const response = await getOrderOrigins()

    if (!response.data) {
      toast.error(response.error?.message || dictionary.messageNotification.apiMessageNotification.error.common)
      setLoading(false)

      return
    }

    setOrderOrigins(response.data.data)
    setLoading(false)
  }

  useEffect(() => {
    if (open) {
      initOrderOrigins()
    }
  }, [open])

  const handleCloseOrderOriginDialog = () => {
    setIsOpenOrderOriginDialog(false)
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPaging(prevPaging => ({ ...prevPaging, page }))
  }

  const handlClickUpdateOrderOrigin = (orderOrigin: IOrderOrigin) => {
    setEditingId(orderOrigin.id)
    setValue('id', orderOrigin.id)
    setValue('name', orderOrigin.name)
    setValue('isActive', orderOrigin.isActive)
  }

  const handleClickCreateOrderOrigin = () => {
    setOpenCreateOrderOriginDialog(true)
  }

  const handleEditOrderOriginSubmit = async (data: IOrderOriginRequest) => {
    const itemUpdate: IOrderOriginRequest = {
      id: data.id,
      name: data.name,
      isActive: data.isActive
    }

    const isEdit = !!itemUpdate.id

    setLoading(true)

    try {
      const response = await createOrUpdateOrigin(itemUpdate)

      if (response.error) {
        toast.error(response.error.message || dictionary.messageNotification.apiMessageNotification.error.common)
        setLoading(false)

        return
      }

      response.data?.data && updateOrderOrigins(response.data?.data, isEdit)

      isEdit && setEditingId(null)

      toast.success(dictionary.messageNotification.apiMessageNotification.success.commonUpdate)
    } catch {
      toast.error(dictionary.messageNotification.apiMessageNotification.error.common)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderOrigins = (data: IOrderOriginRequest, isEdit: boolean) => {
    const updateOrderOrigin = data as IOrderOrigin

    if (isEdit) {
      orderOrigins &&
        setOrderOrigins(prev =>
          prev.map(orderOrigin => (orderOrigin.id === updateOrderOrigin.id ? updateOrderOrigin : orderOrigin))
        )
    } else {
      setOrderOrigins(prev => [...prev, updateOrderOrigin])
    }
  }

  const handleSaveClick = () => {
    handleSubmit(handleEditOrderOriginSubmit)()
  }

  const handleCancelClick = () => {
    reset()
    setEditingId(null)
  }

  const handleShowHideOrderOrigin = async (orderOrigin: IOrderOrigin, isActive: boolean) => {
    const itemUpdate = { ...orderOrigin, isActive }

    handleEditOrderOriginSubmit(itemUpdate)
  }

  return (
    <Dialog fullWidth maxWidth='xl' open={open} onClose={handleCloseOrderOriginDialog}>
      <Card>
        <CardHeader
          title={dictionary.adminArea.order.orderOriginDialog.cardHeaderTitle}
          action={
            <IconButton
              onClick={() => {
                handleCloseOrderOriginDialog()
              }}
            >
              <Icon icon='mdi:window-close' />
            </IconButton>
          }
        />
        <CardContent>
          <Box display='flex' justifyContent='flex-end'>
            <Button variant='contained' size='small' onClick={handleClickCreateOrderOrigin}>
              {dictionary.adminArea.common.button.addNew}
            </Button>
          </Box>
          {orderOrigins.length > 0 ? (
            <>
              <TableContainer sx={{ height: 600, boxShadow: 'none', marginTop: 5 }}>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby='tableTitle'
                  aria-label='sticky table'
                  size={'medium'}
                  className={tableStyles.table}
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell key={1} align='left' padding={'normal'} sx={{ width: '30px' }}>
                        {dictionary.adminArea.order.orderOriginDialog.table.header.no}
                      </TableCell>
                      <TableCell key={2} align='left' padding={'normal'}>
                        {dictionary.adminArea.order.orderOriginDialog.table.header.name}
                      </TableCell>
                      <TableCell key={3} align='center' padding={'normal'} sx={{ width: '150px' }}>
                        {dictionary.adminArea.order.orderOriginDialog.table.header.status}
                      </TableCell>
                      <TableCell key={4} align='right' padding={'normal'} sx={{ width: '40px' }}>
                        {dictionary.adminArea.order.orderOriginDialog.table.header.action}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderOrigins
                      .slice(paging.page * paging.itemsPerPage, (paging.page + 1) * paging.itemsPerPage)
                      .map((row, index) => (
                        <TableRow hover role='checkbox' tabIndex={-1} key={index} sx={{ cursor: 'pointer' }}>
                          <TableCell key={`no-${index}`} align='left'>
                            {paging.page * paging.itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell key={`name-${index}`} align='left'>
                            {editingId === row.id ? (
                              <Controller
                                name='name'
                                control={control}
                                render={({ field: { value, onChange }, fieldState }) => (
                                  <TextField
                                    fullWidth
                                    size='small'
                                    value={value}
                                    type='text'
                                    helperText={fieldState.error?.message}
                                    onChange={onChange}
                                    disabled={editingId !== row.id}
                                  />
                                )}
                              />
                            ) : (
                              row.name
                            )}
                          </TableCell>
                          <TableCell key={`isActive-${index}`} align='center'>
                            <Tooltip
                              arrow
                              title={
                                row.isActive
                                  ? dictionary.adminArea.order.orderOriginDialog.table.body.activeStatus
                                  : dictionary.adminArea.order.orderOriginDialog.table.body.inactiveStatus
                              }
                              placement='top'
                            >
                              <Icon
                                icon='mdi:circle'
                                style={{
                                  color: row.isActive ? theme.palette.success.main : theme.palette.secondary.main,
                                  marginTop: 2,
                                  fontSize: '1rem'
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell key={`action-${index}`} align='right'>
                            {editingId !== row.id ? (
                              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                                <Tooltip arrow title='Sửa' placement='top'>
                                  <IconButton
                                    aria-label='edit'
                                    onClick={() => {
                                      handlClickUpdateOrderOrigin(row)
                                    }}
                                  >
                                    <Icon icon='mdi:pencil' color={theme.palette.warning.main} fontSize='.9em' />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip
                                  arrow
                                  title={
                                    row.isActive
                                      ? dictionary.adminArea.order.orderOriginDialog.table.body.hide
                                      : dictionary.adminArea.order.orderOriginDialog.table.body.show
                                  }
                                  placement='top'
                                >
                                  <IconButton
                                    aria-label='eyecheck'
                                    onClick={() => {
                                      handleShowHideOrderOrigin(row, !row.isActive)
                                    }}
                                  >
                                    <Icon icon={`mdi:eye-${row.isActive ? 'off' : 'check'}-outline`} fontSize='.9em' />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            ) : (
                              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                                <Tooltip arrow title='Lưu lại' placement='top'>
                                  <IconButton aria-label='submit' onClick={handleSaveClick}>
                                    <Icon icon='mdi:check' color={theme.palette.success.main} fontSize='.9em' />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip arrow title={'Hủy'} placement='top'>
                                  <IconButton aria-label='close' onClick={handleCancelClick}>
                                    <Icon icon={'mdi:close'} fontSize='.9em' />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component='div'
                rowsPerPageOptions={[-1]}
                count={orderOrigins.length}
                rowsPerPage={paging.itemsPerPage}
                page={paging.page}
                onPageChange={handleChangePage}
              />
            </>
          ) : (
            <Box textAlign='center' py={20}>
              <EmptyBox />
              <Typography variant='body2'>{dictionary.adminArea.order.orderOriginDialog.noOrderOrigin}</Typography>
            </Box>
          )}
          <CreateOrderOriginDialog
            open={openCreateOrderOriginDialog}
            setIsOpenOrderOriginDialog={setOpenCreateOrderOriginDialog}
            setLoading={setLoading}
            updateOrderOrigins={updateOrderOrigins}
          />
        </CardContent>
      </Card>
    </Dialog>
  )
}

export default OrderOriginDialog
