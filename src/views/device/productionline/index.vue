<template>
  <div class="app-container">
    <!-- 导航路径指示器 -->
    <el-breadcrumb separator="/" class="mb-4 breadcrumb-custom">
      <el-breadcrumb-item 
        @click="goToProjectManagement"
        class="breadcrumb-item"
      >
        项目管理
      </el-breadcrumb-item>
      <el-breadcrumb-item 
        class="breadcrumb-item active"
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

    <!-- 显示当前关联的项目信息 -->
    <div class="mb-4 project-info-bar">
      <el-descriptions column="1" border class="project-info-descriptions">
        <el-descriptions-item label="当前项目" class="project-info-item">
          <span class="project-name">{{ currentProjectName || `项目ID: ${currentProjectId}` }}</span>
          <el-button 
            type="text" 
            icon="ArrowLeft" 
            @click="goToProjectManagement" 
            class="back-btn"
          >返回项目列表</el-button>
          <el-button 
            type="text" 
            icon="User" 
            @click="handleViewMembers({mainProjectId: currentProjectId, projectName: currentProjectName})"
            class="members-btn"
          >
            查看项目成员
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 产线搜索表单 -->
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
          <el-form-item label="产线状态" prop="isQuoted">
            <el-select 
              v-model="productionLineQueryParams.isQuoted" 
              placeholder="请选择" 
              clearable
              class="form-input"
            >
              <el-option label="未报价" value="0"></el-option>
              <el-option label="报价完成" value="1"></el-option>
              <el-option label="选型完成" value="2"></el-option>
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
           <!-- 产线列表的操作列 -->
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
    
    <!-- 查看选型详情按钮 -->
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
    :disabled="scope.row.projectStatus === 1 || ![1, 2].includes(scope.row.isQuoted)" 
    v-hasPermi="['device:management:edit']"  
    class="table-action-btn"
  >
    {{ scope.row.projectStatus === 1 ? '已为模版' : '设为模版' }}
  </el-button>
</el-tooltip>
  </template>
