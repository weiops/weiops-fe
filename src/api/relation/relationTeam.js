import axios from '@/libs/api.request'

const url = '/web/relation/team/'

export const APIListTeam = (params) => {
  return axios.request({
    url: url,
    params: params,
    method: 'GET'
  })
}

export const APICreateTeam = (data) => {
  return axios.request({
    url: `${url}create/`,
    data: data,
    method: 'POST'
  })
}
