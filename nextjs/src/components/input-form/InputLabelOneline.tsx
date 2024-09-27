'use client'

// MUI Import
import { Box, Grid2 as Grid, styled, Typography } from '@mui/material'
import type { BoxProps } from '@mui/material'

const BoxStyled = styled(Box)<BoxProps>(() => ({
  marginBottom: '1em'
}))

export interface IInputLabelOneline extends BoxProps {
  label: string
  labelColumnNumber?: number
}

const InputLabelOneline = (props: IInputLabelOneline) => {
  const { label, labelColumnNumber, children } = props

  const sizeLabel = labelColumnNumber || 4

  const sizeInputField = 12 - sizeLabel

  return (
    <BoxStyled {...props}>
      <Grid container spacing={2} alignItems='center' columns={12}>
        <Grid size={sizeLabel}>
          <Typography>{label}</Typography>
        </Grid>
        <Grid size={sizeInputField}>{children}</Grid>
      </Grid>
    </BoxStyled>
  )
}

export default InputLabelOneline
