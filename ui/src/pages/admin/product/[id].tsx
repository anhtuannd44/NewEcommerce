import { GetServerSideProps, GetServerSidePropsContext } from 'next/types'
import { useEffect, useState } from 'react'
import { ERROR_MESSAGE_COMMON } from 'src/common/constants'
import { IProduct } from 'src/form/admin/product/interface/IProduct'
import { showSnackbar } from 'src/redux/admin/slice/snackbarSlice'
import { dispatch } from 'src/redux/store'
import { getProduct } from 'src/services/product'
import CreateOrEditLoadingBox from 'src/views/admin/loading-box/CreateOrEditLoadingBox'
import CreateOrUpdateProductPage from 'src/views/admin/product/CreateOrEditPage'
import NotFound from 'src/views/shared/error/NotFound'

interface IUpdateOrderProductAdminProps {
  id: string
}

const UpdateProductAdmin = (props: IUpdateOrderProductAdminProps) => {
  const { id } = props

  const [product, setProduct] = useState<IProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getProductById = async (id: string) => {
    try {
      const response = await getProduct(id)
      if (response.data) {
        setProduct(response.data)
      } else {
        dispatch(showSnackbar({ message: response.error?.message || ERROR_MESSAGE_COMMON, severity: 'error' }))
      }
    } catch (error) {
      dispatch(showSnackbar({ message: ERROR_MESSAGE_COMMON, severity: 'error' }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getProductById(id)
  }, [id])

  if (isLoading) {
    return <CreateOrEditLoadingBox />
  }

  if (!product) {
    return <NotFound />
  }

  return <CreateOrUpdateProductPage id={id} product={product} />
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query

  return {
    props: { id: id as string }
  }
}

export default UpdateProductAdmin
