import request from '@/utils/request'

// 查询固定分类的下拉框字典列表
export function listFixeddropdownitems(query) {
  return request({
    url: '/device/fixeddropdownitems/list',
    method: 'get',
    params: query
  })
}

// 查询固定分类的下拉框字典详细
export function getFixeddropdownitems(ItemId) {
  return request({
    url: '/device/fixeddropdownitems/' + ItemId,
    method: 'get'
  })
}

// 新增固定分类的下拉框字典
export function addFixeddropdownitems(data) {
  return request({
    url: '/device/fixeddropdownitems',
    method: 'post',
    data: data
  })
}

// 修改固定分类的下拉框字典
export function updateFixeddropdownitems(data) {
  return request({
    url: '/device/fixeddropdownitems',
    method: 'put',
    data: data
  })
}

// 删除固定分类的下拉框字典
export function delFixeddropdownitems(ItemId) {
  return request({
    url: '/device/fixeddropdownitems/' + ItemId,
    method: 'delete'
  })
}