</el-table-column>
        <el-table-column label="项目名称" align="center" prop="projectName" min-width="150" />
        <el-table-column label="备注" align="center" prop="remarks" min-width="150" />
        <el-table-column label="产线状态" align="center" prop="isQuoted" min-width="120">
          <template #default="scope">
            <el-tag 
              :type="getStatusTagType(scope.row.isQuoted)"
              class="status-tag"
            >
              {{ getStatusText(scope.row.isQuoted) }}
            </el-tag>
          </template>
        </el-table-column>
       
        <el-table-column label="最新操作人" align="center" prop="lastOperator" min-width="100" />
        <el-table-column label="最后修改时间" align="center" prop="lastModifyTime" min-width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastModifyTime) }}</span>
          </template>
        </el-table-column>
         <el-table-column label="创建人" align="center" prop="creator" min-width="100" />
         <el-table-column label="创建时间" align="center" prop="createTime" min-width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否为模板" align="center" prop="projectStatus" min-width="120">
          <template #default="scope">
            <el-tag 
              :type="scope.row.projectStatus === 0 ? 'primary' : 'warning'"
              class="status-tag"
            >
              {{ scope.row.projectStatus === 0 ? '正常' : '项目模版' }}
            </el-tag>
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
        
        <!-- 项目名称：用户必填 -->
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="productionLineForm.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        
        
        <!-- 复用模版选项 -->
        <el-form-item>
          <el-checkbox 
            v-model="useTemplate" 
            @change="handleTemplateChange"
            class="template-checkbox"
          >
            复用已有选型模版
          </el-checkbox>
        </el-form-item>
        
        <!-- 模版选择下拉框，仅当勾选复用模版时显示 -->
        <el-form-item 
          label="选择模版" 
          prop="templateId"
          v-if="useTemplate"
        >
          <el-select 
            v-model="productionLineForm.templateId" 
            placeholder="请选择要复用的选型模版"
            @change="handleTemplateSelect"
            clearable
            class="template-select"
          >
            <el-option 
              v-for="template in templateList" 
              :key="template.projectId" 
              :label="template.projectName" 
              :value="template.projectId"
            />
          </el-select>
        </el-form-item>
        
        <!-- 显示选中的模版信息 -->
        <el-form-item v-if="useTemplate && selectedTemplate">
          <div class="template-info">
            <p><strong>选中模版信息：</strong></p>
            <p>创建人：{{ selectedTemplate.creator || '-' }}</p>
            <p>最后修改时间：{{ parseTime(selectedTemplate.lastModifyTime) || '-' }}</p>
          </div>
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
        
        <!-- 隐藏的选型记录ID，用于存储从模版获取的值 -->
        <el-form-item label="选型记录ID" prop="recordId" class="hidden-field">
          <el-input 
            v-model="productionLineForm.recordId" 
            placeholder="关联的选型记录ID" 
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

    <!-- 查看项目成员对话框 -->
    <el-dialog 
      :title="`${currentViewProjectName || '项目'}成员列表`" 
      v-model="showViewMembersDialog" 
      width="500px"
      append-to-body
    >
    <el-table 
      :data="viewMembersList" 
      border
      size="small"
      class="members-table"
    >
      <el-table-column label="用户ID" prop="userId" width="100" />
      <el-table-column label="用户名" width="150">
        <template #default="scope">
          {{ scope.row.user_name || scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="角色" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.roleName === 'selector' ? 'info' : 'primary'">
            {{ scope.row.roleName === 'selector' ? '选型员' : '报价员' }}
          </el-tag>
        </template>
      </el-table-column>
          <el-table-column label="加入时间" prop="joinTime">
            <template #default="scope">
              {{ parseTime(scope.row.joinTime) }}
            </template>
          </el-table-column>
          <el-table-column 
            label="操作" 
            width="100"
            v-if="canManageMembers"
          >
            <template #default="scope">
              <el-button 
                link 
                type="danger" 
                size="small"
                @click="removeProjectMember(scope.row)"
                :disabled="scope.row.isCreator"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <template #footer>
          <el-button @click="showViewMembersDialog = false">关 闭</el-button>
        </template>
      </el-dialog>
  </div>
</template>

<script setup name="ProductionLineManagement">
import { ref, reactive, toRefs, onMounted, getCurrentInstance, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CopyDocument } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'

// 导入API
import { listManagement, getManagement, delManagement, addManagement, updateManagement } from "@/api/device/management"
import { listRelation, delRelation } from "@/api/device/relation"
import { listUser } from "@/api/system/user"

// 路由实例和当前路由
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()

// 获取用户存储实例
const userStore = useUserStore()

// 当前选中的项目信息
const currentProjectId = ref('')
const currentProjectName = ref('')

// 当前用户角色信息
const currentUserRole = ref('')

// 响应式判断是否为桌面端
const isDesktop = computed(() => {
  return window.innerWidth >= 768;
});

// 产线关联记录ID默认提示
const showRecordIdTip = ref(false)

// 模版相关
const templateList = ref([]) // 选型模版列表
const useTemplate = ref(false) // 是否复用模版
const selectedTemplate = ref(null) // 当前选中的模版

// 成员管理相关变量
const showViewMembersDialog = ref(false)
const currentViewProjectId = ref('')
const currentViewProjectName = ref('')
const viewMembersList = ref([])
const canManageMembers = ref(false)
const allAvailableUsers = ref([]) // 所有用户

// 产线管理相关数据
const productionLineList = ref([])
const productionLineLoading = ref(true)
const showProductionLineSearch = ref(true)
const productionLineIds = ref([])
const productionLineSingle = ref(true)
const productionLineMultiple = ref(true)
const productionLineTotal = ref(0)
const productionLineDialogOpen = ref(false)
const productionLineDialogTitle = ref('')

// 产线表单数据
const productionLineData = reactive({
  form: {
    projectId: null,
    mainProjectId: null,
    projectName: null,
    remarks: null,
    templateId: null,
    recordId: null,
    isQuoted: 0,  // 默认状态为未报价
    projectStatus: 0
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    mainProjectId: null,
    projectName: null,
    creator: null,
    isQuoted: null  // 支持0,1,2三种状态的筛选
  },
  rules: {
    projectName: [
      { required: true, message: "项目名称不能为空", trigger: "blur" }
    ],
    isQuoted: [
      { required: true, message: "请选择产线状态", trigger: "change" }
    ]
  }
})

const { form: productionLineForm, queryParams: productionLineQueryParams, rules: productionLineRules } = toRefs(productionLineData)

// 初始化页面并获取用户角色
onMounted(() => {
  console.log('开始初始化页面...')
  
  // 从路由参数获取项目信息
  currentProjectId.value = route.query.projectId || ''
  currentProjectName.value = route.query.projectName || ''
  
  // 初始化用户角色
  initUserRole()
  
  // 监听用户存储变化，实时更新角色信息
  watch(
    () => userStore.roles,
    (newRoles) => {
      console.log('用户角色变化:', newRoles)
      updateUserRole(newRoles)
      updateAdminPermission()
    },
    { immediate: true, deep: true }
  )
  
  // 其他初始化逻辑
  if (!currentProjectId.value) {
    proxy.$message.warning('未找到关联的项目信息，请从项目管理页面进入')
  } else {
    productionLineQueryParams.value.mainProjectId = currentProjectId.value
    productionLineForm.value.mainProjectId = currentProjectId.value
    getProductionLineList()
    getTemplateList()
  }
  
  getUserList()
})

// 初始化用户角色
function initUserRole() {
  updateUserRole(userStore.roles)
  updateAdminPermission()
}

// 更新用户角色
function updateUserRole(roles) {
  // 从roles数组中获取主要角色（根据实际业务逻辑调整）
  currentUserRole.value = roles && roles.length > 0 ? roles[0] : ''
  
  console.log('用户角色初始化结果:', {
    currentUserRole: currentUserRole.value,
    isSelector: currentUserRole.value === 'selector',
    isQuoter: currentUserRole.value === 'quoter',
    roles: roles
  })
}

// 更新管理员权限
function updateAdminPermission() {
  // 检查用户角色中是否包含管理员角色
  canManageMembers.value = userStore.roles && userStore.roles.some(role => role === 'admin')
}

// 产线列表相关方法
function getProductionLineList() {
  productionLineLoading.value = true
  listManagement(productionLineQueryParams.value).then(response => {
    productionLineList.value = response.rows
    productionLineTotal.value = response.total
    productionLineLoading.value = false
  }).catch(error => {
    console.error('获取产线列表失败:', error)
    productionLineLoading.value = false
  })
}

// 处理产线选择变化
function handleProductionLineSelectionChange(selection) {
  productionLineIds.value = selection.map(item => item.projectId)
  productionLineSingle.value = selection.length !== 1
  productionLineMultiple.value = !selection.length
}

// 重置产线查询
function resetProductionLineQuery() {
  const { productionLineQueryRef } = proxy.$refs
  if (productionLineQueryRef) {
    productionLineQueryRef.resetFields()
  }
  // 保留项目ID条件
  productionLineQueryParams.value.mainProjectId = currentProjectId.value
  getProductionLineList()
}

// 获取选型模版列表
function getTemplateList() {
  const params = {
    pageNum: 1,
    pageSize: 100,
    projectStatus: 1 // 只查询状态为模版的项目
  }
  listManagement(params).then(response => {
    templateList.value = response.rows
  }).catch(error => {
    console.error('获取模版列表失败:', error)
  })
}

// 处理模版选择变化
function handleTemplateChange(checked) {
  useTemplate.value = checked
  if (!checked) {
    productionLineForm.value.templateId = null
    productionLineForm.value.recordId = null
    selectedTemplate.value = null
  }
}

// 处理模版选择
function handleTemplateSelect(templateId) {
  if (!templateId) {
    selectedTemplate.value = null
    productionLineForm.value.recordId = null
    return
  }
  
  const template = templateList.value.find(item => item.projectId === templateId)
  if (template) {
    selectedTemplate.value = template
    productionLineForm.value.recordId = template.recordId
  }
}

// 根据状态值获取状态文本
function getStatusText(status) {
  switch(Number(status)) {
    case 0: return '未报价'
    case 1: return '报价完成'
    case 2: return '选型完成'
    default: return '未知状态'
  }
}

// 根据状态值获取标签类型
function getStatusTagType(status) {
  switch(Number(status)) {
    case 0: return 'info'      // 未报价 - 蓝色
    case 1: return 'success'   // 报价完成 - 绿色
    case 2: return 'warning'   // 选型完成 - 黄色
    default: return 'default'
  }
}

// 获取选型提示信息
function getSelectionTip(row) {
  const status = Number(row.isQuoted)
  
  if (status === 0) {
    return currentUserRole.value === 'selector' 
      ? '未报价状态下，选型员不可进入选型' 
      : ''
  } else if (status === 1) {
    return currentUserRole.value === 'quoter' 
      ? '报价完成状态下，报价员不可进入选型' 
      : ''
  } else if (status === 2) {
    return '选型已完成，所有人不可进入'
  }
  
  return ''
}

// 权限判断函数（带详细日志）
function canEnterSelection(row) {
  const status = Number(row.isQuoted)
  
  console.log('权限判断详情:', {
    rowId: row.projectId,
    rowName: row.projectName,
    status: status,
    statusText: getStatusText(status),
    currentUserRole: currentUserRole.value,
    isSelector: currentUserRole.value === 'selector',
    isQuoter: currentUserRole.value === 'quoter'
  })

  // 状态为2（选型完成）时，所有人都不可进入
  if (status === 2) {
    console.log(`项目 ${row.projectId} 选型已完成，禁止进入`)
    return false
  }

  // 状态为0（未报价）时，selector不可进入
  if (status === 0) {
    const result = currentUserRole.value !== 'selector'
    console.log(`项目 ${row.projectId} 未报价状态，${currentUserRole.value} ${result ? '允许' : '禁止'}进入`)
    return result
  }

  // 状态为1（报价完成）时，quoter不可进入
  if (status === 1) {
    const result = currentUserRole.value !== 'quoter'
    console.log(`项目 ${row.projectId} 报价完成状态，${currentUserRole.value} ${result ? '允许' : '禁止'}进入`)
    return result
  }

  // 未知状态
  console.log(`项目 ${row.projectId} 未知状态(${status})，默认禁止进入`)
  return false
}

// 进入选型页面
function goToSelectionPage(row) {
  if (!canEnterSelection(row)) return
  
  router.push({
    path: 'DeviceSearch/DeviceSearch/DeviceSearch',
    query: {
      productionLineId: row.projectId,
      recordId: row.recordId,
      status:row.isQuoted

    }
  })
}

// 查看选型详情
function goToSelectionDetail(row) {
  if (!row.recordId || row.recordId === 0) return
  
   router.push({
    path: '/selectDevice/selectionDetail',  
    query: {
      recordId: row.recordId,
      productionLineId: row.projectId,
      productionLineName: row.projectName
    }
  })
}

// 获取设为模版按钮提示
function getTemplateBtnTip(row) {
  if (row.projectStatus === 1) {
    return '已设为模版'
  }
  if (![1, 2].includes(row.isQuoted)) {
    return '只有报价完成或选型完成的产线才能设为模版'
  }
  return ''
}

// 设置为模版
function setAsTemplate(row) {
  if (row.projectStatus === 1) return
  
  if (![1, 2].includes(row.isQuoted)) {
    proxy.$message.warning('只有报价完成或选型完成的产线才能设为模版')
    return
  }
  
  const updateData = {
    projectId: row.projectId,
    projectStatus: 1 // 设置为模版状态
  }
  
  updateManagement(updateData).then(response => {
    proxy.$message.success('设置为模版成功')
    getProductionLineList()
  }).catch(error => {
    console.error('设置为模版失败:', error)
    proxy.$message.error('设置为模版失败')
  })
}

// 跳转到项目管理页面
function goToProjectManagement() {
  router.push('project');
}

// 获取用户列表
function getUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then(response => {
    allAvailableUsers.value = response.rows;
  }).catch(error => {
    console.error('获取用户列表失败:', error);
  });
}

// 查看项目成员
function handleViewMembers(row) {
  if (!row || !row.mainProjectId) {
    proxy.$message.error('无法获取项目信息，请刷新页面重试');
    return;
  }
  
  currentViewProjectId.value = row.mainProjectId
  currentViewProjectName.value = row.projectName || '未知项目'
  
  viewMembersList.value = [];
  
  listRelation({ mainProjectId: row.mainProjectId }).then(response => {
    const relations = response.rows;
    
    const membersWithRoles = relations.map(relation => {
      const userInfo = allAvailableUsers.value.find(user => user.userId === relation.userId);
      
      return {
        ...relation,
        roleName: userInfo ? userInfo.remark : 'unknown',
        userName: userInfo ? (userInfo.user_name || userInfo.userName) : '未知用户'
      };
    });
    
    viewMembersList.value = membersWithRoles;
    showViewMembersDialog.value = true;
  }).catch(error => {
    console.error('获取项目成员失败:', error)
  })
}

// 移除项目成员
function removeProjectMember(member) {
  const projectId = currentViewProjectId.value;
  if (!projectId) {
    proxy.$message.error('无法获取项目信息，操作失败');
    return;
  }
  
  proxy.$confirm(`确定要移除成员 ${member.userName || '未知用户'} 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    viewMembersList.value = viewMembersList.value.filter(m => m.userId !== member.userId)
    
    delRelation({ 
      mainProjectId: projectId, 
      userId: member.userId 
    }).then(() => {
      proxy.$message.success('移除成员成功');
    }).catch(error => {
      console.error('移除成员失败:', error);
      proxy.$message.error('移除成员失败');
    })
  }).catch(() => {
    // 取消移除
  })
}

// 产线新增/编辑相关方法
function handleProductionLineAdd() {
  productionLineDialogTitle.value = '添加产线'
  productionLineForm.value.projectId = null
  productionLineForm.value.mainProjectId = currentProjectId.value
  productionLineForm.value.projectName = null
  productionLineForm.value.remarks = null
  productionLineForm.value.templateId = null
  productionLineForm.value.recordId = null
  productionLineForm.value.isQuoted = 0
  productionLineForm.value.projectStatus = 0
  
  useTemplate.value = false
  selectedTemplate.value = null
  
  productionLineDialogOpen.value = true
}

function handleProductionLineUpdate(row) {
  productionLineDialogTitle.value = '修改产线'
  productionLineForm.value.projectId = row.projectId
  productionLineForm.value.mainProjectId = row.mainProjectId
  productionLineForm.value.projectName = row.projectName
  productionLineForm.value.remarks = row.remarks
  productionLineForm.value.templateId = null
  productionLineForm.value.recordId = row.recordId
  productionLineForm.value.isQuoted = row.isQuoted
  productionLineForm.value.projectStatus = row.projectStatus
  
  useTemplate.value = false
  selectedTemplate.value = null
  
  productionLineDialogOpen.value = true
}

function submitProductionLineForm() {
  proxy.$refs.productionLineRef.validate(valid => {
    if (valid) {
      if (productionLineForm.value.projectId) {
        // 修改产线
        updateManagement(productionLineForm.value).then(response => {
          proxy.$message.success('修改产线成功')
          productionLineDialogOpen.value = false
          getProductionLineList()
        }).catch(error => {
          console.error('修改产线失败:', error)
          proxy.$message.error('修改产线失败')
        })
      } else {
        // 新增产线
        addManagement(productionLineForm.value).then(response => {
          proxy.$message.success('新增产线成功')
          productionLineDialogOpen.value = false
          getProductionLineList()
        }).catch(error => {
          console.error('新增产线失败:', error)
          proxy.$message.error('新增产线失败')
        })
      }
    }
  })
}

function cancelProductionLineForm() {
  productionLineDialogOpen.value = false
}

// 删除产线
function handleProductionLineDelete(row) {
  const ids = row ? [row.projectId] : productionLineIds.value
  if (!ids || ids.length === 0) {
    proxy.$message.warning('请选择要删除的产线')
    return
  }
  
  proxy.$confirm(`确定要删除选中的 ${ids.length} 个产线吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delManagement(ids).then(response => {
      proxy.$message.success('删除成功')
      getProductionLineList()
    }).catch(error => {
      console.error('删除产线失败:', error)
      proxy.$message.error('删除失败')
    })
  }).catch(() => {
    // 取消删除
  })
}

