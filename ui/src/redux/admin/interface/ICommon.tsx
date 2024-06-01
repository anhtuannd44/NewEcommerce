import { MessageType } from 'src/common/enums'

export interface IMessageCommon {
  type: MessageType
  text: string
}

export interface IRequestStatus {
  isSubmitted: boolean
  isSuccess: boolean
  isLoading: boolean
}
