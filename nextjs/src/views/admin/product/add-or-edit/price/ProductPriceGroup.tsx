'use client'

// MUI Imports
import {
  Autocomplete,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid2 as Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material'

// Third-party Imports
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { Icon } from '@iconify/react'

// Type Imports
import type { IProduct } from '@/interface/admin/product/IProduct'
import type { IProductAttribute } from '@/interface/admin/product/IProductAttribute'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

const ProductPriceGroup = () => {
  const { dictionary } = useDictionary()
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

  return (<>
    <Grid container spacing={8} mb={3}>
      <Grid textAlign='center' size={1}></Grid>
      <Grid size={2}>
        <Typography variant='h6'>
          {dictionary.adminArea.product.field.productGroup.table.nameAttributeColumn}
        </Typography>
      </Grid>
      <Grid size={9}>
        <Typography variant='h6'>
          {dictionary.adminArea.product.field.productGroup.table.valueAttributeColumn}
        </Typography>
      </Grid>
    </Grid>
    <Divider sx={{ marginTop: 0, marginBottom: 5, borderColor: '#A2A2A2' }} />
    {fields.length > 0 &&
      fields.map((item, index) => (
        <Grid container spacing={8} mb={4} key={item.id}>
          <Grid textAlign='center' size={1}>
            <IconButton
              size='small'
              aria-label='delete'
              sx={{ fontWeight: 300, fontSize: '1.125rem' }}
              onClick={() => {
                handleRemoveAttribute(index)
              }}
            >
              <Icon icon='ri:close-line' inline />
            </IconButton>
          </Grid>
          <Grid size={2}>
            <Controller
              name={`productAttributes.${index}.name`}
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <TextField
                  fullWidth
                  error={!!fieldState.error}
                  size='small'
                  type='text'
                  sx={{
                    fontSize: '0.4rem !important'
                  }}
                  onChange={onChange}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid size={9}>
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
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder={dictionary.adminArea.product.field.productGroup.valueAttributePlaceholder}
                        error={!!fieldState.error}
                      />
                    )}
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
      startIcon={<Icon icon='mdi:plus' style={{ border: '1px solid', borderRadius: '99px' }} />}
      onClick={() => {
        handleAddNewAttribute()
      }}
    >
      {dictionary.adminArea.product.field.productGroup.addNewAttributeButton}
    </Button>
  </>);
}

export default ProductPriceGroup
