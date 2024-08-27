// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import AddOrEditProduct from '@/views/admin/product/add-or-edit'

const EditProductPage = async ({ params, mode }: { params: { id: string }; mode: Mode }) => {
  return <AddOrEditProduct id={params.id} mode={mode} />
}

export default EditProductPage
