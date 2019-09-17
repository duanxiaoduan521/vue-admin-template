import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth',
    method: 'post',
    data
  })
}

export function getInfo() { // token
  return request({
    url: '/authdata/userinfo',
    method: 'get'
    // ,
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/authdata/logout',
    method: 'post'
  })
}
