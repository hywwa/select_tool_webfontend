<template>
  <div class="app-container">
    <!-- 搜索表单 - 优化移动端布局 -->
    <el-form 
      :model="queryParams" 
      ref="queryRef" 
      :inline="isDesktop" 
      v-show="showSearch" 
      :label-width="isDesktop ? '68px' : '80px'"
      class="search-form"
    >
      <el-row :gutter="10" class="search-form-row">
        <!-- 搜索字段按屏幕尺寸自动调整布局 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="物料编码" prop="materialCode">
            <el-input
              v-model="queryParams.materialCode"
              placeholder="请输入物料编码"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="物料描述" prop="materialDescription">
            <el-input
              v-model="queryParams.materialDescription"
              placeholder="请输入物料描述"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="最大砖宽" prop="brickSpec">
            <el-input
              v-model="queryParams.brickSpec"
              placeholder="请输入最大砖宽"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="移砖行程" prop="travelDistance">
            <el-input
              v-model="queryParams.travelDistance"
              placeholder="请输入移砖行程(mm)"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="样式" prop="style">
            <el-input
              v-model="queryParams.style"
              placeholder="请输入样式"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="工位数" prop="workstationCount">
            <el-input
              v-model="queryParams.workstationCount"
              placeholder="请输入工位数"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="提升速比" prop="liftRatio">
            <el-input
              v-model="queryParams.liftRatio"
              placeholder="请输入提升速比"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="提升齿轮" prop="liftGearDiameter">
            <el-input
              v-model="queryParams.liftGearDiameter"
              placeholder="请输入提升齿轮直径(mm)"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="驱动速比" prop="driveRatio">
            <el-input
              v-model="queryParams.driveRatio"
              placeholder="请输入水平驱动速比"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="驱动轴径" prop="driveShaftDiameter">
            <el-input
              v-model="queryParams.driveShaftDiameter"
              placeholder="请输入水平驱动轴径(mm)"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="带轮直径" prop="drivePulleyDiameter">
            <el-input
              v-model="queryParams.drivePulleyDiameter"
              placeholder="请输入水平驱动同步带轮直径(mm)"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="从动轴径" prop="drivenShaftDiameter">
            <el-input
              v-model="queryParams.drivenShaftDiameter"
              placeholder="请输入从动轴径(mm)"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="吸盘数量" prop="suctionCupCount">
            <el-input
              v-model="queryParams.suctionCupCount"
              placeholder="请输入吸盘数量"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="吸盘大小" prop="suctionCupSize">
            <el-input
              v-model="queryParams.suctionCupSize"
              placeholder="请输入吸盘大小(mm)"
              clearable
              @keyup.enter="handleQuery"
              class="form-input"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" class="form-actions-col">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery" class="search-btn">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery" class="reset-btn">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 操作按钮 - 优化移动端布局 -->
    <div class="operation-bar">
      <div class="operation-buttons">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['device:brick:add']"
          class="operation-btn"
          size="mini"
        >新增</el-button>
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['device:brick:edit']"
          class="operation-btn"
          size="mini"
        >修改</el-button>
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:brick:remove']"
          class="operation-btn"
          size="mini"
        >删除</el-button>
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['device:brick:export']"
          class="operation-btn"
          size="mini"
        >导出</el-button>
      </div>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" class="search-toggle"></right-toolbar>
    </div>

    <!-- 表格展示 - 优化移动端显示 -->
    <div class="table-container">
      <el-table 
        v-loading="loading" 
        :data="brickList" 
        @selection-change="handleSelectionChange" 
        border
        class="data-table"
        size="mini"
        highlight-current-row
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column label="序号" align="center" prop="id" min-width="60" />
        <el-table-column label="物料编码" align="center" prop="materialCode" min-width="100" />
        <el-table-column label="物料描述" align="center" prop="materialDescription" min-width="120" />
        <el-table-column label="最大砖宽" align="center" prop="brickSpec" min-width="80" />
        <el-table-column label="移砖行程(mm)" align="center" prop="travelDistance" min-width="100" />
        
        <!-- 桌面端显示的额外列 -->
        <el-table-column label="样式" align="center" prop="style" min-width="80" v-if="isDesktop" />
        <el-table-column label="工位数" align="center" prop="workstationCount" min-width="80" v-if="isDesktop" />
        <el-table-column label="提升速比" align="center" prop="liftRatio" min-width="80" v-if="isDesktop" />
        <el-table-column label="提升齿轮(mm)" align="center" prop="liftGearDiameter" min-width="100" v-if="isDesktop" />
        <el-table-column label="驱动速比" align="center" prop="driveRatio" min-width="80" v-if="isDesktop" />
        <el-table-column label="驱动轴径(mm)" align="center" prop="driveShaftDiameter" min-width="100" v-if="isDesktop" />
        <el-table-column label="带轮直径(mm)" align="center" prop="drivePulleyDiameter" min-width="100" v-if="isDesktop" />
        <el-table-column label="从动轴径(mm)" align="center" prop="drivenShaftDiameter" min-width="100" v-if="isDesktop" />
        <el-table-column label="吸盘数量" align="center" prop="suctionCupCount" min-width="80" v-if="isDesktop" />
        <el-table-column label="吸盘形式" align="center" prop="suctionCupType" min-width="80" v-if="isDesktop" />
        <el-table-column label="吸盘大小(mm)" align="center" prop="suctionCupSize" min-width="100" v-if="isDesktop" />
        <el-table-column label="电磁阀数量" align="center" prop="solenoidValveCount" min-width="100" v-if="isDesktop" />
        <el-table-column label="电磁阀型号" align="center" prop="solenoidValveModel" min-width="100" v-if="isDesktop" />
        <el-table-column label="真空发生器数量" align="center" prop="vacuumGeneratorCount" min-width="120" v-if="isDesktop" />
        <el-table-column label="真空发生器型号" align="center" prop="vacuumGeneratorModel" min-width="120" v-if="isDesktop" />
        <el-table-column label="叉砖口内空(mm)" align="center" prop="forkOpening" min-width="110" v-if="isDesktop" />
        <el-table-column label="备注" align="center" prop="notes" min-width="300" v-if="isDesktop" />
        <el-table-column label="在用项目" align="center" prop="usedProjects" min-width="100" v-if="isDesktop" />
        
        <!-- 移动端展开详情按钮 -->
        <el-table-column v-else width="40" align="center">
          <template #default="scope">
            <el-button 
              type="text" 
              size="mini" 
              @click="toggleDetail(scope.row)"
              :icon="expandedId === scope.row.id ? 'Minus' : 'Plus'"
            />
          </template>
        </el-table-column>
        
        <el-table-column 
          label="操作" 
          align="center" 
          class-name="small-padding fixed-width" 
          :min-width="isDesktop ? 120 : 100"
        >
          <template #default="scope">
            <el-button 
              link 
              type="primary" 
              icon="Edit" 
              @click="handleUpdate(scope.row)" 
              v-hasPermi="['device:brick:edit']"
              class="table-action-btn"
              size="mini"
            >修改</el-button>
            <el-button 
              link 
              type="primary" 
              icon="Delete" 
              @click="handleDelete(scope.row)" 
              v-hasPermi="['device:brick:remove']"
              class="table-action-btn"
              size="mini"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 移动端详情展开区域 -->
      <div 
        v-for="row in brickList" 
        :key="row.id"
        v-if="!isDesktop && expandedId === row.id"
        class="mobile-detail-panel"
      >
        <div class="detail-item"><span class="detail-label">样式：</span>{{ row.style || '-' }}</div>
        <div class="detail-item"><span class="detail-label">工位数：</span>{{ row.workstationCount || '-' }}</div>
        <div class="detail-item"><span class="detail-label">提升速比：</span>{{ row.liftRatio || '-' }}</div>
        <div class="detail-item"><span class="detail-label">提升齿轮(mm)：</span>{{ row.liftGearDiameter || '-' }}</div>
        <div class="detail-item"><span class="detail-label">驱动速比：</span>{{ row.driveRatio || '-' }}</div>
        <div class="detail-item"><span class="detail-label">驱动轴径(mm)：</span>{{ row.driveShaftDiameter || '-' }}</div>
        <div class="detail-item"><span class="detail-label">带轮直径(mm)：</span>{{ row.drivePulleyDiameter || '-' }}</div>
        <div class="detail-item"><span class="detail-label">从动轴径(mm)：</span>{{ row.drivenShaftDiameter || '-' }}</div>
        <div class="detail-item"><span class="detail-label">吸盘数量：</span>{{ row.suctionCupCount || '-' }}</div>
        <div class="detail-item"><span class="detail-label">吸盘形式：</span>{{ row.suctionCupType || '-' }}</div>
        <div class="detail-item"><span class="detail-label">吸盘大小(mm)：</span>{{ row.suctionCupSize || '-' }}</div>
        <div class="detail-item"><span class="detail-label">电磁阀数量：</span>{{ row.solenoidValveCount || '-' }}</div>
        <div class="detail-item"><span class="detail-label">电磁阀型号：</span>{{ row.solenoidValveModel || '-' }}</div>
        <div class="detail-item"><span class="detail-label">真空发生器数量：</span>{{ row.vacuumGeneratorCount || '-' }}</div>
        <div class="detail-item"><span class="detail-label">真空发生器型号：</span>{{ row.vacuumGeneratorModel || '-' }}</div>
        <div class="detail-item"><span class="detail-label">叉砖口内空(mm)：</span>{{ row.forkOpening || '-' }}</div>
        <div class="detail-item"><span class="detail-label">备注：</span>{{ row.notes || '-' }}</div>
        <div class="detail-item"><span class="detail-label">在用项目：</span>{{ row.usedProjects || '-' }}</div>
      </div>
    </div>
    
    <!-- 分页控件 -->
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
      class="pagination-container"
      :page-sizes="[5, 10, 20]"
    />

    <!-- 添加或修改砖机对话框 - 优化移动端尺寸 -->
    <el-dialog 
      :title="title" 
      v-model="open" 
      :width="isDesktop ? '600px' : '90%'" 
      append-to-body
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <el-form 
        ref="brickRef" 
        :model="form" 
        :rules="rules" 
        :label-width="isDesktop ? '120px' : '70px'"
        class="dialog-form"
      >
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物料编码" class="form-input" />
        </el-form-item>
        <el-form-item label="物料描述" prop="materialDescription">
          <el-input v-model="form.materialDescription" placeholder="请输入物料描述" class="form-input" />
        </el-form-item>
        <el-form-item label="适用最大砖宽" prop="brickSpec">
          <el-input v-model="form.brickSpec" placeholder="请输入适用最大砖宽" class="form-input" />
        </el-form-item>
        <el-form-item label="移砖行程(mm)" prop="travelDistance">
          <el-input v-model="form.travelDistance" placeholder="请输入移砖行程(mm)" class="form-input" />
        </el-form-item>
        <el-form-item label="样式" prop="style">
          <el-input v-model="form.style" placeholder="请输入样式" class="form-input" />
        </el-form-item>
        <el-form-item label="工位数" prop="workstationCount">
          <el-input v-model="form.workstationCount" placeholder="请输入工位数" class="form-input" />
        </el-form-item>
        <el-form-item label="提升速比" prop="liftRatio">
          <el-input v-model="form.liftRatio" placeholder="请输入提升速比" class="form-input" />
        </el-form-item>
        <el-form-item label="提升齿轮直径(mm)" prop="liftGearDiameter">
          <el-input v-model="form.liftGearDiameter" placeholder="请输入提升齿轮直径(mm)" class="form-input" />
        </el-form-item>
        <el-form-item label="水平驱动速比" prop="driveRatio">
          <el-input v-model="form.driveRatio" placeholder="请输入水平驱动速比" class="form-input" />
        </el-form-item>
        <el-form-item label="水平驱动轴径(mm)" prop="driveShaftDiameter">
          <el-input v-model="form.driveShaftDiameter" placeholder="请输入水平驱动轴径(mm)" class="form-input" />
        </el-form-item>
        <el-form-item label="水平驱动同步带轮直径(mm)" prop="drivePulleyDiameter">
          <el-input v-model="form.drivePulleyDiameter" placeholder="请输入水平驱动同步带轮直径(mm)" class="form-input" />
        </el-form-item>
        <el-form-item label="从动轴径(mm)" prop="drivenShaftDiameter">
          <el-input v-model="form.drivenShaftDiameter" placeholder="请输入从动轴径(mm)" class="form-input" />
        </el-form-item>
        <el-form-item label="吸盘数量" prop="suctionCupCount">
          <el-input v-model="form.suctionCupCount" placeholder="请输入吸盘数量" class="form-input" />
        </el-form-item>
        <el-form-item label="吸盘大小(mm)" prop="suctionCupSize">
          <el-input v-model="form.suctionCupSize" placeholder="请输入吸盘大小(mm)" class="form-input" />
        </el-form-item>
        <el-form-item label="电磁阀数量" prop="solenoidValveCount">
          <el-input v-model="form.solenoidValveCount" placeholder="请输入电磁阀数量" class="form-input" />
        </el-form-item>
        <el-form-item label="电磁阀型号" prop="solenoidValveModel">
          <el-input v-model="form.solenoidValveModel" placeholder="请输入电磁阀型号" class="form-input" />
        </el-form-item>
        <el-form-item label="真空发生器数量" prop="vacuumGeneratorCount">
          <el-input v-model="form.vacuumGeneratorCount" placeholder="请输入真空发生器数量" class="form-input" />
        </el-form-item>
        <el-form-item label="真空发生器型号" prop="vacuumGeneratorModel">
          <el-input v-model="form.vacuumGeneratorModel" placeholder="请输入真空发生器型号" class="form-input" />
        </el-form-item>
        <el-form-item label="叉砖口内空(mm)" prop="forkOpening">
          <el-input v-model="form.forkOpening" placeholder="请输入叉砖口内空(mm)" class="form-input" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" type="textarea" placeholder="请输入内容" rows="3" class="form-input" />
        </el-form-item>
        <el-form-item label="在用项目" prop="usedProjects">
          <el-input v-model="form.usedProjects" type="textarea" placeholder="请输入内容" rows="3" class="form-input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Brick">
