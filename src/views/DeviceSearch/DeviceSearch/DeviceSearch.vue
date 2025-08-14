<template>
  <div class="device-search-page">
    <!-- 控制面板 -->
    <div class="control-panel">
      <button @click="toggleSection('left')" :class="{ active: !hiddenSections.left }">
        {{ hiddenSections.left ? '显示' : '隐藏' }}参数区
      </button>
      <button @click="toggleSection('middle')" :class="{ active: !hiddenSections.middle }">
        {{ hiddenSections.middle ? '显示' : '隐藏' }}结果区
      </button>
      <button @click="toggleSection('right')" :class="{ active: !hiddenSections.right }">
        {{ hiddenSections.right ? '显示' : '隐藏' }}已选区
      </button>
      <button @click="exportSelected" class="export-btn" v-if="!hiddenSections.right && selectedDevices.length > 0">
        导出已选设备
      </button>
    </div>

    <!-- 主内容区 -->
    <div class="main-container-big">
      <!-- 左侧参数区 -->
      <div
          class="section left-section"
          :style="{ width: leftWidth, display: hiddenSections.left ? 'none' : 'block' }"
          ref="leftSection"
      >
        <div class="param-form">
          <h3>砖机设备参数</h3>
          <el-form ref="formRef" :model="form" label-width="100px">
            <el-form-item label="适用砖规格">
              <el-select v-model="form.suitType" placeholder="请选择适用砖规格">
                <el-option label="≤900" value="≤900"></el-option>
                <el-option label="≤1600" value="≤1600"></el-option>
                <el-option label="≤1200" value="≤1200"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="样式">
              <el-select v-model="form.type" placeholder="请选择样式">
                <el-option label="三轴式" value="三轴式"></el-option>
                <el-option label="纵向式" value="纵向式"></el-option>
                <el-option label="托盘式" value="托盘式"></el-option>
                <el-option label="一体式" value="一体式"></el-option>
                <el-option label="分体式" value="分体式"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchDevices">搜索</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 左侧调整手柄 -->
      <div
          class="resize-handle left-handle"
          v-if="!hiddenSections.left && !hiddenSections.middle"
          @mousedown="startResize('left')"
      ></div>

      <!-- 中间结果区 -->
      <div
          class="section middle-section"
          :style="{ width: middleWidth, display: hiddenSections.middle ? 'none' : 'block' }"
          ref="middleSection"
      >
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="砖机" name="brick">
            <el-table :data="brickDevices" border>
              <el-table-column label="数量">
                <template #default="scope">
                  <el-input-number
                      v-model="scope.row.quantity"
                      :min="1"
                      size="small"
                      :controls-position="'right'"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="goodCode" label="物料编码"></el-table-column>
              <el-table-column prop="goodDes" label="物料描述"></el-table-column>
              <el-table-column prop="suitType" label="适用砖规格"></el-table-column>
              <el-table-column prop="type" label="样式"></el-table-column>
              <el-table-column prop="moveLength" label="移砖行程"></el-table-column>
              <el-table-column prop="note" label="备注"></el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                      type="text"
                      @click="selectDevice(scope.row, 'brick')"
                  >
                    选择
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="运输车" name="transport">
            <el-table :data="transportDevices" border>
              <el-table-column label="数量">
                <template #default="scope">
                  <el-input-number
                      v-model="scope.row.quantity"
                      :min="1"
                      size="small"
                      :controls-position="'right'"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="goodCode" label="物料编码"></el-table-column>
              <el-table-column prop="goodDescription" label="物料描述"></el-table-column>
              <el-table-column prop="lengthCar" label="车长"></el-table-column>
              <el-table-column prop="tsLength" label="托升支架长"></el-table-column>
              <el-table-column prop="tsType" label="托升支架形式"></el-table-column>
              <el-table-column prop="elecMode" label="电力形式"></el-table-column>
              <el-table-column prop="note" label="备注"></el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                      type="text"
                      @click="selectDevice(scope.row, 'transport')"
                  >
                    选择
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="摆渡车" name="transfer">
            <el-table :data="transferDevices" border>
              <el-table-column label="数量">
                <template #default="scope">
                  <el-input-number
                      v-model="scope.row.quantity"
                      :min="1"
                      size="small"
                      :controls-position="'right'"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="goodCode" label="物料编码"></el-table-column>
              <el-table-column prop="descxxtion" label="描述"></el-table-column>
              <el-table-column prop="longToall" label="总长"></el-table-column>
              <el-table-column prop="kWidth" label="坑宽"></el-table-column>
              <el-table-column prop="note" label="备注"></el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                      type="text"
                      @click="selectDevice(scope.row, 'transfer')"
                  >
                    选择
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="拍齐顶升" name="lift">
            <el-table :data="liftDevices" border>
              <el-table-column label="数量">
                <template #default="scope">
                  <el-input-number
                      v-model="scope.row.quantity"
                      :min="1"
                      size="small"
                      :controls-position="'right'"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="goodCode" label="物料编码"></el-table-column>
              <el-table-column prop="goodDescriptin" label="物料描述"></el-table-column>
              <el-table-column prop="suitWidth" label="适用宽度"></el-table-column>
              <el-table-column prop="liftLength" label="托砖板长度"></el-table-column>
              <el-table-column prop="note" label="备注"></el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                      type="text"
                      @click="selectDevice(scope.row, 'lift')"
                  >
                    选择
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 右侧调整手柄 -->
      <div
          class="resize-handle right-handle"
          v-if="!hiddenSections.middle && !hiddenSections.right"
          @mousedown="startResize('right')"
      ></div>

      <!-- 右侧已选区 -->
      <div
          class="section right-section"
          :style="{ width: rightWidth, display: hiddenSections.right ? 'none' : 'block' }"
          ref="rightSection"
      >
        <div class="selected-devices">
          <h3>已选设备 ({{ selectedDevices.length }})</h3>
          <el-table :data="selectedDevices" border>
            <el-table-column prop="type" label="设备类型"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="goodCode" label="物料编码"></el-table-column>
            <el-table-column prop="name" label="物料备注"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                    type="text"
                    @click="removeDevice(scope.$index)"
                    style="color: #f56c6c"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="DeviceSearch">
