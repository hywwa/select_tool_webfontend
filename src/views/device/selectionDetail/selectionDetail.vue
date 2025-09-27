<template>
  <div class="app-container">
    <!-- 导航路径 -->
    <el-breadcrumb separator="/" class="mb-4">
      <el-breadcrumb-item @click="$router.push('/device/project')">项目管理</el-breadcrumb-item>
      <el-breadcrumb-item @click="$router.push(`/device/project?projectId=${productionLineInfo.mainProjectId}`)">
        产线管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>选型详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 产线基本信息 -->
    <el-card class="mb-4">
      <div class="card-header">
        <h3>产线信息</h3>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">产线名称</div>
          <div class="info-value">{{ productionLineInfo.projectName || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">关联项目</div>
          <div class="info-value">{{ productionLineInfo.mainProjectName || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">创建人</div>
          <div class="info-value">{{ productionLineInfo.creator || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">最后修改时间</div>
          <div class="info-value">{{ parseTime(productionLineInfo.lastModifyTime) || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">报价状态</div>
          <div class="info-value">
            <el-tag :type="productionLineInfo.isQuoted === 1 ? 'success' : 'info'">
              {{ productionLineInfo.isQuoted === 1 ? '已完成' : '未完成' }}
            </el-tag>
          </div>
        </div>
        <div class="info-item">
          <div class="info-label">项目状态</div>
          <div class="info-value">
            <el-tag :type="productionLineInfo.projectStatus === 0 ? 'primary' : 'warning'">
              {{ productionLineInfo.projectStatus === 0 ? '正常' : '项目模版' }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 操作按钮 -->
    <div class="operation-bar mb-4">
      <el-button 
        type="primary" 
        icon="Download" 
        @click="reExport"
        :loading="exportLoading"
        v-hasPermi="['device:records:export']"
      >
        重新导出
      </el-button>
      <el-button 
        type="default" 
        icon="ArrowLeft" 
        @click="$router.back()"
        class="ml-2"
      >
        返回
      </el-button>
    </div>

    <!-- 选型参数信息 -->
    <el-card class="mb-4">
      <div class="card-header">
        <h3>选型参数详情</h3>
      </div>
      <div v-loading="paramLoading" class="param-container">
        <!-- 基础信息 -->
        <div class="param-section mb-6">
          <h4 class="section-title">基础信息</h4>
          <div class="param-grid single-column">
            <div class="param-item">
              <div class="param-label">导出时间</div>
              <div class="param-value">{{ parseTime(selectionParams.exportTime) || '-' }}</div>
            </div>
          </div>
        </div>
        
        <!-- 砖机参数 -->
        <div class="param-section mb-6">
          <h4 class="section-title">砖机参数</h4>
          <div class="param-grid three-columns">
            <div class="param-item">
              <div class="param-label">最大砖宽</div>
              <div class="param-value">{{ selectionParams.brickSpec || '-' }} mm</div>
            </div>
            <div class="param-item">
              <div class="param-label">砖机样式</div>
              <div class="param-value">{{ selectionParams.style || '-' }}</div>
            </div>
            <div class="param-item">
              <div class="param-label">工位数</div>
              <div class="param-value">{{ selectionParams.workstationCount || '-' }}</div>
            </div>
          </div>
        </div>
        
        <!-- 拍齐顶升 -->
        <div class="param-section mb-6">
          <h4 class="section-title">拍齐顶升</h4>
          <div class="param-grid single-column">
            <div class="param-item">
              <div class="param-label">适用最大砖厚度</div>
              <div class="param-value">{{ selectionParams.maxBrickThickness || '-' }} mm</div>
            </div>
          </div>
        </div>
        
        <!-- 摆渡车参数 -->
        <div class="param-section mb-6">
          <h4 class="section-title">摆渡车参数</h4>
          <div class="param-grid four-columns">
            <div class="param-item">
              <div class="param-label">坑宽</div>
              <div class="param-value">{{ selectionParams.ferryPitwidth || '-' }} mm</div>
            </div>
            <div class="param-item">
              <div class="param-label">有无坑</div>
              <div class="param-value">{{ selectionParams.ferryHasPit || '-' }}</div>
            </div>
            <div class="param-item">
              <div class="param-label">关键特征</div>
              <div class="param-value">{{ selectionParams.ferryKeyFeature || '-' }}</div>
            </div>
            <div class="param-item">
              <div class="param-label">使用最大砖宽度</div>
              <div class="param-value">{{ selectionParams.ferryMaxBrickWidth || '-' }} mm</div>
            </div>
          </div>
        </div>
        
        <!-- 运输车参数 -->
        <div class="param-section mb-6">
          <h4 class="section-title">运输车参数</h4>
          <div class="param-grid three-columns">
            <div class="param-item">
              <div class="param-label">坑宽</div>
              <div class="param-value">{{ selectionParams.transportPitwidth || '-' }} mm</div>
            </div>
            <div class="param-item">
              <div class="param-label">电力形式</div>
              <div class="param-value">{{ selectionParams.powerType || '-' }}</div>
            </div>
            <div class="param-item">
              <div class="param-label">支撑形式</div>
              <div class="param-value">{{ selectionParams.supportType || '-' }}</div>
            </div>
          </div>
        </div>
        
        <!-- 砖规格片数 -->
        <div class="param-section">
          <h4 class="section-title">砖规格片数</h4>
          <div class="spec-grid">
            <div class="spec-item">
              <div class="spec-label">300×600</div>
              <div class="spec-value">{{ selectionParams.brickCount1 || '-' }}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">400×800</div>
              <div class="spec-value">{{ selectionParams.brickCount2 || '-' }}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">600×600</div>
              <div class="spec-value">{{ selectionParams.brickCount3 || '-' }}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">800×800</div>
              <div class="spec-value">{{ selectionParams.brickCount4 || '-' }}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">600×1200</div>
              <div class="spec-value">{{ selectionParams.brickCount5 || '-' }}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">1200×600</div>
              <div class="spec-value">{{ selectionParams.brickCount6 || '-' }}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">750×1500</div>
              <div class="spec-value">{{ selectionParams.brickCount7 || '-' }}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">800×1600</div>
              <div class="spec-value">{{ selectionParams.brickCount8 || '-' }}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">900×1800</div>
              <div class="spec-value">{{ selectionParams.brickCount9 || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 设备选型列表 -->
    <el-card>
      <div class="card-header">
        <h3>设备选型清单</h3>
      </div>
      <div v-loading="deviceLoading" class="table-container">
        <el-table 
          :data="selectedDevices" 
          border 
          stripe
          size="mini"
        >
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column label="设备类型" align="center" prop="deviceType">
            <template #default="scope">
              <el-tag type="info">
                {{ deviceTypeMap[scope.row.deviceType] || '未知' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="设备物料编号" align="center" prop="materialCode"></el-table-column>
          <el-table-column label="数量" align="center" prop="cartQuantity"></el-table-column>
        </el-table>
        
        <div v-if="selectedDevicesLoading" class="empty-state">
          <el-empty description="暂无设备选型记录"></el-empty>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup name="SelectionDetail">
import { ref, onMounted, watch, nextTick } from 'vue' 
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getManagement } from "@/api/device/management"
import { getRecords } from "@/api/device/records"  
import { listDevices } from "@/api/device/devices"  
import { exportSelectedDevices, exportByMaterialCode, downloadExportFile } from "../../../api/device/export.js";


// 路由实例
const route = useRoute()
const router = useRouter()

// 设备类型映射 - 与后端实体类对应
const deviceTypeMap = {
  1: '设备/砖机',
  2: '运输车',
  3: '摆渡车',
  4: '拍齐顶升'
}

// 加载状态
const paramLoading = ref(true)
const deviceLoading = ref(true)
const selectedDevicesLoading = ref(false)

// 核心数据（产线信息、选型参数、设备列表）
const productionLineInfo = ref({})
const selectionParams = ref({})
const selectedDevices = ref([])

// 时间格式化工具函数
function parseTime(time) {
  if (!time) return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minute}`;
}

// 1. 获取产线信息（封装为Promise，便于按顺序执行）
function getProductionLineInfo(productionLineId) {
  return new Promise((resolve) => {
    getManagement(productionLineId).then(response => {
      productionLineInfo.value = response.data || {};
    }).catch(err => {
      console.error('获取产线信息失败:', err);
      ElMessage.error('获取产线信息失败');
    }).finally(() => {
      resolve(); // 无论成功失败，都标记完成
    });
  });
}

// 2. 获取选型参数（封装为Promise）
function getSelectionParams(recordId) {
  return new Promise((resolve) => {
    paramLoading.value = true;
    getRecords(recordId).then(response => {  
      selectionParams.value = response.data || {};
    }).catch(err => {
      console.error('获取选型参数失败:', err);
      ElMessage.error('获取选型参数失败');
    }).finally(() => {
      paramLoading.value = false;
      resolve();
    });
  });
}

// 3. 获取设备选型列表（封装为Promise）
function getDevices(recordId) {
  return new Promise((resolve) => {
    deviceLoading.value = true;
    listDevices({ recordId: recordId }).then(response => {
      selectedDevices.value = response.rows || response.data || [];
      selectedDevicesLoading.value = selectedDevices.value.length === 0;
    }).catch(err => {
      console.error('获取设备选型列表失败:', err);
      ElMessage.error('获取设备选型列表失败');
    }).finally(() => {
      deviceLoading.value = false;
      resolve();
    });
  });
}

// 统一数据加载函数（核心：清空旧数据 + 按顺序加载新数据）
async function loadAllData() {
  // 步骤1：清空上一次的旧数据（关键！避免参数残留）
  productionLineInfo.value = {};
  selectionParams.value = {};
  selectedDevices.value = [];
  selectedDevicesLoading.value = false;
  
  // 步骤2：强制DOM更新，确保清空状态生效
  await nextTick();
  
  // 步骤3：获取当前路由参数
  const { recordId, productionLineId } = route.query;
  
  // 步骤4：参数合法性校验
  if (!recordId || !productionLineId) {
    return;
  }
  const rid = Number(recordId);
  const plid = Number(productionLineId);
  if (isNaN(rid) || isNaN(plid)) {
    return;
  }
  
  // 步骤5：按顺序加载数据（确保前一个接口完成后再加载下一个）
  await getProductionLineInfo(plid);
  await getSelectionParams(rid);
  await getDevices(rid);
}

// 监听路由参数变化（核心：只监听关键参数，避免无效触发）
watch(
  [() => route.query.recordId, () => route.query.productionLineId], // 仅监听这两个核心参数
  async ([newRecordId, newProductionLineId], [oldRecordId, oldProductionLineId]) => {
    // 只有当参数真正变化时，才重新加载数据
    if (newRecordId !== oldRecordId || newProductionLineId !== oldProductionLineId) {
      await loadAllData();
    }
  },
  { immediate: true } // 页面首次挂载时，立即执行一次加载
)

// 页面首次挂载时（与watch的immediate配合，双重保障）
onMounted(() => {
  loadAllData();
});

const exportLoading = ref(false);
function reExport() {
  exportLoading.value = true;
  const { recordId } = route.query;
  
  if (!recordId || selectedDevices.value.length === 0) {
    ElMessage.warning('缺少设备数据，无法导出');
    exportLoading.value = false;
    return;
  }
  
  // 构造导出数据（基于materialCode）
  const exportData = {
    brick: [],
    transfer: [],
    lift: [],
    transport: []
  };
  
  // 记录错误信息
  const errorInfo = {
    missingMaterialCode: [],
    unknownType: []
  };
  
  selectedDevices.value.forEach(device => {
    // 1. 验证设备基本信息是否完整
    if (!device) {
      console.warn('跳过无效设备对象');
      return;
    }
    
    // 2. 检查物料编码
    if (!device.materialCode || device.materialCode.trim() === '') {
      errorInfo.missingMaterialCode.push({
        name: device.name || '未知设备',
        id: device.id || '无ID'
      });
      return;
    }
    
    // 3. 处理设备类型（增加容错机制）
    let key = '';
    const deviceType = device.type || device.deviceType; // 兼容两种可能的类型字段
    
    if (!deviceType) {
      errorInfo.unknownType.push({
        name: device.name || '未知设备',
        materialCode: device.materialCode
      });
      return;
    }
    
    // 类型映射（同时支持字符串和数字类型）
    if (typeof deviceType === 'string') {
      switch(deviceType.trim()) {
        case '砖机': key = 'brick'; break;
        case '运输车': key = 'transport'; break;
        case '摆渡车': key = 'transfer'; break;
        case '拍齐顶升': key = 'lift'; break;
        default: 
          errorInfo.unknownType.push({
            name: device.name || '未知设备',
            type: deviceType,
            materialCode: device.materialCode
          });
          return;
      }
    } else if (typeof deviceType === 'number') {
      // 支持数字类型的设备类型（1-4对应四种设备）
      switch(deviceType) {
        case 1: key = 'brick'; break;
        case 2: key = 'transport'; break;
        case 3: key = 'transfer'; break;
        case 4: key = 'lift'; break;
        default: 
          errorInfo.unknownType.push({
            name: device.name || '未知设备',
            type: deviceType,
            materialCode: device.materialCode
          });
          return;
      }
    } else {
      errorInfo.unknownType.push({
        name: device.name || '未知设备',
        type: deviceType,
        materialCode: device.materialCode
      });
      return;
    }
    
    // 4. 收集有效数据
    exportData[key].push({
      materialCode: device.materialCode,
      quantity: device.quantity || 1
    });
  });
  
  // 输出错误日志，便于调试
  if (errorInfo.missingMaterialCode.length > 0) {
    console.warn('缺少物料编码的设备:', errorInfo.missingMaterialCode);
  }
  if (errorInfo.unknownType.length > 0) {
    console.warn('未知设备类型:', errorInfo.unknownType);
  }
  
  // 5. 检查有效数据
  const hasValidData = Object.values(exportData).some(arr => arr.length > 0);
  if (!hasValidData) {
    // 显示更具体的错误信息
    let warningMsg = '没有可导出的有效设备数据';
    if (errorInfo.missingMaterialCode.length > 0 && errorInfo.unknownType.length > 0) {
      warningMsg += '（部分设备缺少物料编码且存在未知设备类型）';
    } else if (errorInfo.missingMaterialCode.length > 0) {
      warningMsg += `（${errorInfo.missingMaterialCode.length}个设备缺少物料编码）`;
    } else if (errorInfo.unknownType.length > 0) {
      warningMsg += `（${errorInfo.unknownType.length}个设备类型未知）`;
    }
    ElMessage.warning(warningMsg);
    exportLoading.value = false;
    return;
  }
  
  // 6. 如果有部分数据无效，提示用户
  if (errorInfo.missingMaterialCode.length > 0 || errorInfo.unknownType.length > 0) {
    let noticeMsg = '部分设备因数据不完整未被导出：';
    if (errorInfo.missingMaterialCode.length > 0) {
      noticeMsg += ` 缺少物料编码(${errorInfo.missingMaterialCode.length}个)`;
    }
    if (errorInfo.unknownType.length > 0) {
      noticeMsg += ` 未知设备类型(${errorInfo.unknownType.length}个)`;
    }
    ElMessage.info(noticeMsg);
  }
  
  // 7. 调用导出接口
  exportByMaterialCode(exportData)
    .then(response => {
      // 增加详细日志，帮助诊断问题
      console.log('导出接口响应对象:', response);
      console.log('响应数据类型:', typeof response);
      console.log('响应数据结构:', response);
      
      if (!response) {
        throw new Error('服务器未返回任何响应');
      }
      
      // 关键修复：处理不同格式的响应数据
      let blobData;
      
      // 情况1: 响应本身就是Blob对象（有些库会直接返回Blob）
      if (response instanceof Blob) {
        blobData = response;
      } 
      // 情况2: 响应数据在data属性中
      else if (response.data) {
        blobData = response.data;
      } 
      // 情况3: 无法识别的响应结构
      else {
        throw new Error('无法识别的响应结构');
      }
      
      // 验证Blob数据
      if (!(blobData instanceof Blob)) {
        // 尝试转换为Blob（处理ArrayBuffer等情况）
        if (blobData instanceof ArrayBuffer) {
          blobData = new Blob([blobData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        } else if (typeof blobData === 'string') {
          throw new Error('导出失败: ' + blobData);
        } else {
          // 增加更详细的错误信息
          throw new Error(`服务器返回非预期数据类型: ${typeof blobData}, 数据: ${JSON.stringify(blobData)}`);
        }
      }
      
      // 验证文件大小
      if (blobData.size === 0) {
        throw new Error('服务器返回空文件');
      }
      
      // 下载文件
      downloadExportFile(blobData, `设备选型清单_${recordId}.xlsx`);
      ElMessage.success('导出成功');
    })
    .catch(err => {
      console.error('重新导出失败:', err);
      ElMessage.error(err.message || '重新导出失败，请稍后重试');
    })
    .finally(() => {
      exportLoading.value = false;
    });
}
</script>

<style scoped lang="scss">
.app-container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
  box-sizing: border-box;
}

.card-header {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #1f2329;
    margin: 0;
  }
}

.operation-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.param-container {
  margin-top: 16px;
}

.param-section {
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2329;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e6eb;
}

/* 产线信息样式 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 10px;
}

.info-item {
  padding: 8px 12px;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
}

.info-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f5f5f5;
}

.info-value {
  font-size: 14px;
  color: #303133;
  min-height: 20px;
}

/* 参数网格布局 */
.param-grid {
  display: grid;
  gap: 16px;
  padding: 10px;
}

.single-column {
  grid-template-columns: 1fr;
}

.three-columns {
  grid-template-columns: repeat(3, 1fr);
}

.four-columns {
  grid-template-columns: repeat(4, 1fr);
}

.param-item {
  padding: 12px;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  background-color: #fff;
}

.param-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f5f5f5;
  text-align: left;
}

.param-value {
  font-size: 14px;
  color: #303133;
  min-height: 20px;
  text-align: left;
}

/* 砖规格片数样式 */
.spec-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0;
}

.spec-item {
  border: 1px solid #e5e6eb;
  padding: 12px 8px;
  text-align: center;
}

.spec-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f5f5f5;
  font-weight: 500;
}

.spec-value {
  font-size: 14px;
  color: #303133;
}

.table-container {
  margin-top: 16px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .spec-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .four-columns {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .info-grid,
  .three-columns {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .spec-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .info-grid,
  .three-columns,
  .four-columns {
    grid-template-columns: 1fr;
  }
  
  .spec-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
