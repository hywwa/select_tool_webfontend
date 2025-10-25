import request from '@/utils/request'

// 查询砖机列表
export function listBrick(query) {
  return request({
    url: '/device/brick/list',
    method: 'get',
    params: query
  })
}

// 查询砖机详细
export function getBrick(id) {
  return request({
    url: '/device/brick/' + id,
    method: 'get'
  })
}

// 新增砖机
export function addBrick(data) {
  return request({
    url: '/device/brick',
    method: 'post',
    data: data
  })
}

// 修改砖机
export function updateBrick(data) {
  return request({
    url: '/device/brick',
    method: 'put',
    data: data
  })
}

// 删除砖机
export function delBrick(id) {
  return request({
    url: '/device/brick/' + id,
    method: 'delete'
  })
}


// 新增：导入砖机数据
export function importBrick(data) {
  return request({
    url: '/device/brick/importData',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data' // 表单上传格式
    },
    data: data
  })
}
