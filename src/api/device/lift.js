import request from '@/utils/request'

// 查询拍齐顶升列表
export function listLift(query) {
  return request({
    url: '/device/lift/list',
    method: 'get',
    params: query
  })
}

// 查询拍齐顶升详细
export function getLift(id) {
  return request({
    url: '/device/lift/' + id,
    method: 'get'
  })
}

// 新增拍齐顶升
export function addLift(data) {
  return request({
    url: '/device/lift',
    method: 'post',
    data: data
  })
}

// 修改拍齐顶升
export function updateLift(data) {
  return request({
    url: '/device/lift',
    method: 'put',
    data: data
  })
}

// 删除拍齐顶升
export function delLift(id) {
  return request({
    url: '/device/lift/' + id,
    method: 'delete'
  })
}

export function importLift(data) {
  return request({
    url: '/device/lift/importData',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data' // 表单上传格式
    },
    data: data
  })
}