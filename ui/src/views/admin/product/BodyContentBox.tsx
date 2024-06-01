import { Paper, Typography } from '@mui/material'
import { AppDispatch, RootState } from 'src/redux/store'
import { connect } from 'react-redux'
import { IProductAdmin } from 'src/redux/admin/interface/IProductAdmin'
import { updateGeneralField } from 'src/redux/admin/slice/productAdminSlice'
import DxHtmlEditor from 'src/views/shared/editor'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import { useCallback } from 'react'
import _ from 'lodash'

export interface IBodyContentBoxProps {
  product: IProductAdmin
  updateGeneralField: (field: keyof IProductAdmin, value: string) => void
}

const BodyContentBox = (props: IBodyContentBoxProps) => {
  const { updateGeneralField } = props

  const updateGeneralFieldDebounce = useCallback(_.debounce((field: keyof IProductAdmin, value: string) => updateGeneralField(field, value), 1000), [])

  const handleValueChange = (value: any) => {
    updateGeneralFieldDebounce('body', value)
  }

  return (
    <Paper>
      <PaperHeader leftHeader={<Typography variant='h6'>Chi tiết sản phẩm</Typography>} />
      <PaperContent>
        <DxHtmlEditor height='650px' handleValueChange={handleValueChange} />
      </PaperContent>
    </Paper>
  )
}

const mapStateToProps = (state: RootState) => ({
  product: state.productAdmin.createOrUpdateProductAdminRequest.product
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateGeneralField: (field: keyof IProductAdmin, value: string) => dispatch(updateGeneralField({ field, value }))
})

export default connect(mapStateToProps, mapDispatchToProps)(BodyContentBox)
