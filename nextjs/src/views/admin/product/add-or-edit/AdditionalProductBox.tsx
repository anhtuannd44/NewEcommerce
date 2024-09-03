'use client'

// MUI Imports
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Gird,
  Paper,
  TextField,
  Typography
} from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'
import { Icon } from '@iconify/react'

// Type Imports
import type { IBrand } from '@/interface/admin/product/IBrand'
import type { IProductCategory } from '@/interface/admin/product/IProductCategory'
import type { IProduct } from '@/interface/admin/product/IProduct'

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
      <Card>
        <CardHeader title={'Thông tin bổ sung'} />
        <CardContent>
          <Grid container spacing={5}>
            <Grid xs={12}>
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
                      <TextField
                        {...params}
                        error={!!fieldState.error}
                        fullWidth
                        label='Danh mục sản phẩm'
                        helperText={fieldState.error?.message}
                      />
                    )}
                    onChange={(event, newValue, reason) => {
                      if (
                        event.type === 'keydown' &&
                        ((event as React.KeyboardEvent).key === 'Backspace' ||
                          (event as React.KeyboardEvent).key === 'Delete') &&
                        reason === 'removeOption'
                      ) {
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
                          }}
                        >
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
                              <Icon
                                icon='mdi:plus'
                                style={{
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
                            }}
                          >
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
            <Grid xs={12}>
              <Controller
                name='brandId'
                control={control}
                render={({ field: { onChange }, fieldState }) => (
                  <Autocomplete
                    fullWidth
                    size='small'
                    options={brandList}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={!!fieldState.error}
                        label='Thương hiệu'
                        helperText={fieldState.error?.message}
                      />
                    )}
                    onChange={(event, newValue, reason) => {
                      if (
                        event.type === 'keydown' &&
                        ((event as React.KeyboardEvent).key === 'Backspace' ||
                          (event as React.KeyboardEvent).key === 'Delete') &&
                        reason === 'removeOption'
                      ) {
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
                          }}
                        >
                          <Typography sx={{ fontWeight: 400, py: 1 }}>{option.name}</Typography>
                          <Typography
                            variant='body2'
                            color='warning.main'
                            fontSize='.75rem'
                            onMouseDown={event => {
                              event.preventDefault()

                              // handleOpenCreateOrUpdateBrandDialog(true, option.id, option.name)
                            }}
                          >
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
                              <Icon
                                icon='mdi:plus'
                                style={{
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
                            }}
                          >
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
            <Grid xs={12}>
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
                      <TextField
                        {...params}
                        fullWidth
                        error={!!fieldState.error}
                        label='Tags'
                        helperText={fieldState.error?.message}
                      />
                    )}
                    onChange={(event, newValue, reason) => {
                      if (
                        event.type === 'keydown' &&
                        ((event as React.KeyboardEvent).key === 'Backspace' ||
                          (event as React.KeyboardEvent).key === 'Delete') &&
                        reason === 'removeOption'
                      ) {
                        return
                      }

                      onChange(newValue)
                    }}
                    getOptionLabel={option => option}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        <Box
                          sx={{
                            display: 'flex',
                            marginLeft: 3,
                            alignItems: 'flex-start',
                            flexDirection: 'column'
                          }}
                        >
                          <Typography sx={{ fontWeight: 400, py: 1 }}>{option}</Typography>
                        </Box>
                      </li>
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* <CreateCategoryDialog open={isOpenCreateProductCategoryDialog} handleOpenCreateCategoryDialog={handleOpenCreateCategoryDialog} /> */}
      {/* <CreateBrandDialog open={isOpenCreateOrUpdateBrandDialog} brandData={brandData} handleClose={handleCloseCreateOrUpdateBrandDialog} /> */}
    </>
  )
}

export default AdditionalProductBox
