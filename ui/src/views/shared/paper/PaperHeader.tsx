import { Box } from '@mui/material'
import { ReactNode } from 'react'

interface IPaperHeaderProps {
  leftHeader: ReactNode
  rightHeader?: ReactNode
}

const PaperHeader = (props: IPaperHeaderProps): JSX.Element => {
  const { leftHeader, rightHeader } = props
  return (
    <Box borderBottom='1px solid #E8EAEB' justifyContent='space-between' display='flex' alignItems='center' px={5} py={3}>
      <Box display='flex' justifyContent='flex-start'>
        {leftHeader}
      </Box>
      {rightHeader && (
        <Box display='flex' justifyContent='flex-end' alignItems='center'>
          {rightHeader}
        </Box>
      )}
    </Box>
  )
}

export default PaperHeader
