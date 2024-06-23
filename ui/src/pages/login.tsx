import { ChangeEvent, FormEvent, MouseEvent, ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Divider, Checkbox, TextField, InputLabel, Typography, IconButton, CardContent, FormControl, OutlinedInput, InputAdornment } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { Google, Github, Twitter, Facebook, EyeOutline, EyeOffOutline } from 'mdi-material-ui'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { getToken } from 'src/api/authApi'

interface State {
  email: string
  password: string
  showPassword: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    email: '',
    password: '',
    showPassword: false
  })

  // ** Hook
  const theme = useTheme()
  const router = useRouter()
  const { returnUrl } = router.query

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const login = await getToken({ email: 'anhtuan.nd44@gmail.com', password: values.password })
    if (login.data) {
      router.push((returnUrl as string) || '/')
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '2.5rem !important'
              }}>
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Vui lòng đăng nhập để tiếp tục</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <TextField autoFocus fullWidth id='email' name='email' label='Email' sx={{ marginBottom: 4 }} />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} aria-label='toggle password visibility'>
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <FormControlLabel control={<Checkbox />} label='Lưu đăng nhập' />
              <Link passHref href='/' onClick={e => e.preventDefault()}>
                Quên mật khẩu?
              </Link>
            </Box>
            <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} type='submit'>
              Login
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Bạn chưa có tài khoản?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/pages/register'>
                  Tạo tài khoản
                </Link>
              </Typography>
            </Box>
            <Divider sx={{ my: 5 }}>hoặc đăng nhập với</Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                <Facebook sx={{ color: '#497ce2' }} />
              </IconButton>
              <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                <Twitter sx={{ color: '#1da1f2' }} />
              </IconButton>
              <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                <Github sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }} />
              </IconButton>
              <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                <Google sx={{ color: '#db4437' }} />
              </IconButton>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
