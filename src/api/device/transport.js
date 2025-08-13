import request from '@/utils/request'

// 查询运输车列表
export function listTransport(query) {
  return request({
    url: '/device/transport/list',
    method: 'get',
    params: query
  })
}

// 查询运输车详细
export function getTransport(id) {
  return request({
    url: '/device/transport/' + id,
    method: 'get'
  })
}

// 新增运输车
export function addTransport(data) {
  return request({
    url: '/device/transport',
    method: 'post',
    data: data
  })
}

// 修改运输车
export function updateTransport(data) {
  return request({
    url: '/device/transport',
    method: 'put',
    data: data
  })
}

// 删除运输车
export function delTransport(id) {
  return request({
    url: '/device/transport/' + id,
    method: 'delete'
  })
}
