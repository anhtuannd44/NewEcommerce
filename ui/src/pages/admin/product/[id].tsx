import { useRouter } from 'next/router'
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types'
import { ParsedUrlQuery } from 'querystring'
import { useEffect } from 'react'
import CreateOrUpdateProductPage from 'src/views/admin/product/CreateOrEditPage'

interface IUpdateOrderProductAdminProps {
  id: string
}

const UpdateProductAdmin = (props: IUpdateOrderProductAdminProps) => {
  const { id } = props

  return <CreateOrUpdateProductPage id={id} isUpdate={true} />
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query

  return {
    props: { id: id as string }
  }
}

export default UpdateProductAdmin
