import http from 'src/api/apiService'
import request from 'src/api/apiService'

export const userApiRequest = {
    getList: () => http.get('/user/')
}