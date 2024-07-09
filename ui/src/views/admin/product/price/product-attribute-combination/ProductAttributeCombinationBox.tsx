import {
  Button,
  IconButton,
  TextField,
  Typography,
  TableHead,
  TableCell,
  Checkbox,
  TableContainer,
  TableBody,
  Toolbar,
  Tooltip,
  TableRow,
  Table,
  Stack,
  Paper,
  FormControl,
  FormHelperText
} from '@mui/material'
import { Delete } from 'mdi-material-ui'
import { alpha } from '@mui/material/styles'
import { IMessageCommon } from 'src/redux/admin/interface/ICommon'
import { ChangeEvent, useEffect, useState } from 'react'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import PaperContent from 'src/views/shared/paper/PaperContent'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { IProduct } from 'src/form/admin/product/interface/IProduct'
import { IProductAttribute } from 'src/form/admin/product/interface/IProductAttribute'
import { IAttributeJson, IProductAttributeCombination } from 'src/form/admin/product/interface/IProductCombination'
import { v4 } from 'uuid'

interface EnhancedTableProps {
  numSelected: number
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  rowCount: number
  manageStockQuantity: boolean
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { onSelectAllClick, numSelected, rowCount, manageStockQuantity } = props

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          />
        </TableCell>
        <TableCell key={1} align='left' padding={'normal'}>
          Tên Phiên Bản
        </TableCell>
        <TableCell key={2} align='left' padding={'normal'}>
          Mã SKU
        </TableCell>
        <TableCell key={3} align='left' padding={'normal'}>
          Barcode
        </TableCell>
        <TableCell key={4} align='right' padding={'normal'}>
          Giá Bán
        </TableCell>
        {manageStockQuantity && (
          <>
            <TableCell key={5} align='right' padding={'normal'}>
              Tồn Kho
            </TableCell>
            <TableCell key={6} align='right' padding={'normal'}>
              Giá Nhập
            </TableCell>
          </>
        )}
      </TableRow>
    </TableHead>
  )
}

interface ITableToolbarProps {
  numSelected: number
}

