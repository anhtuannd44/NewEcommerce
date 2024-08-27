// React Imports
import type { FC, ReactNode } from 'react'

// MUI Imports
import { Box } from '@mui/material'

interface PaperContentProps {
  children: ReactNode
  [key: string]: any // For any other props
}

const PaperContent: FC<PaperContentProps> = ({ children, ...props }) => {
  return (
    <Box p={5} component='div' {...props}>
      {children}
    </Box>
  )
}

export default PaperContent