// 导出产线
function handleProductionLineExport() {
  proxy.$confirm('确定要导出所有产线数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    window.open(`/device/management/export?${new URLSearchParams(productionLineQueryParams.value).toString()}`)
  }).catch(() => {
    // 取消导出
  })
}

// 时间格式化函数
function parseTime(time, pattern) {
  if (!time) return ''
  const d = new Date(time)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const hour = d.getHours().toString().padStart(2, '0')
  const minute = d.getMinutes().toString().padStart(2, '0')
  const second = d.getSeconds().toString().padStart(2, '0')
  
  if (pattern === 'date') {
    return `${year}-${month}-${day}`
  }
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.breadcrumb-custom {
  background-color: #f5f7fa;
  padding: 10px 15px;
  border-radius: 4px;
}

.breadcrumb-item {
  cursor: pointer;
}

.breadcrumb-item.active {
  color: #409eff;
  font-weight: bold;
}

.search-form {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.search-form-row {
  margin-bottom: 10px;
}

.form-item-col {
  margin-bottom: 10px;
}

.form-actions-col {
  display: flex;
  align-items: flex-end;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.operation-buttons {
  display: flex;
  gap: 10px;
}

.operation-btn {
  margin-right: 5px;
}

.table-container {
  margin-bottom: 15px;
}

.data-table {
  width: 100%;
}

.status-tag {
  padding: 2px 8px;
  font-size: 12px;
}

.table-action-btn {
  margin-right: 5px;
  padding: 0 5px;
}

.pagination-container {
  text-align: right;
  margin-top: 10px;
}

.custom-dialog .el-dialog__body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.dialog-form {
  margin-top: 10px;
}

.hidden-field {
  display: none;
}

.members-table {
  width: 100%;
}

.project-info-bar {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
}

.project-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name {
  font-weight: bold;
  color: #1f2329;
}

.back-btn, .members-btn {
  margin-left: 10px;
}

.template-info {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}

.template-info p {
  margin: 5px 0;
}

.disabled-input {
  background-color: #f5f7fa;
}

.template-checkbox {
  margin-bottom: 10px;
}
</style>
