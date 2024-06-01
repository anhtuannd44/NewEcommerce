import * as React from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import { visuallyHidden } from '@mui/utils'
import { Pagination, Stack } from '@mui/material'

export interface TableColumn<T> {
  name: string
  field: keyof T
  align: 'left' | 'center' | 'right'
  width: string | undefined
  ellipsis: boolean
}

type Order = 'asc' | 'desc'

interface EnhancedTableProps<T> {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
  headers: TableColumn<T>[]
}

const EnhancedTableHead = <T,>(props: EnhancedTableProps<T>) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headers } = props
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

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
        {headers.slice(1).map(headCell => (
          <TableCell key={headCell.name} align={headCell.align} padding={'normal'} sortDirection={orderBy == headCell.field ? order : false}>
            <TableSortLabel active={orderBy == headCell.field} direction={orderBy == headCell.field ? order : 'asc'} onClick={createSortHandler(headCell.name)}>
              {headCell.name}
              {orderBy == headCell.field ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
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
        {numSelected} selected
      </Typography>
      <Tooltip title='Delete'>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  )
}

const PaginationButtons = () => {
  return (
    <Stack spacing={2} alignItems='center' sx={{ py: '1em' }}>
      <Pagination count={10} showFirstButton showLastButton />
    </Stack>
  )
}

export interface ITableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
	isPagination?: boolean
	setRowPerPage?: number
}

const TableSelection = <T,>(props: ITableProps<T>) => {
  const { data, columns, isPagination, setRowPerPage } = props

  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<string>('calories')
  const [selected, setSelected] = React.useState<readonly T[keyof T][]>([])
  const [page, setPage] = React.useState(0)
  const rowsPerPage = setRowPerPage ?? 5

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map(n => n[columns[0].field])
      setSelected(newSelected)

      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: T[keyof T]) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly T[keyof T][] = []

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const isSelected = (id: T[keyof T]) => selected.indexOf(id) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <EnhancedTableToolbar numSelected={selected.length} />
        <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={'medium'}>
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={() => handleRequestSort}
            rowCount={data.length}
            headers={columns}
          />
          <TableBody>
            {data.map((row, index) => {
              const isItemSelected = isSelected(row[columns[0].field])
              const labelId = `enhanced-table-checkbox-${index}`

              return (
                <TableRow
                  hover
                  onClick={(event: any) => handleClick(event, row[columns[0].field])}
                  role='checkbox'
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={index}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      color='primary'
                      checked={isItemSelected}
                      inputProps={{
                        'aria-labelledby': labelId
                      }}
                    />
                  </TableCell>
                  {columns.slice(1).map(value => {
                    const textValue = String(row[value.field])
                    return (
                      <TableCell key={value.name} align={value.align} width={value.width ? value.width : undefined}>
                        <Tooltip title={textValue} placement='top'>
                          <Typography
                            sx={{
                              overflow: value.ellipsis ? 'hidden' : 'unset',
                              textOverflow: value.ellipsis ? 'ellipsis' : 'unset',
                              display: value.ellipsis ? '-webkit-box' : 'unset',
                              WebkitLineClamp: value.ellipsis ? '3' : 'unset',
                              WebkitBoxOrient: value.ellipsis ? 'vertical' : 'unset',
                              fontSize: '0.87rem'
                            }}
                            component='p'>
                            {textValue}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows
                }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationButtons />
    </Paper>
  )
}

export default TableSelection