import {ref, reactive, onMounted, toRefs, nextTick, warn} from 'vue';
import { getCurrentInstance } from 'vue';
import {
  searchBrickDevices,
  searchLiftDevices,
  searchTransferDevices,
  searchTransportDevices
} from "../../../api/device.js";
import axios from "axios";
import {ElMessage} from "element-plus";


// 布局状态
const hiddenSections = ref({ left: false, middle: false, right: false });
const leftWidth = ref('15%');
const middleWidth = ref('55%');
const rightWidth = ref('30%');
const minWidth = ref(200); // 最小宽度限制

// 表单数据
const form = reactive({
  suitType: '',
  type: ''
});
const formRef = ref(null);

// 标签页状态
const activeTab = ref('brick');

// 设备数据
const brickDevices = ref([]);
const transportDevices = ref([]);
const transferDevices = ref([]);
const liftDevices = ref([]);
const selectedDevices = ref([]);

// 引用
const leftSection = ref(null);
const middleSection = ref(null);
const rightSection = ref(null);
const resizing = ref({
  isResizing: false,
  type: null,
  startX: 0,
  startWidth: 0,
  otherWidth: 0
});

// 切换区域显示/隐藏
const toggleSection = (section) => {
  hiddenSections.value[section] = !hiddenSections.value[section];
  adjustSectionWidths();
};

// 调整区域宽度
const adjustSectionWidths = () => {
  const visibleSections = Object.keys(hiddenSections.value).filter(key => !hiddenSections.value[key]);
  if (visibleSections.length === 0) return;

  // 计算总可见宽度百分比
  const totalVisible = visibleSections.reduce((sum, section) => {
    const widthRef = {
      left: leftWidth,
      middle: middleWidth,
      right: rightWidth
    }[section];
    return sum + parseFloat(widthRef.value);
  }, 0);

  // 计算每个可见区域应占的百分比
  const widthPercentage = 100 / visibleSections.length;

  // 应用新宽度
  visibleSections.forEach(section => {
    const widthRef = {
      left: leftWidth,
      middle: middleWidth,
      right: rightWidth
    }[section];
    widthRef.value = `${widthPercentage}%`;
  });
};

// 开始调整宽度
const startResize = (type) => {
  resizing.value.isResizing = true;
  resizing.value.type = type;
  resizing.value.startX = event.pageX;

  if (type === 'left') {
    resizing.value.startWidth = parseFloat(leftWidth.value);
    resizing.value.otherWidth = parseFloat(middleWidth.value);
  } else {
    resizing.value.startWidth = parseFloat(middleWidth.value);
    resizing.value.otherWidth = parseFloat(rightWidth.value);
  }

  // 添加事件监听
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);

  // 防止选择文本
  event.preventDefault();
};

