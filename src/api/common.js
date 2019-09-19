import request from '@/utils/request'

export function GetDataByName(data) {
  return request({
    url: '/authdata/GetDataByName',
    method: 'post',
    data
  })
}

export function GetDataByNameXlsx(data) {
  return request({
    url: '/authdata/GetDataByName',
    method: 'post',
    data,
    responseType: 'blob'
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

export function DownloadExcel(data, filename) {
  const content = data
  const blob = new Blob([content])
  const fileName = filename + '.xlsx'
  if ('download' in document.createElement('a')) { // 非IE下载
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  } else { // IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}
