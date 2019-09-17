import request from '@/utils/request'
/**
  *根据角色获得可见菜单
  */
export function getMenuByRole(data) {
  return request({
    url: '/authdata/rolemenus',
    method: 'post',
    data
  })
}
