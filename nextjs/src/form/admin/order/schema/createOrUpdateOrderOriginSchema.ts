// Third-party Imports
import * as Yup from 'yup'

// Type Imports
import type { IOrderOriginRequest } from '@/interface/admin/order'

export const orderOriginSchema = Yup.object<IOrderOriginRequest>().shape({
  name: Yup.string().required('Vui lòng nhập tên nguồn'),
  isActive: Yup.bool().default(true)
})
