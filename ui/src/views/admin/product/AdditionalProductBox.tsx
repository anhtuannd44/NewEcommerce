import { Autocomplete, Box, Button, Divider, Grid, Paper, TextField, Typography } from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import _ from 'lodash'
import { IBrand, IProductAdmin, IProductCategoryAdmin } from 'src/redux/admin/interface/IProductAdmin'
import { updateGeneralField, updateProductTags } from 'src/redux/admin/slice/productAdminSlice'
import { Plus } from 'mdi-material-ui'
import CreateCategoryDialog from './category/CreateCategoryDialog'
import { useCallback, useState } from 'react'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import CreateBrandDialog from './brand/CreateBrandDialog'

export interface IAdditionalProductBoxProps {
  product: IProductAdmin
  productCategoryList: IProductCategoryAdmin[]
  brandList: IBrand[]
  allProductTags: string[]
  updateGeneralField: (field: keyof IProductAdmin, value: string) => void
  updateProductTags: (values: string[]) => void
}

const AdditionalProductBox = (props: IAdditionalProductBoxProps) => {
  const { product, productCategoryList, brandList, allProductTags, updateGeneralField, updateProductTags } = props

  const [isOpenCreateProductCategoryDialog, setIsOpenCreateProductCategoryDialog] = useState<boolean>(false)
  const [isOpenCreateOrUpdateBrandDialog, setIsOpenCreateOrUpdateBrandDialog] = useState<boolean>(false)
  const [brandData, setBrandData] = useState<IBrand>({ id: null, name: '' })

  const updateGeneralFieldDebounce = useCallback(_.debounce((field: keyof IProductAdmin, value: string) => updateGeneralField(field, value), 1000), [])

  const handleOpenCreateCategoryDialog = (isOpen: boolean) => {
    setIsOpenCreateProductCategoryDialog(isOpen)
  }

  const handleOpenCreateOrUpdateBrandDialog = (isEdit: boolean, id: string | null = null, name: string = '') => {
    if (isEdit) {
      setBrandData({ id, name })
    }
    setIsOpenCreateOrUpdateBrandDialog(true)
  }

  const handleCloseCreateOrUpdateBrandDialog = () => {
    setIsOpenCreateOrUpdateBrandDialog(false)
  }

  return (
    <>
      <Paper>
        <PaperHeader leftHeader={<Typography variant='h6'>Thông tin bổ sung</Typography>} />
        <PaperContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                size='small'
                id='productCategory'
                options={productCategoryList}
                renderInput={params => <TextField {...params} label='Danh mục sản phẩm' />}
                onChange={(event, newValue, reason) => {
                  if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                    return
                  }
                  updateGeneralFieldDebounce('productCategoryId', newValue?.id || '')
                }}
                getOptionLabel={option => option.name}
                renderOption={(props, option) => (
                  <li key={option.id} {...props}>
                    <Box
                      sx={{
                        display: 'flex',
                        marginLeft: 3,
                        alignItems: 'flex-start',
                        flexDirection: 'column'
                      }}>
                      <Typography variant='body1' sx={{ fontWeight: 300, py: 1 }} fontSize='0.875rem'>
                        {option.name}
                      </Typography>
                    </Box>
                  </li>
                )}
                PaperComponent={({ children }) => {
                  return (
                    <Paper>
                      <Button
                        fullWidth
                        startIcon={
                          <Plus
                            sx={{
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
                        style={{ justifyContent: 'flex-start' }}
                        onMouseDown={() => {
                          handleOpenCreateCategoryDialog(true)
                        }}>
                        Thêm mới danh mục
                      </Button>
                      <Divider sx={{ margin: 0 }} />
                      {children}
                    </Paper>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                size='small'
                options={brandList}
                renderInput={params => <TextField {...params} label='Thương hiệu' />}
                onChange={(event, newValue, reason) => {
                  if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                    return
                  }
                  updateGeneralFieldDebounce('brandId', newValue?.id || '')
                }}
                getOptionLabel={option => option.name}
                renderOption={(props, option) => (
                  <li key={option.id} {...props}>
                    <Box
                      sx={{
                        display: 'flex',
                        marginLeft: 3,
                        alignItems: 'flex-start',
                        flexDirection: 'column'
                      }}>
                      <Typography sx={{ fontWeight: 400, py: 1 }}>{option.name}</Typography>
                      <Typography
                        variant='body2'
												color='warning.main'
												fontSize='.75rem'
                        onMouseDown={event => {
                          event.preventDefault()

                          handleOpenCreateOrUpdateBrandDialog(true, option.id, option.name)
                        }}>
                        sửa
                      </Typography>
                    </Box>
                  </li>
                )}
                PaperComponent={({ children }) => {
                  return (
                    <Paper>
                      <Button
                        fullWidth
                        startIcon={
                          <Plus
                            sx={{
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
                        style={{ justifyContent: 'flex-start' }}
                        onMouseDown={() => {
                          handleOpenCreateOrUpdateBrandDialog(false)
                        }}>
                        Thêm mới thương hiệu
                      </Button>
                      <Divider sx={{ margin: 0 }} />
                      {children}
                    </Paper>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                multiple
                size='small'
                options={allProductTags}
                value={product.tags}
                freeSolo
                renderInput={params => <TextField {...params} label='Tags' />}
                onChange={(event, newValue, reason) => {
                  if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                    return
                  }
                  updateProductTags(newValue)
                }}
                getOptionLabel={option => option}
                renderOption={(props, option) => (
                  <li key={option} {...props}>
                    <Box
                      sx={{
                        display: 'flex',
                        marginLeft: 3,
                        alignItems: 'flex-start',
                        flexDirection: 'column'
                      }}>
                      <Typography sx={{ fontWeight: 400, py: 1 }}>{option}</Typography>
                    </Box>
                  </li>
                )}
              />
            </Grid>
          </Grid>
        </PaperContent>
      </Paper>
      <CreateCategoryDialog open={isOpenCreateProductCategoryDialog} handleOpenCreateCategoryDialog={handleOpenCreateCategoryDialog} />
      <CreateBrandDialog open={isOpenCreateOrUpdateBrandDialog} brandData={brandData} handleClose={handleCloseCreateOrUpdateBrandDialog} />
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  product: state.productAdmin.createOrUpdateProductAdminRequest.product,
  brandList: state.productAdmin.brandList,
  productCategoryList: state.productAdmin.productCategoryList,
  allProductTags: state.productAdmin.productTags
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateGeneralField: (field: keyof IProductAdmin, value: string) => dispatch(updateGeneralField({ field, value })),
  updateProductTags: (values: string[]) => dispatch(updateProductTags(values))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalProductBox)
