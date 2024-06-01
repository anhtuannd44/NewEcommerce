import { Box, Button, Popover, TextField } from '@mui/material'
import { NumberFormatValues, NumericFormat, SourceInfo } from 'react-number-format'
import { DiscountType } from 'src/common/enums'

export interface IDiscountOrderPopover {
  open: boolean
  value: number
  discountType: DiscountType
  anchorEl: null | HTMLElement
  handleCloseDiscountTypeModule: () => void
  handleChangeDiscountType: (discountType: DiscountType) => void
  handleDiscountValueChange: (value: number) => void
}

const DiscountOrderPopover = ({
  open,
  discountType,
  value,
  anchorEl,
  handleCloseDiscountTypeModule,
  handleChangeDiscountType,
  handleDiscountValueChange
}: IDiscountOrderPopover) => {
  const onDiscountValueChange = (values: NumberFormatValues, source: SourceInfo) => {
    let valueNumber = values.floatValue
    if (valueNumber !== undefined) {
      if (discountType === DiscountType.Percent) {
        valueNumber = valueNumber > 100 ? 100 : valueNumber < 0 ? 0 : valueNumber
      } else {
        valueNumber = valueNumber < 0 ? 0 : valueNumber
      }

      handleDiscountValueChange(valueNumber)
    } else {
      valueNumber = 0
      handleDiscountValueChange(valueNumber)
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
          onClick={() => handleChangeDiscountType(DiscountType.Value)}
          size='small'
          sx={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }}>
          Giá trị
        </Button>
        <Button
          variant={discountType == DiscountType.Percent ? 'contained' : 'outlined'}
          onClick={() => handleChangeDiscountType(DiscountType.Percent)}
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
            onChange: (event: any) => {
              let valueNumber = parseFloat(event.target.value.replace(/,/g, ''))
              if (discountType === DiscountType.Percent) {
                valueNumber = valueNumber > 100 ? 100 : valueNumber < 0 ? 0 : valueNumber
              } else {
                valueNumber = valueNumber < 0 ? 0 : valueNumber
              }

              event.target.value = String(valueNumber)
            }
          }}
          onValueChange={(value, source) => {
            onDiscountValueChange(value, source)
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

export default DiscountOrderPopover
