// Http Service Imports
import { httpWithAuth } from '@/apis/api-services'

// Type Imports
import type { IUser } from '@/interface/admin/user'
import type { FetchDataResult } from '@/interface/api-base/IFetchDataResult'
import type { IManyResult } from '@/interface/api-base/IManyResult'

export const getUsers = async (): Promise<FetchDataResult<IManyResult<IUser>>> => {
  return await httpWithAuth.get<IManyResult<IUser>>(`/admin/user`)
}
