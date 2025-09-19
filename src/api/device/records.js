import request from '@/utils/request'

// 查询选型结果记录（包含所有参数）列表
export function listRecords(query) {
  return request({
    url: '/device/records/list',
    method: 'get',
    params: query
  })
}

// 查询选型结果记录（包含所有参数）详细
export function getRecords(recordId) {
  return request({
    url: '/device/records/' + recordId,
    method: 'get'
  })
}

// 新增选型结果记录（包含所有参数）
export function addRecords(data) {
  return request({
    url: '/device/records',
    method: 'post',
    data: data
  })
}

// 修改选型结果记录（包含所有参数）
export function updateRecords(data) {
  return request({
    url: '/device/records',
    method: 'put',
    data: data
  })
}

// 删除选型结果记录（包含所有参数）
export function delRecords(recordId) {
  return request({
    url: '/device/records/' + recordId,
    method: 'delete'
  })
}
