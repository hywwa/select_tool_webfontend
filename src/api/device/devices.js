import request from '@/utils/request'

// 查询选型记录与设备的中间列表
export function listDevices(query) {
  return request({
    url: '/device/devices/list',
    method: 'get',
    params: query
  })
}

// 查询选型记录与设备的中间详细
export function getDevices(id) {
  return request({
    url: '/device/devices/' + id,
    method: 'get'
  })
}

// 新增选型记录与设备的中间
export function addDevices(data) {
  return request({
    url: '/device/devices',
    method: 'post',
    data: data
  })
}

// 修改选型记录与设备的中间
export function updateDevices(data) {
  return request({
    url: '/device/devices',
    method: 'put',
    data: data
  })
}

// 删除选型记录与设备的中间
export function delDevices(id) {
  return request({
    url: '/device/devices/' + id,
    method: 'delete'
  })
}
