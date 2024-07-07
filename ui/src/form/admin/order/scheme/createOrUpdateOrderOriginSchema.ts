import * as Yup from 'yup'
import { IOrderOriginRequest } from '../interface/ICreateOrEditOrderOrigin'

export const orderOriginSchema = Yup.object<IOrderOriginRequest>().shape({
  name: Yup.string().required('Vui lòng nhập tên nguồn'),
  isActive: Yup.bool().default(true)
})