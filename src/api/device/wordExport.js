import request from '@/utils/request'

/**
 * 导出设备技术附件Word文档
 * @returns {Promise} - 返回导出的Word文档blob对象
 */
export function exportEquipmentTechnicalAttachment() {
  return request({
    url: '/api/word/export',
    method: 'get',
    responseType: 'blob'  // 重要：指定响应类型为blob，用于处理二进制文件
  })
}

/**
 * 下载导出的文件（通用方法，可用于任何blob类型文件下载）
 * @param {Blob} blob - 文件的blob对象
 * @param {String} fileName - 下载的文件名（包含扩展名）
 * @example
 * // 使用示例
 * exportEquipmentTechnicalAttachment().then(blob => {
 *   downloadExportFile(blob, `设备技术附件_${new Date().toLocaleDateString()}.docx`)
 * }).catch(error => {
 *   console.error('导出失败:', error)
 * })
 */
export const downloadExportFile = (blob, fileName) => {
  try {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // 兼容IE浏览器
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
      window.URL.revokeObjectURL(url);
      return;
    }

    // 主流浏览器处理
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
    