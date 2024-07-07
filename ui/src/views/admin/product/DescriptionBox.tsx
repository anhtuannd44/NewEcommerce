import { Paper, Typography } from '@mui/material'
import { IProductAdmin } from 'src/redux/admin/interface/IProductAdmin'
import DxHtmlEditor from 'src/views/shared/editor'
import PaperHeader from 'src/views/shared/paper/PaperHeader'
import PaperContent from 'src/views/shared/paper/PaperContent'
import { Controller, useFormContext } from 'react-hook-form'
import { IProduct } from 'src/form/admin/product/interface/IProduct'

export interface IDescriptionBoxProps {
  product: IProductAdmin
  updateGeneralField: (field: keyof IProductAdmin, value: string) => void
}

const DescriptionBox = () => {
  const { control } = useFormContext<IProduct>()

  return (
    <Paper>
      <PaperHeader leftHeader={<Typography variant='h6'>Mô tả ngắn</Typography>} />
      <PaperContent>
        <Controller name='shortDescription' control={control} render={({ field: { onChange }, fieldState }) => <DxHtmlEditor height='350px' handleValueChange={onChange} />} />
      </PaperContent>
    </Paper>
  )
}

export default DescriptionBox
