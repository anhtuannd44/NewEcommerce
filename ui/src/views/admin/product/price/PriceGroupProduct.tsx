import { FormControl, FormLabel, Grid, TextField } from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import { IProductAdmin } from 'src/redux/admin/interface/IProductAdmin'

import ProductAttributeBox from './product-attribute-combination/ProductAttributeBox'

const PriceGroupProduct = () => {
  return (
    <>
      <ProductAttributeBox />
    </>
  )
}

export default PriceGroupProduct