import { ref, reactive, toRefs, getCurrentInstance, computed, watchEffect } from 'vue'
import { listBrick, getBrick, delBrick, addBrick, updateBrick } from "@/api/device/brick"
import axios from 'axios'

const { proxy } = getCurrentInstance()

// 响应式判断是否为桌面端
const isDesktop = computed(() => {
  return window.innerWidth >= 768;
});

// 移动端展开详情的ID
const expandedId = ref('')

// 数据定义
const brickList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    materialCode: null,
    materialDescription: null,
    brickSpec: null,
    travelDistance: null,
    style: null,
    workstationCount: null,
    liftRatio: null,
    liftGearDiameter: null,
    driveRatio: null,
    driveShaftDiameter: null,
    drivePulleyDiameter: null,
    drivenShaftDiameter: null,
    suctionCupCount: null,
    suctionCupType: null,
    suctionCupSize: null,
    solenoidValveCount: null,
    solenoidValveModel: null,
    vacuumGeneratorCount: null,
    vacuumGeneratorModel: null,
    forkOpening: null,
    notes: null,
    usedProjects: null
  },
  rules: {
    materialCode: [
      { required: true, message: "物料编码不能为空", trigger: "blur" }
    ],
    materialDescription: [
      { required: true, message: "物料描述不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询砖机列表 */
function getList() {
  loading.value = true
  listBrick(queryParams.value).then(response => {
    brickList.value = response.rows
    total.value = response.total
    loading.value = false
  }).catch(err => {
    console.error('获取砖机列表失败:', err);
    proxy.$modal.msgError('获取砖机列表失败，请重试');
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    materialCode: null,
    materialDescription: null,
    brickSpec: null,
    travelDistance: null,
    style: null,
    workstationCount: null,
    liftRatio: null,
    liftGearDiameter: null,
    driveRatio: null,
    driveShaftDiameter: null,
    drivePulleyDiameter: null,
    drivenShaftDiameter: null,
    suctionCupCount: null,
    suctionCupType: null,
    suctionCupSize: null,
    solenoidValveCount: null,
    solenoidValveModel: null,
    vacuumGeneratorCount: null,
    vacuumGeneratorModel: null,
    forkOpening: null,
    notes: null,
    usedProjects: null
  }
  if (proxy.$refs["brickRef"]) {
    proxy.resetForm("brickRef")
  }
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  if (proxy.$refs["queryRef"]) {
    proxy.resetForm("queryRef")
  }
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 表格行点击事件 - 处理选中状态 */
function handleRowClick(row, column, event) {
  // 如果点击的是操作列或展开按钮，不触发选择
  if (column.label === '操作' || column.width === 40) {
    return;
  }
  // 实现单选逻辑
  const selected = brickList.value.find(item => ids.value.includes(item.id));
  if (selected && selected.id === row.id) {
    // 取消选择
    ids.value = [];
  } else {
    // 选择当前行
    ids.value = [row.id];
  }
  handleSelectionChange(brickList.value.filter(item => ids.value.includes(item.id)));
}

/** 切换详情展开状态 */
function toggleDetail(row) {
  if (expandedId.value === row.id) {
    expandedId.value = '';
  } else {
    expandedId.value = row.id;
  }
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加砖机"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row?.id || (ids.value.length ? ids.value[0] : null);
  
  if (!_id) {
    proxy.$modal.msgWarning("请选择需要修改的砖机");
    return;
  }
  
  getBrick(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改砖机"
  }).catch(err => {
    proxy.$modal.msgError("获取砖机信息失败：" + (err.message || err));
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["brickRef"].validate(valid => {
    if (valid) {
      const isUpdate = !!form.value.id;
      const promise = isUpdate 
        ? updateBrick(form.value) 
        : addBrick(form.value);
      
      promise
        .then(() => {
          proxy.$modal.msgSuccess(isUpdate ? "修改成功" : "新增成功");
          open.value = false;
          getList();
        })
        .catch(err => {
          proxy.$modal.msgError((err.message || err) || (isUpdate ? "修改失败" : "新增失败"));
        });
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row?.id ? [row.id] : ids.value;
  
  if (!_ids.length) {
    proxy.$modal.msgWarning("请选择需要删除的砖机");
    return;
  }
  
  proxy.$modal.confirm('是否确认删除砖机编号为"' + _ids + '"的数据项？').then(function() {
    return delBrick(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('device/brick/export', {
    ...queryParams.value
  }, `brick_${new Date().getTime()}.xlsx`)
}

// 监听窗口大小变化，优化响应式显示
watchEffect(() => {
  const handleResize = () => {
    // 窗口大小变化时重置展开状态，避免布局错乱
    expandedId.value = '';
  };
  
  window.addEventListener('resize', handleResize);
  
  // 组件卸载时移除事件监听
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});

// 初始化加载数据
getList()
</script>

<style scoped lang="scss">
// 基础样式
.app-container {
  padding: 16px;
  box-sizing: border-box;
  min-height: 100vh;
  background-color: #f5f7fa;
}

// 搜索表单样式
.search-form {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 4px;
  
  .search-form-row {
    width: 100%;
  }
  
  .form-item-col {
    margin-bottom: 10px;
  }
  
  .form-actions-col {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
  }
  
  .form-input {
    width: 100%;
  }
  
  .search-btn, .reset-btn {
    margin-right: 8px;
  }
}

// 操作按钮栏
.operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  
  .operation-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    overflow-x: auto;
    padding-bottom: 8px;
    min-width: 0;
    width: 100%;
    
    .operation-btn {
      white-space: nowrap;
      flex-shrink: 0;
    }
  }
  
  .search-toggle {
    margin-left: auto;
    margin-top: 8px;
    align-self: flex-end;
  }
}

// 表格容器
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 16px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  .data-table {
    width: 100%;
    min-width: 900px;
    
    .table-action-btn {
      margin-right: 8px;
      padding: 0 5px;
    }
  }
  
  // 移动端详情面板
  .mobile-detail-panel {
    background-color: #f9f9f9;
    border: 1px solid #e8e8e8;
    border-top: none;
    padding: 10px 15px;
    font-size: 13px;
    
    .detail-item {
      margin-bottom: 8px;
      line-height: 1.5;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .detail-label {
        color: #666;
        display: inline-block;
        width: 100px;
        font-weight: 500;
      }
    }
  }
}

// 分页样式
.pagination-container {
  text-align: right;
  margin-top: 12px;
  
  &::v-deep .el-pagination {
    justify-content: center;
    flex-wrap: wrap;
  }
}

// 对话框样式
.custom-dialog {
  .dialog-form {
    margin-top: 12px;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
  }
}

// 响应式样式
@media (max-width: 768px) {
  .app-container {
    padding: 8px;
  }
  
  .operation-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    
    .operation-buttons {
      width: 100%;
      justify-content: flex-start;
      padding-bottom: 4px;
    }
    
    .search-toggle {
      align-self: flex-end;
      margin-left: 0;
    }
  }
  
  .search-form {
    padding: 8px;
    
    .form-item-col {
      width: 100%;
    }
  }
  
  .table-container .data-table {
    min-width: auto;
    font-size: 12px;
  }
  
  .pagination-container {
    text-align: center;
    font-size: 12px;
    
    &::v-deep .el-pagination__sizes {
      display: none;
    }
  }
  
  .custom-dialog {
    &::v-deep .el-dialog__body {
      padding: 15px 10px;
      max-height: 70vh;
      overflow-y: auto;
    }
  }
}
</style>
