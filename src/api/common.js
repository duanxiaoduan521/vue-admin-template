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

export function ExecDataByConfig(data) {
  return request({
    url: '/authdata/ExecDataByConfig',
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

export function checkButtons(buttonsList, baoxiu) {
  console.log(buttonsList)
  for (var i = 0; i < buttonsList.length; i++) {
    console.log(buttonsList[i].path)
    if (buttonsList[i].path !== '' && buttonsList[i].menu_id !== '') {
      // return isShow === true
    }
    // if (buttonsList[i].path !== '') {
    //   console.log(1)
    // }
  }
  return true
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
