import { Box, Button, Grid, FormControl, Popover, TextField, Typography } from '@mui/material'
import _ from 'lodash'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { DiscountType } from 'src/common/enums'
import { IProductItemRequestBody } from 'src/form/admin/interface/IOrderRequest'

export interface IDiscountOrderPopover {
  index: number
}

const DiscountOrderPopover = (props: IDiscountOrderPopover) => {
  const { index } = props
  const { control, setValue, watch } = useFormContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const fieldWatch = watch(`items.${index}`) as IProductItemRequestBody

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? `discount-popover-${index}` : undefined

  const handleDiscountTypeChange = (type: DiscountType) => {
    const fieldUpdate = _.clone(fieldWatch)
    let newDiscountValue = 0
    if (type === DiscountType.Percent) {
      newDiscountValue = fieldUpdate.discountValue > 100 ? 100 : fieldUpdate.discountValue < 0 ? 0 : fieldUpdate.discountValue
    } else {
      newDiscountValue = fieldUpdate.discountValue < 0 ? 0 : fieldUpdate.discountValue
    }

    fieldUpdate.discountType = type
    fieldUpdate.discountValue = newDiscountValue
    setValue(`items.${index}`, fieldUpdate, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <>
      <NumericFormat
        variant='standard'
        type='text'
        inputProps={{
          min: 0,
          style: { textAlign: 'right' },
          readOnly: true
        }}
        valueIsNumericString={true}
        min={0}
        value={fieldWatch.discountType === DiscountType.Value ? fieldWatch.discountValue : ((fieldWatch.price || 0) / 100) * (fieldWatch.discountValue || 0)}
        customInput={TextField}
        onClick={handleClick}
        decimalScale={2}
        thousandSeparator=','
        allowLeadingZeros={false}
        allowNegative={false}
      />
      {(fieldWatch.discountValue || 0) > 0 && (fieldWatch.quantity || 0) > 0 && (
        <Typography color={(fieldWatch.totalPriceAfterDiscount || 0) < 0 ? 'error' : 'success'} fontSize='0.725rem'>
          {`${fieldWatch.discountPercent?.toFixed(2)} %`}
        </Typography>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        sx={{
          marginTop: 3
        }}>
        <Box p={3} boxShadow={[2]} borderRadius={'4px'}>
          <Controller
            name={`items.${index}.discountType`}
            control={control}
            render={({ field }) => (
              <Grid container>
                <Grid item xs={6}>
                  <Button
                    variant={field.value == DiscountType.Value ? 'contained' : 'outlined'}
                    onClick={() => handleDiscountTypeChange(DiscountType.Value)}
                    size='small'
                    fullWidth
                    sx={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0
                    }}>
                    Giá trị
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant={field.value == DiscountType.Percent ? 'contained' : 'outlined'}
                    onClick={() => handleDiscountTypeChange(DiscountType.Percent)}
                    size='small'
                    fullWidth
                    sx={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0
                    }}>
                    %
                  </Button>
                </Grid>
              </Grid>
            )}
          />
          <Controller
            name={`items.${index}.discountValue`}
            control={control}
            render={({ field: { onChange, value }, fieldState }) => {
              return (
                <FormControl error={!!fieldState.error} variant='standard' fullWidth>
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
                        verticalAlign: 'baseline'
                      },
                      onChange: (event: any) => {
                        let valueNumber = parseFloat(event.target.value.replace(/,/g, ''))
                        if (fieldWatch.discountType === DiscountType.Percent) {
                          valueNumber = valueNumber > 100 ? 100 : valueNumber < 0 ? 0 : valueNumber
                        } else {
                          valueNumber = valueNumber < 0 ? 0 : valueNumber
                        }

                        event.target.value = String(valueNumber)
                      }
                    }}
                    onValueChange={(value, source) => {
                      onChange(value.floatValue ?? null)
                    }}
                    decimalScale={2}
                    thousandSeparator=','
                    allowLeadingZeros={false}
                    allowNegative={false}
                  />
                </FormControl>
              )
            }}
          />
        </Box>
      </Popover>
    </>
  )
}

export default DiscountOrderPopover
