//MUI Imports
import { Button, Card, CardContent, CardHeader, Grid2 as Grid, TextField } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'

// Type Imports
import type { IProduct } from '@/interface/admin/product/IProduct'

// Component Imports
import { useDictionary } from '@/contexts/dictionaryContext'

const GeneralInfoProduct = () => {
  const { control } = useFormContext<IProduct>()

  const { dictionary } = useDictionary()

  return (
    (<Card>
      <CardHeader
        title={dictionary.adminArea.product.generalInformationPanelTitle}
        action={
          <Button type='submit' variant='contained' color='primary'>
            {dictionary.adminArea.common.button.submit}
          </Button>
        }
      />
      <CardContent>
        <Grid container spacing={5}>
          <Grid size={12}>
            <Controller
              name='name'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <TextField
                  fullWidth
                  size='small'
                  type='text'
                  label={dictionary.adminArea.product.field.name.label}
                  placeholder={dictionary.adminArea.product.field.name.placeholder}
                  helperText={fieldState.error?.message || dictionary.adminArea.product.field.name.helperText}
                  onChange={onChange}
                  error={!!fieldState.error}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Controller
              name='seoUrl'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <TextField
                  fullWidth
                  size='small'
                  type='text'
                  label={dictionary.adminArea.product.field.seoUrl.label}
                  placeholder={dictionary.adminArea.product.field.seoUrl.placeholder}
                  helperText={fieldState.error?.message}
                  error={!!fieldState.error}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Controller
              name='sku'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <TextField
                  fullWidth
                  size='small'
                  type='text'
                  label={dictionary.adminArea.product.field.sku.label}
                  placeholder={dictionary.adminArea.product.field.sku.placeholder}
                  helperText={fieldState.error?.message}
                  error={!!fieldState.error}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Controller
              name='unit'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <TextField
                  fullWidth
                  type='text'
                  size='small'
                  label={dictionary.adminArea.product.field.unit.label}
                  placeholder={dictionary.adminArea.product.field.unit.placeholder}
                  helperText={fieldState.error?.message}
                  error={!!fieldState.error}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>)
  );
}

export default GeneralInfoProduct
