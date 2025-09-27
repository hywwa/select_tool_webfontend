import request from '@/utils/request'

/**
 * 导出报价单Excel文件
 * @returns {Promise} - 返回导出的Excel文件blob对象
 */
export function exportQuotation() {
  return request({
    url: '/device/quotation/export',
    method: 'get',
    responseType: 'blob'  // 指定响应类型为blob，用于处理二进制文件
  })
}

/**
 * 检查报价单导出状态
 * @returns {Promise} - 返回导出状态信息
 */
export function checkQuotationExportStatus() {
  return request({
    url: '/device/quotation/export/status',
    method: 'get'
  })
}

/**
 * 下载导出的Excel文件
 * @param {Blob} blob - Excel文件的blob对象
 * @param {String} [fileName] - 可选的文件名，不提供则使用默认名
 */
export const downloadQuotationFile = (blob, fileName) => {
  try {
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // 处理文件名，如果未提供则从blob类型推断或使用默认名
    let downloadName = fileName;
    if (!downloadName) {
      // 尝试从blob类型获取文件名（通常不可靠）
      const contentDisposition = blob.contentDisposition;
      if (contentDisposition && contentDisposition.includes('filename=')) {
        downloadName = contentDisposition.split('filename=')[1].replace(/"/g, '');
      } else {
        // 使用默认文件名
        downloadName = `报价单_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
      }
    }

    // 兼容IE浏览器
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, downloadName);
      window.URL.revokeObjectURL(url);
      return;
    }

    // 主流浏览器处理
    a.setAttribute('download', downloadName);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // 清理资源
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    
  } catch (error) {
    console.error('报价单文件下载失败:', error);
    throw new Error('下载报价单时发生错误，请稍后重试');
  }
};
    