// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Theme Config Imports
import themeConfig from 'src/configs/themeConfig'

const Button = (theme: Theme) => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          borderRadius: 3,
          lineHeight: 1.71,
          letterSpacing: '0.4px',
          padding: `${theme.spacing(1.875, 3)}`,
					textTransform: 'unset'
        },
        contained: {
          boxShadow: 'none',
          padding: `${theme.spacing(1.875, 5.5)}`
        },
        outlined: {
          padding: `${theme.spacing(1.625, 5.25)}`
        },
        sizeSmall: {
          padding: `${theme.spacing(1, 2.25)}`,
          '&.MuiButton-contained': {
            padding: `${theme.spacing(1, 3.5)}`,
            '&:hover': {
              boxShadow: 'none'
            }
          },
          '&.MuiButton-outlined': {
            padding: `${theme.spacing(0.75, 3.25)}`
          }
        },
				sizeMedium: {
					fontSize: '.9rem'
				},
        sizeLarge: {
          padding: `${theme.spacing(2.125, 5.5)}`,
          '&.MuiButton-contained': {
            padding: `${theme.spacing(2.125, 6.5)}`
          },
          '&.MuiButton-outlined': {
            padding: `${theme.spacing(1.875, 6.25)}`
          }
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: themeConfig.disableRipple
      }
    }
  }
}

export default Button
