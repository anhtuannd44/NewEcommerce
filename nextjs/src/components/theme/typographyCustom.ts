// MUI Imports
import type { Theme } from '@mui/material/styles'

const typographyCustom = (): Theme['typography'] =>
  ({
    fontSize: 12.125,
    h1: {
      fontSize: '2.725rem',
      fontWeight: 500,
      lineHeight: 1.478261
    },
    h2: {
      fontSize: '2.225rem',
      fontWeight: 500,
      lineHeight: 1.47368421
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.58334
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5556
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.46667
    },
    subtitle1: {
      fontSize: '0.875rem',
      lineHeight: 1.46667
    },
    subtitle2: {
      fontSize: '0.775rem',
      fontWeight: 400,
      lineHeight: 1.53846154
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.46667
    },
    body2: {
      fontSize: '0.775rem',
      lineHeight: 1.53846154
    },
    button: {
      fontSize: '0.875rem',
      lineHeight: 1.46667,
      textTransform: 'none'
    },
    caption: {
      fontSize: '0.775rem',
      lineHeight: 1.3846154,
      letterSpacing: '0.4px'
    },
    overline: {
      fontSize: '0.75rem',
      lineHeight: 1.16667,
      letterSpacing: '0.8px'
    }
  }) as Theme['typography']

export default typographyCustom