const EnhancedTableToolbar = (props: ITableToolbarProps) => {
  const { numSelected } = props
  return (
    <Toolbar
      sx={{
        px: '1.75em !important',
        ...(numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}>
      <Typography
        sx={{
          flex: '1 1 100%'
        }}
        color='inherit'
        variant='subtitle1'
        component='div'>
        {numSelected} đang được chọn
      </Typography>
      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton>
            <Delete />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  )
}

const ProductAttributeCombinationBox = () => {
  const { control, watch, setValue } = useFormContext<IProduct>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productAttributeCombinations'
  })

  const manageStockQuantity = watch('manageStockQuantity')
  const sku = watch('sku')

  const productAttributes = useWatch({ name: 'productAttributes' })

  const generateCombinations = (attributes: IProductAttribute[]): IProductAttributeCombination[] => {
    if (attributes.length === 0) return []

    const combinations: IProductAttributeCombination[] = []

    const generate = (prefix: IAttributeJson[], prefixName: string, remainingAttributes: IProductAttribute[]) => {
      const [first, ...rest] = remainingAttributes

      first.productAttributeValues.forEach(value => {
        const combination = [...prefix, { productAttributeId: first.id, productAttributeValue: value }]
        const combinationName = prefixName ? `${prefixName} - ${value}` : value
        if (rest.length > 0) {
          generate(combination, combinationName, rest)
        } else {
          combinations.push({
            id: v4(),
            name: combinationName,
            sku: sku,
            barCode: '',
            attributeJson: combination
          })
        }
      })
    }

    generate([], '', attributes)

    return combinations
  }

  useEffect(() => {
    const newCombinations = generateCombinations(productAttributes || [])
    setValue('productAttributeCombinations', newCombinations)
  }, [productAttributes])

  const [selected, setSelected] = useState<readonly string[]>([])

  const handleClickSelectRow = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = fields.map(n => n.id)
      setSelected(newSelected)

      return
    }
    setSelected([])
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  return (
    <Paper>
      <PaperHeader leftHeader={<Typography variant='h6'>Chỉnh sửa biến thể sản phẩm</Typography>} />
      <PaperContent>
        <Stack spacing={2} direction='row' mb={5}>
          <Button variant='outlined' size='small' sx={{ fontWeight: 300 }}>
            Tạo toàn bộ biến thể
          </Button>
          <Button variant='outlined' size='small' sx={{ fontWeight: 300 }}>
            Thêm biến thể tùy chỉnh
          </Button>
        </Stack>
        <TableContainer>
          <EnhancedTableToolbar numSelected={selected.length} />
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={'medium'}>
            <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={fields.length} manageStockQuantity={manageStockQuantity} />
            <TableBody>
              {fields &&
                fields.length > 0 &&
                fields.map((row, index) => {
                  const isItemSelected = isSelected(row.id)
                  const labelId = `enhanced-table-checkbox-${row.id}`
                  return (
                    <TableRow hover role='checkbox' aria-checked={isItemSelected} tabIndex={-1} key={row.id} selected={isItemSelected} sx={{ cursor: 'pointer' }}>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          color='primary'
                          onClick={event => handleClickSelectRow(event, row.id)}
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId
                          }}
                        />
                      </TableCell>
                      <TableCell key={`name-${index}`} align='left'>
                        {row.name}
                      </TableCell>
                      <TableCell key={`sku-${index}`} align='left' sx={{ verticalAlign: 'top' }}>
                        <Controller
                          name={`productAttributeCombinations.${index}.sku`}
                          control={control}
                          render={({ field: { onChange }, fieldState }) => (
                            <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                              <TextField margin='dense' id={`sku-${index}`} name={`sku-${index}`} fullWidth variant='standard' onChange={onChange} error={!!fieldState.error} />
                              <FormHelperText>{fieldState.error?.message}</FormHelperText>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell key={`barcode-${index}`} align='left' sx={{ verticalAlign: 'top' }}>
                        <Controller
                          name={`productAttributeCombinations.${index}.barCode`}
                          control={control}
                          render={({ field: { onChange }, fieldState }) => (
                            <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                              <TextField margin='dense' id={`barCode-${index}`} name={`barCode-${index}`} fullWidth variant='standard' onChange={onChange} error={!!fieldState.error} />
                              <FormHelperText>{fieldState.error?.message}</FormHelperText>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell key={`price-${index}`} align='right' sx={{ verticalAlign: 'top' }}>
                        <Controller
                          name={`productAttributeCombinations.${index}.price`}
                          control={control}
                          render={({ field: { onChange }, fieldState }) => (
                            <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                              <NumericFormat
                                valueIsNumericString={false}
                                margin='dense'
                                id={`price-${index}`}
                                name={`price-${index}`}
                                variant='standard'
                                type='text'
                                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                onValueChange={values => {
                                  onChange(values.floatValue)
                                }}
                                suffix=' ₫'
                                customInput={TextField}
                                decimalScale={2}
                                thousandSeparator=','
                                allowLeadingZeros={false}
                                allowNegative={false}
                                error={!!fieldState.error}
                              />
                              <FormHelperText>{fieldState.error?.message}</FormHelperText>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      {manageStockQuantity && (
                        <>
                          <TableCell key={`stockQuantity-${index}`} align='right' sx={{ verticalAlign: 'top' }}>
                            <Controller
                              name={`productAttributeCombinations.${index}.stockQuantity`}
                              control={control}
                              render={({ field: { onChange }, fieldState }) => (
                                <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                                  <NumericFormat
                                    margin='dense'
                                    id={`stockQuantity-${index}`}
                                    name={`stockQuantity-${index}`}
                                    variant='standard'
                                    type='text'
                                    inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                    onValueChange={values => {
                                      onChange(values.floatValue)
                                    }}
                                    customInput={TextField}
                                    decimalScale={0}
                                    thousandSeparator=','
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    error={!!fieldState.error}
                                  />
                                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                                </FormControl>
                              )}
                            />
                          </TableCell>
                          <TableCell key={`productCost-${index}`} align='right' sx={{ verticalAlign: 'top' }}>
                            <Controller
                              name={`productAttributeCombinations.${index}.productCost`}
                              control={control}
                              render={({ field: { onChange }, fieldState }) => (
                                <FormControl error={!!fieldState.error} variant='standard' fullWidth>
                                  <NumericFormat
                                    margin='dense'
                                    id={`productCost-${index}`}
                                    name={`productCost-${index}`}
                                    variant='standard'
                                    type='text'
                                    suffix=' ₫'
                                    inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                    onValueChange={values => {
                                      onChange(values.floatValue)
                                    }}
                                    customInput={TextField}
                                    decimalScale={2}
                                    thousandSeparator=','
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    error={!!fieldState.error}
                                  />
                                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                                </FormControl>
                              )}
                            />
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  )
                })}
              {/* {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows
                    }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
            </TableBody>
          </Table>
        </TableContainer>
      </PaperContent>
    </Paper>
  )
}

export default ProductAttributeCombinationBox
