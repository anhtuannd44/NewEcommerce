import * as Yup from 'yup'
import { ICreateOrderOrigin, IUpdaterderOrigin } from '../interface/ICreateOrEditOrderOrigin'

export const createOriginSchema = Yup.object<ICreateOrderOrigin>().shape({
  name: Yup.string().required('Vui lòng nhập tên nguồn')
})

export const updateOriginSchema = Yup.object<ICreateOrderOrigin>().shape({
  id: Yup.string().required(),
  name: Yup.string().required('Vui lòng nhập tên nguồn'),
  isActive: Yup.bool().required().default(true)
})
