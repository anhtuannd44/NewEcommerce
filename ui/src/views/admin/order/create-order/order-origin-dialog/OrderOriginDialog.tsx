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
  Paper,
  Typography,
  TablePagination,
  Backdrop,
  CircularProgress
} from '@mui/material'
import { RootState, dispatch } from 'src/redux/store'
import { connect } from 'react-redux'
import { useState } from 'react'
import { createOrUpdateOrigin } from 'src/services/order'
import { Circle, EyeCheckOutline, EyeOffOutline, Pencil, WindowClose } from 'mdi-material-ui'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import EmptyBox from 'src/views/shared/EmptyBox'
import { IOrderOrigin, IOrderOriginList } from 'src/redux/admin/interface/IAdminGeneralState'
import { IOrderOriginRequest } from 'src/form/admin/interface/ICreateOrEditOrderOrigin'
import CreateOrUpdateOrderOriginDialog from 'src/views/shared/order-origin/CreateOrUpdateOrderOriginDialog'
import { FetchDataResult } from 'src/api/interface/IApiService'
import { ERROR_MESSAGE_COMMON, SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT } from 'src/common/constants'
import { showSnackbar } from 'src/redux/admin/slice/snackbarSlice'
import { updateOriginList } from 'src/redux/admin/slice/adminGeneralSlice'
import { ISingleResult } from 'src/api/response-interface/ISingleResult'

interface IOrderOriginDialogProps {
  open: boolean
  orderOriginList: IOrderOriginList
  setIsOpenOrderOriginDialog: (isOpen: boolean) => void
}

interface IPaging {
  page: number
  itemsPerPage: number
}

interface IEditOrderOriginDialog {
  edittingOrderOrigin: IOrderOriginRequest | null
  orderOriginDialogOpen: boolean
  mode: 'create' | 'update'
}

