// ** MUI Imports
import { Theme } from '@mui/material/styles'

const input = (theme: Theme) => {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
          fontSize: '.8rem'
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&:before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.22)`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.32)`
          },
          '&.Mui-disabled:before': {
            borderBottom: `1px solid ${theme.palette.text.disabled}`
          }
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: `rgba(${theme.palette.customColors.main}, 0.04)`,
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: `rgba(${theme.palette.customColors.main}, 0.08)`
          },
          '&:before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.22)`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.32)`
          },
          sizeSmall: {
            fontSize: '0.8rem'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {          
          '&.Mui-focused': {
            fieldset: {
              borderWidth: '1px !important',
              borderColor: `rgba(${theme.palette.primary.light}, 0.5) !important`
            },
            borderColor: `${theme.palette.primary.light} !important`
          },
          '&:hover:not(.Mui-focused)': {
            fieldset: {
              borderColor: `${theme.palette.primary.light} !important`
            },
            borderColor: `${theme.palette.primary.light} !important`,
						transition: 'all 2s ease-out !important',
          },
          '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
            fieldset: {
              borderColor: `rgba(${theme.palette.primary.light}, 0.5) !important`
            },
            borderColor: `rgba(${theme.palette.primary.light}, 0.5) !important`
          },
          '&:hover.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: `rgba(${theme.palette.customColors.main}, 0.22)`
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.disabled
          }
        }
      }
    }
  }
}

export default input
