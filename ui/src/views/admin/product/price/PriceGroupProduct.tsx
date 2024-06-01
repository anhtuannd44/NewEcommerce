import { FormControl, FormLabel, Grid, TextField } from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import { IProductAdmin } from 'src/redux/admin/interface/IProductAdmin'
import { updateGeneralField} from 'src/redux/admin/slice/productAdminSlice'
import ProductAttributeBox from './product-attribute-combination/ProductAttributeBox'

export interface IPriceGroupProductProps {
  product: IProductAdmin
  updateGeneralField: (field: keyof IProductAdmin, value: number) => void
}

const PriceGroupProduct = (props: IPriceGroupProductProps) => {
  const { product, updateGeneralField } = props

  return (
    <>
      <ProductAttributeBox />
      
     
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  product: state.productAdmin.createOrUpdateProductAdminRequest.product
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateGeneralField: (field: keyof IProductAdmin, value: number) => dispatch(updateGeneralField({ field, value }))
})

export default connect(mapStateToProps, mapDispatchToProps)(PriceGroupProduct)
