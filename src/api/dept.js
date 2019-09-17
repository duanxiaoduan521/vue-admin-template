import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/authdata/GetRecuDataByName',
    method: 'post',
    data
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createDept(data) {
  return request({
    url: '/authdata/PostDataByName',
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function getRecuDept(data) {
  return request({
    url: '/authdata/getrecudatabyname',
    method: 'post',
    data
  })
}
