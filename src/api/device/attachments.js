import request from '@/utils/request'

// 查询砖机附件列表
export function listAttachments(query) {
  return request({
    url: '/device/attachments/list',
    method: 'get',
    params: query
  })
}

// 查询砖机附件详细
export function getAttachments(id) {
  return request({
    url: '/device/attachments/' + id,
    method: 'get'
  })
}

// 新增砖机附件
export function addAttachments(data) {
  return request({
    url: '/device/attachments',
    method: 'post',
    data: data
  })
}

// 修改砖机附件
export function updateAttachments(data) {
  return request({
    url: '/device/attachments',
    method: 'put',
    data: data
  })
}

// 删除砖机附件
export function delAttachments(id) {
  return request({
    url: '/device/attachments/' + id,
    method: 'delete'
  })
}
