import request from '@/utils/request'

// 查询项目管理列表
export function listProject(query) {
  return request({
    url: '/device/project/list',
    method: 'get',
    params: query
  })
}

// 通过项目ID列表查询项目管理列表
export function listProjectByIds(projectIds) {
  return request({
    url: '/device/project/listByIds',
    method: 'post',
    data: projectIds
  })
}

// 查询项目管理详细
export function getProject(mainProjectId) {
  return request({
    url: '/device/project/' + mainProjectId,
    method: 'get'
  })
}

// 新增项目管理
export function addProject(data) {
  return request({
    url: '/device/project',
    method: 'post',
    data: data
  })
}

// 修改项目管理
export function updateProject(data) {
  return request({
    url: '/device/project',
    method: 'put',
    data: data
  })
}

// 删除项目管理
export function delProject(mainProjectId) {
  return request({
    url: '/device/project/' + mainProjectId,
    method: 'delete'
  })
}
