import { List, ListItem, ListItemText, Typography } from "@mui/material"

export interface IProductBorrowProps {
    borrow: string,
    totalPay: string,
    returnOrder: string,
    shippingFail: string
}

const ProductBorrowInfo = (props: IProductBorrowProps) => {
    const { borrow, totalPay, returnOrder, shippingFail } = props

    return (
        <List>
            <ListItem
                key={1}
                disableGutters
                sx={{
                    height: 30
                }}
                secondaryAction={
                    <Typography variant='body1'>{borrow}</Typography>
                }
            >
                <ListItemText primary={'Nợ phải thu:'} />
            </ListItem>
            <ListItem
                key={2}
                disableGutters
                sx={{
                    height: 30
                }}
                secondaryAction={
                    <Typography variant='body1'>{totalPay}</Typography>
                }
            >
                <ListItemText primary={'Tổng chi tiêu:'} />
            </ListItem>
            <ListItem
                key={3}
                disableGutters
                sx={{
                    height: 30
                }}
                secondaryAction={
                    <Typography variant='body1'>{returnOrder}</Typography>
                }
            >
                <ListItemText primary={'Trả hàng:'} />
            </ListItem>
            <ListItem
                key={4}
                disableGutters
                sx={{
                    height: 30
                }}
                secondaryAction={
                    <Typography variant='body1'>{shippingFail}</Typography>
                }
            >
                <ListItemText primary={'Giao hàng thất bại:'} />
            </ListItem>
        </List>
    )
}

export default ProductBorrowInfo