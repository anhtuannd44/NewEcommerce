'use client'

// MUI Imports
import { Paper, Typography } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'

// Type Imports
import type { IProduct } from '@interface/admin/product/IProduct'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Component Imports
import PaperContent from '@components/paper/PaperContent'
import PaperHeader from '@components/paper/PaperHeader'
import DxHtmlEditor from '@views/shared/editor/DxHtmlEditor'

const ProductDescriptionBox = () => {
  const { control } = useFormContext<IProduct>()

  const { dictionary } = useDictionary()

  return (
    <Paper>
      <PaperHeader
        leftHeader={<Typography variant='h6'>{dictionary.adminArea.product.shortDescriptionPanelTitle}</Typography>}
      />
      <PaperContent>
        <Controller
          name='shortDescription'
          control={control}
          render={({ field: { onChange } }) => <DxHtmlEditor height='350px' handleValueChange={onChange} />}
        />
      </PaperContent>
    </Paper>
  )
}

export default ProductDescriptionBox
