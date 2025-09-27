<template>
  <div class="export-test-container">
    <!-- 顶部装饰条（与登录页一致） -->
    <div class="top-accent"></div>
    
    <!-- 背景装饰元素（复用登录页风格） -->
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    
    <!-- 导出测试卡片（核心区域） -->
    <div class="export-card">
      <!-- 标题区域 -->
      <div class="export-header">
        <div class="logo">
          <i class="el-icon-download"></i>
        </div>
        <h1 class="export-title">文档导出测试</h1>
        <p class="export-desc">测试各类文档导出功能，包括技术附件和报价单</p>
      </div>
      
      <!-- 功能区域 -->
      <div class="export-content">
        <!-- 导出按钮组 -->
        <div class="export-buttons">
          <!-- 技术附件导出按钮 -->
          <el-button
            :loading="isExporting"
            size="large"
            type="primary"
            class="export-btn"
            @click="handleExport"
          >
            <i class="el-icon-document" v-if="!isExporting"></i>
            <span v-if="!isExporting">导出技术附件Word文档</span>
            <span v-else>
              <i class="el-icon-loading loading-icon"></i>
              导出中，请稍候...
            </span>
          </el-button>
          
          <!-- 报价单导出按钮 -->
          <el-button
            :loading="isQuotationExporting"
            size="large"
            type="success"
            class="export-btn quotation-btn"
            @click="handleQuotationExport"
          >
            <i class="el-icon-s-grid" v-if="!isQuotationExporting"></i>
            <span v-if="!isQuotationExporting">导出报价单Excel</span>
            <span v-else>
              <i class="el-icon-loading loading-icon"></i>
              导出中，请稍候...
            </span>
          </el-button>
        </div>
        
        <!-- 说明文本 -->
        <div class="export-tips">
          <p class="tip-text">
            <i class="el-icon-info-circle"></i>
            点击对应按钮将生成并下载相应文档
          </p>
          <p class="tip-text">
            <i class="el-icon-info-circle"></i>
            技术附件：「沙特RAK-窑后储砖线技术附件.docx」
          </p>
          <p class="tip-text">
            <i class="el-icon-info-circle"></i>
            报价单：「设备报价单_YYYYMMDD.xlsx」
          </p>
          <p class="tip-text">
            <i class="el-icon-warning"></i>
            导出过程中请不要重复点击，避免网络拥堵
          </p>
        </div>
      </div>
      
      <!-- 结果提示区域（动态显示） -->
      <div class="export-result" v-if="resultMsg">
        <el-alert
          :title="resultMsg"
          :type="isSuccess ? 'success' : 'error'"
          show-icon
          closable
          @close="clearResult"
        ></el-alert>
      </div>
      
      <!-- 页脚信息（与登录页一致） -->
      <div class="export-footer">
        <p>© {{ new Date().getFullYear() }} 智能储运事业部 - 接口测试专用页面</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
// 导入导出API
import { exportEquipmentTechnicalAttachment, downloadExportFile } from '@/api/device/wordExport'
import { exportQuotation, downloadQuotationFile } from '@/api/device/exportQuotation'

// 状态管理
const isExporting = ref(false)                // 技术附件导出状态
const isQuotationExporting = ref(false)       // 报价单导出状态
const resultMsg = ref('')                     // 结果提示文本
const isSuccess = ref(false)                  // 导出成功/失败标记

/**
 * 处理技术附件导出逻辑
 */
const handleExport = async () => {
  // 1. 防重复点击 + 初始化状态
  if (isExporting.value) return
  isExporting.value = true
  resultMsg.value = ''
  let loadingInstance = null

  try {
    // 2. 显示全局加载提示（增强用户感知）
    loadingInstance = ElLoading.service({
      text: '正在生成Word文档...',
      background: 'rgba(255, 255, 255, 0.8)'
    })

    // 3. 调用导出接口（获取Blob流）
    const blob = await exportEquipmentTechnicalAttachment()

    // 4. 生成动态文件名
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const fileName = `${dateStr}-沙特RAK-窑后储砖线技术附件.docx`

    // 5. 触发文件下载
    downloadExportFile(blob, fileName)

    // 6. 导出成功提示
    isSuccess.value = true
    resultMsg.value = '技术附件导出成功！文件已开始下载，请在浏览器下载列表中查看'
    ElMessage.success('Word文档导出成功！')

  } catch (error) {
    // 7. 导出失败处理
    isSuccess.value = false
    resultMsg.value = `技术附件导出失败：${error.message || '网络异常或接口错误'}`
    ElMessage.error(`导出失败：${error.message || '请稍后重试'}`)
    console.error('技术附件导出接口异常：', error)

  } finally {
    // 8. 清理状态
    isExporting.value = false
    if (loadingInstance) loadingInstance.close()
  }
}

