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
export function getFixeddropdownitems(itemId) {
  return request({
    url: '/device/fixeddropdownitems/' + itemId,
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

// api/device/fixeddropdownitems.js（修正后）
export function delFixeddropdownitems(itemIds) {  // 直接接收itemIds数组
  return request({
    // 关键：将itemIds数组通过URL路径传递，用逗号拼接
    url: `/device/fixeddropdownitems/${itemIds.join(',')}`, 
    method: 'delete'  // 无需params，参数已在URL中
  })
}
