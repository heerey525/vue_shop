import axios from '@/libs/api.request'

export const users = info => {
  return axios.request({
    url: '/users',
    params: info,
    method: 'get'
  })
}
