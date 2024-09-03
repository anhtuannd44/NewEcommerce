'use client'

// MUI Imports
import { Card, CardContent, CardHeader } from '@mui/material'

// Third-party Imports
import { Controller, useFormContext } from 'react-hook-form'

// Type Imports
import type { IProduct } from '@interface/admin/product/IProduct'

// Context Imports
import { useDictionary } from '@/contexts/dictionaryContext'

// Component Imports
import DxHtmlEditor from '@views/shared/editor/DxHtmlEditor'

const ProductDescriptionBox = () => {
  const { control } = useFormContext<IProduct>()

  const { dictionary } = useDictionary()

  return (
    <Card>
      <CardHeader title={dictionary.adminArea.product.shortDescriptionPanelTitle} />
      <CardContent>
        <Controller
          name='shortDescription'
          control={control}
          render={({ field: { onChange } }) => <DxHtmlEditor height='350px' handleValueChange={onChange} />}
        />
      </CardContent>
    </Card>
  )
}

export default ProductDescriptionBox
