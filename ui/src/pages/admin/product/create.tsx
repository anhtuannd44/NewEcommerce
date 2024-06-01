import { useRouter } from 'next/router'
import CreateOrUpdateProductPage from 'src/views/admin/product/CreateOrEditPage'

const CreateProductAdmin = () => {

  return <CreateOrUpdateProductPage isUpdate={true} />
}
export default CreateProductAdmin
