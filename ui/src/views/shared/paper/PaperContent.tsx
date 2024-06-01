import { Box, BoxProps, SxProps, Theme } from '@mui/material'
import { DefaultComponentProps } from '@mui/material/OverridableComponent'
import { FC, ReactNode } from 'react'

interface PaperContentProps {
  children: ReactNode
  [key: string]: any // For any other props
}

const PaperContent: FC<PaperContentProps> = ({ children, ...props }) => {
  return (
    <Box
      p={5}
      component='div'
      {...props}>
      {children}
    </Box>
  )
}

export default PaperContent
