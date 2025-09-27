import request from '@/utils/request'

// 查询用户与项目的关联关系，用于控制项目权限列表
export function listRelation(query) {
  return request({
    url: '/device/relation/list',
    method: 'get',
    params: query
  })
}

// 查询用户与项目的关联关系，用于控制项目权限详细
export function getRelation(relationId) {
  return request({
    url: '/device/relation/' + relationId,
    method: 'get'
  })
}

// 新增用户与项目的关联关系，用于控制项目权限
export function addRelation(data) {
  return request({
    url: '/device/relation',
    method: 'post',
    data: data
  })
}

// 修改用户与项目的关联关系，用于控制项目权限
export function updateRelation(data) {
  return request({
    url: '/device/relation',
    method: 'put',
    data: data
  })
}

// 删除用户与项目的关联关系，用于控制项目权限
export function delRelation(relationId) {
  return request({
    url: '/device/relation/' + relationId,
    method: 'delete'
  })
}
