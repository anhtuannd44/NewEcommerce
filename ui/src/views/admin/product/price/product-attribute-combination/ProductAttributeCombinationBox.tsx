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
import { IProductAdmin, IProductAttribute, IProductAttributeCombination, IProductAttributeCombinationControls } from 'src/redux/admin/interface/IProductAdmin'
import { handlePushMessageSnackbar, updateProductAttributeCombinationField, updateProductAttributes, updateGeneralField } from 'src/redux/admin/slice/productAdminSlice'
import { Delete } from 'mdi-material-ui'
import { alpha } from '@mui/material/styles'
import { IMessageCommon } from 'src/redux/admin/interface/ICommon'
import { ChangeEvent, useEffect, useState } from 'react'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import PaperContent from 'src/views/shared/paper/PaperContent'
import PaperHeader from 'src/views/shared/paper/PaperHeader'

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

export interface IProductAttributeCombinationBoxProps {
  product: IProductAdmin
  controls: IProductAttributeCombinationControls[]
  isSubmitted: boolean
  updateGeneralField: (field: keyof IProductAdmin, value: string | number) => void
  updateProductAttributes: (values: IProductAttribute[]) => void
  handlePushMessageSnackbar: (message: IMessageCommon) => void
  updateProductAttributeCombinationField: (field: keyof IProductAttributeCombination, rowId: string, value: any) => void
}

const ProductAttributeCombinationBox = (props: IProductAttributeCombinationBoxProps) => {
  const { product, controls, isSubmitted, updateProductAttributeCombinationField, updateGeneralField, updateProductAttributes, handlePushMessageSnackbar } = props
  const { productAttributes, productAttributeCombinations } = product

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
      const newSelected = productAttributeCombinations.map(n => n.id)
      setSelected(newSelected)

      return
    }
    setSelected([])
  }

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof IProductAttributeCombination, rowId: string) => {
    const value = event.currentTarget.value
    updateProductAttributeCombinationField(field, rowId, value)
  }

  const handleNumberChange = (field: keyof IProductAttributeCombination, rowId: string, values: NumberFormatValues) => {
    const value = values.floatValue
    updateProductAttributeCombinationField(field, rowId, value)
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
            <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={productAttributeCombinations.length} manageStockQuantity={product.manageStockQuantity} />
            <TableBody>
              {productAttributeCombinations &&
                productAttributeCombinations.length > 0 &&
                productAttributeCombinations.map((row, index) => {
                  const isItemSelected = isSelected(row.id)
                  const labelId = `enhanced-table-checkbox-${index}`
                  return (
                    <TableRow hover role='checkbox' aria-checked={isItemSelected} tabIndex={-1} key={index} selected={isItemSelected} sx={{ cursor: 'pointer' }}>
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
                        <FormControl error={isSubmitted && !controls.find(x => x.id === row.id)?.validate.sku.result.isValid} variant='standard' fullWidth>
                          <TextField
                            margin='dense'
                            id={`sku-${index}`}
                            name={`sku-${index}`}
                            fullWidth
                            variant='standard'
                            onChange={event => {
                              handleTextChange(event, 'sku', row.id)
                            }}
                            value={row.sku}
                            error={isSubmitted && !controls.find(x => x.id === row.id)?.validate.sku.result.isValid}
                          />
                          <FormHelperText>{isSubmitted && controls.find(x => x.id === row.id)?.validate.sku.result.errorMessage}</FormHelperText>
                        </FormControl>
                      </TableCell>
                      <TableCell key={`barcode-${index}`} align='left' sx={{ verticalAlign: 'top' }}>
                        <FormControl error={isSubmitted && !controls.find(x => x.id === row.id)?.validate.barCode.result.isValid} variant='standard' fullWidth required>
                          <TextField
                            margin='dense'
                            id={`barcode-${index}`}
                            name={`barcode-${index}`}
                            fullWidth
                            variant='standard'
                            onChange={event => {
                              handleTextChange(event, 'barCode', row.id)
                            }}
                            value={row.barCode}
                            error={isSubmitted && !controls.find(x => x.id === row.id)?.validate.barCode.result.isValid}
                          />
                          <FormHelperText>{isSubmitted && controls.find(x => x.id === row.id)?.validate.barCode.result.errorMessage}</FormHelperText>
                        </FormControl>
                      </TableCell>
                      <TableCell key={`price-${index}`} align='right' sx={{ verticalAlign: 'top' }}>
                        <FormControl error={isSubmitted && !controls.find(x => x.id === row.id)?.validate.price.result.isValid} variant='standard' fullWidth>
                          <NumericFormat
                            valueIsNumericString={false}
                            margin='dense'
                            id={`price-${index}`}
                            name={`price-${index}`}
                            value={row.price || ''}
                            variant='standard'
                            type='text'
                            inputProps={{ min: 0, style: { textAlign: 'right' } }}
                            onValueChange={values => {
                              handleNumberChange('price', row.id, values)
                            }}
                            suffix=' ₫'
                            customInput={TextField}
                            decimalScale={2}
                            thousandSeparator=','
                            allowLeadingZeros={false}
                            allowNegative={false}
                            error={isSubmitted && !controls.find(x => x.id === row.id)?.validate.price.result.isValid}
                          />
                          <FormHelperText>{isSubmitted && controls.find(x => x.id === row.id)?.validate.price.result.errorMessage}</FormHelperText>
                        </FormControl>
                      </TableCell>
                      {product.manageStockQuantity && (
                        <>
                          <TableCell key={`stockQuantity-${index}`} align='right' sx={{ verticalAlign: 'top' }}>
                            <FormControl error={isSubmitted && !controls.find(x => x.id === row.id)?.validate.stockQuantity.result.isValid} variant='standard' fullWidth>
                              <NumericFormat
                                margin='dense'
                                id={`stockQuantity-${index}`}
                                name={`stockQuantity-${index}`}
                                value={row.stockQuantity || ''}
                                variant='standard'
                                type='text'
                                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                onValueChange={values => {
                                  handleNumberChange('stockQuantity', row.id, values)
                                }}
                                customInput={TextField}
                                decimalScale={0}
                                thousandSeparator=','
                                allowLeadingZeros={false}
                                allowNegative={false}
                                error={isSubmitted && !controls.find(x => x.id === row.id)?.validate.stockQuantity.result.isValid}
                              />
                              <FormHelperText>{isSubmitted && controls.find(x => x.id === row.id)?.validate.stockQuantity.result.errorMessage}</FormHelperText>
                            </FormControl>
                          </TableCell>
                          <TableCell key={`price-${index}`} align='right' sx={{ verticalAlign: 'top' }}>
                            <FormControl error={isSubmitted && !controls.find(x => x.id === row.id)?.validate.productCost.result.isValid} variant='standard' fullWidth>
                              <NumericFormat
                                margin='dense'
                                id={`productCost-${index}`}
                                name={`productCost-${index}`}
                                value={row.productCost || ''}
                                variant='standard'
                                type='text'
                                suffix=' ₫'
                                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                onValueChange={values => {
                                  handleNumberChange('productCost', row.id, values)
                                }}
                                customInput={TextField}
                                decimalScale={2}
                                thousandSeparator=','
                                allowLeadingZeros={false}
                                allowNegative={false}
                                error={isSubmitted && !controls.find(x => x.id === row.id)?.validate.productCost.result.isValid}
                              />
                              <FormHelperText>{isSubmitted && controls.find(x => x.id === row.id)?.validate.productCost.result.errorMessage}</FormHelperText>
                            </FormControl>
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
