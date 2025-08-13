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
    return request({
        url: '/device/search/export-selected',
        method: 'post',
        data,
        responseType: 'blob'
    }).then(response => {
        // 处理文件下载
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = '已选设备数据.xlsx'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    })
}