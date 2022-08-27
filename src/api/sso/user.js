import axios from '@/libs/api.request'

const url = '/web/user/'

export const APIListUser = (params) => {
  return axios.request({
    url: url,
    params: params,
    method: 'GET'
  })
}
