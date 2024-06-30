import { APIStatus } from './apiEnums'

export const CONTENT_TYPE_APPLICATION_JSON = 'application/json'

export const APIStatusMessages = {
  [APIStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [APIStatus.BAD_REQUEST]: 'Bad Request'
}
