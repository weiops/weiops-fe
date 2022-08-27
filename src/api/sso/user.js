import axios from '@/libs/api.request'

const url = '/web/user/'

export const APIListUser = (params) => {
  return axios.request({
    url: url,
    params: params,
    method: 'GET'
  })
}

export const APICreateUser = (data) => {
  return axios.request({
    url: `${url}create/`,
    data: data,
    method: 'POST'
  })
}

export const APIUpdateUser = (data) => {
  const uid = data.id
  return axios.request({
    url: `${url}update/${uid}/`,
    data: data,
    method: 'POST'
  })
}

export const APIDeleteUser = (uid) => {
  return axios.request({
    url: `${url}delete/${uid}/`,
    method: 'DELETE'
  })
}
