import {
  Button,
  Dialog,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  FormControl,
  FormHelperText,
  Stack,
  IconButton,
  Tooltip,
  Box,
  FormGroup,
  Paper,
  Typography,
  Backdrop,
  CircularProgress,
  TablePagination
} from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import _ from 'lodash'
import { connect } from 'react-redux'
import { ChangeEvent, useEffect, useState } from 'react'
import { createOrUpdateOrigin } from 'src/services/order'
import { CheckCircle, Circle, EyeCheckOutline, EyeOffOutline, Pencil, WindowClose } from 'mdi-material-ui'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import EmptyBox from 'src/views/shared/EmptyBox'
import { IOrderOrigin, IOrderOriginList, IRequestStatus } from 'src/redux/admin/interface/IAdminGeneralState'
import { createOrUpdateOriginList } from 'src/redux/admin/slice/adminGeneralSlice'
import { IMessageCommon } from 'src/redux/admin/interface/ICommon'
import { handlePushMessageSnackbar } from 'src/redux/admin/slice/orderAdminSlice'
import { MessageType } from 'src/common/enums'
import { ERROR_MESSAGE_COMMON, SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT } from 'src/common/constants'

interface IOrderOriginState {
  createRequest: ICreateOrderOriginRequest
  editRequest: IEditOrderOriginRequest[]
  paging: {
    page: number
    itemsPerPage: number
  }
  status: IRequestStatus
}

interface ICreateOrderOriginRequest {
  name: string
  isSubmitted: boolean
}

interface IEditOrderOriginRequest {
  item: IOrderOrigin
  currentItem: IOrderOrigin
  isEditing: boolean
}

interface IOrderAttributeDialogProps {
  open: boolean
  orderOriginList: IOrderOriginList
  createOrUpdateOriginList: (item: IOrderOrigin) => void
  handlePushMessageSnackbar: (message: IMessageCommon) => void
  handleClose: () => void
}

