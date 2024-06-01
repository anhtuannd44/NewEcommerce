import { Button, DialogActions, DialogContent, DialogTitle, Dialog, TextField, Grid, Divider, FormControl, FormHelperText, Backdrop, CircularProgress } from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import { ICreateOrUpdateProductCategoryRequest, IProductCategoryAdminCreateBody } from 'src/redux/admin/interface/IProductAdmin'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { createProductCategory } from 'src/api/product'
import { IValidationRequest, checkValidity } from 'src/utils/utility'
import { handleSubmitCreateProductCategory, resetCreateProductCategoryState, updateProductCategoryBody } from 'src/redux/admin/slice/productAdminSlice'

export interface ICreateCategoryDialogProps {
  open: boolean
  createOrUpdateProductCategoryRequest: ICreateOrUpdateProductCategoryRequest
  updateProductCategoryBody: (state: IProductCategoryAdminCreateBody) => void
  handleOpenCreateCategoryDialog: (isOpen: boolean) => void
  createProductCategory: (category: IProductCategoryAdminCreateBody) => void
  resetCreateProductCategoryState: () => void
  handleSubmitCreateProductCategory: () => void
}

interface IProductCategoryAdminControl {
  name: IValidationRequest
  seoUrl: IValidationRequest
  shortDescription: IValidationRequest
  metaTitle: IValidationRequest
  metaKeywords: IValidationRequest
  metaDescription: IValidationRequest
}

const CreateCategoryDialog = (props: ICreateCategoryDialogProps) => {
  const {
    open,
    handleOpenCreateCategoryDialog,
    createOrUpdateProductCategoryRequest,
    updateProductCategoryBody,
    createProductCategory,
    resetCreateProductCategoryState,
    handleSubmitCreateProductCategory
  } = props
  const { category, loading, submitted, isSuccess } = createOrUpdateProductCategoryRequest

  useEffect(() => {
    if (isSuccess) {
      handleOpenCreateCategoryDialog(false)
    }
  }, [isSuccess])

  const [formStates, setFormStates] = useState<IProductCategoryAdminControl>({
    name: {
      validation: {
        required: true
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    },
    seoUrl: {
      validation: {
        required: false
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    },
    shortDescription: {
      validation: {
        required: false
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    },
    metaTitle: {
      validation: {
        required: false
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    },
    metaKeywords: {
      validation: {
        required: false
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    },
    metaDescription: {
      validation: {
        required: false
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    }
  })

  useEffect(() => {
    if (open) {
      resetCreateProductCategoryState()
    }
  }, [open])

  const fieldChanged = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    const field = event.target.name
    checkFieldValidity(field as keyof IProductCategoryAdminCreateBody, value)
    const currentCategoryState = { ...category, [field as keyof IProductCategoryAdminCreateBody]: value }
    updateProductCategoryBody(currentCategoryState)
  }

  const checkFieldValidity = (name: keyof IProductCategoryAdminControl, value: string): boolean => {
    const control = formStates[name]

    if (!control) return true

    const rules = control.validation
    const validationRs = checkValidity(value, rules)

    setFormStates(preState => ({
      ...preState,
      [name]: {
        ...preState[name],
        result: {
          ...preState[name].result,
          isValid: validationRs.isValid,
          errorMessage: validationRs.errorMessage
        }
      }
    }))

    return validationRs.isValid === true
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    handleSubmitCreateProductCategory()

    let isValid = true
    for (let fieldName in formStates) {
      isValid = checkFieldValidity(fieldName as keyof IProductCategoryAdminControl, category[fieldName as keyof IProductCategoryAdminCreateBody]) && isValid
    }

    if (isValid) {
      createProductCategory(category)
    }
  }

  return (
    <>
      <Dialog
        maxWidth='lg'
        open={open}
        onClose={() => {
          handleOpenCreateCategoryDialog(false)
        }}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit
        }}>
        <DialogTitle>Thêm danh mục sản phẩm</DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <FormControl error={submitted && !formStates.name.result.isValid} variant='standard' fullWidth>
                <TextField
                  autoFocus
                  margin='dense'
                  id='name'
                  name='name'
                  label='Tên danh mục'
                  fullWidth
                  variant='filled'
                  onChange={fieldChanged}
                  value={category.name}
                  error={submitted && !formStates.name.result.isValid}
                />
                <FormHelperText>{submitted && formStates.name.result.errorMessage}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField margin='dense' id='seoUrl' name='seoUrl' label='Đường dẫn tĩnh (SEO Url)' fullWidth variant='filled' onChange={fieldChanged} value={category.seoUrl} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                rows={5}
                margin='dense'
                id='shortDescription'
                name='shortDescription'
                label='Mô tả ngắn'
                fullWidth
                variant='filled'
                onChange={fieldChanged}
                value={category.shortDescription}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField margin='dense' id='metaTitle' name='metaTitle' label='Tên danh mục SEO' fullWidth variant='filled' onChange={fieldChanged} value={category.metaTitle} />
            </Grid>
            <Grid item xs={6}>
              <TextField margin='dense' id='metaKeywords' name='metaKeywords' label='Keywords (SEO)' fullWidth variant='filled' onChange={fieldChanged} value={category.metaKeywords} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                rows={5}
                margin='dense'
                id='metaDescription'
                name='metaDescription'
                label='Mô tả ngắn (SEO)'
                fullWidth
                variant='filled'
                onChange={fieldChanged}
                value={category.metaDescription}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            size='medium'
            onClick={() => {
              handleOpenCreateCategoryDialog(false)
            }}>
            Thoát
          </Button>
          <Button variant='contained' size='medium' type='submit'>
            Hoàn tất
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop sx={{ color: '#fff', zIndex: 99999 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  createOrUpdateProductCategoryRequest: state.productAdmin.createOrUpdateProductCategoryRequest,
  message: state.productAdmin.message
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  createProductCategory: (category: IProductCategoryAdminCreateBody) => dispatch(createProductCategory(category)),
  updateProductCategoryBody: (category: IProductCategoryAdminCreateBody) => dispatch(updateProductCategoryBody(category)),
  resetCreateProductCategoryState: () => dispatch(resetCreateProductCategoryState()),
  handleSubmitCreateProductCategory: () => dispatch(handleSubmitCreateProductCategory())
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateCategoryDialog)
