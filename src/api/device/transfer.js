import request from '@/utils/request'

// 查询摆渡车列表
export function listTransfer(query) {
  return request({
    url: '/device/transfer/list',
    method: 'get',
    params: query
  })
}

// 查询摆渡车详细
export function getTransfer(id) {
  return request({
    url: '/device/transfer/' + id,
    method: 'get'
  })
}

// 新增摆渡车
export function addTransfer(data) {
  return request({
    url: '/device/transfer',
    method: 'post',
    data: data
  })
}

// 修改摆渡车
export function updateTransfer(data) {
  return request({
    url: '/device/transfer',
    method: 'put',
    data: data
  })
}

// 删除摆渡车
export function delTransfer(id) {
  return request({
    url: '/device/transfer/' + id,
    method: 'delete'
  })
}

export function importTransfer(data) {
  return request({
    url: '/device/transfer/importData',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data' // 表单上传格式
    },
    data: data
  })
}