// 处理调整宽度
const handleResize = (event) => {
  if (!resizing.value.isResizing) return;

  const containerWidth = document.querySelector('.main-container-big').offsetWidth;
  const deltaX = (event.pageX - resizing.value.startX) / containerWidth * 100;

  if (resizing.value.type === 'left') {
    // 调整左侧和中间宽度
    let newLeftWidth = resizing.value.startWidth + deltaX;
    let newMiddleWidth = resizing.value.otherWidth - deltaX;

    // 应用最小宽度限制
    if (newLeftWidth < minWidth.value / containerWidth * 100) {
      newLeftWidth = minWidth.value / containerWidth * 100;
      newMiddleWidth = 100 - newLeftWidth - parseFloat(rightWidth.value);
    }

    if (newMiddleWidth < minWidth.value / containerWidth * 100) {
      newMiddleWidth = minWidth.value / containerWidth * 100;
      newLeftWidth = 100 - newMiddleWidth - parseFloat(rightWidth.value);
    }

    leftWidth.value = `${newLeftWidth}%`;
    middleWidth.value = `${newMiddleWidth}%`;
  } else {
    // 调整中间和右侧宽度
    let newMiddleWidth = resizing.value.startWidth + deltaX;
    let newRightWidth = resizing.value.otherWidth - deltaX;

    // 应用最小宽度限制
    if (newMiddleWidth < minWidth.value / containerWidth * 100) {
      newMiddleWidth = minWidth.value / containerWidth * 100;
      newRightWidth = 100 - newMiddleWidth - parseFloat(leftWidth.value);
    }

    if (newRightWidth < minWidth.value / containerWidth * 100) {
      newRightWidth = minWidth.value / containerWidth * 100;
      newMiddleWidth = 100 - newRightWidth - parseFloat(leftWidth.value);
    }

    middleWidth.value = `${newMiddleWidth}%`;
    rightWidth.value = `${newRightWidth}%`;
  }
};

// 停止调整宽度
const stopResize = () => {
  resizing.value.isResizing = false;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
};

// 搜索设备
const searchDevices = async () => {
  try {
    const response = await searchBrickDevices(form);
    brickDevices.value = response.rows.map(item => ({ ...item, quantity: 1 }));
    activeTab.value = 'brick';
  } catch (error) {
    console.error('搜索设备失败:', error);
  }
};

// 重置表单
const resetForm = () => {
  form.suitType = '';
  form.type = '';
};

// 选择设备
const selectDevice = (device, type) => {
  let deviceInfo = {};

  switch (type) {
    case 'brick':
      deviceInfo = {
        id: device.id,
        type: '砖机',
        goodCode: device.goodCode,
        name: device.goodDes,
        quantity: device.quantity
      };
      break;
    case 'transport':
      deviceInfo = {
        id: device.id,
        type: '运输车',
        goodCode: device.goodCode,
        name: device.goodDescription,
        quantity: device.quantity
      };
      break;
    case 'transfer':
      deviceInfo = {
        id: device.id,
        type: '摆渡车',
        goodCode: device.goodCode,
        name: device.descxxtion,
        quantity: device.quantity
      };
      break;
    case 'lift':
      deviceInfo = {
        id: device.id,
        type: '拍齐顶升',
        goodCode: device.goodCode,
        name: device.goodDescriptin,
        quantity: device.quantity
      };
      break;
  }

  // 检查是否已选择该设备
  const existingIndex = selectedDevices.value.findIndex(
      item => item.id === deviceInfo.id && item.type === deviceInfo.type
  );

  if (existingIndex > -1) {
    // 更新数量
    selectedDevices.value[existingIndex].quantity = deviceInfo.quantity;
  } else {
    // 添加新设备
    selectedDevices.value.push(deviceInfo);
  }
};

// 移除设备
const removeDevice = (index) => {
  selectedDevices.value.splice(index, 1);
};

