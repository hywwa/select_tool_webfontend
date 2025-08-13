<template>
  <div class="app-container">
    <!-- 整体布局：导航栏 + 主内容 -->
    <div class="layout-wrapper">

      <!-- 主内容区（包含我们的三部分） -->
      <main class="main-content">
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

        <!-- 三栏内容区 -->
        <div class="content-wrapper">
          <!-- 左侧参数区（贴紧导航栏） -->
          <div
              class="section left-section"
              :style="{ width: leftWidth, display: hiddenSections.left ? 'none' : 'block' }"
          >
            <div class="param-form">
              <h3>砖机设备参数</h3>
              <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="适用砖规格">
                  <el-select v-model="form.suitType" placeholder="请选择">
                    <el-option label="≤900" value="≤900"></el-option>
                    <el-option label="≤1600" value="≤1600"></el-option>
                    <el-option label="≤1200" value="≤1200"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="样式">
                  <el-select v-model="form.type" placeholder="请选择">
                    <el-option label="三轴式" value="三轴式"></el-option>
                    <el-option label="纵向式" value="纵向式"></el-option>
                    <el-option label="托盘式" value="托盘式"></el-option>
                    <el-option label="一体式" value="一体式"></el-option>
                    <el-option label="分体式" value="分体式"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchDevices">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 左侧调整手柄 -->
          <div
              class="resize-handle"
              v-if="!hiddenSections.left && !hiddenSections.middle"
              @mousedown="startResize('left')"
          ></div>

          <!-- 中间结果区 -->
          <div
              class="section middle-section"
              :style="{ width: middleWidth, display: hiddenSections.middle ? 'none' : 'block' }"
          >
            <el-tabs v-model="activeTab" type="card">
              <el-tab-pane label="砖机" name="brick">
                <el-table :data="brickDevices" border>
                  <el-table-column label="数量">
                    <template #default="scope">
                      <el-input-number v-model="scope.row.quantity" :min="1" size="small"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="code" label="物料编码"></el-table-column>
                  <el-table-column prop="goodDes" label="物料描述"></el-table-column>
                  <el-table-column prop="suitType" label="适用砖规格"></el-table-column>
                  <el-table-column prop="type" label="样式"></el-table-column>
                  <el-table-column label="操作">
                    <template #default="scope">
                      <el-button type="text" @click="selectDevice(scope.row, 'brick')">选择</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <!-- 其他标签页内容省略 -->
            </el-tabs>
          </div>

          <!-- 右侧调整手柄 -->
          <div
              class="resize-handle"
              v-if="!hiddenSections.middle && !hiddenSections.right"
              @mousedown="startResize('right')"
          ></div>

          <!-- 右侧已选区 -->
          <div
              class="section right-section"
              :style="{ width: rightWidth, display: hiddenSections.right ? 'none' : 'block' }"
          >
            <div class="selected-devices">
              <h3>已选设备</h3>
              <el-table :data="selectedDevices" border>
                <el-table-column prop="type" label="设备类型"></el-table-column>
                <el-table-column prop="code" label="物料编码"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="quantity" label="数量"></el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button type="text" @click="removeDevice(scope.$index)">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import {searchBrickDevices} from "../../../api/device.js";

