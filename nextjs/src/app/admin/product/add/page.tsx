import type { Mode } from '@core/types'

// Type Imports
import type { getDictionary } from '@/utils/dictionary/getDictionaryServer'

// Component Imports
import AddOrEditProduct from '@/views/admin/product/add-or-edit'

const AddProductPage = ({
  dictionary,
  mode
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  mode: Mode
}) => {
  return <AddOrEditProduct dictionary={dictionary} mode={mode} />
}

export default AddProductPage
