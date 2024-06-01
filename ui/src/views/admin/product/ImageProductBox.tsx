import { Box, Grid, IconButton, Paper, Typography } from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import { IProductFile } from 'src/redux/admin/interface/IProductAdmin'
import { updateAlbum, updateMainPicture } from 'src/redux/admin/slice/productAdminSlice'
import { CloudUpload, Delete } from '@mui/icons-material'
import { useState } from 'react'
import { Plus } from 'mdi-material-ui'
import FileManager from 'src/views/shared/fileManager'
import { FileLibraryListItem } from 'react-media-library'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'

export interface IImageProductBoxProps {
  album: IProductFile[] | []
  mainPicture: IProductFile
  updateMainPicture: (mainPicture: IProductFile) => void
  updateAlbum: (files: IProductFile[]) => void
}

const ImageProductBox = (props: IImageProductBoxProps) => {
  const { album, mainPicture, updateMainPicture, updateAlbum } = props

  const [isOpenFileManager, setIsOpenFileManager] = useState<{ isOpen: boolean; target: 'main' | 'album' | '' }>({ isOpen: false, target: 'main' })

  const handleFilesSelectCallbackForMainPicture = (items: FileLibraryListItem[]) => {
    if (items && items.length > 0) {
      updateMainPicture({ fileId: items[0]._id as string, virtualPath: items[0].thumbnailUrl || '' })
    }
    setIsOpenFileManager({ isOpen: false, target: '' })
  }

  const handleFilesSelectCallbackForAlbum = (items: FileLibraryListItem[]) => {
    const currentAlbum = [...album]
    if (items && items.length > 0) {
      items.map(item => {
        if (currentAlbum.findIndex(x => x.fileId === item._id) === -1) {
          const addFile: IProductFile = {
            fileId: item._id as string,
            virtualPath: item.thumbnailUrl || ''
          }
          currentAlbum.push(addFile)
        }
      })
      updateAlbum(currentAlbum)
    }
    setIsOpenFileManager({ isOpen: false, target: '' })
  }

  const onFileManagerClose = () => {
    setIsOpenFileManager({ isOpen: false, target: 'main' })
  }

  const handleRemoveMainPicture = () => {
    updateMainPicture({ fileId: null, virtualPath: '' })
  }

  const handleRemoveItemInAlbum = (fileId: string | null) => {
    const currentAlbum = [...album]
    const files = currentAlbum.filter(item => item.fileId != fileId)
    updateAlbum(files)
  }

  return (
    <Paper>
      <PaperHeader leftHeader={<Typography variant='h6'>Ảnh sản phẩm</Typography>} />
      <PaperContent>
        {mainPicture.virtualPath ? (
          <Box
            sx={{
              position: 'relative',
              ':hover': {
                '.main-img': {
                  opacity: '20%'
                },
                '.remove-main-button': {
                  opacity: 1
                }
              }
            }}>
            <Box
              component='img'
              className='main-img'
              src={mainPicture.virtualPath}
              alt='Ảnh sản phẩm được chọn'
              sx={{
                width: '100%',
                transition: 'all .2s ease-out'
              }}
            />
            <Box
              className='remove-main-button'
              sx={{
                position: 'absolute',
                transition: 'all .2s ease-out',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                opacity: 0
              }}>
              <IconButton aria-label='delete' size='small' onClick={handleRemoveMainPicture} color='error'>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box
            component='section'
            sx={{ border: '1px dashed grey', minHeight: 240, cursor: 'pointer' }}
            display='flex'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            onClick={() => {
              setIsOpenFileManager({ isOpen: true, target: 'main' })
            }}>
            <Box p={2}>
              <Typography variant='body2' textAlign='center'>
                Ảnh sản phẩm chính, click vào đây để upload
              </Typography>
              <CloudUpload fontSize='large' />
            </Box>
          </Box>
        )}
        <Box mt={3}>
          <Typography variant='body1' mb={2}>
            Album sản phẩm
          </Typography>

          <Grid container spacing={2}>
            {album.length > 0 &&
              album.map(item => (
                <Grid item xs={3} key={item.fileId}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '60px',
                      border: '1px dashed grey',
                      position: 'relative',
                      ':hover': {
                        '.album-img': {
                          opacity: '20%'
                        },
                        '.remove-button': {
                          opacity: 1
                        }
                      }
                    }}>
                    <Box
                      component='img'
                      className='album-img'
                      src={item.virtualPath}
                      alt='Ảnh sản phẩm được chọn'
                      sx={{
                        width: '100%',
                        height: '60px',
                        transition: 'all .2s ease-out'
                      }}
                    />
                    <Box
                      className='remove-button'
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        opacity: 0,
                        transition: 'all .2s ease-out'
                      }}>
                      <IconButton
                        aria-label='delete'
                        color='error'
                        size='small'
                        onClick={() => {
                          handleRemoveItemInAlbum(item.fileId)
                        }}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              ))}
            <Grid item xs={3}>
              <Box
                onClick={() => {
                  setIsOpenFileManager({ isOpen: true, target: 'album' })
                }}
                sx={{
                  width: '100%',
                  height: '60px',
                  border: '1px dashed grey',
                  cursor: 'pointer'
                }}
                alignItems='center'
                justifyContent='center'
                display='flex'>
                <Plus />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </PaperContent>
      <FileManager
        isOpen={isOpenFileManager.isOpen}
        handleFilesSelectCallback={isOpenFileManager.target === 'main' ? handleFilesSelectCallbackForMainPicture : handleFilesSelectCallbackForAlbum}
        multipleSelect={isOpenFileManager.target === 'album'}
        onClose={onFileManagerClose}
      />
    </Paper>
  )
}

const mapStateToProps = (state: RootState) => ({
  album: state.productAdmin.createOrUpdateProductAdminRequest.product.album,
  mainPicture: state.productAdmin.createOrUpdateProductAdminRequest.product.mainPicture
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateMainPicture: (mainPicture: IProductFile) => dispatch(updateMainPicture(mainPicture)),
  updateAlbum: (files: IProductFile[]) => dispatch(updateAlbum(files))
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageProductBox)
