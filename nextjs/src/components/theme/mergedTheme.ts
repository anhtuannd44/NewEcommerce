/*
 * We recommend using the merged theme if you want to override our core theme.
 * This means you can use our core theme and override it with your own customizations.
 * Write your overrides in the userTheme object in this file.
 * The userTheme object is merged with the coreTheme object within this file.
 * Export this file and import it in the `@components/theme/index.tsx` file to use the merged theme.
 */

// MUI Imports
import { deepmerge } from '@mui/utils'
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { SystemMode } from '@core/types'

// Core Theme Imports
import coreTheme from '@core/theme'

// Custom Part Imports
import typographyCustom from './typographyCustom'

const mergedTheme = (settings: Settings, mode: SystemMode, direction: Theme['direction']) => {
  // Vars
  const userTheme = {
    // Write your overrides here.
    shape: {
      borderRadius: 4,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10
      }
    },
    typography: typographyCustom(),
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#91BFB6',
            light: '#759c94',
            dark: '#759c94',
            contrastText: '#FFFFFF'
          },
          secondary: {
            main: '#8A8D93',
            light: '#A1A4A9',
            dark: '#7C7F84'
          },
          success: {
            main: '#91c78d',
            light: '#A6D5A3',
            dark: '#A6D5A3',
            contrastText: '#fff'
          },
          info: {
            main: '#5bbff0',
            light: '#45C1FF',
            dark: '#5b9bba',
            contrastText: '#fff'
          },
          error: {
            main: '#F48A64',
            light: '#F48A64',
            dark: '#d97b59',
            contrastText: '#fff'
          },
          warning: {
            main: '#cfa440',
            light: '#cfa440',
            dark: '#bda24b',
            contrastText: '#fff'
          },
          background: {
            default: '#f7f7f7',
            paper: '#FFFFFF',
            paperChannel: '255 255 255'
          },
          customColors: {
            tableHeaderBg: '#F6FBF6'
          },
          action: {
            active: `rgb(var(--mui-mainColorChannels-light) / 0.4)`
          }
        }
      },
      dark: {
        palette: {
          primary: {
            main: '#91BFB6',
            light: '#91BFB6',
            dark: '#91BFB6',
            contrastText: '#fff'
          },
          secondary: {
            main: '#8A8D93',
            light: '#A1A4A9',
            dark: '#7C7F84'
          },
          background: {
            default: '#546e69',
            paper: '#3f544f',
            paperChannel: '60 77 55'
          },
          warning: {
            main: '#cfa440',
            light: '#cfa440',
            dark: '#bda24b',
            contrastText: '#fff'
          },
          error: {
            main: '#F48A64',
            light: '#d97b59',
            dark: '#d97b59',
            contrastText: '#fff'
          },
          customColors: {
            tableHeaderBg: '#2d3d39'
          },
          action: {
            active: `rgb(var(--mui-mainColorChannels-dard) / 0.4)`
          }
        }
      }
    },
    mainColorChannels: {
      light: '57 64 56',
      dark: '232 252 227',
      lightShadow: '36 41 40',
      darkShadow: '19 17 32'
    }
  } as Theme

  return deepmerge(coreTheme(settings, mode, direction), userTheme)
}

export default mergedTheme