/**
 * 处理报价单导出逻辑
 */
const handleQuotationExport = async () => {
  // 1. 防重复点击 + 初始化状态
  if (isQuotationExporting.value) return
  isQuotationExporting.value = true
  resultMsg.value = ''
  let loadingInstance = null

  try {
    // 2. 显示全局加载提示
    loadingInstance = ElLoading.service({
      text: '正在生成报价单Excel...',
      background: 'rgba(255, 255, 255, 0.8)'
    })

    // 3. 调用报价单导出接口
    const blob = await exportQuotation()

    // 4. 生成动态文件名
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
     const fileName = `${dateStr}-沙特RAK-窑后储砖报价单.xlsx`

    // 5. 触发文件下载
    downloadQuotationFile(blob, fileName)

    // 6. 导出成功提示
    isSuccess.value = true
    resultMsg.value = '报价单导出成功！文件已开始下载，请在浏览器下载列表中查看'
    ElMessage.success('报价单Excel导出成功！')

  } catch (error) {
    // 7. 导出失败处理
    isSuccess.value = false
    resultMsg.value = `报价单导出失败：${error.message || '网络异常或接口错误'}`
    ElMessage.error(`导出失败：${error.message || '请稍后重试'}`)
    console.error('报价单导出接口异常：', error)

  } finally {
    // 8. 清理状态
    isQuotationExporting.value = false
    if (loadingInstance) loadingInstance.close()
  }
}

/**
 * 清除结果提示
 */
const clearResult = () => {
  resultMsg.value = ''
}
</script>

<style lang='scss' scoped>
// 复用登录页主色调，保持风格统一
$primary-color: #FF5722;
$secondary-color: #FF9800;
$accent-color: #FFEB3B;
$success-color: #4CAF50;
$light-gray: #FFF8F5;
$text-color: #333333;

.export-test-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $light-gray;
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
  
  // 顶部装饰条（与登录页完全一致）
  .top-accent {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, $primary-color, $secondary-color, $accent-color);
    background-size: 200% 100%;
    animation: gradientShift 5s ease infinite;
  }
  
  // 背景装饰元素（复用登录页动画）
  .background-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
    animation: float 8s ease-in-out infinite;
  }
  
  .shape-1 {
    width: 200px;
    height: 200px;
    background-color: $primary-color;
    top: 15%;
    left: 12%;
    animation-delay: 0s;
  }
  
  .shape-2 {
    width: 150px;
    height: 150px;
    background-color: $secondary-color;
    bottom: 20%;
    right: 18%;
    animation-delay: 2s;
  }
  
  .shape-3 {
    width: 100px;
    height: 100px;
    background-color: $accent-color;
    top: 65%;
    left: 25%;
    animation-delay: 4s;
  }
}

// 导出测试卡片（核心容器）
.export-card {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(255, 87, 34, 0.1);
  padding: 45px 30px;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(255, 87, 34, 0.15);
  }
}

// 卡片头部（标题区域）
.export-header {
  text-align: center;
  margin-bottom: 35px;
  
  .logo {
    width: 70px;
    height: 70px;
    margin: 0 auto 25px;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary-color, $secondary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28px;
    box-shadow: 0 4px 15px rgba(255, 87, 34, 0.2);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05) rotate(5deg);
    }
  }
  
  .export-title {
    color: $primary-color;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  
  .export-desc {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
  }
}

// 卡片内容（功能区域）
.export-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

// 导出按钮组
.export-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  width: 90%;
}

// 导出按钮（突出样式）
.export-btn {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:first-child {
    background: linear-gradient(90deg, $primary-color, $secondary-color);
    border: none;
  }
  
  &:first-child:hover {
    background: linear-gradient(90deg, #E64A19, #F57C00);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .el-icon-document, .el-icon-s-grid {
    margin-right: 8px;
  }
}

// 报价单按钮特殊样式
.quotation-btn {
  background: linear-gradient(90deg, $success-color, #8BC34A);
  border: none;
  
  &:hover {
    background: linear-gradient(90deg, #388E3C, #689F38);
  }
}

// 说明文本区域
.export-tips {
  width: 90%;
  padding: 15px;
  background-color: #FFF8F5;
  border-radius: 8px;
  border-left: 4px solid $primary-color;
}

.tip-text {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 13px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .el-icon-info-circle {
    color: $primary-color;
    margin-right: 8px;
  }
  
  .el-icon-warning {
    color: $secondary-color;
    margin-right: 8px;
  }
}

// 结果提示区域
.export-result {
  width: 90%;
  margin: 25px auto 0;
}

// 页脚信息
.export-footer {
  text-align: center;
  margin-top: 40px;
  color: #888;
  font-size: 14px;
  padding-top: 20px;
  border-top: 1px solid #FFE0D2;
}

// 复用登录页动画
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
</style>
