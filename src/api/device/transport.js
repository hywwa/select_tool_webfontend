import request from '@/utils/request'

// 查询运输车列表
export function listTransport(query) {
  return request({
    url: '/device/transport/list',
    method: 'get',
    params: query
  })
}

// 查询运输车详细
export function getTransport(id) {
  return request({
    url: '/device/transport/' + id,
    method: 'get'
  })
}

// 新增运输车
export function addTransport(data) {
  return request({
    url: '/device/transport',
    method: 'post',
    data: data
  })
}

// 修改运输车
export function updateTransport(data) {
  return request({
    url: '/device/transport',
    method: 'put',
    data: data
  })
}

// 删除运输车
export function delTransport(id) {
  return request({
    url: '/device/transport/' + id,
    method: 'delete'
  })
}

// 新增：导入运输车数据
export function importTransport(data) {
  return request({
    url: '/device/transport/importData', // 对应后端Controller的请求路径
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data' // 保持表单上传格式，与砖机接口一致
    },
    data: data // data为包含文件和updateSupport参数的FormData对象
  })
}
