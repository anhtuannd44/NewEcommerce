// Third-party Imports
import * as Yup from 'yup'

// Type Imports
import type { IOrderOriginRequest } from '@/interface/admin/order'

// Dictionary Imports
import type { getDictionary } from '@/utils/dictionary/getDictionaryClient'

const orderOriginSchema = (dictionary: Awaited<ReturnType<typeof getDictionary>>) =>
  Yup.object<IOrderOriginRequest>().shape({
    name: Yup.string().required(dictionary.formValidation.required),
    isActive: Yup.bool().default(true)
  })

export default orderOriginSchema
