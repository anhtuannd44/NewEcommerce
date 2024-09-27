'use client'

// MUI Imports
import { IconButton, Box, BoxProps, styled, Chip } from '@mui/material'

// Third-party Imports
import { Icon } from '@iconify/react'

interface INumberInputWithButton extends BoxProps {
  onIncrease: () => void
  onDecrease: () => void
}

const NumberFieldWrapper = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;

  &:hover .increase-btn,
  &:hover .decrease-btn {
    opacity: 1;
  }
`

const ButtonIcon = styled(IconButton)`
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 3px;
`

const NumberInputWithButton = (props: INumberInputWithButton) => {
  return (
    <NumberFieldWrapper>
      <ButtonIcon
        className='decrease-btn'
        sx={{
          left: '-20px'
        }}
        onClick={props.onDecrease}
      >
        <Icon icon='mdi:minus-circle' fontSize='20px' />
      </ButtonIcon>
      {props.children}
      <ButtonIcon
        className='increase-btn'
        sx={{
          right: '-20px'
        }}
        onClick={props.onIncrease}
      >
        <Icon icon='mdi:plus-circle' fontSize='20px' />
      </ButtonIcon>
    </NumberFieldWrapper>
  )
}

export default NumberInputWithButton
