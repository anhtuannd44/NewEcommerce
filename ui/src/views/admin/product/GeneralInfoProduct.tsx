import { Button, FormControl, FormHelperText, Grid, Paper, TextField, Typography } from '@mui/material'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import { Controller, useFormContext } from 'react-hook-form'
import { IProduct } from 'src/form/admin/product/interface/IProduct'

const GeneralInfoProduct = () => {
  const { control } = useFormContext<IProduct>()

  return (
    <Paper>
      <PaperHeader
        leftHeader={<Typography variant='h6'>Thông tin chung</Typography>}
        rightHeader={
          <Button type='submit' variant='contained' color='success'>
            Hoàn Tất
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
                    label='Tên sản phẩm'
                    placeholder='VD: Tủ áo Decor 3 tầng'
                    helperText={'Tên sản phẩm thường KHÔNG bao gồm các thuộc tính như màu sắc, kích cỡ, ...'}
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
                    label='Đường dẫn tĩnh'
                    placeholder='VD: san-pham-01'
                    helperText='Đường dẫn tĩnh để tối ưu hóa SEO. Nếu để trống, hệ thống tự sinh ra theo tên sản phẩm'
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
