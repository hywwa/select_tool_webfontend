<template>
  <div class="app-container">
    <!-- 切换视图的标签页 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="mb-4">
      <el-tab-pane label="选型模版列表" name="templates"></el-tab-pane>
      <el-tab-pane label="项目列表" name="projects"></el-tab-pane>
    </el-tabs>

    <!-- 模版列表视图 -->
    <template v-if="activeTab === 'templates'">
      <!-- 模版搜索表单 -->
      <el-form 
        :model="templateQueryParams" 
        ref="templateQueryRef" 
        :inline="true" 
        v-show="showTemplateSearch" 
        label-width="120px"
      >
        <el-form-item label="模版名称" prop="projectName">
          <el-input
            v-model="templateQueryParams.projectName"
            placeholder="请输入模版名称"
            clearable
            @keyup.enter="getTemplateList"
          />
        </el-form-item>
        
        <el-form-item label="创建人" prop="creator">
          <el-input
            v-model="templateQueryParams.creator"
            placeholder="请输入创建人"
            clearable
            @keyup.enter="getTemplateList"
          />
        </el-form-item>
        
        <el-form-item label="最后修改时间" prop="lastModifyTime">
          <el-date-picker clearable
            v-model="templateQueryParams.lastModifyTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择最后修改时间">
          </el-date-picker>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getTemplateList">搜索</el-button>
          <el-button icon="Refresh" @click="resetTemplateQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="2">
        </el-col>
        
        <right-toolbar v-model:showSearch="showTemplateSearch" @queryTable="getTemplateList"></right-toolbar>
      </el-row>

      <!-- 模版表格 -->
      <el-table 
        v-loading="templateLoading" 
        :data="templateList" 
        @selection-change="handleTemplateSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="projectId" />
        <el-table-column label="关联的选型记录ID" align="center" prop="recordId" />
        <el-table-column label="模版名称" align="center" prop="projectName" />
        <el-table-column label="创建人" align="center" prop="creator" />
        <el-table-column label="最后修改时间" align="center" prop="lastModifyTime" width="220">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastModifyTime, '{y}-{m}-{d} {h}:{i}:{s}') || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最新操作人" align="center" prop="lastOperator">
          <template #default="scope">
            <span>{{ scope.row.lastOperator || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remarks">
          <template #default="scope">
            <span>{{ scope.row.remarks || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="projectStatus">
          <template #default="scope">
            <el-tag type="warning">项目模版</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="240">
          <template #default="scope">
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
            
            <el-button 
              link 
              type="info" 
              icon="DeleteDocument" 
              @click="handleCancelAsTemplate(scope.row)" 
              v-hasPermi="['device:records:query']"
              class="table-action-btn"
            >
              取消模版
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination
        v-show="templateTotal>0"
        :total="templateTotal"
        v-model:page="templateQueryParams.pageNum"
        v-model:limit="templateQueryParams.pageSize"
        @pagination="getTemplateList"
      />
    </template>

    <!-- 项目列表视图 -->
    <template v-if="activeTab === 'projects'">
      <!-- 项目搜索表单 -->
      <el-form 
        :model="projectQueryParams" 
        ref="projectQueryRef" 
        :inline="true" 
        v-show="showProjectSearch" 
        label-width="120px"
      >
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="projectQueryParams.projectName"
            placeholder="请输入项目名称"
            clearable
            @keyup.enter="getProjectList"
          />
        </el-form-item>
        
        <el-form-item label="创建人" prop="creator">
          <el-input
            v-model="projectQueryParams.creator"
            placeholder="请输入创建人"
            clearable
            @keyup.enter="getProjectList"
          />
        </el-form-item>
        
        <el-form-item label="最后修改时间" prop="lastModifyTime">
          <el-date-picker clearable
            v-model="projectQueryParams.lastModifyTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择最后修改时间">
          </el-date-picker>
        </el-form-item>
        
        <el-form-item label="是否报价完成" prop="isQuoted">
          <el-select v-model="projectQueryParams.isQuoted" placeholder="请选择" clearable>
            <el-option label="未完成" value="0"></el-option>
            <el-option label="已完成" value="1"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getProjectList">搜索</el-button>
          <el-button icon="Refresh" @click="resetProjectQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="3">
          <el-button
            type="warning"
            plain
            icon="CopyDocument"
            :disabled="!canSetAsTemplate"
            @click="handleSetAsTemplate"
            v-hasPermi="['device:records:query']"
          >设为模版</el-button>
          
          <el-button
            type="info"
            plain
            icon="DeleteDocument"
            :disabled="!canCancelAsTemplate"
            @click="handleCancelProjectAsTemplate"
            v-hasPermi="['device:records:query']"
            class="ml-2"
          >取消模版</el-button>
        </el-col>
        
        <right-toolbar v-model:showSearch="showProjectSearch" @queryTable="getProjectList"></right-toolbar>
      </el-row>

      <!-- 项目表格 -->
      <el-table 
        v-loading="projectLoading" 
        :data="projectList" 
        @selection-change="handleProjectSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="projectId" />
        <el-table-column label="关联的选型记录ID" align="center" prop="recordId" />
        <el-table-column label="项目名称" align="center" prop="projectName" />
        <el-table-column label="创建人" align="center" prop="creator" />
        <el-table-column label="最后修改时间" align="center" prop="lastModifyTime" width="220">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastModifyTime, '{y}-{m}-{d} {h}:{i}:{s}') || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最新操作人" align="center" prop="lastOperator">
          <template #default="scope">
            <span>{{ scope.row.lastOperator || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remarks">
          <template #default="scope">
            <span>{{ scope.row.remarks || '-' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="是否报价完成" align="center" prop="isQuoted">
          <template #default="scope">
            <el-tag :type="scope.row.isQuoted === 1 ? 'success' : 'info'">
              {{ scope.row.isQuoted === 1 ? '已完成' : '未完成' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" align="center" prop="projectStatus">
          <template #default="scope">
            <el-tag :type="scope.row.projectStatus === 0 ? 'primary' : 'warning'">
              {{ scope.row.projectStatus === 0 ? '正常项目' : '项目模版' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="240">
          <template #default="scope">
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
            
            <el-button 
              link 
              type="warning" 
              icon="CopyDocument" 
              @click="handleSetAsTemplate(scope.row)" 
              v-hasPermi="['device:records:query']"
              v-if="scope.row.projectStatus === 0"
              class="table-action-btn"
            >
              设为模版
            </el-button>
            
            <el-button 
              link 
              type="info" 
              icon="DeleteDocument" 
              @click="handleCancelProjectAsTemplate(scope.row)" 
              v-hasPermi="['device:records:query']"
              v-if="scope.row.projectStatus === 1"
              class="table-action-btn"
            >
              取消模版
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination
        v-show="projectTotal>0"
        :total="projectTotal"
        v-model:page="projectQueryParams.pageNum"
        v-model:limit="projectQueryParams.pageSize"
        @pagination="getProjectList"
      />
      
      <!-- 空状态提示 -->
      <div v-if="!projectLoading && projectList.length === 0" class="empty-state">
        <el-empty description="暂无项目数据，请检查查询条件或新增项目"></el-empty>
      </div>
    </template>

    <!-- 添加/编辑对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogOpen" 
      width="500px" 
      append-to-body
    >
      <el-form 
        ref="formRef" 
        :model="formData" 
        :rules="formRules" 
        label-width="120px"
      >
        <el-form-item label="关联的选型记录ID" prop="recordId">
          <el-input 
            v-model="formData.recordId" 
            placeholder="请输入关联的选型记录ID" 
          />
        </el-form-item>
        
        <el-form-item label="名称" prop="projectName">
          <el-input 
            v-model="formData.projectName" 
            placeholder="请输入{{ activeTab === 'projects' ? '项目' : '模版' }}名称" 
          />
        </el-form-item>
        
        <el-form-item label="创建人" prop="creator">
          <el-input 
            v-model="formData.creator" 
            placeholder="请输入创建人" 
          />
        </el-form-item>
        
        <el-form-item label="最后修改时间" prop="lastModifyTime">
          <el-date-picker clearable
            v-model="formData.lastModifyTime"
            type="datetime"  
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择最后修改时间">
          </el-date-picker>
        </el-form-item>
        
        <el-form-item label="最新操作人" prop="lastOperator">
          <el-input 
            v-model="formData.lastOperator" 
            placeholder="请输入最新操作人" 
          />
        </el-form-item>
        
        <el-form-item label="备注" prop="remarks">
          <el-input 
            v-model="formData.remarks" 
            type="textarea" 
            placeholder="请输入内容" 
          />
        </el-form-item>
        
        <!-- 项目视图显示是否报价完成 -->
        <el-form-item 
          label="是否报价完成" 
          prop="isQuoted"
          v-show="activeTab === 'projects'"
        >
          <el-select v-model="formData.isQuoted" placeholder="请选择">
            <el-option label="未完成" value="0"></el-option>
            <el-option label="已完成" value="1"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="projectStatus" v-show="activeTab === 'projects'">
          <el-select v-model="formData.projectStatus" placeholder="请选择">
            <el-option label="正常项目" value="0"></el-option>
            <el-option label="项目模版" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancelForm">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="TemplateManagement">
import { listManagement, updateManagement } from "@/api/device/management"
import { useRouter } from 'vue-router'
import { onMounted, ref, reactive, watch } from 'vue'
import useUserStore from '@/store/modules/user'

const router = useRouter()
const { proxy } = getCurrentInstance()
const userStore = useUserStore()

// 时间格式化函数 - 支持秒
const parseTime = (time, format = '{y}-{m}-{d} {h}:{i}:{s}') => {
  if (!time) return '';
  try {
    // 处理不同格式的时间字符串
    const date = new Date(time.replace(/-/g, '/'));
    if (isNaN(date.getTime())) {
      return time; // 无法解析时返回原始值
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');  // 小时
    const minutes = String(date.getMinutes()).padStart(2, '0');  // 分钟
    const seconds = String(date.getSeconds()).padStart(2, '0');  // 秒
    return format.replace('{y}', year)
                 .replace('{m}', month)
                 .replace('{d}', day)
                 .replace('{h}', hours)
                 .replace('{i}', minutes)
                 .replace('{s}', seconds);
  } catch (error) {
    console.error('时间格式化失败:', error);
    return time; // 出错时返回原始值
  }
};

// 视图切换相关 - 默认显示模版列表
const activeTab = ref('templates')

// 模版列表相关数据
const templateList = ref([])
const templateLoading = ref(false)
const showTemplateSearch = ref(true)
const templateIds = ref([])
const templateTotal = ref(0)

// 项目列表相关数据
const projectList = ref([])
const projectLoading = ref(false)
const showProjectSearch = ref(true)
const projectIds = ref([])
const projectTotal = ref(0)

// 按钮状态控制
const canSetAsTemplate = ref(false)
const canCancelAsTemplate = ref(false)

// 对话框相关
const dialogOpen = ref(false)
const dialogTitle = ref("")
const formData = ref({})

// 表单验证规则
const formRules = reactive({
  recordId: [
    { required: true, message: "关联的选型记录ID不能为空", trigger: "blur" }
  ],
  projectName: [
    { required: true, message: "名称不能为空", trigger: "blur" }
  ],
  creator: [
    { required: true, message: "创建人不能为空", trigger: "blur" }
  ],
  isQuoted: [
    { required: true, message: "是否报价完成不能为空", trigger: "change" }
  ],
  projectStatus: [
    { required: true, message: "状态不能为空", trigger: "change" }
  ]
})

// 模版查询参数
const templateQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  recordId: null,
  projectName: null,
  creator: null,
  lastModifyTime: null,
  lastOperator: null,
  remarks: null,
  projectStatus: 1  // 固定查询模版
})

// 项目查询参数
const projectQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  recordId: null,
  projectName: null,
  creator: null,
  lastModifyTime: null,
  lastOperator: null,
  remarks: null,
  isQuoted: null,
  projectStatus: 0  // 固定查询正常项目
})

// 监听项目选中项变化，控制按钮状态
watch(projectIds, (newVal) => {
  if (newVal.length === 0) {
    canSetAsTemplate.value = false
    canCancelAsTemplate.value = false
    return
  }
  
  // 检查所有选中项目的状态
  const selectedProjects = projectList.value.filter(item => newVal.includes(item.projectId))
  const allNormal = selectedProjects.every(item => item.projectStatus === 0)
  const allTemplates = selectedProjects.every(item => item.projectStatus === 1)
  
  canSetAsTemplate.value = allNormal
  canCancelAsTemplate.value = allTemplates
})

// 标签页切换时加载对应数据
function handleTabChange(tabName) {
  activeTab.value = tabName
  if (tabName === 'templates') {
    templateLoading.value = true
    getTemplateList()
  } else {
    projectLoading.value = true
    getProjectList()
  }
}

/** 查询模版列表 */
function getTemplateList() {
  templateLoading.value = true
  listManagement(templateQueryParams).then(response => {
    console.log("模版接口返回:", response)
    templateList.value = response.rows || []
    templateTotal.value = response.total || 0
    templateLoading.value = false
  }).catch(error => {
    console.error("模版列表加载失败:", error)
    templateList.value = []
    templateTotal.value = 0
    templateLoading.value = false
    proxy.$modal.error("模版列表加载失败，请重试")
  })
}

/** 查询项目列表 */
function getProjectList() {
  projectLoading.value = true
  listManagement(projectQueryParams).then(response => {
    console.log("项目接口返回:", response)
    projectList.value = response.rows || []
    projectTotal.value = response.total || 0
    projectLoading.value = false
  }).catch(error => {
    console.error("项目列表加载失败:", error)
    projectList.value = []
    projectTotal.value = 0
    projectLoading.value = false
    proxy.$modal.error("项目列表加载失败，请重试")
  })
}

/** 模版搜索按钮操作 */
function handleTemplateQuery() {
  templateQueryParams.pageNum = 1
  getTemplateList()
}

/** 项目搜索按钮操作 */
function handleProjectQuery() {
  projectQueryParams.pageNum = 1
  getProjectList()
}

/** 重置模版查询 */
function resetTemplateQuery() {
  if (proxy.$refs["templateQueryRef"]) {
    proxy.resetForm("templateQueryRef")
  }
  templateQueryParams.projectStatus = 1
  handleTemplateQuery()
}

/** 重置项目查询 */
function resetProjectQuery() {
  if (proxy.$refs["projectQueryRef"]) {
    proxy.resetForm("projectQueryRef")
  }
  projectQueryParams.projectStatus = 0
  handleProjectQuery()
}

/** 模版表格选中变化 */
function handleTemplateSelectionChange(selection) {
  templateIds.value = selection.map(item => item.projectId)
}

/** 项目表格选中变化 */
function handleProjectSelectionChange(selection) {
  projectIds.value = selection.map(item => item.projectId)
}


/** 表单重置 */
function resetForm() {
  formData.value = {
    projectId: null,
    recordId: null,
    projectName: null,
    creator: null,
    createTime: null,
    lastModifyTime: null,
    lastOperator: null,
    remarks: null,
    isQuoted: null,
    projectStatus: activeTab.value === 'projects' ? 0 : 1
  }
  if (proxy.$refs["formRef"]) {
    proxy.resetForm("formRef")
  }
}

/** 取消表单 */
function cancelForm() {
  dialogOpen.value = false
  resetForm()
}

/** 提交表单 */
function submitForm() {
  proxy.$refs["formRef"].validate(valid => {
    if (valid) {
      if (formData.value.projectId != null) {
        // 修改操作调用更新接口
        updateManagement(formData.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          dialogOpen.value = false
          activeTab.value === 'templates' ? getTemplateList() : getProjectList()
        }).catch(error => {
          console.error("修改失败:", error)
          proxy.$modal.error("修改失败，请重试")
        })
      } else {
        formData.value.projectStatus = activeTab.value === 'templates' ? 1 : 0
        // 实际项目中补充add接口调用
        proxy.$modal.msgSuccess(`${activeTab.value === 'templates' ? '新增模版' : '新增项目'}成功`)
        dialogOpen.value = false
        activeTab.value === 'templates' ? getTemplateList() : getProjectList()
      }
    }
  })
}

/** 设为模版（projectStatus: 0 → 1） */
function handleSetAsTemplate(row) {
  const projectIds = row ? [row.projectId] : projectIds.value;
  if (projectIds.length === 0) return;

  proxy.$modal.confirm(`是否确认将选中的 ${projectIds.length} 个项目设为模版？`).then(async () => {
    try {
      // 显示加载状态
      projectLoading.value = true;
      
      // 批量更新：循环调用接口
      const updatePromises = projectIds.map(id => 
        updateManagement({
          projectId: id,
          projectStatus: 1  // 设为模版
        })
      );
      await Promise.all(updatePromises);
      
      proxy.$modal.msgSuccess("设为模版成功");
      getProjectList(); // 刷新列表
    } catch (error) {
      console.error("设为模版失败:", error);
      proxy.$modal.error("设为模版失败，请重试");
    } finally {
      projectLoading.value = false;
    }
  }).catch(() => {});
}

/** 取消项目中的模版状态（projectStatus: 1 → 0） */
function handleCancelProjectAsTemplate(row) {
  const projectIds = row ? [row.projectId] : projectIds.value;
  if (projectIds.length === 0) return;
  
  proxy.$modal.confirm(`是否确认取消选中的 ${projectIds.length} 个项目的模版状态？`).then(async () => {
    try {
      // 显示加载状态
      projectLoading.value = true;
      
      // 批量更新：循环调用接口
      const updatePromises = projectIds.map(id => 
        updateManagement({
          projectId: id,
          projectStatus: 0  // 设为正常项目
        })
      );
      await Promise.all(updatePromises);
      
      proxy.$modal.msgSuccess("取消模版成功");
      getProjectList(); // 刷新列表
    } catch (error) {
      console.error("取消模版失败:", error);
      proxy.$modal.error("取消模版失败，请重试");
    } finally {
      projectLoading.value = false;
    }
  }).catch(() => {});
}

/** 取消模版列表中的模版状态（projectStatus: 1 → 0） */
function handleCancelAsTemplate(row) {
  const templateId = row.projectId;
  
  proxy.$modal.confirm(`是否确认取消该模版的模版状态？`).then(async () => {
    try {
      // 显示加载状态
      templateLoading.value = true;
      
      // 调用更新接口
      await updateManagement({
        projectId: templateId,
        projectStatus: 0  // 设为正常项目
      });
      
      proxy.$modal.msgSuccess("取消模版成功");
      getTemplateList(); // 刷新列表
    } catch (error) {
      console.error("取消模版失败:", error);
      proxy.$modal.error("取消模版失败，请重试");
    } finally {
      templateLoading.value = false;
    }
  }).catch(() => {});
}

/** 跳转到选型详情页面 */
function goToSelectionDetail(row) {
  if (!row || !row.recordId || row.recordId === 0) {
    proxy.$modal.msgWarning("该记录没有关联的选型记录");
    return;
  }
  
  // 保存当前记录信息
  const currentId = row.projectId;
  const currentName = row.projectName || '';
  
  // 跳转到选型详情页面，参考项目管理的跳转逻辑
  router.push({
    path: '/selectDevice/selectionDetail',  // 与项目管理保持一致的详情页路由
    query: {
      recordId: row.recordId,
      productionLineId: currentId,
      productionLineName: currentName
    }
  });
}

/** 页面加载时初始化数据 */
onMounted(() => {
  getTemplateList()
})
</script>

<style scoped>
.empty-state {
  margin: 20px 0;
  text-align: center;
}

.table-action-btn {
  margin-right: 8px;
}
</style>
