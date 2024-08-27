//MUI Imports
import { Button, FormControl, FormHelperText, Grid, Paper, TextField, Typography } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'

// Type Imports
import type { IProduct } from '@/interface/admin/product/IProduct'

// Component Imports
import PaperHeader from '@/components/paper/PaperHeader'
import PaperContent from '@/components/paper/PaperContent'
import { useDictionary } from '@/contexts/dictionaryContext'

const GeneralInfoProduct = () => {
  const { control } = useFormContext<IProduct>()

  const { dictionary } = useDictionary()

  return (
    <Paper>
      <PaperHeader
        leftHeader={<Typography variant='h6'>{dictionary.adminArea.product.generalInformationPanelTitle}</Typography>}
        rightHeader={
          <Button type='submit' variant='contained' color='success'>
            {dictionary.adminArea.common.button.submit}
          </Button>
        }
      />
      <PaperContent>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Controller
              name='name'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                  <TextField
                    fullWidth
                    type='text'
                    label={dictionary.adminArea.product.field.name.label}
                    placeholder={dictionary.adminArea.product.field.name.placeholder}
                    helperText={dictionary.adminArea.product.field.name.helperText}
                    onChange={onChange}
                    error={!!fieldState.error}
                  />
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name='seoUrl'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                  <TextField
                    fullWidth
                    type='text'
                    label={dictionary.adminArea.product.field.seoUrl.label}
                    placeholder={dictionary.adminArea.product.field.seoUrl.placeholder}
                    helperText={dictionary.adminArea.product.field.seoUrl.helperText}
                    sx={{
                      fontSize: '0.4rem !important'
                    }}
                    error={!!fieldState.error}
                    onChange={onChange}
                  />
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name='sku'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                  <TextField
                    fullWidth
                    type='text'
                    label='Mã sản phẩm'
                    placeholder='VD: FIVO0293'
                    helperText='Mã không trùng lặp để định danh sản phẩm'
                    sx={{
                      fontSize: '0.4rem !important'
                    }}
                    error={!!fieldState.error}
                    onChange={onChange}
                  />
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name='unit'
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                  <TextField
                    fullWidth
                    type='text'
                    label='Đơn vị tính'
                    placeholder='VD: Cái, chai, ly, ...'
                    helperText='Đơn vị tính của sản phẩm (Cái, chai, ly, ...)'
                    sx={{
                      fontSize: '0.4rem !important'
                    }}
                    error={!!fieldState.error}
                    onChange={onChange}
                  />
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </PaperContent>
    </Paper>
  )
}

export default GeneralInfoProduct
