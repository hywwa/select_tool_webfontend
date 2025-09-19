import request from '@/utils/request'

// 查询产线列表
export function listManagement(query) {
  return request({
    url: '/device/management/list',
    method: 'get',
    params: query
  })
}

// 查询产线详细
export function getManagement(projectId) {
  return request({
    url: '/device/management/' + projectId,
    method: 'get'
  })
}

// 新增产线
export function addManagement(data) {
  return request({
    url: '/device/management',
    method: 'post',
    data: data
  })
}

// 修改产线
export function updateManagement(data) {
  return request({
    url: '/device/management',
    method: 'put',
    data: data
  })
}

// 删除产线
export function delManagement(projectId) {
  return request({
    url: '/device/management/' + projectId,
    method: 'delete'
  })
}
