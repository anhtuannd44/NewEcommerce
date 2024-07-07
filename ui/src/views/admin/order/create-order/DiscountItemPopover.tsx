import { Box, Button, Popover, TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import { NumberFormatValues, NumericFormat, SourceInfo } from 'react-number-format'
import { DiscountType } from 'src/common/enums'

export interface IDiscountItemPopover {
  open: boolean
  productId: string
  value: number
  discountType: DiscountType
  anchorEl: null | HTMLElement
  handleCloseDiscountTypeModule: () => void
  handleChangeDiscountType: (id: string, discountType: DiscountType) => void
  handleDiscountValueChange: (id: string, value: number) => void
}

const DiscountItemPopover = (props: IDiscountItemPopover) => {
  const { open, productId, discountType, value, anchorEl, handleCloseDiscountTypeModule, handleChangeDiscountType, handleDiscountValueChange } = props

  const onDiscountValueChange = (values: NumberFormatValues) => {
    const discountValue = typeof values.floatValue === 'number' ? Math.min(Math.max(values.floatValue, 0), discountType === DiscountType.Percent ? 100 : Infinity) : 0
    handleDiscountValueChange(productId, discountValue)
  }

  const onDiscountInputTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputValue = event.target.value?.replace(/,/g, '') ?? '0'
    const discountValue = parseFloat(inputValue)

    if (discountType === DiscountType.Percent) {
      event.target.value = Math.min(Math.max(discountValue, 0), 100).toString()
    } else {
      event.target.value = Math.max(discountValue, 0).toString()
    }
  }

  return (
    <Popover
      id={''}
      open={open}
      anchorEl={anchorEl}
      onClose={() => handleCloseDiscountTypeModule()}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      sx={{
        marginTop: 3
      }}>
      <Box p={3} boxShadow={[2]} borderRadius={'4px'}>
        <Button
          variant={discountType == DiscountType.Value ? 'contained' : 'outlined'}
          onClick={() => handleChangeDiscountType(productId, DiscountType.Value)}
          size='small'
          sx={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }}>
          Giá trị
        </Button>
        <Button
          variant={discountType == DiscountType.Percent ? 'contained' : 'outlined'}
          onClick={() => handleChangeDiscountType(productId, DiscountType.Percent)}
          size='small'
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            marginRight: 3
          }}>
          %
        </Button>
        <NumericFormat
          value={value}
          variant='standard'
          customInput={TextField}
          sx={{
            verticalAlign: 'baseline'
          }}
          inputProps={{
            min: 0,
            style: {
              textAlign: 'right',
              maxWidth: 90,
              verticalAlign: 'baseline'
            },
            onChange: onDiscountInputTextChange
          }}
          onValueChange={value => {
            onDiscountValueChange(value)
          }}
          decimalScale={2}
          thousandSeparator=','
          allowLeadingZeros={false}
          allowNegative={false}
        />
      </Box>
    </Popover>
  )
}

export default DiscountItemPopover