// 导出选好的设备
const exportSelected = async () => {


  try {
    if (selectedDevices.value.length === 0) {
      ElMessage.error('请至少选择一条数据');
      return;
    }

    // 按设备类型组织数据
    const selectedDevicesMap = {
      brick: [],
      transport: [],
      transfer: [],
      lift: []
    };

    // 将已选设备按类型分类
    selectedDevices.value.forEach(device => {
      switch(device.type) {
        case '砖机':
          selectedDevicesMap.brick.push(device.goodCode);
          break;
        case '运输车':
          selectedDevicesMap.transport.push(device.goodCode);
          break;
        case '摆渡车':
          selectedDevicesMap.transfer.push(device.goodCode);
          break;
        case '拍齐顶升':
          selectedDevicesMap.lift.push(device.goodCode);
          break;
      }
    });

    // 过滤空数组
    const payload = Object.keys(selectedDevicesMap).reduce((acc, key) => {
      if (selectedDevicesMap[key].length > 0) {
        acc[key] = selectedDevicesMap[key];
      }
      return acc;
    }, {});

    try {
      const response = await axios.post(
          'http://localhost:8080/device/search/export-selected',
          payload,
          {
            responseType: 'blob',
            headers: { 'Content-Type': 'application/json' },
            validateStatus: status => status === 200
          }
      );

      const blob = response.data;
      // 处理下载
      const excelBlob = new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const contentDisposition = response.headers['content-disposition'] || '';
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      const fileName = fileNameMatch
          ? decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ''))
          : `selected_devices_${new Date().getTime()}.xlsx`;


      const url = window.URL.createObjectURL(excelBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      //  清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      ElMessage.success('导出成功');

    } catch (error) {
      // 处理请求错误
      let errorMsg = '导出失败';

      if (error.response && error.response.data instanceof Blob) {
        // 处理后端返回的Blob类型错误
        const errorText = await error.response.data.text();
        const errorObj = JSON.parse(errorText);
        ElMessage.error(errorObj.msg || '导出失败');
      } else {
        ElMessage.error(error.message || '导出失败');
      }
      throw new Error(errorMsg);
    }

  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error(error.message || '导出失败: 未知错误');
  }
}

// 初始化其他设备列表
const initOtherDevices = async () => {
  try {
    const [brickRes, transportRes, transferRes, liftRes] = await Promise.all([

      searchBrickDevices({}),
      searchTransportDevices({}),
      searchTransferDevices({}),
      searchLiftDevices({})
    ]);

    brickDevices.value = brickRes.rows.map(item => ({ ...item, quantity: 1 }));
    transportDevices.value = transportRes.rows.map(item => ({ ...item, quantity: 1 }));
    transferDevices.value = transferRes.rows.map(item => ({ ...item, quantity: 1 }));
    liftDevices.value = liftRes.rows.map(item => ({ ...item, quantity: 1 }));
  } catch (error) {
    console.error('初始化其他设备失败:', error);
  }
};

// 窗口大小变化时重新计算宽度
const handleWindowResize = () => {
  adjustSectionWidths();
};

onMounted(() => {
  initOtherDevices();
  window.addEventListener('resize', handleWindowResize);

  // 初始化宽度，防止出现0宽度问题
  nextTick(() => {
    adjustSectionWidths();
  });
});
</script>

<style scoped>
.device-search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.control-panel {
  padding: 10px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  gap: 10px;
  align-items: center;
}

.control-panel button {
  padding: 5px 10px;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.control-panel button.active {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.export-btn {
  margin-left: auto;
  background-color: #409eff;
  color: orange;
  border-color: #409eff;
}

.main-container-big {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

.section {
  overflow: auto;
  transition: width 0.2s ease;
  height: 100%;
  box-sizing: border-box;
}

.left-section {
  background-color: #fff;
  padding: 15px;
  border-right: 1px solid #e4e7ed;
}

.middle-section {
  padding: 15px;
  border-right: 1px solid #e4e7ed;
  flex: 1;
}

.right-section {
  padding: 15px;
  background-color: #fff;
}

.param-form {
  width: 100%;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  box-sizing: border-box;
}

.selected-devices h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

/* 调整手柄样式 */
.resize-handle {
  width: 5px;
  height: 100%;
  background-color: #e4e7ed;
  cursor: col-resize;
  transition: background-color 0.2s;
  z-index: 10;
}

.resize-handle:hover {
  background-color: #409eff;
}

.resize-handle:active {
  background-color: #66b1ff;
}

/* 自定义滚动条 */
.section::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.section::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}

.section::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 确保表格适应容器宽度 */
.el-table {
  width: 100% !important;
}
</style>