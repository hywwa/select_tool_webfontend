import request from '@/utils/request'

/**
 * 导出设备技术附件Word文档（POST方式传递复杂参数）
 * @param {Object} params - 导出参数（包含砖机、运输车等设备的ID和数量）
 * @returns {Promise} - 返回导出的Word文档blob对象
 */
export function exportEquipmentTechnicalAttachment(params) {
  return request({
    url: '/api/word/export',
    method: 'post',  // 改为POST请求
    data: params,    // 通过请求体传递参数（而非URL查询字符串）
    responseType: 'blob'  // 保持二进制响应类型
  })
}

// 下载方法无需修改
export const downloadExportFile = (blob, fileName) => {
  try {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
      window.URL.revokeObjectURL(url);
      return;
    }

    a.setAttribute('download', fileName);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('文件下载失败:', error);
    throw new Error('下载文件时发生错误，请稍后重试');
  }
};