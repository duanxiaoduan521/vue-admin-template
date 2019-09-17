import request from '@/utils/request'

export function GetDataByName(data) {
  return request({
    url: '/authdata/GetDataByName',
    method: 'post',
    data
  })
}

export function GetDataByNames(data) {
  return request({
    url: '/authdata/GetDataByNames',
    method: 'post',
    data
  })
}

export function PostDataByName(data) {
  return request({
    url: '/authdata/PostDataByName',
    method: 'post',
    data
  })
}

export function PostDataByNames(data) {
  return request({
    url: '/authdata/PostDataByNames',
    method: 'post',
    data
  })
}

export function removeimage(data) {
  return request({
    url: '/authdata/removeimage',
    method: 'post',
    data
  })
}
export function getRecuData(data) {
  return request({
    url: '/authdata/GetRecuDataByName',
    method: 'post',
    data
  })
}

export function UpdateDataRelation(data) {
  return request({
    url: '/authdata/UpdateDataRelation',
    method: 'post',
    data
  })
}