export default {
  setup() {
    const state = reactive({
      hiddenSections: { left: false, middle: false, right: false },
      leftWidth: '25%',
      middleWidth: '50%',
      rightWidth: '25%',
      minWidth: 200,
      activeTab: 'brick',
      form: { suitType: '', type: '' },
      brickDevices: [],
      selectedDevices: []
    });

    // 宽度调整相关方法（与之前逻辑一致）
    const resizing = ref({ isResizing: false, type: null, startX: 0, startWidth: 0, otherWidth: 0 });

    const startResize = (type) => {
      resizing.value.isResizing = true;
      resizing.value.type = type;
      resizing.value.startX = event.pageX;
      resizing.value.startWidth = parseFloat(state[type === 'left' ? 'leftWidth' : 'middleWidth']);
      resizing.value.otherWidth = parseFloat(state[type === 'left' ? 'middleWidth' : 'rightWidth']);

      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
      event.preventDefault();
    };

    const handleResize = (event) => {
      if (!resizing.value.isResizing) return;
      const containerWidth = document.querySelector('.content-wrapper').offsetWidth;
      const deltaX = (event.pageX - resizing.value.startX) / containerWidth * 100;

      if (resizing.value.type === 'left') {
        const newLeft = Math.max(state.minWidth / containerWidth * 100, resizing.value.startWidth + deltaX);
        const newMiddle = 100 - newLeft - parseFloat(state.rightWidth);
        state.leftWidth = `${newLeft}%`;
        state.middleWidth = `${Math.max(state.minWidth / containerWidth * 100, newMiddle)}%`;
      } else {
        const newMiddle = Math.max(state.minWidth / containerWidth * 100, resizing.value.startWidth + deltaX);
        const newRight = 100 - newMiddle - parseFloat(state.leftWidth);
        state.middleWidth = `${newMiddle}%`;
        state.rightWidth = `${Math.max(state.minWidth / containerWidth * 100, newRight)}%`;
      }
    };

    const stopResize = () => {
      resizing.value.isResizing = false;
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    };

    // 其他方法（搜索、选择等）
    const toggleSection = (section) => {
      state.hiddenSections[section] = !state.hiddenSections[section];
      const visible = Object.keys(state.hiddenSections).filter(k => !state.hiddenSections[k]);
      const width = 100 / visible.length + '%';
      visible.forEach(k => state[k + 'Width'] = width);
    };

    const searchDevices = async () => {
      try {
        const response = await searchBrickDevices(state.form);
        state.brickDevices = response.rows.map(item => ({ ...item, quantity: 1 }));
        state.activeTab = 'brick';
      } catch (error) {
        console.error('搜索设备失败:', error);
      }
    };

    // 重置表单
    const resetForm = () => {
      state.form = {
        suitType: '',
        type: ''
      };
    };

    // 选择设备
    const selectDevice = (device, type) => {
      let deviceInfo = {};

      switch(type) {
        case 'brick':
          deviceInfo = {
            id: device.id,
            type: '砖机',
            code: device.code,
            name: device.goodDes,
            quantity: device.quantity
          };
          break;
        case 'transport':
          deviceInfo = {
            id: device.id,
            type: '运输车',
            code: device.goodCode,
            name: device.goodDescription,
            quantity: device.quantity
          };
          break;
        case 'transfer':
          deviceInfo = {
            id: device.id,
            type: '摆渡车',
            code: device.goodCode,
            name: device.descxxtion,
            quantity: device.quantity
          };
          break;
        case 'lift':
          deviceInfo = {
            id: device.id,
            type: '拍齐顶升',
            code: device.codeGood,
            name: device.goodDescriptin,
            quantity: device.quantity
          };
          break;
      }

      // 检查是否已选择该设备
      const existingIndex = state.selectedDevices.findIndex(
          item => item.id === deviceInfo.id && item.type === deviceInfo.type
      );

      if (existingIndex > -1) {
        // 更新数量
        state.selectedDevices[existingIndex].quantity = deviceInfo.quantity;
      } else {
        // 添加新设备
        state.selectedDevices.push(deviceInfo);
      }
    };

    // 移除设备
    const removeDevice = (index) => {
      state.selectedDevices.splice(index, 1);
    };

    // 导出已选设备
    const exportSelected = async () => {
      try {
        await exportSelectedDevices(state.selectedDevices);
      } catch (error) {
        console.error('导出失败:', error);
      }
    };

    // 初始化其他设备列表
    const initOtherDevices = async () => {
      try {
        const [transportRes, transferRes, liftRes] = await Promise.all([
          searchTransportDevices({}),
          searchTransferDevices({}),
          searchLiftDevices({})
        ]);

        state.transportDevices = transportRes.rows.map(item => ({ ...item, quantity: 1 }));
        state.transferDevices = transferRes.rows.map(item => ({ ...item, quantity: 1 }));
        state.liftDevices = liftRes.rows.map(item => ({ ...item, quantity: 1 }));
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

    return {
      ...state,
      startResize,
      toggleSection,
      searchDevices,
      selectDevice,
      removeDevice,
      exportSelected
    };
  }
};
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  height: 100vh;
}

/* 导航栏样式 */
.sidebar {
  width: 200px; /* 导航栏固定宽度 */
  background: #2d3a4b;
  color: #fff;
  /* 确保导航栏在最左侧 */
  float: left;
  position: relative;
  z-index: 10;
}

/* 主内容区 */
.main-content {
  flex: 1; /* 占满剩余宽度 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 三栏内容容器 */
.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧参数区 - 贴紧导航栏 */
.left-section {
  padding: 15px;
  border-right: 1px solid #e4e7ed;
  margin-left: 0 !important; /* 移除左侧间距 */
  padding-left: 15px !important; /* 仅保留必要内边距 */
  box-sizing: border-box;
}

/* 其他区域样式 */
.middle-section {
  padding: 15px;
  border-right: 1px solid #e4e7ed;
  box-sizing: border-box;
}

.right-section {
  padding: 15px;
  box-sizing: border-box;
}

/* 调整手柄 */
.resize-handle {
  width: 5px;
  height: 100%;
  background: #e4e7ed;
  cursor: col-resize;
}

/* 控制面板 */
.control-panel {
  padding: 10px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  gap: 10px;
}

/* 其他样式省略 */
</style>