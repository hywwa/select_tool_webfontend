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
    <div class="main-container">
      <!-- 左侧参数区 -->
      <div
          class="section left-section"
          :style="{ width: leftWidth, display: hiddenSections.left ? 'none' : 'block' }"
          ref="leftSection"
      >
        <div class="param-form">
          <h3>砖机设备参数</h3>
          <el-form ref="form" :model="form" label-width="100px">
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
              <el-table-column prop="code" label="物料编码"></el-table-column>
              <el-table-column prop="goodDes" label="物料描述"></el-table-column>
              <el-table-column prop="suitType" label="适用砖规格"></el-table-column>
              <el-table-column prop="type" label="样式"></el-table-column>
              <el-table-column prop="moveLength" label="移砖行程"></el-table-column>
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
              <el-table-column prop="tsType" label="台车类型"></el-table-column>
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
              <el-table-column prop="codeGood" label="物料编码"></el-table-column>
              <el-table-column prop="goodDescriptin" label="物料描述"></el-table-column>
              <el-table-column prop="suitWidth" label="适用宽度"></el-table-column>
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
            <el-table-column prop="code" label="物料编码"></el-table-column>
            <el-table-column prop="name" label="名称/描述"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
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

<script>
import { ref, reactive, onMounted, toRefs, nextTick } from 'vue';
import { searchBrickDevices, searchTransportDevices, searchTransferDevices, searchLiftDevices, exportSelectedDevices } from '@/api/device';

export default {
  setup() {
    // 状态管理
    const state = reactive({
      // 布局状态
      hiddenSections: { left: false, middle: false, right: false },
      leftWidth: '30%',
      middleWidth: '40%',
      rightWidth: '30%',
      minWidth: 200, // 最小宽度限制

      // 表单数据
      form: {
        suitType: '',
        type: ''
      },

      // 标签页状态
      activeTab: 'brick',

      // 设备数据
      brickDevices: [],
      transportDevices: [],
      transferDevices: [],
      liftDevices: [],
      selectedDevices: []
    });

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
      state.hiddenSections[section] = !state.hiddenSections[section];
      adjustSectionWidths();
    };

    // 调整区域宽度
    const adjustSectionWidths = () => {
      const visibleSections = Object.keys(state.hiddenSections).filter(key => !state.hiddenSections[key]);
      if (visibleSections.length === 0) return;

      // 计算总可见宽度百分比
      const totalVisible = visibleSections.reduce((sum, section) => {
        return sum + parseFloat(state[`${section}Width`]);
      }, 0);

      // 计算每个可见区域应占的百分比
      const widthPercentage = 100 / visibleSections.length;

      // 应用新宽度
      visibleSections.forEach(section => {
        state[`${section}Width`] = `${widthPercentage}%`;
      });
    };

    // 开始调整宽度
    const startResize = (type) => {
      resizing.value.isResizing = true;
      resizing.value.type = type;
      resizing.value.startX = event.pageX;

      if (type === 'left') {
        resizing.value.startWidth = parseFloat(state.leftWidth);
        resizing.value.otherWidth = parseFloat(state.middleWidth);
      } else {
        resizing.value.startWidth = parseFloat(state.middleWidth);
        resizing.value.otherWidth = parseFloat(state.rightWidth);
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

      const containerWidth = document.querySelector('.main-container').offsetWidth;
      const deltaX = (event.pageX - resizing.value.startX) / containerWidth * 100;

      if (resizing.value.type === 'left') {
        // 调整左侧和中间宽度
        let newLeftWidth = resizing.value.startWidth + deltaX;
        let newMiddleWidth = resizing.value.otherWidth - deltaX;

        // 应用最小宽度限制
        if (newLeftWidth < state.minWidth / containerWidth * 100) {
          newLeftWidth = state.minWidth / containerWidth * 100;
          newMiddleWidth = 100 - newLeftWidth - parseFloat(state.rightWidth);
        }

        if (newMiddleWidth < state.minWidth / containerWidth * 100) {
          newMiddleWidth = state.minWidth / containerWidth * 100;
          newLeftWidth = 100 - newMiddleWidth - parseFloat(state.rightWidth);
        }

        state.leftWidth = `${newLeftWidth}%`;
        state.middleWidth = `${newMiddleWidth}%`;
      } else {
        // 调整中间和右侧宽度
        let newMiddleWidth = resizing.value.startWidth + deltaX;
        let newRightWidth = resizing.value.otherWidth - deltaX;

        // 应用最小宽度限制
        if (newMiddleWidth < state.minWidth / containerWidth * 100) {
          newMiddleWidth = state.minWidth / containerWidth * 100;
          newRightWidth = 100 - newMiddleWidth - parseFloat(state.leftWidth);
        }

        if (newRightWidth < state.minWidth / containerWidth * 100) {
          newRightWidth = state.minWidth / containerWidth * 100;
          newMiddleWidth = 100 - newRightWidth - parseFloat(state.leftWidth);
        }

        state.middleWidth = `${newMiddleWidth}%`;
        state.rightWidth = `${newRightWidth}%`;
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
      ...toRefs(state),
      leftSection,
      middleSection,
      rightSection,
      toggleSection,
      startResize,
      searchDevices,
      resetForm,
      selectDevice,
      removeDevice,
      exportSelected
    };
  }
};
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
  background-color: #67c23a;
  color: white;
  border-color: #67c23a;
}

.main-container {
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
