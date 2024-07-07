import { Autocomplete, Button, Divider, FormControl, FormHelperText, Grid, IconButton, TextField, Typography } from '@mui/material'
import { Close, Plus } from 'mdi-material-ui'
import { v4 as uuidv4 } from 'uuid'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { IProduct } from 'src/form/admin/product/interface/IProduct'
import { IProductAttribute } from 'src/form/admin/product/interface/IProductAttribute'

const ProductAttributeBox = () => {
  const { control } = useFormContext<IProduct>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productAttributes'
  })

  const handleAddNewAttribute = () => {
    const newId = uuidv4()
    const newProductAttribute: IProductAttribute = {
      id: newId,
      name: '',
      productAttributeValues: []
    }
    append(newProductAttribute)
  }

  const handleRemoveAttribute = (index: number) => {
    remove(index)
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
      {fields &&
        fields.length > 0 &&
        fields.map((item, index) => (
          <Grid container spacing={8} mb={4} key={item.id}>
            <Grid item xs={1} textAlign='center'>
              <IconButton
                size='small'
                aria-label='delete'
                sx={{ fontWeight: 300, fontSize: '1.125rem' }}
                onClick={() => {
                  handleRemoveAttribute(index)
                }}>
                <Close />
              </IconButton>
            </Grid>
            <Grid item xs={2}>
              <Controller
                name={`productAttributes.${index}.name`}
                control={control}
                render={({ field: { onChange }, fieldState }) => (
                  <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                    <TextField
                      fullWidth
                      error={!!fieldState.error}
                      size='small'
                      type='text'
                      sx={{
                        fontSize: '0.4rem !important'
                      }}
                      onChange={onChange}
                    />
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={9}>
              <Controller
                name={`productAttributes.${index}.productAttributeValues`}
                control={control}
                render={({ field: { onChange }, fieldState }) => (
                  <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                    <Autocomplete
                      fullWidth
                      multiple
                      size='small'
                      freeSolo
                      renderInput={params => <TextField {...params} placeholder='Nhập giá trị và nhấn Enter để thêm' error={!!fieldState.error} />}
                      onChange={(event, newValue) => {
                        onChange(newValue)
                      }}
                      options={[]}
                    />
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>
                )}
              />
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

export default ProductAttributeBox
