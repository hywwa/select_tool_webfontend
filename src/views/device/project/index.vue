<template>
  <div class="app-container">
    <!-- 导航路径指示器 - 优化样式和交互反馈 -->
    <el-breadcrumb separator="/" class="mb-4 breadcrumb-custom">
      <el-breadcrumb-item 
        :class="{ 'active': viewState === 'project' }" 
        @click="switchToProjectView"
        class="breadcrumb-item"
      >
        项目管理
      </el-breadcrumb-item>
      <el-breadcrumb-item 
        v-if="viewState === 'productionLine'" 
        :class="{ 'active': viewState === 'productionLine' }" 
        @click="switchToProductionLineView"
        class="breadcrumb-item"
      >
        产线管理
        <template #suffix>
          <el-tag 
            type="info" 
            size="small" 
            class="ml-2 project-tag" 
            v-if="currentProjectId"
          >
            {{ currentProjectName || `项目ID: ${currentProjectId}` }}
          </el-tag>
        </template>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 1. 项目管理视图 -->
    <div v-if="viewState === 'project'" class="view-container animate-fade-in">
      <!-- 项目搜索表单 - 优化移动端布局 -->
      <el-form 
        :model="projectQueryParams" 
        ref="projectQueryRef" 
        :inline="isDesktop" 
        v-show="showProjectSearch" 
        label-width="120px"
        class="search-form"
      >
        <el-row :gutter="10" class="search-form-row">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
            <el-form-item label="项目编码" prop="projectCode">
              <el-input
                v-model="projectQueryParams.projectCode"
                placeholder="请输入项目编码"
                clearable
                @keyup.enter="getProjectList"
                class="form-input"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="projectQueryParams.projectName"
                placeholder="请输入项目名称"
                clearable
                @keyup.enter="getProjectList"
                class="form-input"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
            <el-form-item label="创建人" prop="createUser">
              <el-input
                v-model="projectQueryParams.createUser"
                placeholder="请输入创建人"
                clearable
                @keyup.enter="getProjectList"
                class="form-input"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
            <el-form-item label="最后修改时间" prop="lastModifyTime">
              <el-date-picker
                v-model="projectQueryParams.lastModifyTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择最后修改时间"
                clearable
                class="form-input"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" class="form-actions-col">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="getProjectList" class="search-btn">搜索</el-button>
              <el-button icon="Refresh" @click="resetProjectQuery" class="reset-btn">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 项目操作按钮 - 优化移动端滚动和布局 -->
      <div class="operation-bar">
        <div class="operation-buttons">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleProjectAdd"
            v-hasPermi="['device:project:add']"
            class="operation-btn"
          >新增项目</el-button>
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="projectSingle"
            @click="handleProjectUpdate"
            v-hasPermi="['device:project:edit']"
            class="operation-btn"
          >修改</el-button>
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="projectMultiple"
            @click="handleProjectDelete"
            v-hasPermi="['device:project:remove']"
            class="operation-btn"
          >删除</el-button>
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleProjectExport"
            v-hasPermi="['device:project:export']"
            class="operation-btn"
          >导出</el-button>
          <!-- 管理当前项目的产线 -->
          <el-button
            type="info"
            plain
            icon="Setting"
            :disabled="projectSingle"
            @click="switchToProductionLineView"
            v-hasPermi="['device:management:query']"
            class="operation-btn"
          >管理产线</el-button>
        </div>
        <right-toolbar 
          v-model:showSearch="showProjectSearch" 
          @queryTable="getProjectList"
          class="search-toggle"
        ></right-toolbar>
      </div>

      <!-- 项目列表 - 优化表格滚动和移动端显示 -->
      <div class="table-container">
        <el-table 
          v-loading="projectLoading" 
          :data="projectList" 
          @selection-change="handleProjectSelectionChange" 
          border
          class="data-table"
          size="mini"
          highlight-current-row
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="项目编码" align="center" prop="projectCode" min-width="120" />
          <el-table-column label="项目名称" align="center" prop="projectName" min-width="150" />
          <el-table-column label="项目描述" align="center" prop="projectDesc" min-width="180" />
          <el-table-column label="项目状态" align="center" prop="projectStatus" min-width="100">
            <template #default="scope">
              <el-tag 
                :type="scope.row.projectStatus === 1 ? 'primary' : scope.row.projectStatus === 2 ? 'success' : 'danger'"
                class="status-tag"
              >
                {{ scope.row.projectStatus === 1 ? '进行中' : scope.row.projectStatus === 2 ? '已完成' : '已取消' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建人" align="center" prop="createUser" min-width="100" />
          <el-table-column label="最后修改时间" align="center" prop="lastModifyTime" min-width="160">
            <template #default="scope">
              <span>{{ parseTime(scope.row.lastModifyTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column 
            label="操作" 
            align="center" 
            class-name="small-padding fixed-width" 
            min-width="180"
          >
            <template #default="scope">
              <el-button 
                link 
                type="primary" 
                icon="Edit" 
                @click="handleProjectUpdate(scope.row)" 
                v-hasPermi="['device:project:edit']"
                class="table-action-btn"
              >修改</el-button>
              <el-button 
                link 
                type="primary" 
                icon="Delete" 
                @click="handleProjectDelete(scope.row)" 
                v-hasPermi="['device:project:remove']"
                class="table-action-btn"
              >删除</el-button>
              <el-button 
                link 
                type="primary" 
                icon="Setting" 
                @click="switchToProductionLineView(scope.row)" 
                v-hasPermi="['device:management:query']"
                class="table-action-btn"
              >管理产线</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 分页控件 -->
      <pagination
        v-show="projectTotal>0"
        :total="projectTotal"
        v-model:page="projectQueryParams.pageNum"
        v-model:limit="projectQueryParams.pageSize"
        @pagination="getProjectList"
        class="pagination-container"
      />

      <!-- 添加或修改项目对话框 -->
      <el-dialog 
        :title="projectDialogTitle" 
        v-model="projectDialogOpen" 
        width="500px" 
        append-to-body
        :close-on-click-modal="false"
        class="custom-dialog"
      >
        <el-form 
          ref="projectRef" 
          :model="projectForm" 
          :rules="projectRules" 
          label-width="80px"
          class="dialog-form"
        >
          <el-form-item label="项目编码" prop="projectCode">
            <el-input v-model="projectForm.projectCode" placeholder="请输入项目编码" />
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="projectForm.projectName" placeholder="请输入项目名称" />
          </el-form-item>
          <el-form-item label="项目描述" prop="projectDesc">
            <el-input v-model="projectForm.projectDesc" type="textarea" placeholder="请输入内容" rows="3" />
          </el-form-item>

          <el-form-item label="项目状态" prop="projectStatus">
            <el-select v-model="projectForm.projectStatus" placeholder="请选择项目状态">
              <el-option label="进行中" value="1"></el-option>
              <el-option label="已完成" value="2"></el-option>
              <el-option label="已取消" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitProjectForm">确 定</el-button>
            <el-button @click="cancelProjectForm">取 消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <!-- 2. 产线管理视图 -->
    <div v-if="viewState === 'productionLine'" class="view-container animate-fade-in">
      <!-- 显示当前关联的项目信息 - 优化样式 -->
      <div class="mb-4 project-info-bar">
        <el-descriptions column="1" border class="project-info-descriptions">
          <el-descriptions-item label="当前项目" class="project-info-item">
            <span class="project-name">{{ currentProjectName || `项目ID: ${currentProjectId}` }}</span>
            <el-button 
              type="text" 
              icon="ArrowLeft" 
              @click="switchToProjectView" 
              class="back-btn"
            >返回项目列表</el-button>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 产线搜索表单 - 优化移动端布局 -->
      <el-form 
        :model="productionLineQueryParams" 
        ref="productionLineQueryRef" 
        :inline="isDesktop" 
        v-show="showProductionLineSearch" 
        label-width="120px"
        class="search-form"
      >
        <el-row :gutter="10" class="search-form-row">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="productionLineQueryParams.projectName"
                placeholder="请输入项目名称"
                clearable
                @keyup.enter="getProductionLineList"
                class="form-input"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
            <el-form-item label="创建人" prop="creator">
              <el-input
                v-model="productionLineQueryParams.creator"
                placeholder="请输入创建人"
                clearable
                @keyup.enter="getProductionLineList"
                class="form-input"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
            <el-form-item label="是否报价完成" prop="isQuoted">
              <el-select 
                v-model="productionLineQueryParams.isQuoted" 
                placeholder="请选择" 
                clearable
                class="form-input"
              >
                <el-option label="未完成" value="0"></el-option>
                <el-option label="已完成" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" class="form-actions-col">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="getProductionLineList" class="search-btn">搜索</el-button>
              <el-button icon="Refresh" @click="resetProductionLineQuery" class="reset-btn">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 产线操作按钮 -->
      <div class="operation-bar">
        <div class="operation-buttons">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleProductionLineAdd"
            v-hasPermi="['device:management:add']"
            class="operation-btn"
          >新增产线</el-button>
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="productionLineSingle"
            @click="handleProductionLineUpdate"
            v-hasPermi="['device:management:edit']"
            class="operation-btn"
          >修改</el-button>
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="productionLineMultiple"
            @click="handleProductionLineDelete"
            v-hasPermi="['device:management:remove']"
            class="operation-btn"
          >删除</el-button>
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleProductionLineExport"
            v-hasPermi="['device:management:export']"
            class="operation-btn"
          >导出</el-button>
        </div>
        <right-toolbar 
          v-model:showSearch="showProductionLineSearch" 
          @queryTable="getProductionLineList"
          class="search-toggle"
        ></right-toolbar>
      </div>

      <!-- 产线列表 -->
      <div class="table-container">
        <el-table 
          v-loading="productionLineLoading" 
          :data="productionLineList" 
          @selection-change="handleProductionLineSelectionChange" 
          border
          class="data-table"
          size="mini"
          highlight-current-row
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="项目名称" align="center" prop="projectName" min-width="150" />
          <el-table-column label="创建人" align="center" prop="creator" min-width="100" />
          <el-table-column label="最后修改时间" align="center" prop="lastModifyTime" min-width="160">
            <template #default="scope">
              <span>{{ parseTime(scope.row.lastModifyTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否报价完成" align="center" prop="isQuoted" min-width="120">
            <template #default="scope">
              <el-tag 
                :type="scope.row.isQuoted === 1 ? 'success' : 'info'"
                class="status-tag"
              >
                {{ scope.row.isQuoted === 1 ? '已完成' : '未完成' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="项目状态" align="center" prop="projectStatus" min-width="120">
            <template #default="scope">
              <el-tag 
                :type="scope.row.projectStatus === 0 ? 'primary' : 'warning'"
                class="status-tag"
              >
                {{ scope.row.projectStatus === 0 ? '正常' : '项目模版' }}
              </el-tag>
            </template>
          </el-table-column>
         <!-- 在产线列表的操作列中添加新按钮 -->
<el-table-column 
  label="操作" 
  align="center" 
  class-name="small-padding fixed-width" 
  min-width="240" 
>
  <template #default="scope">
    <el-button 
      link 
      type="primary" 
      icon="Edit" 
      @click="handleProductionLineUpdate(scope.row)" 
      v-hasPermi="['device:management:edit']"
      class="table-action-btn"
    >修改</el-button>
    <el-button 
      link 
      type="primary" 
      icon="Delete" 
      @click="handleProductionLineDelete(scope.row)" 
      v-hasPermi="['device:management:remove']"
      class="table-action-btn"
    >删除</el-button>
    <el-tooltip 
      :content="getSelectionTip(scope.row)"  
      placement="top"
      :disabled="canEnterSelection(scope.row)"  
    >
      <el-button 
        link 
        type="primary" 
        icon="Search" 
        @click="goToSelectionPage(scope.row)" 
        :disabled="!canEnterSelection(scope.row)" 
        class="table-action-btn"
      >进入选型</el-button>
    </el-tooltip>
    
    <!-- 新增：查看选型详情按钮 -->
    <el-button 
      link 
      type="primary" 
      icon="Document" 
      @click="goToSelectionDetail(scope.row)" 
      :disabled="!scope.row.recordId || scope.row.recordId === 0"
      v-hasPermi="['device:records:query']"
      class="table-action-btn"
    >查看选型详情</el-button>

  <el-tooltip 
  :content="getTemplateBtnTip(scope.row)" 
  placement="top"
>
  <el-button 
    link 
    type="info"  
    icon="CopyDocument"  
    @click="setAsTemplate(scope.row)" 
    :disabled="scope.row.projectStatus === 1 || scope.row.isQuoted !== 1" 
    v-hasPermi="['device:management:edit']"  
    class="table-action-btn"
  >
    {{ scope.row.projectStatus === 1 ? '已为模版' : '设为模版' }}
  </el-button>
</el-tooltip>
  </template>
</el-table-column>
  
        </el-table>
      </div>
      
      <!-- 分页控件 -->
      <pagination
        v-show="productionLineTotal>0"
        :total="productionLineTotal"
        v-model:page="productionLineQueryParams.pageNum"
        v-model:limit="productionLineQueryParams.pageSize"
        @pagination="getProductionLineList"
        class="pagination-container"
      />

      <!-- 添加或修改产线对话框 -->
      <el-dialog 
        :title="productionLineDialogTitle" 
        v-model="productionLineDialogOpen" 
        width="500px" 
        append-to-body
        :close-on-click-modal="false"
        class="custom-dialog"
      >
        <el-form 
          ref="productionLineRef" 
          :model="productionLineForm" 
          :rules="productionLineRules" 
          label-width="120px"
          class="dialog-form"
        >
          <!-- 关联的总项目ID，自动填充不可编辑 -->
          <el-form-item label="总项目ID" prop="mainProjectId">
            <el-input 
              v-model="productionLineForm.mainProjectId" 
              placeholder="关联的总项目ID" 
              disabled 
              class="disabled-input"
            />
          </el-form-item>
          
          <!-- 项目名称：用户必填 -->
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="productionLineForm.projectName" placeholder="请输入项目名称" />
          </el-form-item>
          
          <!-- 项目备注：可选填写 -->
          <el-form-item label="项目备注" prop="remarks">
            <el-input 
              v-model="productionLineForm.remarks" 
              type="textarea" 
              placeholder="请输入内容（可选）" 
              rows="3" 
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitProductionLineForm">确 定</el-button>
            <el-button @click="cancelProductionLineForm">取 消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup name="ProjectProductionFlow">
import { ref, reactive, toRefs, onMounted, getCurrentInstance, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// 导入API
import { listProject, getProject, delProject, addProject, updateProject } from "@/api/device/project"
import { listManagement, getManagement, delManagement, addManagement, updateManagement } from "@/api/device/management"
import useUserStore from '@/store/modules/user'


// 路由实例
const router = useRouter()
const { proxy } = getCurrentInstance()

// 响应式判断是否为桌面端
const isDesktop = computed(() => {
  return window.innerWidth >= 768;
});

// 视图状态管理：project-项目管理，productionLine-产线管理
const viewState = ref('project')

// 当前选中的项目信息
const currentProjectId = ref('')
const currentProjectName = ref('')

// 当前选中的产线信息
const currentProductionLineId = ref('')
const currentProductionLineName = ref('')

// 产线关联记录ID默认提示（未输入时显示）
const showRecordIdTip = ref(false)

// 1. 项目管理相关数据
const projectList = ref([])
const projectLoading = ref(true)
const showProjectSearch = ref(true)
const projectIds = ref([])
const projectSingle = ref(true)
const projectMultiple = ref(true)
const projectTotal = ref(0)
const projectDialogOpen = ref(false)
const projectDialogTitle = ref('')

// 项目表单数据
const projectData = reactive({
  form: {
    mainProjectId: null,
    projectCode: null,
    projectName: null,
    projectDesc: null,
    projectStatus: null,
    createUser: null,
    lastModifyTime: null,
    lastModifyUser: null
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    projectCode: null,
    projectName: null,
    createUser: null,
    lastModifyTime: null
  },
  rules: {
    projectCode: [
      { required: true, message: "项目编码不能为空", trigger: "blur" }
    ],
    projectName: [
      { required: true, message: "总项目名称不能为空", trigger: "blur" }
    ],
    projectStatus: [
      { required: true, message: "项目状态不能为空", trigger: "change" }
    ],
    createUser: [
      { required: true, message: "创建人不能为空", trigger: "blur" }
    ]
  }
})

const { form: projectForm, queryParams: projectQueryParams, rules: projectRules } = toRefs(projectData)

// 2. 产线管理相关数据
const productionLineList = ref([])
const productionLineLoading = ref(true)
const showProductionLineSearch = ref(true)
const productionLineIds = ref([])
const productionLineSingle = ref(true)
const productionLineMultiple = ref(true)
const productionLineTotal = ref(0)
const productionLineDialogOpen = ref(false)
const productionLineDialogTitle = ref('')

// 产线表单数据：移除后端自动生成字段的必填校验
const productionLineData = reactive({
  form: {
    projectId: null,
    recordId: null, // 后端默认0
    mainProjectId: null,
    projectName: null, // 用户必填
    creator: null, // 后端自动填充当前用户
    lastModifyTime: null, // 后端自动更新
    lastOperator: null, // 后端自动填充
    remarks: null, // 可选
    isQuoted: null, // 后端默认0
    projectStatus: null // 后端默认0
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    recordId: null,
    mainProjectId: null,
    projectName: null,
    creator: null,
    isQuoted: null
  },
  rules: {
    // 关联记录ID：非必填（后端默认0）
    recordId: [
      { message: "关联的选型记录ID为数字", trigger: "blur", type: "number" }
    ],
    // 项目名称：必填
    projectName: [
      { required: true, message: "项目名称不能为空", trigger: "blur" }
    ],
    // 报价状态：非必填（后端默认0）
    isQuoted: [
      { message: "请选择报价状态", trigger: "change" }
    ],
    // 项目状态：非必填（后端默认0）
    projectStatus: [
      { message: "请选择项目状态", trigger: "change" }
    ]
  }
})

const { form: productionLineForm, queryParams: productionLineQueryParams, rules: productionLineRules } = toRefs(productionLineData)

// 监听关联记录ID输入状态，显示默认提示
watch(() => productionLineForm.value.recordId, (val) => {
  showRecordIdTip.value = val === null || val === '';
}, { immediate: true })

// 修正后的时间格式化函数，处理时区问题
function parseTime(time, format = '{y}-{m}-{d} {h}:{i}:{s}') {
  if (time === null || time === undefined || time === '') {
    return ''
  }
  
  // 处理时间戳，确保是数字类型
  if (typeof time === 'string') {
    // 移除可能的引号
    time = time.replace(/["']/g, '')
    // 如果是字符串时间戳，转换为数字
    if (/^\d+$/.test(time)) {
      time = parseInt(time)
    } else {
      // 尝试解析ISO格式时间
      const date = new Date(time)
      if (!isNaN(date.getTime())) {
        time = date.getTime()
      } else {
        return ''
      }
    }
  }
  
  // 如果是10位时间戳，转换为13位（秒->毫秒）
  if (time.toString().length === 10) {
    time = time * 1000
  }
  
  const date = new Date(time)
  // 检查是否是有效日期
  if (isNaN(date.getTime())) {
    return ''
  }
  
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  
  // 补零处理
  Object.keys(formatObj).forEach(key => {
    if (format.includes(`{${key}}`) && formatObj[key] < 10) {
      formatObj[key] = '0' + formatObj[key]
    }
  })
  
  return format.replace(/{([ymdhisa])}/g, (result, key) => {
    return formatObj[key] || ''
  })
}


// 切换到项目管理视图
function switchToProjectView() {
  viewState.value = 'project';
  getProjectList();
}

// 切换到产线管理视图，可传入项目行数据
function switchToProductionLineView(row) {
  // 获取项目ID和名称
  if (row && row.mainProjectId) {
    currentProjectId.value = row.mainProjectId;
    currentProjectName.value = row.projectName || '';
  } else if (projectIds.value.length === 1) {
    currentProjectId.value = projectIds.value[0];
    // 从列表中查找项目名称
    const project = projectList.value.find(item => item.mainProjectId === currentProjectId.value);
    currentProjectName.value = project?.projectName || '';
  } else {
    proxy.$modal.msgWarning("请选择一个项目进行操作");
    return;
  }

  // 设置产线查询条件
  productionLineQueryParams.value.mainProjectId = currentProjectId.value;
  viewState.value = 'productionLine';
  getProductionLineList();
}

// 跳转到选型页面
function goToSelectionPage(row) {
  if (!row || !row.projectId) {
    proxy.$modal.msgWarning("请选择一条产线记录");
    return;
  }

   // 2. 权限校验：判断当前角色是否符合报价状态要求
  if (!canEnterSelection(row)) {
    proxy.$modal.msgWarning(getSelectionTip(row)); // 提示无权限
    return;
  }
  
  // 保存当前产线信息
  currentProductionLineId.value = row.projectId;
  currentProductionLineName.value = row.projectName || '';
  
  // 跳转到指定的选型页面
  router.push({
    path: 'DeviceSearch/DeviceSearch/DeviceSearch',  // 选型页面路由路径
     query: {
        productionLineId: row.projectId,
    //   productionLineName: row.projectName,
    //   mainProjectId: currentProjectId.value,
    //   mainProjectName: currentProjectName.value
     }
  });
}

// 跳转到选型详情页面
function goToSelectionDetail(row) {
  if (!row || !row.recordId || row.recordId === 0) {
    proxy.$modal.msgWarning("该产线没有关联的选型记录");
    return;
  }
  
  // 保存当前产线和选型记录信息
  currentProductionLineId.value = row.projectId;
  currentProductionLineName.value = row.projectName || '';
  
  // 跳转到选型详情页面
  router.push({
    path: '/selectDevice/selectionDetail',  // 假设详情页路由路径
    query: {
      recordId: row.recordId,
      productionLineId: row.projectId,
      productionLineName: row.projectName
    }
  });
}
    

// --------------------------- 项目管理相关方法 ---------------------------
/** 查询项目列表 */
function getProjectList() {
  projectLoading.value = true;
  listProject(projectQueryParams.value)
    .then(response => {
      projectList.value = response.rows || [];
      projectTotal.value = response.total || 0;
    })
    .catch(err => {
      console.error('获取项目列表失败:', err);
      proxy.$modal.msgError('获取项目列表失败，请重试');
    })
    .finally(() => {
      projectLoading.value = false;
    });
}

/** 重置项目查询 */
function resetProjectQuery() {
  if (proxy.$refs["projectQueryRef"]) {
    proxy.$refs["projectQueryRef"].resetFields();
  }
  projectQueryParams.value.pageNum = 1;
  getProjectList();
}

/** 项目选择变更 */
function handleProjectSelectionChange(selection) {
  projectIds.value = selection.map(item => item.mainProjectId);
  projectSingle.value = selection.length !== 1;
  projectMultiple.value = !selection.length;
}

/** 新增项目 */
function handleProjectAdd() {
  projectForm.value = {
    mainProjectId: null,
    projectCode: null,
    projectName: null,
    projectDesc: null,
    projectStatus: null,
    createUser: null
  };
  projectDialogTitle.value = "添加项目";
  projectDialogOpen.value = true;
}

/** 修改项目 */
function handleProjectUpdate(row) {
  const mainProjectId = row?.mainProjectId || (projectIds.value.length ? projectIds.value[0] : null);
  
  if (!mainProjectId) {
    proxy.$modal.msgWarning("请选择需要修改的项目");
    return;
  }
  
  getProject(mainProjectId)
    .then(response => {
      projectForm.value = { ...response.data };
      projectDialogTitle.value = "修改项目";
      projectDialogOpen.value = true;
    })
    .catch(err => {
      proxy.$modal.msgError("获取项目信息失败：" + (err.message || err));
    });
}

/** 提交项目表单 */
function submitProjectForm() {
  proxy.$refs["projectRef"].validate(valid => {
    if (valid) {
      const isUpdate = !!projectForm.value.mainProjectId;
      const promise = isUpdate 
        ? updateProject(projectForm.value) 
        : addProject(projectForm.value);
      
      promise
        .then(() => {
          proxy.$modal.msgSuccess(isUpdate ? "修改成功" : "新增成功");
          projectDialogOpen.value = false;
          getProjectList();
        })
        .catch(err => {
          proxy.$modal.msgError((err.message || err) || (isUpdate ? "修改失败" : "新增失败"));
        });
    }
  });
}

/** 取消项目表单 */
function cancelProjectForm() {
  projectDialogOpen.value = false;
  proxy.resetForm("projectRef");
}

/** 删除项目 */
function handleProjectDelete(row) {
  const mainProjectIds = row?.mainProjectId ? [row.mainProjectId] : projectIds.value;
  
  if (!mainProjectIds.length) {
    proxy.$modal.msgWarning("请选择需要删除的项目");
    return;
  }
  
  proxy.$modal.confirm(`是否确认删除项目编号为"${mainProjectIds.join(',')}"的数据？`)
    .then(() => {
      return delProject(mainProjectIds);
    })
    .then(() => {
      getProjectList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出项目 */
function handleProjectExport() {
  proxy.download('device/project/export', {
    ...projectQueryParams.value
  }, `project_${new Date().getTime()}.xlsx`);
}

// --------------------------- 产线管理相关方法 ---------------------------
/** 查询产线列表 */
function getProductionLineList() {
  productionLineLoading.value = true;
  listManagement(productionLineQueryParams.value)
    .then(response => {
      productionLineList.value = response.rows || [];
      productionLineTotal.value = response.total || 0;
    })
    .catch(err => {
      console.error('获取产线列表失败:', err);
      proxy.$modal.msgError('获取产线列表失败，请重试');
    })
    .finally(() => {
      productionLineLoading.value = false;
    });
}

/** 重置产线查询 */
function resetProductionLineQuery() {
  if (proxy.$refs["productionLineQueryRef"]) {
    proxy.$refs["productionLineQueryRef"].resetFields();
  }
  // 保留项目ID筛选条件
  productionLineQueryParams.value.mainProjectId = currentProjectId.value;
  productionLineQueryParams.value.pageNum = 1;
  getProductionLineList();
}

/** 产线选择变更 */
function handleProductionLineSelectionChange(selection) {
  productionLineIds.value = selection.map(item => item.projectId);
  productionLineSingle.value = selection.length !== 1;
  productionLineMultiple.value = !selection.length;
}

/** 新增产线：预填当前用户到创建人 */
function handleProductionLineAdd() {
  productionLineForm.value = {
    projectId: null,
    recordId: null, // 后端默认0
    mainProjectId: currentProjectId.value,  // 自动关联当前项目
    projectName: null,
    creator: userStore.username || '系统用户', // 前端预显当前用户
    remarks: null,
    isQuoted: null, // 后端默认0
    projectStatus: null // 后端默认0
  };
  productionLineDialogTitle.value = "添加产线";
  productionLineDialogOpen.value = true;
  showRecordIdTip.value = true; // 显示默认提示
}

/** 修改产线 */
function handleProductionLineUpdate(row) {
  const projectId = row?.projectId || (productionLineIds.value.length ? productionLineIds.value[0] : null);
  
  if (!projectId) {
    proxy.$modal.msgWarning("请选择需要修改的产线");
    return;
  }
  
  getManagement(projectId)
    .then(response => {
      productionLineForm.value = { ...response.data };
      productionLineDialogTitle.value = "修改产线";
      productionLineDialogOpen.value = true;
      showRecordIdTip.value = !productionLineForm.value.recordId; // 根据当前值显示提示
    })
    .catch(err => {
      proxy.$modal.msgError("获取产线信息失败：" + (err.message || err));
    });
}
// 提交产线表单：过滤后端自动生成的字段
function submitProductionLineForm() {
  proxy.$refs["productionLineRef"].validate(valid => {
    if (valid) {
      const isUpdate = !!productionLineForm.value.projectId;
      // 确保关联正确的项目ID
      productionLineForm.value.mainProjectId = currentProjectId.value;
      
      // 过滤后端自动生成的字段
      const submitData = { ...productionLineForm.value };
      delete submitData.creator; // 后端自动填充当前用户
      delete submitData.lastModifyTime; // 后端自动更新
      delete submitData.lastOperator; // 后端自动填充
      
      const promise = isUpdate 
        ? updateManagement(submitData) 
        : addManagement(submitData);
      
      promise
        .then(response => {  // 接收完整响应对象
          proxy.$modal.msgSuccess(isUpdate ? "修改成功" : "新增成功");
          
          // 新增操作时，获取返回的自增ID
          if (!isUpdate) {
            // 从响应中获取自增ID并存储
            const newProductionLine = response.data;
            if (newProductionLine && newProductionLine.projectId) {
              console.log("新增产线的自增ID:", newProductionLine.projectId);
              // 可以在这里使用这个ID进行后续操作，如跳转等
              // currentProductionLineId.value = newProductionLine.projectId;
            }
          }
          
          productionLineDialogOpen.value = false;
          getProductionLineList();
        })
        .catch(err => {
          proxy.$modal.msgError((err.message || err) || (isUpdate ? "修改失败" : "新增失败"));
        });
    }
  });
}
    

/** 取消产线表单 */
function cancelProductionLineForm() {
  productionLineDialogOpen.value = false;
  proxy.resetForm("productionLineRef");
}

/** 删除产线 */
function handleProductionLineDelete(row) {
  const projectIds = row?.projectId ? [row.projectId] : productionLineIds.value;
  
  if (!projectIds.length) {
    proxy.$modal.msgWarning("请选择需要删除的产线");
    return;
  }
  
  proxy.$modal.confirm(`是否确认删除产线编号为"${projectIds.join(',')}"的数据？`)
    .then(() => {
      return delManagement(projectIds);
    })
    .then(() => {
      getProductionLineList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出产线 */
function handleProductionLineExport() {
  proxy.download('device/management/export', {
    ...productionLineQueryParams.value
  }, `management_${new Date().getTime()}.xlsx`);
}

// 2. 初始化store实例
const userStore = useUserStore();

// 3. 响应式存储当前用户角色（取第一个角色）
const currentUserRole = ref('');

// 4. 页面加载时获取角色
onMounted(async () => {
  // 若依框架中，登录后会自动调用getInfo，这里直接从store取角色
  const userRoles = userStore.roles || [];
  
  // 取第一个角色（若依角色是数组格式，如 ['admin', 'quoter']）
  currentUserRole.value = userRoles.length > 0 ? userRoles[0] : '';
  
  // （可选）如果角色为空，手动触发getInfo刷新（极端情况处理）
  if (!currentUserRole.value) {
    try {
      await userStore.getInfo(); // 调用store中的getInfo方法
      currentUserRole.value = userStore.roles.length > 0 ? userStore.roles[0] : '';
    } catch (err) {
      console.error('获取用户角色失败:', err);
    }
  }
  
  // 初始化项目列表
  getProjectList();
});


function canEnterSelection(row) {
  // 调试：打印当前角色和产线状态（方便定位问题）
  console.log('当前用户角色:', currentUserRole.value);
  console.log('当前产线报价状态:', row.isQuoted);

  // 1. 超级角色直接放行（admin/keda，处理字符串格式）
  const superRoles = ['admin', 'keda'];
  if (superRoles.includes(currentUserRole.value)) {
    return true;
  }

  // 2. 角色为空时拒绝（容错）
  if (!currentUserRole.value) {
    console.warn('用户角色为空，拒绝进入选型');
    return false;
  }

  // 3. 普通角色：按报价状态判断（处理字符串格式）
  if (row.isQuoted === 1) {
    // 已完成报价：仅 selector 角色可操作
    return currentUserRole.value === 'selector';
  } else if (row.isQuoted === 0) {
    // 未完成报价：仅 quoter 角色可操作
    return currentUserRole.value === 'quoter';
  }

  // 4. 异常状态（如 isQuoted 为 null/undefined）：默认无权限
  return false;
}

// 权限提示函数：返回无权限时的提示文本
function getSelectionTip(row) {
    // 超级角色无需提示
  const superRoles = ['admin', 'keda'];
  if (superRoles.includes(currentUserRole.value)) {
    return '';
  }
  if (row.isQuoted === 1) {
    return '当前产线报价已完成，仅「选型员」角色可进入选型';
  } else if (row.isQuoted === 0) {
    return '当前产线报价未完成，仅「报价员」角色可进入选型';
  }
  return '无权限进入选型';
}

// --------------------------- 产线模版相关方法 ---------------------------

// 产线设为模版按钮的tooltip提示（根据状态动态生成）
function getTemplateBtnTip(row) {
  // 情况1：已为模版
  if (row.projectStatus === 1) {
    return "当前产线已为选型模版，无需重复设置";
  }
  // 情况2：报价未完成
  if (row.isQuoted !== 1) {
    return "仅支持「报价已完成」的产线设为选型模版";
  }
  // 情况3：可正常设置
  return "将当前产线设置为选型模版";
}

/** 将产线设置为选型模版（projectStatus = 1） */
function setAsTemplate(row) {
  // 1. 基础校验：确保产线ID存在
  if (!row || !row.projectId) {
    proxy.$modal.msgWarning("请选择有效的产线记录");
    return;
  }

  // 2. 二次确认：避免误操作
  proxy.$modal.confirm(
    `确定要将「${row.projectName || '未命名产线'}」设置为选型模版吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info"
    }
  ).then(() => {
    // 3. 构造请求参数：仅传递必要字段（产线ID + 目标状态）
    const templateData = {
      projectId: row.projectId,
      projectStatus: 1,  // 1表示“项目模版”（与原有逻辑：0=正常 对应）
      // 若后端需要其他字段（如最后修改人），可补充（从store取当前用户）
      lastModifyUser: userStore.username || '系统用户'
    };

    // 4. 调用后端接口修改状态（复用updateManagement接口，需确保后端支持单独修改projectStatus）
    updateManagement(templateData)
      .then(() => {
        proxy.$modal.msgSuccess("设置选型模版成功！");
        // 5. 刷新产线列表，显示最新状态
        getProductionLineList();
      })
      .catch(err => {
        proxy.$modal.msgError(`设置失败：${err.message || '后端接口异常'}`);
      });
  }).catch(() => {
    // 取消操作时不做处理
  });
}

// 监听窗口大小变化，优化响应式显示
watchEffect(() => {
  window.addEventListener('resize', () => {
    // 当窗口大小改变时，不需要额外操作，computed属性isDesktop会自动更新
  });
});

// 页面初始化加载项目列表
onMounted(() => {
  getProjectList();
});
</script>

<style scoped lang="scss">
// 基础样式
.app-container {
  padding: 16px;
  box-sizing: border-box;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.view-container {
  background-color: #fff;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

// 动画效果
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 面包屑样式
.breadcrumb-custom {
  margin-bottom: 16px;
  
  .breadcrumb-item {
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      color: #1890ff;
    }
    
    &.active {
      color: #1890ff;
      font-weight: bold;
    }
  }
  
  .project-tag {
    vertical-align: middle;
  }
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
    
    .operation-btn {
      white-space: nowrap;
    }
  }
  
  .search-toggle {
    margin-left: auto;
  }
}

// 表格容器
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 16px;
  
  .data-table {
    width: 100%;
    min-width: 800px;
    
    .status-tag {
      padding: 2px 8px;
      font-size: 12px;
    }
    
    .table-action-btn {
      margin-right: 8px;
    }
  }
}

// 分页样式
.pagination-container {
  text-align: right;
  margin-top: 12px;
}

// 项目信息栏
.project-info-bar {
  margin-bottom: 16px;
  
  .project-info-descriptions {
    background-color: #f9fafb;
    
    .project-info-item {
      .project-name {
        font-weight: bold;
        color: #1890ff;
        margin-right: 16px;
      }
      
      .back-btn {
        vertical-align: middle;
        color: #1890ff;
      }
    }
  }
}

// 对话框样式
.custom-dialog {
  .dialog-form {
    margin-top: 12px;
    
    .disabled-input {
      background-color: #f5f7fa;
      color: #909399;
    }
    
    // 自定义默认提示样式
    .el-form-item__error--custom {
      position: static;
      margin-top: 4px;
      font-size: 12px;
      color: #666;
    }
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
  
  .view-container {
    padding: 12px 8px;
  }
  
  .operation-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    
    .operation-buttons {
      width: 100%;
      justify-content: flex-start;
    }
    
    .search-toggle {
      align-self: flex-end;
      margin-left: 0;
    }
  }
  
  .breadcrumb-custom {
    font-size: 12px;
    
    .project-tag {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .search-form {
    padding: 8px;
    
    .form-item-col {
      width: 100%;
    }
  }
}
</style>
