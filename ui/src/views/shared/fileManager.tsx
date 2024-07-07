import { Alert, Box, CircularProgress, Snackbar, circularProgressClasses } from '@mui/material'
import { useEffect, useState } from 'react'
import { FileLibraryListItem, FileUploadListItem, ReactMediaLibrary } from 'react-media-library'
import { connect } from 'react-redux'
import { getFileList, uploadFile } from 'src/services/file'
import { setLoading } from 'src/redux/admin/slice/fileSlice'
import { AppDispatch, RootState } from 'src/redux/store'

interface IFileManagerProps {
  isOpen: boolean
  loading: boolean
  multipleSelect: boolean
  fileLibraryList: FileLibraryListItem[] | undefined
  getFileList: () => void
  handleFilesSelectCallback: (items: FileLibraryListItem[]) => void
  onClose: () => void
  setLoading: (isLoading: boolean) => void
}

interface ISnackbar {
  isOpen: boolean
  message: string
}

const FileManager = (props: IFileManagerProps) => {
  const { handleFilesSelectCallback, isOpen, fileLibraryList, getFileList, multipleSelect, onClose, loading, setLoading } = props

  const [openSnackbar, setOpenSnackbar] = useState<ISnackbar>({ isOpen: false, message: '' })

  useEffect(() => {
    if (isOpen) {
      getFileList()
    }
  }, [isOpen])

  const handleCloseSnackbar = () => {
    setOpenSnackbar({ isOpen: false, message: '' })
  }

  const finishUploadCallBack = (uploadFiles: FileUploadListItem[]) => {
    setLoading(false)
  }

  const fileUploadCallback = async (file: File) => {
    setLoading(true)
    try {
      await uploadFile(file)
      return true
    } catch (error: any) {
      if (error && error.response && error.response.data) {
        if (error.response.data.code === 'FILE_EXISTED') {
          setOpenSnackbar({ isOpen: true, message: error.response.data.message })
        } else {
          setOpenSnackbar({ isOpen: true, message: 'Có lỗi xảy ra, vui lòng thử lại sau' })
        }
      } else {
        setOpenSnackbar({ isOpen: true, message: 'Có lỗi xảy ra, vui lòng thử lại sau' })
      }
      return false
    }
  }

  return (
    <>
      {loading && (
        <Box height='100%' width='100%' position='fixed' left='0' top='0' zIndex='99999' borderRadius='5px' bgcolor='rgba(255,255,255,.5)'>
          <CircularProgress
            variant='indeterminate'
            disableShrink
            sx={{
              color: theme => (theme.palette.mode === 'light' ? '##9c1aff' : '#308fe8'),
              animationDuration: '550ms',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: 'round'
              }
            }}
            size={60}
            thickness={2}
          />
        </Box>
      )}
      <ReactMediaLibrary
        acceptedTypes={['image/*']}
        modalTitle='Thư viện'
        fileLibraryList={fileLibraryList || []}
        fileUploadCallback={fileUploadCallback}
        filesDeleteCallback={function noRefCheck() {}}
        filesSelectCallback={handleFilesSelectCallback}
        finishUploadCallback={finishUploadCallBack}
        multiSelect={multipleSelect}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Snackbar
        sx={{ zIndex: 9999 }}
        open={openSnackbar.isOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => {
          handleCloseSnackbar()
        }}>
        <Alert severity='error' variant='filled' sx={{ width: '100%' }}>
          {openSnackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  fileLibraryList: state.fileAdmin.fileLibraryList,
  loading: state.fileAdmin.loading
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  getFileList: () => dispatch(getFileList()),
  setLoading: (isLoading: boolean) => dispatch(setLoading(isLoading))
})

export default connect(mapStateToProps, mapDispatchToProps)(FileManager)
