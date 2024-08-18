import type { Mode } from '@core/types'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'

// Component Imports
import AddOrEditEditProduct from '@/views/admin/product/edit'

const AddProductPage = ({
  dictionary,
  mode
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  mode: Mode
}) => {
  return <AddOrEditEditProduct dictionary={dictionary} mode={mode} />
}

export default AddProductPage
