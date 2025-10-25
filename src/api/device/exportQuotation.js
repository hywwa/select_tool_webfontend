import request from '@/utils/request'

/**
 * 导出报价单Excel文件（带动态参数）
 * @param {Object} params - 动态参数（上下砖机、运输车、摆渡车的ID和数量）
 * @param {Array} params.brickMachines - 上下砖机列表，格式：[{id: 1, quantity: 5}, ...]
 * @param {Array} params.transportVehicles - 运输车列表，格式：[{id: 101, quantity: 3}, ...]
 * @param {Array} params.ferryVehicles - 摆渡车列表，格式：[{id: 201, quantity: 2}, ...]
 * @returns {Promise} - 返回导出的Excel文件blob对象
 */
export function exportQuotation(params) {
  return request({
    url: '/device/quotation/export',
    method: 'post',  // 后端已改为POST请求
    data: params,    // 传递动态参数（替换原get请求的params）
    responseType: 'blob'  // 保持blob类型接收二进制文件
  })
}

// 检查状态API无需修改
export function checkQuotationExportStatus() {
  return request({
    url: '/device/quotation/export/status',
    method: 'get'
  })
}

// 下载文件方法无需修改（保持原逻辑）
export const downloadQuotationFile = (blob, fileName) => {
  try {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    let downloadName = fileName;
    if (!downloadName) {
      const contentDisposition = blob.contentDisposition;
      if (contentDisposition && contentDisposition.includes('filename=')) {
        downloadName = contentDisposition.split('filename=')[1].replace(/"/g, '');
      } else {
        downloadName = `报价单_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
      }
    }

    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, downloadName);
      window.URL.revokeObjectURL(url);
      return;
    }

    a.setAttribute('download', downloadName);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    
  } catch (error) {
    console.error('报价单文件下载失败:', error);
    throw new Error('下载报价单时发生错误，请稍后重试');
  }
};