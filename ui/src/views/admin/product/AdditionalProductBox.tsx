import { Autocomplete, Box, Button, Divider, FormControl, FormHelperText, Grid, Paper, TextField, Typography } from '@mui/material'
import { Plus } from 'mdi-material-ui'
import CreateCategoryDialog from './category/CreateCategoryDialog'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import CreateBrandDialog from './brand/CreateBrandDialog'
import { IProductCategory } from 'src/form/admin/product/interface/IProductCategory'
import { IBrand } from 'src/form/admin/product/interface/IBrand'
import { Controller, useFormContext } from 'react-hook-form'
import { IProduct } from 'src/form/admin/product/interface/IProduct'

export interface IAdditionalProductBoxProps {
  productCategoryList: IProductCategory[]
  brandList: IBrand[]
  productTagList: string[]
}

const AdditionalProductBox = (props: IAdditionalProductBoxProps) => {
  const { productCategoryList, brandList, productTagList } = props

  const { control } = useFormContext<IProduct>()

  return (
    <>
      <Paper>
        <PaperHeader leftHeader={<Typography variant='h6'>Thông tin bổ sung</Typography>} />
        <PaperContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Controller
                name='productCategoryId'
                control={control}
                render={({ field: { onChange }, fieldState }) => (
                  <Autocomplete
                    fullWidth
                    size='small'
                    id='productCategory'
                    options={productCategoryList}
                    renderInput={params => (
                      <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                        <TextField {...params} error={!!fieldState.error} label='Danh mục sản phẩm' />
                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                      </FormControl>
                    )}
                    onChange={(event, newValue, reason) => {
                      if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                        return
                      }
                      onChange(newValue?.id)
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
                              // handleOpenCreateCategoryDialog(true)
                            }}>
                            Thêm mới danh mục
                          </Button>
                          <Divider sx={{ margin: 0 }} />
                          {children}
                        </Paper>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='brandId'
                control={control}
                render={({ field: { onChange }, fieldState }) => (
                  <Autocomplete
                    fullWidth
                    size='small'
                    options={brandList}
                    renderInput={params => (
                      <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                        <TextField {...params} error={!!fieldState.error} label='Thương hiệu' />
                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                      </FormControl>
                    )}
                    onChange={(event, newValue, reason) => {
                      if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                        return
                      }
                      onChange(newValue?.id)
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

                              // handleOpenCreateOrUpdateBrandDialog(true, option.id, option.name)
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
                              // handleOpenCreateOrUpdateBrandDialog(false)
                            }}>
                            Thêm mới thương hiệu
                          </Button>
                          <Divider sx={{ margin: 0 }} />
                          {children}
                        </Paper>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='tags'
                control={control}
                render={({ field: { onChange }, fieldState }) => (
                  <Autocomplete
                    fullWidth
                    multiple
                    size='small'
                    options={productTagList}
                    freeSolo
                    renderInput={params => (
                      <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                        <TextField {...params} error={!!fieldState.error} label='Tags' />
                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                      </FormControl>
                    )}
                    onChange={(event, newValue, reason) => {
                      if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
                        return
                      }
                      onChange(newValue)
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
                )}
              />
            </Grid>
          </Grid>
        </PaperContent>
      </Paper>
      {/* <CreateCategoryDialog open={isOpenCreateProductCategoryDialog} handleOpenCreateCategoryDialog={handleOpenCreateCategoryDialog} /> */}
      {/* <CreateBrandDialog open={isOpenCreateOrUpdateBrandDialog} brandData={brandData} handleClose={handleCloseCreateOrUpdateBrandDialog} /> */}
    </>
  )
}

export default AdditionalProductBox