const OrderOriginDialog = (props: IOrderOriginDialogProps) => {
  const { open, orderOriginList, setIsOpenOrderOriginDialog } = props
  const { orderOrigins, total } = orderOriginList

  const [loading, setLoading] = useState<boolean>(false)
  const [paging, setPaging] = useState<IPaging>({
    page: 0,
    itemsPerPage: 10
  })

  const handleCloseOrderOriginDialog = () => {
    setIsOpenOrderOriginDialog(false)
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPaging(prevPaging => ({ ...prevPaging, page }))
  }

  const [editOriginDialog, setEditOriginDialog] = useState<IEditOrderOriginDialog>({
    edittingOrderOrigin: null,
    orderOriginDialogOpen: false,
    mode: 'create'
  })

  const handlClickUpdateOrderOrigin = (orderOrigin?: IOrderOrigin) => {
    if (orderOrigin) {
      const orderOriginRequest: IOrderOriginRequest = {
        id: orderOrigin.id || undefined,
        name: orderOrigin.name,
        isActive: orderOrigin.isActive
      }

      setEditOriginDialog(prev => ({
        ...prev,
        edittingOrderOrigin: orderOriginRequest,
        orderOriginDialogOpen: true,
        mode: 'update'
      }))
    }
  }

  const handleClickCreateOrderOrigin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    setEditOriginDialog(prev => ({
      ...prev,
      edittingOrderOrigin: null,
      orderOriginDialogOpen: true,
      mode: 'create'
    }))
  }

  const handleCloseEditOrderOriginDialog = () => {
    setEditOriginDialog(prev => ({
      ...prev,
      edittingOrderOrigin: null,
      orderOriginDialogOpen: false
    }))
  }

  const handleEditOrderOriginSubmit = async (data: IOrderOriginRequest): Promise<FetchDataResult<ISingleResult<IOrderOrigin>>> => {
    const updatedOrderOrigin = editOriginDialog.mode === 'update' && editOriginDialog.edittingOrderOrigin ? { ...editOriginDialog.edittingOrderOrigin, ...data } : data

    const itemUpdate: IOrderOriginRequest = {
      id: updatedOrderOrigin.id,
      name: updatedOrderOrigin.name,
      isActive: updatedOrderOrigin.isActive
    }

    return await createOrUpdateOrigin(itemUpdate)
  }

  const handleShowHideOrderOrigin = async (orderOrigin: IOrderOrigin, isActive: boolean) => {
    setLoading(true)
    const itemUpdate = { ...orderOrigin, isActive }
    const response = await createOrUpdateOrigin(itemUpdate)
    if (response.data) {
      dispatch(showSnackbar({ message: SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT, severity: 'success' }))
      dispatch(updateOriginList(response.data.data))
    } else {
      dispatch(showSnackbar({ message: response.error?.message || ERROR_MESSAGE_COMMON, severity: 'error' }))
    }
    setLoading(false)
  }

  return (
    <>
      <Dialog fullWidth maxWidth='xl' open={open} onClose={handleCloseOrderOriginDialog}>
        <Paper sx={{ margin: 0 }}>
          <PaperHeader
            leftHeader={<Typography variant='h6'>Thêm/Chỉnh sửa nguồn đơn hàng</Typography>}
            rightHeader={
              <IconButton
                onClick={() => {
                  handleCloseOrderOriginDialog()
                }}>
                <WindowClose />
              </IconButton>
            }
          />
          <PaperContent>
            <Box display='flex' justifyContent='flex-end'>
              <Button variant='contained' onClick={handleClickCreateOrderOrigin}>
                Thêm mới
              </Button>
            </Box>
            {orderOrigins && orderOrigins.length > 0 ? (
              <>
                <TableContainer sx={{ height: 600, boxShadow: 'none', marginTop: 5 }}>
                  <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' aria-label='sticky table' size={'medium'} stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell key={1} align='left' padding={'normal'} sx={{ width: '30px' }}>
                          STT
                        </TableCell>
                        <TableCell key={2} align='left' padding={'normal'}>
                          Tên Nguồn
                        </TableCell>
                        <TableCell key={3} align='center' padding={'normal'} sx={{ width: '150px' }}>
                          Trạng thái
                        </TableCell>
                        <TableCell key={4} align='right' padding={'normal'} sx={{ width: '40px' }}>
                          Hành động
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderOrigins.slice(paging.page * paging.itemsPerPage, (paging.page + 1) * paging.itemsPerPage).map((row, index) => (
                        <TableRow hover role='checkbox' tabIndex={-1} key={index} sx={{ cursor: 'pointer' }}>
                          <TableCell key={`name-${index}`} align='left'>
                            {paging.page * paging.itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell
                            key={`sku-${index}`}
                            align='left'
                            onClick={() => {
                              handlClickUpdateOrderOrigin(row)
                            }}>
                            <Typography variant='body1'>{row.name}</Typography>
                          </TableCell>
                          <TableCell key={`isActive-${index}`} align='center'>
                            <Tooltip arrow title={row.isActive ? 'Đang hiển thị' : 'Đang ẩn'} placement='top'>
                              <Circle sx={{ color: row.isActive ? 'success.main' : 'error.main', marginTop: 2, fontSize: '1rem' }} />
                            </Tooltip>
                          </TableCell>
                          <TableCell key={`barcode-${index}`} align='right'>
                            <Stack direction='row' spacing={2} justifyContent='flex-end'>
                              <Tooltip arrow title='Sửa' placement='top'>
                                <IconButton
                                  aria-label='edit'
                                  onClick={() => {
                                    handlClickUpdateOrderOrigin(row)
                                  }}>
                                  <Pencil color='warning' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip arrow title={row.isActive ? 'Ẩn' : 'Hiển thị'} placement='top'>
                                <IconButton
                                  aria-label='eyecheck'
                                  onClick={() => {
                                    handleShowHideOrderOrigin(row, !row.isActive)
                                  }}>
                                  {row.isActive ? <EyeOffOutline /> : <EyeCheckOutline />}
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination component='div' rowsPerPageOptions={[-1]} count={total || 0} rowsPerPage={paging.itemsPerPage} page={paging.page} onPageChange={handleChangePage} />
              </>
            ) : (
              <Box textAlign='center' py={20}>
                <EmptyBox />
                <Typography variant='body2'>Chưa có dữ liệu, vui lòng thêm mới nguồn ở trên</Typography>
              </Box>
            )}
          </PaperContent>
        </Paper>
      </Dialog>
      <Backdrop sx={{ color: '#fff', zIndex: 99999 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <CreateOrUpdateOrderOriginDialog
        open={editOriginDialog.orderOriginDialogOpen}
        onClose={handleCloseEditOrderOriginDialog}
        onSubmit={handleEditOrderOriginSubmit}
        orderOrigin={editOriginDialog.edittingOrderOrigin || undefined}
        mode={editOriginDialog.mode}
      />
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  orderOriginList: state.adminGeneral.orderOriginList
})

export default connect(mapStateToProps)(OrderOriginDialog)
