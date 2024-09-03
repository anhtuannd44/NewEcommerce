// Http Service Imports
import { httpWithAuth } from '@/apis/api-services'

// Type Imports
import type { IOrder, IOrderAttribute, IOrderOrigin, IOrderOriginRequest } from '@/interface/admin/order'
import type { FetchDataResult } from '@/interface/api-base/IFetchDataResult'
import type { IManyResult } from '@/interface/api-base/IManyResult'
import type { ISingleResult } from '@/interface/api-base/ISingleResult'

export const getOrderAttributes = async (): Promise<FetchDataResult<IManyResult<IOrderAttribute>>> => {
  return await httpWithAuth.get<IManyResult<IOrderAttribute>>('/admin/order/attribute')
}

export const getOrderOrigins = async (): Promise<FetchDataResult<IManyResult<IOrderOrigin>>> => {
  return await httpWithAuth.get<IManyResult<IOrderOrigin>>('/admin/order/orderOrigin')
}

export const getOrderTags = async (): Promise<FetchDataResult<IManyResult<string>>> => {
  return await httpWithAuth.get<IManyResult<string>>('/admin/order/tags')
}

export const createOrUpdateOrder = async (data: IOrder): Promise<FetchDataResult<ISingleResult<IOrder>>> => {
  return await httpWithAuth.post('/admin/order/create', data)
}

export const createOrUpdateOrigin = async (
  item: IOrderOriginRequest
): Promise<FetchDataResult<ISingleResult<IOrderOrigin>>> => {
  return await httpWithAuth.post<ISingleResult<IOrderOrigin>>('/admin/order/orderOrigin/createOrUpdate', item)
}
