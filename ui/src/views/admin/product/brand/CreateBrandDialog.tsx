import { Button, DialogActions, DialogContent, DialogTitle, Dialog, TextField, Divider, FormControl, FormHelperText, Backdrop, CircularProgress } from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import { IBrand, ICreateOrUpdateBrandRequest } from 'src/redux/admin/interface/IProductAdmin'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { createOrUpdateBrand } from 'src/api/services/product'
import { IValidationRequest, checkValidity } from 'src/utils/utility'
import { handleSubmitCreateOrUpdateBrand, updateCreateOrUpdateBrandRequest } from 'src/redux/admin/slice/productAdminSlice'

export interface ICreateBrandDialogProps {
  open: boolean
  brandData: IBrand
  createOrUpdateBrandRequest: ICreateOrUpdateBrandRequest
  handleClose: () => void
  createOrUpdateBrand: (brand: IBrand) => void
  updateCreateOrUpdateBrandRequest: (brandRequest: ICreateOrUpdateBrandRequest) => void
}

export interface ICreateOrUpdateBrandRequestControls {
  name: IValidationRequest
}

const CreateBrandDialog = (props: ICreateBrandDialogProps) => {
  const { open, createOrUpdateBrandRequest, brandData, createOrUpdateBrand, updateCreateOrUpdateBrandRequest, handleClose } = props
  const { brand, isLoading, isSubmitted, isSuccess } = createOrUpdateBrandRequest

  const [title, setTitle] = useState<string>('Thêm thương hiệu')

  useEffect(() => {
    if (isSuccess) {
      handleClose()
    }
  }, [isSuccess])

  const [formStates, setFormStates] = useState<ICreateOrUpdateBrandRequestControls>({
    name: {
      validation: {
        required: true
      },
      result: {
        isValid: true,
        errorMessage: ''
      }
    }
  })

  useEffect(() => {
    if (open) {
      if (brandData.id) {
        setTitle('Sửa thương hiệu')
      }
      updateCreateOrUpdateBrandRequest({ ...createOrUpdateBrandRequest, brand: brandData })
    }
  }, [open])

  const fieldChanged = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    const field = event.target.name
    checkFieldValidity(field as keyof ICreateOrUpdateBrandRequestControls, value)
    const currentBrandState = {
      ...createOrUpdateBrandRequest,
      brand: {
        ...createOrUpdateBrandRequest.brand,
        [field as keyof IBrand]: value
      }
    }
    updateCreateOrUpdateBrandRequest(currentBrandState)
  }

  const checkFieldValidity = (name: keyof ICreateOrUpdateBrandRequestControls, value: any): boolean => {
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

    updateCreateOrUpdateBrandRequest({ ...createOrUpdateBrandRequest, isSubmitted: true })

    let isValid = true
    for (const fieldName in formStates) {
      isValid = checkFieldValidity(fieldName as keyof ICreateOrUpdateBrandRequestControls, brand[fieldName as keyof IBrand]) && isValid
    }

    if (isValid) {
      createOrUpdateBrand(brand)
    }
  }

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth='md'
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit
        }}>
        <DialogTitle>{title}</DialogTitle>
        <Divider />
        <DialogContent>
          <FormControl error={isSubmitted && !formStates.name.result.isValid} variant='standard' fullWidth>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              name='name'
              label='Tên thương hiệu'
              fullWidth
              variant='filled'
              onChange={fieldChanged}
              value={brand.name}
              error={isSubmitted && !formStates.name.result.isValid}
            />
            <FormHelperText>{isSubmitted && formStates.name.result.errorMessage}</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' size='medium' onClick={handleClose}>
            Thoát
          </Button>
          <Button variant='contained' size='medium' type='submit'>
            Hoàn tất
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop sx={{ color: '#fff', zIndex: 99999 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  createOrUpdateBrandRequest: state.productAdmin.createOrUpdateBrandRequest
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateCreateOrUpdateBrandRequest: (brandRequest: ICreateOrUpdateBrandRequest) => dispatch(updateCreateOrUpdateBrandRequest(brandRequest)),
  createOrUpdateBrand: (brand: IBrand) => dispatch(createOrUpdateBrand(brand))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateBrandDialog)
