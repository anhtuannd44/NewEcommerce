'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { Box, Button, Grid2 as Grid, Popover, TextField, Typography } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import type { NumberFormatValues } from 'react-number-format'

// Enum Imports
import { DiscountType } from '@/enums/product-enums'

// Type Imports
import type { IOrder } from '@/interface/admin/order'

interface IDiscountOrderPopover {
  handleCalculateTotal: (calVat?: number) => void
  discountPercent: number
}

const DiscountTotalBoxPopover = (props: IDiscountOrderPopover) => {
  const { handleCalculateTotal, discountPercent } = props
  const { control, watch, setValue } = useFormContext<IOrder>()

  const discountType = useWatch<IOrder>({ name: 'discountType' }) as DiscountType
  const discountValue = (useWatch<IOrder>({ name: 'discountValue' }) as number) ?? 0
  const preTotal = (watch('preTotal') as number) ?? 0
  const totalPriceAfterDiscount = watch('totalPriceAfterDiscount') as number

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    if (discountType === undefined) {
      setValue('discountType', DiscountType.Value)
    }
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? `discount-popover` : undefined

  const handleDiscountValueChange = (values: NumberFormatValues) => {
    const valueNumber = values.floatValue ?? 0

    setValue('discountValue', valueNumber)
    handleCalculateTotal()
  }

  const handleDiscountTypeChange = (type: DiscountType) => {
    setValue('discountType', type)
    let newDiscountValue = 0

    if (type === DiscountType.Percent) {
      newDiscountValue = discountValue > 100 ? 100 : discountValue < 0 ? 0 : discountValue
    } else {
      newDiscountValue = discountValue < 0 ? 0 : discountValue
    }

    setValue('discountValue', newDiscountValue)
    handleCalculateTotal()
  }

  return (
    <>
      <NumericFormat
        variant='standard'
        type='text'
        slotProps={{
          htmlInput: {
            min: 0,
            style: { textAlign: 'right' },
            readOnly: true
          }
        }}
        valueIsNumericString={true}
        min={0}
        value={discountType === DiscountType.Value ? discountValue : (preTotal / 100) * discountValue}
        customInput={TextField}
        onClick={handleClick}
        decimalScale={2}
        thousandSeparator=','
        allowLeadingZeros={false}
        allowNegative={false}
      />
      {discountPercent > 0 && (
        <Typography textAlign='right' color={totalPriceAfterDiscount < 0 ? 'error' : 'success'} fontSize='0.725rem'>
          {`${discountPercent.toFixed(2)} %`}
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
        }}
      >
        <Box p={3} boxShadow={[2]} borderRadius={'4px'}>
          <Controller
            name={'discountType'}
            control={control}
            render={() => (
              <Grid container>
                <Grid size={6}>
                  <Button
                    variant={discountType == DiscountType.Value ? 'contained' : 'outlined'}
                    onClick={() => handleDiscountTypeChange(DiscountType.Value)}
                    size='small'
                    fullWidth
                    sx={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0
                    }}
                  >
                    Giá trị
                  </Button>
                </Grid>
                <Grid size={6}>
                  <Button
                    variant={discountType == DiscountType.Percent ? 'contained' : 'outlined'}
                    onClick={() => handleDiscountTypeChange(DiscountType.Percent)}
                    size='small'
                    fullWidth
                    sx={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0
                    }}
                  >
                    %
                  </Button>
                </Grid>
              </Grid>
            )}
          />
          <Controller
            name={'discountValue'}
            control={control}
            render={() => (
              <NumericFormat
                value={discountValue}
                variant='standard'
                customInput={TextField}
                sx={{
                  verticalAlign: 'baseline'
                }}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    style: {
                      textAlign: 'right',
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
                  }
                }}
                onValueChange={value => {
                  handleDiscountValueChange(value)
                }}
                decimalScale={2}
                thousandSeparator=','
                allowLeadingZeros={false}
                allowNegative={false}
              />
            )}
          />
        </Box>
      </Popover>
    </>
  )
}

export default DiscountTotalBoxPopover
