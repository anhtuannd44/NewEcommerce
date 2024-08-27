// Type Imports
import type { Mode } from '@core/types'
import type { getDictionary } from '@/utils/getDictionary'

// Component Imports
import AddOrEditProduct from '@/views/admin/product/add-or-edit'

const EditProductPage = async ({
  params,
  dictionary,
  mode
}: {
  params: { id: string }
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  mode: Mode
}) => {
  return <AddOrEditProduct id={params.id} dictionary={dictionary} mode={mode} />
}

export default EditProductPage
