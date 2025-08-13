// @/api/device.js
import request from '@/utils/request'

// 搜索砖机设备
export function searchBrickDevices(data) {
    return request({
        url: '/device/search/brick',
        method: 'post',
        data
    })
}

// 搜索运输车设备
export function searchTransportDevices(data) {
    return request({
        url: '/device/search/transport',
        method: 'post',
        data
    })
}

// 搜索摆渡车设备
export function searchTransferDevices(data) {
    return request({
        url: '/device/search/transfer',
        method: 'post',
        data
    })
}

// 搜索拍齐顶升设备
export function searchLiftDevices(data) {
    return request({
        url: '/device/search/lift',
        method: 'post',
        data
    })
}

// 导出已选设备
export function exportSelectedDevices(data) {
    // 先检查数据是否为空
    if (!data || data.length === 0) {
        return Promise.reject(new Error('请选择要导出的设备'));
    }

    return request({
        url: '/device/search/export-selected',
        method: 'post',
        data,
        responseType: 'blob'
    }).then(response => {
        // 检查响应是否有效
        if (!response || !response.data) {
            throw new Error('导出失败，未获取到数据');
        }

        // 处理文件下载
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // 尝试从响应头获取文件名（如果后端设置了的话）
        let fileName = '已选设备数据.xlsx';
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            const match = contentDisposition.match(/filename\*?=utf-8''(.+)/);
            if (match && match[1]) {
                fileName = decodeURIComponent(match[1]);
            }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // 清理资源
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);

        return { success: true, message: '导出成功' };
    }).catch(error => {
        // 统一处理错误
        console.error('导出失败:', error);
        let errorMessage = '导出失败，请重试';

        // 根据不同错误类型提供更具体的信息
        if (error.message) {
            errorMessage = error.message;
        } else if (error.response && error.response.status) {
            errorMessage = `导出失败: 状态码 ${error.response.status}`;
        }

        return Promise.reject(new Error(errorMessage));
    });
}
