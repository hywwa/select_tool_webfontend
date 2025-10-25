import request from '@/utils/request'

// 查询摆渡车附件列表
export function listTransferattachments(query) {
  return request({
    url: '/device/transferattachments/list',
    method: 'get',
    params: query
  })
}

// 查询摆渡车附件详细
export function getTransferattachments(id) {
  return request({
    url: '/device/transferattachments/' + id,
    method: 'get'
  })
}

// 新增摆渡车附件
export function addTransferattachments(data) {
  return request({
    url: '/device/transferattachments',
    method: 'post',
    data: data
  })
}

// 修改摆渡车附件
export function updateTransferattachments(data) {
  return request({
    url: '/device/transferattachments',
    method: 'put',
    data: data
  })
}

// 删除摆渡车附件
export function delTransferattachments(id) {
  return request({
    url: '/device/transferattachments/' + id,
    method: 'delete'
  })
}
