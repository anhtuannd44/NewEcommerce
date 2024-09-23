import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'

export interface IProductBorrowProps {
  borrow: string
  totalPay: string
  returnOrder: string
  shippingFail: string
}

const ProductBorrowInfo = (props: IProductBorrowProps) => {
  const { borrow, totalPay, returnOrder, shippingFail } = props

  return (
    <Box p={4} border='1px dashed grey' borderRadius={1}>
      <List disablePadding>
        <ListItem
          disablePadding
          disableGutters
          key={1}
          sx={{
            height: 30
          }}
          secondaryAction={<Typography variant='body1'>{borrow}</Typography>}
        >
          <ListItemText primary={'Nợ phải thu:'} />
        </ListItem>
        <ListItem
          key={2}
          disablePadding
          disableGutters
          sx={{
            height: 30
          }}
          secondaryAction={<Typography variant='body1'>{totalPay}</Typography>}
        >
          <ListItemText primary={'Tổng chi tiêu:'} />
        </ListItem>
        <ListItem
          key={3}
          disablePadding
          disableGutters
          sx={{
            height: 30
          }}
          secondaryAction={<Typography variant='body1'>{returnOrder}</Typography>}
        >
          <ListItemText primary={'Trả hàng:'} />
        </ListItem>
        <ListItem
          key={4}
          disablePadding
          disableGutters
          sx={{
            height: 30
          }}
          secondaryAction={<Typography variant='body1'>{shippingFail}</Typography>}
        >
          <ListItemText primary={'Giao hàng thất bại:'} />
        </ListItem>
      </List>
    </Box>
  )
}

export default ProductBorrowInfo
