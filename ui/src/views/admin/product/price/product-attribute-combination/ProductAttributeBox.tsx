import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, Button, Divider, FormControl, FormHelperText, Grid, IconButton, TextField, Typography } from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import { IProductAdmin, IProductAttribute, IProductAttributeControl } from 'src/redux/admin/interface/IProductAdmin'
import { handlePushMessageSnackbar, initProductAttributeControl, updateProductAttributeControl, updateProductAttributes } from 'src/redux/admin/slice/productAdminSlice'
import { Close, Plus } from 'mdi-material-ui'
import { v4 as uuidv4 } from 'uuid'
import { IMessageCommon } from 'src/redux/admin/interface/ICommon'
import { MessageType } from 'src/common/enums'
import { SyntheticEvent } from 'react'

export interface IProductAttributeBoxProps {
  product: IProductAdmin
  controls: IProductAttributeControl[] | undefined
  isSubmitted: boolean
  updateProductAttributes: (values: IProductAttribute[], ignoreGenCombination?: boolean) => void
  updateProductAttributeControl: (values: IProductAttributeControl[]) => void
  handlePushMessageSnackbar: (message: IMessageCommon) => void
}

const ProductAttributeBox = (props: IProductAttributeBoxProps) => {
  const { product, isSubmitted, controls, updateProductAttributes, updateProductAttributeControl, handlePushMessageSnackbar } = props
  const { productAttributes } = product

  const handleProductAttributeValueChange = (
    event: SyntheticEvent<Element, Event>,
    reason: AutocompleteChangeReason,
    productAttributeId: string,
    details: AutocompleteChangeDetails<string> | undefined
  ) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') && reason === 'removeOption') {
      return
    }

    const currentProductAttributes = [...productAttributes]
    let newList: IProductAttribute[] = []

    if (reason === 'createOption') {
      const newValue = details?.option.replace(/\s+/g, ' ').trim()
      if (newValue) {
        newList = currentProductAttributes?.map(item => {
          return item.id === productAttributeId && item.productAttributeValues.indexOf(newValue) === -1 ? { ...item, productAttributeValues: [...item.productAttributeValues, newValue] } : item
        })
      }
    }
    if (reason === 'removeOption') {
      newList = currentProductAttributes?.map(item => {
        return item.id === productAttributeId ? { ...item, productAttributeValues: item.productAttributeValues.filter(value => value !== details?.option) } : item
      })
    }

    if (reason === 'clear') {
      newList = currentProductAttributes?.map(item => {
        return item.id === productAttributeId ? { ...item, productAttributeValues: [] } : item
      })
    }

    updateProductAttributes(newList)
  }

  const handleProductAttributeNameChange = (id: string, newValue: string) => {
    const currentProductAttributes = [...productAttributes]
    const newList = currentProductAttributes.map(item => {
      if (item.id === id) {
        return { ...item, name: newValue }
      }
      return item
    })

    updateProductAttributes(newList, true)
  }

  const handleAddNewAttribute = () => {
    const currentProductAttributes = [...productAttributes]
    const currentProductAttributeControl = controls ? [...controls] : []

    const newId = uuidv4()

    currentProductAttributes.push({
      id: newId,
      name: '',
      productAttributeValues: []
    })

    updateProductAttributes(currentProductAttributes)

    currentProductAttributeControl.push({ ...initProductAttributeControl, id: newId })
    updateProductAttributeControl(currentProductAttributeControl)
  }

  const handleRemoveAttribute = (id: string) => {
    const currentProductAttributes = [...productAttributes]
    if (currentProductAttributes.length <= 1) {
      const message: IMessageCommon = { type: MessageType.Error, text: 'Bạn phải thêm ít nhất 1 biến thể cho sản phẩm' }
      handlePushMessageSnackbar(message)
      return
    }

    const newList = currentProductAttributes.filter(item => item.id !== id)
    updateProductAttributes(newList)
  }

  return (
    <>
      <Grid container spacing={8} mb={3}>
        <Grid item xs={1} textAlign='center'></Grid>
        <Grid item xs={2}>
          <Typography variant='h6'>Tên thuộc tính</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant='h6'>Giá trị</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ marginTop: 0, marginBottom: 5, borderColor: '#A2A2A2' }} />
      {productAttributes &&
        productAttributes.length > 0 &&
        productAttributes.map(item => (
          <Grid container spacing={8} mb={4} key={item.id}>
            <Grid item xs={1} textAlign='center'>
              <IconButton
                size='small'
                aria-label='delete'
                sx={{ fontWeight: 300, fontSize: '1.125rem' }}
                onClick={() => {
                  handleRemoveAttribute(item.id)
                }}>
                <Close />
              </IconButton>
            </Grid>
            <Grid item xs={2}>
              <FormControl error={isSubmitted && !controls?.find(x => x.id === item.id)?.validate.name.result.isValid} variant='standard' fullWidth>
                <TextField
                  fullWidth
                  size='small'
                  value={item.name}
                  type='text'
                  sx={{
                    fontSize: '0.4rem !important'
                  }}
                  onChange={event => {
                    handleProductAttributeNameChange(item.id, event.target?.value)
                  }}
                  error={isSubmitted && !controls?.find(x => x.id === item.id)?.validate.name.result.isValid}
                />
                <FormHelperText>{isSubmitted && controls?.find(x => x.id === item.id)?.validate.name.result.errorMessage}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={9}>
              <FormControl error={isSubmitted && !controls?.find(x => x.id === item.id)?.validate.productAttributeValues.result.isValid} variant='standard' fullWidth>
                <Autocomplete
                  fullWidth
                  multiple
                  size='small'
                  value={item.productAttributeValues}
                  freeSolo
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder='Nhập giá trị và nhấn Enter để thêm'
                      error={isSubmitted && !controls?.find(x => x.id === item.id)?.validate.productAttributeValues.result.isValid}
                    />
                  )}
                  onChange={(event, newValue, reason, details) => {
                    handleProductAttributeValueChange(event, reason, item.id, details)
                  }}
                  id={item.id}
                  options={[]}
                />
                <FormHelperText>{isSubmitted && controls?.find(x => x.id === item.id)?.validate.productAttributeValues.result.errorMessage}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        ))}
      <Button
        variant='text'
        sx={{ fontSize: '.875rem', marginTop: 4 }}
        startIcon={<Plus sx={{ border: '1px solid', borderRadius: '99px' }} />}
        onClick={() => {
          handleAddNewAttribute()
        }}>
        Thêm thuộc tính khác
      </Button>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  product: state.productAdmin.createOrUpdateProductAdminRequest.product,
  controls: state.productAdmin.controls.createEditProductAdminControls.productAttributeControls,
  isSubmitted: state.productAdmin.createOrUpdateProductAdminRequest.isSubmitted
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateProductAttributes: (values: IProductAttribute[], ignoreGenCombination?: boolean) => dispatch(updateProductAttributes({ values, ignoreGenCombination })),
  updateProductAttributeControl: (values: IProductAttributeControl[]) => dispatch(updateProductAttributeControl(values)),
  handlePushMessageSnackbar: (message: IMessageCommon) => dispatch(handlePushMessageSnackbar(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductAttributeBox)