const OrderAttributeDialog = (props: IOrderAttributeDialogProps) => {
  const { open, orderOriginList, createOrUpdateOriginList, handlePushMessageSnackbar, handleClose } = props
  const initOrderOriginState: IOrderOriginState = {
    createRequest: {
      name: '',
      isSubmitted: false
    },
    editRequest: [],
    paging: {
      page: 0,
      itemsPerPage: 10
    },
    status: {
      isLoading: false,
      isSubmitted: false,
      isSuccess: false,
      isSentRequest: false
    }
  }

  const [state, setState] = useState<IOrderOriginState>(initOrderOriginState)

  const mapListToEditRequest = (list: IOrderOrigin[]) => {
    const returnList = list.map(item => {
      return { item: { ...item }, currentItem: { ...item }, isEditing: false } as IEditOrderOriginRequest
    })
    setState(prev => ({ ...prev, editRequest: returnList }))
  }

  useEffect(() => {
    if (open && orderOriginList) {
      mapListToEditRequest([...(orderOriginList.orderOrigins || [])])
    }
  }, [open, orderOriginList])

  const handleOnChangeCreateName = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setState(pre => ({
      ...pre,
      createRequest: {
        ...pre.createRequest,
        name: value
      }
    }))
  }

  const handleChangePage = (newPage: number) => {
    setState(pre => ({
      ...pre,
      paging: {
        ...pre.paging,
        page: newPage
      }
    }))
  }

  const handleSubmitCreate = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    setState(prev => ({ ...prev, createRequest: { ...prev.createRequest, isSubmitted: true } }))
    setState(pre => ({
      ...pre,
      status: {
        ...pre.status,
        isSubmitted: true
      }
    }))
    if (state.createRequest.name) {
      setState(pre => ({
        ...pre,
        status: {
          ...pre.status,
          isLoading: true,
          isSuccess: false
        }
      }))
      const response = await createOrUpdateOrigin({ id: null, name: state.createRequest.name, isActive: true })
      const newStatus = { ...state.status, isLoading: false }
      if (response.isSuccess && response.data) {
        newStatus.isSubmitted = false
        newStatus.isSuccess = true
        handlePushMessageSnackbar({ type: MessageType.Success, text: SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT })
        createOrUpdateOriginList(response.data)
      } else {
        handlePushMessageSnackbar({ type: MessageType.Error, text: response.message || ERROR_MESSAGE_COMMON })
        newStatus.isSuccess = false
      }
      setState(pre => ({
        ...pre,
        status: newStatus
      }))
    }
  }

  const handleChangeEditMode = (id: string | null, isEditing: boolean) => {
    const currentList: IEditOrderOriginRequest[] = _.cloneDeep(state.editRequest)
    currentList.forEach(item => {
      if (item.item.id === id) {
        item.isEditing = isEditing
        if (!isEditing) {
          item.item.name = item.currentItem.name
        }
      }
    })
    setState(pre => ({
      ...pre,
      editRequest: currentList
    }))
  }

  const handleOnChangeNameEdit = (id: string | null, name: string) => {
    const editRq = [...state.editRequest].map(item => {
      if (item.item.id === id) {
        return { ...item, item: { ...item.item, name: name } }
      }
      return item
    })
    setState(prev => ({ ...prev, editRequest: editRq }))
  }

  const handleSubmitEdit = async (id: string | null, isShow?: boolean) => {
    const currentList = [...state.editRequest]
    if (currentList.length > 0) {
      const editItem = { ...currentList.find(x => x.item.id === id) }
      if (editItem && editItem.item && editItem.item.name) {
        if (isShow !== undefined) {
          editItem.item = { ...editItem.item, isActive: isShow }
        }
        setState(pre => ({
          ...pre,
          status: {
            ...pre.status,
            isSubmitted: true
          }
        }))
        setState(pre => ({
          ...pre,
          status: {
            ...pre.status,
            isLoading: true,
            isSuccess: false
          }
        }))
        const response = await createOrUpdateOrigin(editItem.item)
        const newStatus = { ...state.status, isLoading: false }
        const newEditRequest = [...state.editRequest]
        if (response.isSuccess && response.data) {
          newStatus.isSubmitted = false
          newStatus.isSuccess = true
          newEditRequest.forEach(item => {
            if (item.item.id === id) {
              item.isEditing = false
            }
          })
          handlePushMessageSnackbar({ type: MessageType.Success, text: SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT })
          createOrUpdateOriginList(response.data)
        } else {
          handlePushMessageSnackbar({ type: MessageType.Error, text: response.message || ERROR_MESSAGE_COMMON })
          newStatus.isSuccess = false
        }
        setState(pre => ({
          ...pre,
          editRequest: newEditRequest,
          status: newStatus
        }))
      }
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth='xl' open={open} onClose={handleClose}>
        <Paper sx={{ margin: 0 }}>
          <PaperHeader
            leftHeader={<Typography variant='h6'>Thêm/Chỉnh sửa nguồn đơn hàng</Typography>}
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
            <Box display='flex' justifyContent='flex-end'>
              <Box>
                <FormGroup row>
                  <FormControl error={state.createRequest.isSubmitted && !state.createRequest.name} variant='standard'>
                    <TextField
                      size='small'
                      id='name'
                      name='name'
                      sx={{ minWidth: '300px' }}
                      label='Tên nguồn'
                      variant='filled'
                      onChange={handleOnChangeCreateName}
                      error={state.createRequest.isSubmitted && !state.createRequest.name}
                    />
                  </FormControl>
                  <Button variant='contained' size='small' onClick={handleSubmitCreate}>
                    Thêm mới
                  </Button>
                </FormGroup>
                <FormHelperText component='p' sx={{ color: 'error.main' }}>
                  {state.createRequest.isSubmitted && !state.createRequest.name && 'Không được để trống'}
                </FormHelperText>
              </Box>
            </Box>
            {state.editRequest.length > 0 ? (
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
                      {state.editRequest.slice(state.paging.page * state.paging.itemsPerPage, (state.paging.page + 1) * state.paging.itemsPerPage).map((row, index) => (
                        <TableRow hover role='checkbox' tabIndex={-1} key={index} sx={{ cursor: 'pointer' }}>
                          <TableCell key={`name-${index}`} align='left'>
                            {(state.paging.page) * state.paging.itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell key={`sku-${index}`} align='left'>
                            {!row.isEditing ? (
                              <Typography variant='body1'>{row.item.name}</Typography>
                            ) : (
                              <FormControl error={state.status.isSubmitted && !row.item.name} variant='standard' fullWidth>
                                <TextField
                                  id={`sku-${index}`}
                                  name={`sku-${index}`}
                                  value={row.item.name}
                                  fullWidth
                                  variant='filled'
                                  onChange={event => {
                                    handleOnChangeNameEdit(row.item.id, event.currentTarget.value)
                                  }}
                                  error={state.status.isSubmitted && !row.item.name}
                                />
                                <FormHelperText>{state.status.isSubmitted && !row.item.name && 'Không được để trống'}</FormHelperText>
                              </FormControl>
                            )}
                          </TableCell>
                          <TableCell key={`isActive-${index}`} align='center'>
                            <Tooltip arrow title={row.item.isActive ? 'Đang hiển thị' : 'Đang ẩn'} placement='top'>
                              <Circle sx={{ color: row.item.isActive ? 'success.main' : 'error.main', marginTop: 2, fontSize: '1rem' }} />
                            </Tooltip>
                          </TableCell>
                          <TableCell key={`barcode-${index}`} align='right'>
                            <Stack direction='row' spacing={2} justifyContent='flex-end'>
                              {row.isEditing ? (
                                <>
                                  <Tooltip arrow title='Lưu' placement='top'>
                                    <IconButton
                                      aria-label='submit-edit'
                                      onClick={() => {
                                        handleSubmitEdit(row.item.id)
                                      }}>
                                      <CheckCircle color='success' />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip arrow title='Hủy' placement='top'>
                                    <IconButton
                                      aria-label='submit-edit'
                                      onClick={() => {
                                        handleChangeEditMode(row.item.id, false)
                                      }}>
                                      <WindowClose />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <>
                                  <Tooltip arrow title='Sửa' placement='top'>
                                    <IconButton
                                      aria-label='edit'
                                      onClick={() => {
                                        handleChangeEditMode(row.item.id, true)
                                      }}>
                                      <Pencil color='warning' />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip arrow title={row.item.isActive ? 'Ẩn' : 'Hiển thị'} placement='top'>
                                    <IconButton
                                      aria-label='eyecheck'
                                      onClick={() => {
                                        handleSubmitEdit(row.item.id, !row.item.isActive)
                                      }}>
                                      {row.item.isActive ? <EyeOffOutline /> : <EyeCheckOutline />}
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component='div'
									rowsPerPageOptions={[-1]}
                  count={state.editRequest.length}
                  rowsPerPage={state.paging.itemsPerPage}
                  page={state.paging.page}
                  onPageChange={(event, newPage) => {
                    handleChangePage(newPage)
                  }}
                />
              </>
            ) : (
              <Box textAlign='center' py={20}>
                <EmptyBox />
                <Typography variant='body2'>Chưa có nguồn sản phẩm nào, vui lòng thêm mới nguồn ở trên</Typography>
              </Box>
            )}
          </PaperContent>
        </Paper>
      </Dialog>
      <Backdrop sx={{ color: '#fff', zIndex: 99999 }} open={state.status.isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  orderOriginList: state.adminGeneral.orderOriginList
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  createOrUpdateOriginList: (item: IOrderOrigin) => dispatch(createOrUpdateOriginList(item)),
  handlePushMessageSnackbar: (message: IMessageCommon) => dispatch(handlePushMessageSnackbar(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderAttributeDialog)
