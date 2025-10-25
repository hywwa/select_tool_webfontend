import request from '@/utils/request'

// 查询运输车附件列表
export function listTransportattachments(query) {
  return request({
    url: '/device/transportattachments/list',
    method: 'get',
    params: query
  })
}

// 查询运输车附件详细
export function getTransportattachments(id) {
  return request({
    url: '/device/transportattachments/' + id,
    method: 'get'
  })
}

// 新增运输车附件
export function addTransportattachments(data) {
  return request({
    url: '/device/transportattachments',
    method: 'post',
    data: data
  })
}

// 修改运输车附件
export function updateTransportattachments(data) {
  return request({
    url: '/device/transportattachments',
    method: 'put',
    data: data
  })
}

// 删除运输车附件
export function delTransportattachments(id) {
  return request({
    url: '/device/transportattachments/' + id,
    method: 'delete'
  })
}
