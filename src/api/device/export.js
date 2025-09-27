import request from '@/utils/request'

/**
 * 导出选型设备清单
 * @param {Object} data - 包含所选设备信息的数据对象
 * @param {Array} data.brick - 砖机选择列表，格式: [{id: 1, quantity: 2}, ...]
 * @param {Array} data.transfer - 摆渡车选择列表，格式: [{id: 1, quantity: 1}, ...]
 * @param {Array} data.lift - 拍齐顶升选择列表，格式: [{id: 1, quantity: 3}, ...]
 * @param {Array} data.transport - 运输车选择列表，格式: [{id: 1, quantity: 2}, ...]
 * @returns {Promise} - 返回导出文件的Promise
 */
export function exportSelectedDevices(data) {
  return request({
    url: '/device/export/selected-devices',
    method: 'post',
    data: data,
    responseType: 'blob'  // 重要：指定响应类型为blob，用于处理二进制文件
  })
}

/**
 * 新增：基于materialCode导出选型设备清单
 * @param {Object} data - 包含所选设备信息的数据对象
 * @param {Array} data.brick - 砖机选择列表，格式: [{materialCode: "xxx", quantity: 2}, ...]
 * @param {Array} data.transfer - 摆渡车选择列表，格式: [{materialCode: "xxx", quantity: 1}, ...]
 * @param {Array} data.lift - 拍齐顶升选择列表，格式: [{materialCode: "xxx", quantity: 3}, ...]
 * @param {Array} data.transport - 运输车选择列表，格式: [{materialCode: "xxx", quantity: 2}, ...]
 * @returns {Promise} - 返回导出文件的Promise
 */
export function exportByMaterialCode(data) {
  return request({
    url: '/device/export/selected-devices-by-material',
    method: 'post',
    data: data,
    responseType: 'blob'  // 重要：指定响应类型为blob
  })
}


export const downloadExportFile = (blob, fileName) => {
  try {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // 1. 兼容 IE 浏览器（专用 API，直接传原始中文文件名）
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
      window.URL.revokeObjectURL(url);
      return;
    }

    // 2. 主流浏览器（直接用原始中文文件名，后端会处理编码）
    a.setAttribute('download', fileName); // 此处 fileName 为原始中文（如“设备选型清单.xlsx”）
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('文件下载失败:', error);
    throw new Error('下载文件时发生错误，文件名编码异常');
  }
};
    