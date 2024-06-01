import http from 'src/api/requestApi'
import request from 'src/api/requestApi'

export const userApiRequest = {
    getList: () => http.get('/user/')
}