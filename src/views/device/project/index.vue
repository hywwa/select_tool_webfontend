<template>
  <div class="app-container">
    <!-- 导航路径指示器 -->
    <el-breadcrumb separator="/" class="mb-4 breadcrumb-custom">
      <el-breadcrumb-item 
        class="breadcrumb-item active"
      >
        项目管理
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 项目分类切换选项卡 -->
    <el-tabs v-model="activeProjectTab" @tab-change="handleProjectTabChange" class="project-tabs mb-4">
      <el-tab-pane label="我的项目" name="myProjects"></el-tab-pane>
      <el-tab-pane label="全部项目" name="allProjects"></el-tab-pane>
    </el-tabs>

    <!-- 项目搜索表单 -->
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
          <el-form-item label="项目状态" prop="projectStatus">
            <el-select
              v-model="projectQueryParams.projectStatus"
              placeholder="请选择项目状态"
              clearable
              class="form-input"
            >
              <el-option label="进行中" value="1"></el-option>
              <el-option label="已完成" value="2"></el-option>
              <el-option label="已取消" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="form-item-col">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="projectQueryParams.createTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择创建时间"
              clearable
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

     <!-- 项目操作按钮 -->
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
          @click="goToProductionLineManagement"
          v-hasPermi="['device:management:query']"
          class="operation-btn"
        >管理产线</el-button>
     <el-button
  type="primary"
  icon="User"
  :disabled="projectSingle"
  @click="handleManageMembers(selectedProject)"
  class="operation-btn"
>管理成员</el-button>
      </div>
      <right-toolbar 
        v-model:showSearch="showProjectSearch" 
        @queryTable="getProjectList"
        class="search-toggle"
      ></right-toolbar>
    </div>

    <!-- 项目列表 -->
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
              icon="User" 
              @click="handleManageMembers(scope.row)" 
              class="table-action-btn"
            >成员</el-button>
            <el-button 
              link 
              type="primary" 
              icon="Setting" 
              @click="goToProductionLineManagement(scope.row)" 
              v-hasPermi="['device:management:query']"
              class="table-action-btn"
            >管理产线</el-button>
          </template>
        </el-table-column>
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
        <el-table-column label="成员数量" align="center" min-width="100">
  <template #default="scope">
    <el-button 
      link 
      type="primary" 
      @click="handleViewMembers(scope.row)"
      class="member-count-btn"
    >
      {{ getMemberCount(scope.row.mainProjectId) || 0 }}人
    </el-button>
  </template>
</el-table-column>
 <el-table-column label="最后修改人" align="center" prop="lastModifyUser" min-width="100" />
        <el-table-column label="最后修改时间" align="center" prop="lastModifyTime" min-width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastModifyTime) }}</span>
          </template>
        </el-table-column>
         <el-table-column label="创建人" align="center" prop="createUser" min-width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" min-width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
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
  width="600px" 
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

    <!-- 项目成员邀请区域 -->
    <el-form-item label="项目成员" prop="members">
      <div class="member-section">
        <el-button 
          type="primary" 
          plain 
          size="small" 
          @click="showInviteMembersDialog = true"
          class="invite-btn"
        >
          <el-icon><UserPlus /></el-icon> 邀请成员
        </el-button>
        
        <div v-if="projectForm.mainProjectId || projectDialogTitle === '添加项目'" class="member-list">
          <template v-if="projectMembers.length > 0">
            <div class="member-tags"> 
              <el-tag 
                v-for="member in projectMembers" 
                :key="member.userId" 
                closable 
                :disable-transitions="false"
                @close="removeProjectMember(member)"
                effect="light"
              >
                {{ member.userName || member.user_name }}
              </el-tag>
            </div>
          </template>
          <template v-else>
            <div class="no-members">暂无成员，请点击"邀请成员"按钮添加</div>
          </template>
        </div>
      </div>
    </el-form-item>
  </el-form>
  <template #footer>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitProjectForm">确 定</el-button>
      <el-button @click="cancelProjectForm">取 消</el-button>
    </div>
  </template>
</el-dialog>

<!-- 邀请成员对话框 -->
<el-dialog 
  title="邀请成员加入项目" 
  v-model="showInviteMembersDialog" 
  width="500px"
  append-to-body
  :close-on-click-modal="false"
>
  <el-form 
    ref="inviteMembersRef" 
    :model="inviteMembersForm" 
    label-width="80px"
    class="dialog-form"
  >
    <el-form-item label="选择成员">
      <el-select
        v-model="inviteMembersForm.userIds"
        multiple
        placeholder="请选择成员"
        class="user-select"
      >
        <el-option-group label="机械部">
          <el-option
            v-for="user in selectorUsers"
            :key="user.userId"
            :label="user.userName"
            :value="user.userId"
          />
        </el-option-group>
        
        <el-option-group label="规划部">
          <el-option
            v-for="user in quoterUsers"
            :key="user.userId"
            :label="user.userName"
            :value="user.userId"
          />
        </el-option-group>
      </el-select>
    </el-form-item>
  </el-form>
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="showInviteMembersDialog = false">取 消</el-button>
      <el-button type="primary" @click="confirmInviteMembers">确 定</el-button>
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
        {{ scope.row.userName }}
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
          @click="removeProjectMember(scope.row, true)"
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

<script setup name="ProjectManagement">
import { ref, reactive, toRefs, onMounted, getCurrentInstance, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// 导入API
import { listProject, getProject, delProject, addProject, updateProject } from "@/api/device/project"
import { listRelation, addRelation, delRelation } from "@/api/device/relation"
import { listUser } from "@/api/system/user"
import useUserStore from '@/store/modules/user'
import { listProjectByIds } from "@/api/device/project"

// 项目分类选项卡状态
const activeProjectTab = ref('myProjects') // 默认显示"我的项目"

// 用户相关变量
const allAvailableUsers = ref([])          // 所有符合条件的用户
const selectorUsers = ref([])             // 选型员用户
const quoterUsers = ref([])               // 报价员用户
const isAdmin = ref(false)                // 是否为管理员
const isKeda = ref(false)                 // 是否为keda角色

// 路由实例
const router = useRouter()
const { proxy } = getCurrentInstance()

// 响应式判断是否为桌面端
const isDesktop = computed(() => {
  return window.innerWidth >= 768;
});

// 成员管理相关变量
const showInviteMembersDialog = ref(false)
const showViewMembersDialog = ref(false)
const currentViewProjectId = ref('')
const currentViewProjectName = ref('')
const projectMembers = ref([])
const viewMembersList = ref([])
const canManageMembers = ref(false)

// 邀请成员表单
const inviteMembersForm = reactive({
  userIds: []
})

// 用户搜索相关
const filteredUsers = ref([])
const userLoading = ref(false)

const selectedProject = ref(null)

// 项目管理相关数据
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
    projectStatus: null,  // 新增项目状态搜索参数
    createTime: null,     // 新增创建时间搜索参数
    lastModifyTime: null,
    isMyProject: true // 默认查询我的项目
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

// 存储项目成员数量的缓存
const projectMemberCounts = ref({})

// 初始化
onMounted(() => {
  // 调试用户信息
  debugUserInfo();
  
  // 获取项目列表
  getProjectList()
  
  // 获取用户列表
  getUserList()
  
  // 获取当前用户信息
  const userStore = useUserStore()
  isAdmin.value = userStore.roles && userStore.roles.some(role => role === 'admin')
  isKeda.value = userStore.roles && userStore.roles.some(role => role === 'keda')
})

// 调试方法
function debugUserInfo() {
  const userStore = useUserStore();
  console.log('=== 若依用户信息调试 ===');
  console.log('userStore:', userStore);
  console.log('userStore.user:', userStore.user);
  console.log('userStore.userId:', userStore.userId);
  console.log('userStore.name:', userStore.name);
  console.log('userStore.roles:', userStore.roles);
  console.log('userStore.token:', userStore.token ? '有token' : '无token');
  
  if (userStore.user) {
    console.log('user对象详情:', userStore.user);
    console.log('user对象所有属性:', Object.keys(userStore.user));
  }
  
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
  console.log('localStorage token:', token);
  console.log('localStorage userInfo:', userInfo);
  
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo);
      console.log('解析的userInfo:', user);
    } catch (e) {
      console.error('解析userInfo失败:', e);
    }
  }
}

// 获取项目成员数量的方法
function getMemberCount(projectId) {
  if (projectMemberCounts.value[projectId] !== undefined) {
    return projectMemberCounts.value[projectId]
  }
  
  listRelation({ mainProjectId: projectId }).then(response => {
    projectMemberCounts.value[projectId] = response.rows.length
  }).catch(error => {
    console.error(`获取项目 ${projectId} 成员数量失败:`, error)
    projectMemberCounts.value[projectId] = 0
  })
  
  return 0
}

// 处理日期范围搜索参数
function processDateParams(params) {
  const processedParams = { ...params };
  
  // 处理创建时间
  if (processedParams.createTime) {
    processedParams.createTimeStart = `${processedParams.createTime} 00:00:00`;
    processedParams.createTimeEnd = `${processedParams.createTime} 23:59:59`;
    delete processedParams.createTime;
  }
  
  // 处理最后修改时间
  if (processedParams.lastModifyTime) {
    processedParams.lastModifyTimeStart = `${processedParams.lastModifyTime} 00:00:00`;
    processedParams.lastModifyTimeEnd = `${processedParams.lastModifyTime} 23:59:59`;
    delete processedParams.lastModifyTime;
  }
  
  return processedParams;
}

// 优化的客户端日期过滤 - 精确匹配日期部分
function filterProjectsByDate(projects, params) {
  // 如果没有日期筛选条件，直接返回
  if (!params.createTime && !params.lastModifyTime) {
    return projects;
  }
  
  return projects.filter(project => {
    // 检查创建时间
    if (params.createTime) {
      // 从"YYYY-MM-DD HH:mm:ss"中提取日期部分
      const projectCreateDate = project.createTime 
        ? project.createTime.split(' ')[0] 
        : null;
      
      // 比较日期部分是否匹配
      if (projectCreateDate !== params.createTime) {
        return false;
      }
    }
    
    // 检查最后修改时间
    if (params.lastModifyTime) {
      // 从"YYYY-MM-DD HH:mm:ss"中提取日期部分
      const projectModifyDate = project.lastModifyTime 
        ? project.lastModifyTime.split(' ')[0] 
        : null;
      
      // 比较日期部分是否匹配
      if (projectModifyDate !== params.lastModifyTime) {
        return false;
      }
    }
    
    return true;
  });
}


function getProjectList() {
  return new Promise((resolve, reject) => {
    projectLoading.value = true;
    
    // 保存原始日期参数用于客户端过滤
    const originalDateParams = {
      createTime: projectQueryParams.value.createTime,
      lastModifyTime: projectQueryParams.value.lastModifyTime
    };
    
    // 处理日期参数
    const processedParams = processDateParams({ ...projectQueryParams.value });
    
    // 调试：打印最终发送的参数
    console.log('发送到API的查询参数:', processedParams);
    
    if (activeProjectTab.value === 'myProjects') {
      // "我的项目"逻辑
      getUserProjects(processedParams).then(processedList => {
        // 客户端二次过滤 - 使用原始日期参数
        const filteredList = filterProjectsByDate(processedList, originalDateParams);
        console.log(`创建时间过滤: ${originalDateParams.createTime || '无'}，结果数量: ${filteredList.length}`);
        console.log(`修改时间过滤: ${originalDateParams.lastModifyTime || '无'}，结果数量: ${filteredList.length}`);
        
        projectList.value = filteredList;
        projectTotal.value = filteredList.length;
        projectLoading.value = false;
        
        processedList.forEach(project => {
          getMemberCount(project.mainProjectId);
        });
        
        resolve(filteredList);
      }).catch(error => {
        console.error('获取我的项目列表失败:', error);
        projectLoading.value = false;
        reject(error);
      });
    } else {
      // "全部项目"逻辑
      listProject(processedParams).then(response => {
        const processedList = response.rows.map(project => {
          if (project.id && !project.mainProjectId) {
            project.mainProjectId = project.id;
            console.log(`项目${project.projectName}缺少mainProjectId，已使用id替代`);
          }
          return project;
        });
        
        // 客户端二次过滤 - 使用原始日期参数
        const filteredList = filterProjectsByDate(processedList, originalDateParams);
        console.log(`创建时间过滤: ${originalDateParams.createTime || '无'}，结果数量: ${filteredList.length}`);
        console.log(`修改时间过滤: ${originalDateParams.lastModifyTime || '无'}，结果数量: ${filteredList.length}`);
        
        projectList.value = filteredList;
        projectTotal.value = filteredList.length;
        projectLoading.value = false;
        
        processedList.forEach(project => {
          getMemberCount(project.mainProjectId);
        });
        
        resolve(filteredList);
      }).catch(error => {
        console.error('获取全部项目列表失败:', error);
        projectLoading.value = false;
        reject(error);
      });
    }
  });
}

function getUserProjects(params) {
  return new Promise((resolve, reject) => {
    const userStore = useUserStore();
    
    // 获取用户ID（保持不变）
    let currentUserId = null;
    
    if (userStore.id && !isNaN(Number(userStore.id))) {
      currentUserId = Number(userStore.id);
    } else if (userStore.user && userStore.user.userId && !isNaN(Number(userStore.user.userId))) {
      currentUserId = Number(userStore.user.userId);
    } else if (userStore.userId && !isNaN(Number(userStore.userId))) {
      currentUserId = Number(userStore.userId);
    } else if (userStore.user && userStore.user.id && !isNaN(Number(userStore.user.id))) {
      currentUserId = Number(userStore.user.id);
    } else if (userStore.token) {
      try {
        const tokenParts = userStore.token.split('.');
        if (tokenParts.length >= 3) {
          let payloadBase64 = tokenParts[1];
          if (payloadBase64.length % 4 !== 0) {
            payloadBase64 += '='.repeat(4 - (payloadBase64.length % 4));
          }
          
          const payload = JSON.parse(atob(payloadBase64));
          const possibleFields = ['userid', 'userId', 'sub', 'id', 'uid', 'user_id'];
          for (const field of possibleFields) {
            if (payload[field] !== undefined && !isNaN(Number(payload[field]))) {
              currentUserId = Number(payload[field]);
              break;
            }
          }
        }
      } catch (e) {
        console.error('解析token失败:', e);
      }
    }
    
    if (!currentUserId || isNaN(currentUserId) || typeof currentUserId !== 'number') {
      userStore.getInfo().then(() => {
        getUserProjects(params).then(resolve).catch(reject);
      }).catch(() => {
        proxy.$message.error('用户信息错误，请重新登录');
        reject(new Error('获取的用户ID无效，必须是数字类型'));
      });
      return;
    }
    
    listRelation({ userId: currentUserId }).then(relationResponse => {
      const relations = relationResponse.rows;
      
      if (!relations || relations.length === 0) {
        resolve([]);
        return;
      }
      
      const projectIds = relations
        .map(relation => relation.mainProjectId)
        .filter(id => id && !isNaN(Number(id)))
        .map(id => Number(id));
      
      if (projectIds.length === 0) {
        resolve([]);
        return;
      }
      
      // 关键修复：确保传递的是正确的数组格式
      // 创建一个新的参数对象，确保ids是纯数组
      const queryParams = { ...params };
      
      // 调用listProjectByIds时正确传递数组参数
      // 有些后端框架要求数组参数以ids=1&ids=2&ids=3形式传递
      listProjectByIds(projectIds, queryParams).then(response => {
        const userProjects = response.rows.map(project => {
          if (project.id && !project.mainProjectId) {
            project.mainProjectId = project.id;
          }
          return project;
        });
        resolve(userProjects);
      }).catch(error => {
        console.error('批量查询项目失败:', error);
        reject(error);
      });
    }).catch(error => {
      console.error('查询用户项目关系失败:', error);
      reject(error);
    });
  });
}

function handleProjectTabChange(tabName) {
  projectQueryParams.value.pageNum = 1;
  projectQueryParams.value.createUser = null;
  
  getProjectList().catch(error => {
    console.error('切换标签页获取项目列表失败:', error);
    proxy.$message.error('加载项目失败，请稍后重试');
    activeProjectTab.value = tabName === 'myProjects' ? 'allProjects' : 'myProjects';
  });
}

// 重置项目查询
function resetProjectQuery() {
  const { projectQueryRef } = proxy.$refs
  if (projectQueryRef) {
    projectQueryRef.resetFields()
  }
  getProjectList()
}

// 处理项目选择变化
function handleProjectSelectionChange(selection) {
  projectIds.value = selection.map(item => item.mainProjectId)
  projectSingle.value = selection.length !== 1
  projectMultiple.value = !selection.length
  selectedProject.value = selection.length === 1 ? selection[0] : null
}

// 跳转到产线管理页面
function goToProductionLineManagement(row) {
  if (!row && (!selectedProject.value || !selectedProject.value.mainProjectId)) {
    proxy.$message.warning('请选择一个项目');
    return;
  }
  
  const project = row || selectedProject.value;
  
  router.push({
    path: 'production-line',  // 假设产线管理页面的路由路径是/production-line
    query: {
      projectId: project.mainProjectId,
      projectName: project.projectName
    }
  });
}

// 获取用户列表 - 新增过滤当前用户逻辑
function getUserList() {
  userLoading.value = true;
  // 1. 获取当前登录用户ID（关键：用于过滤自己）
  const userStore = useUserStore();
  const currentUserId = userStore.id; 
  
  listUser({ pageNum: 1, pageSize: 1000 }).then(response => {
    allAvailableUsers.value = response.rows;
    
    // 2. 筛选用户时排除当前登录用户（核心过滤逻辑）
    selectorUsers.value = response.rows.filter(user => 
      user.remark === 'selector' && user.userId !== currentUserId // 排除自己
    );
    
    quoterUsers.value = response.rows.filter(user => 
      user.remark === 'quoter' && user.userId !== currentUserId // 排除自己
    );
    
    userLoading.value = false;
  }).catch(error => {
    console.error('获取用户列表失败:', error);
    userLoading.value = false;
  });
}

// 获取项目成员
function getProjectMembers(projectId) {
  listRelation({ mainProjectId: projectId }).then(response => {
    const relations = response.rows;
    
    const membersWithRoles = relations.map(relation => {
      const userInfo = allAvailableUsers.value.find(user => user.userId === relation.userId);
      
      return {
        ...relation,
        // 不再使用remark，改用role字段
        roleName: userInfo ? userInfo.remark : 'unknown',
        userName: userInfo ? (userInfo.user_name || userInfo.userName) : '未知用户'
      };
    });
    
    projectMembers.value = membersWithRoles;
  }).catch(error => {
    console.error('获取项目成员失败:', error)
  })
}

// 处理管理成员
function handleManageMembers(row) {
  if (!row || !row.mainProjectId) {
    proxy.$message.error('无法获取项目信息，请刷新页面重试');
    return;
  }
  
  currentViewProjectId.value = row.mainProjectId;
  currentViewProjectName.value = row.projectName || '未知项目';
  canManageMembers.value = true;
  
  viewMembersList.value = [];
  
  listRelation({ mainProjectId: row.mainProjectId }).then(response => {
    const relations = response.rows || [];
    
    const membersWithRoles = relations
      .filter(relation => relation.mainProjectId === row.mainProjectId)
      .map(relation => {
        const userInfo = allAvailableUsers.value.find(user => user.userId === relation.userId);
        
        return {
          ...relation,
          // 不再使用remark，改用role字段
          roleName: userInfo ? userInfo.remark : 'unknown',
          userName: userInfo ? (userInfo.user_name || userInfo.userName) : '未知用户'
        };
      });
    
    viewMembersList.value = membersWithRoles;
    showViewMembersDialog.value = true;
  }).catch(error => {
    console.error(`获取项目 ${row.mainProjectId} 成员失败:`, error);
    proxy.$message.error('获取成员列表失败，请稍后重试');
  })
}

// 查看成员列表
function handleViewMembers(row) {
  currentViewProjectId.value = row.mainProjectId
  currentViewProjectName.value = row.projectName
  canManageMembers.value = isAdmin.value || row.createUser === useUserStore().username
  
  viewMembersList.value = [];
  
  listRelation({ mainProjectId: row.mainProjectId }).then(response => {
    const relations = response.rows;
    
    const membersWithRoles = relations.map(relation => {
      const userInfo = allAvailableUsers.value.find(user => user.userId === relation.userId);
      
      return {
        ...relation,
        // 不再使用remark，改用role字段
        roleName: userInfo ? userInfo.role : 'unknown',
        userName: userInfo ? (userInfo.user_name || userInfo.userName) : '未知用户'
      };
    });
    
    viewMembersList.value = membersWithRoles;
    showViewMembersDialog.value = true;
  }).catch(error => {
    console.error('获取项目成员失败:', error)
  })
}

// 确认邀请成员
function confirmInviteMembers() {
  if (!inviteMembersForm.userIds || inviteMembersForm.userIds.length === 0) {
    proxy.$message.warning('请选择要邀请的成员');
    return;
  }

  const existingUserIds = projectMembers.value.map(member => member.userId);
  const newUserIds = inviteMembersForm.userIds.filter(id => !existingUserIds.includes(id));

  if (newUserIds.length === 0) {
    proxy.$message.warning('所选成员已在项目中');
    showInviteMembersDialog.value = false;
    inviteMembersForm.userIds = [];
    return;
  }

  newUserIds.forEach(userId => {
    const user = allAvailableUsers.value.find(u => u.userId === userId);
    if (user) {
      projectMembers.value.push({
        userId: user.userId,
        userName: user.user_name || user.userName,
        // 不再使用remark，改用role字段
        roleName: user.role || 'selector'
      });
    }
  });

  proxy.$message.success(`成功选择 ${newUserIds.length} 名成员`);
   if (projectForm.value.mainProjectId) {
    projectMemberCounts.value[projectForm.value.mainProjectId] = projectMembers.value.length
  }
  
  showInviteMembersDialog.value = false;
  inviteMembersForm.userIds = [];
}

// 保存项目成员
function saveProjectMembers() {
  return new Promise((resolve, reject) => {
    if (!projectForm.value.mainProjectId || projectMembers.value.length === 0) {
      resolve();
      return;
    }

    listRelation({ mainProjectId: projectForm.value.mainProjectId }).then(response => {
      const existingRelations = response.rows;
      const deletePromise = existingRelations.length > 0 
        ? delRelation(existingRelations.map(rel => rel.relationId))
        : Promise.resolve();

      deletePromise.then(() => {
        const promises = projectMembers.value.map(member => {
          const singleData = {
            mainProjectId: projectForm.value.mainProjectId,
            userId: member.userId,
          };
          return addRelation(singleData);
        });

        Promise.all(promises)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }).catch(error => {
        reject(error);
      });
    }).catch(error => {
      reject(error);
    });
  });
}

// 修复后的移除项目成员方法
function removeProjectMember(member, fromViewDialog = false) {
    if (member.isCreator) {
    proxy.$message.warning('创建者无法被移除');
    return;
  }

  const projectId = fromViewDialog ? currentViewProjectId.value : projectForm.value.mainProjectId;
  if (!projectId) {
    proxy.$message.error('无法获取项目信息，操作失败');
    return;
  }
  
  // 验证是否有有效的relationId（关键：使用relationId作为删除标识）
  if (!member.relationId) {
    proxy.$message.error('成员关系ID不存在，无法移除');
    return;
  }
  
  proxy.$confirm(`确定要移除成员 ${member.userName || '未知用户'} 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 从列表中移除
    if (fromViewDialog) {
      viewMembersList.value = viewMembersList.value.filter(m => m.userId !== member.userId)
    } else {
      projectMembers.value = projectMembers.value.filter(m => m.userId !== member.userId)
    }
    
    // 关键修复：传递relationId（单一ID值），而非对象
    delRelation(member.relationId).then(() => {
      proxy.$message.success('移除成员成功');
      if (projectId) {
        const currentCount = projectMemberCounts.value[projectId] || 0;
        projectMemberCounts.value[projectId] = Math.max(0, currentCount - 1);
      }
    }).catch(error => {
      console.error('移除成员失败:', error);
      proxy.$message.error('移除成员失败: ' + (error.response?.data?.msg || error.message || '未知错误'));
    })
  }).catch(() => {
    // 取消移除
  })
}
    

// 项目新增/编辑相关方法
function handleProjectAdd() {
  projectDialogTitle.value = '添加项目'
  projectForm.value.mainProjectId = null
  projectForm.value.projectCode = null
  projectForm.value.projectName = null
  projectForm.value.projectDesc = null
  projectForm.value.projectStatus = 1 // 默认进行中
  projectForm.value.createUser = useUserStore().username
  
  projectMembers.value = []
  
  projectDialogOpen.value = true
}

function handleProjectUpdate(row) {
  projectDialogTitle.value = '修改项目'
  projectForm.value.mainProjectId = row.mainProjectId
  projectForm.value.projectCode = row.projectCode
  projectForm.value.projectName = row.projectName
  projectForm.value.projectDesc = row.projectDesc
  projectForm.value.projectStatus = row.projectStatus
  projectForm.value.createUser = row.createUser
  
  projectMembers.value = [];
  
  getProjectMembers(row.mainProjectId)
  
  projectDialogOpen.value = true
}

function submitProjectForm() {
  proxy.$refs.projectRef.validate(valid => {
    if (valid) {
      if (projectForm.value.mainProjectId) {
        // 编辑项目逻辑（保持不变）
        updateProject(projectForm.value).then(response => {
          proxy.$message.success('修改项目成功');
          
          saveProjectMembers().then(() => {
            projectMemberCounts.value[projectForm.value.mainProjectId] = projectMembers.value.length;
            projectDialogOpen.value = false;
            getProjectList();
          }).catch(error => {
            console.error('保存成员失败:', error);
            projectDialogOpen.value = false;
            getProjectList();
          });
        }).catch(error => {
          console.error('修改项目失败:', error);
          proxy.$message.error('修改项目失败');
        });
      } else {
        // 新增项目逻辑 - 新增自动添加创建者
        addProject(projectForm.value).then(response => {
          const newProjectId = response.data;
          
          if (!newProjectId || newProjectId <= 0) {
            throw new Error('未能获取有效的项目ID');
          }
          
          projectForm.value.mainProjectId = newProjectId;
          proxy.$message.success('新增项目成功');

          // 3. 自动添加当前创建者到成员列表（核心逻辑）
          const userStore = useUserStore();
          const currentUser = {
            userId: userStore.id, // 当前用户ID
            userName: userStore.name, // 当前用户名
          };

          // 避免重复添加（防止异常场景）
          const isCreatorExists = projectMembers.value.some(
            member => member.userId === currentUser.userId
          );
          if (!isCreatorExists) {
            projectMembers.value.unshift(currentUser); // 插入到列表首位
          }

          // 继续保存成员（此时包含创建者）
          return saveProjectMembers().then(() => {
            projectMemberCounts.value[newProjectId] = projectMembers.value.length;
            return newProjectId;
          });
        }).then(newProjectId => {
          projectDialogOpen.value = false;
          getProjectList();
        }).catch(error => {
          console.error('新增项目流程失败:', error);
          proxy.$message.error(`新增项目失败: ${error.message || '未知错误'}`);
        });
      }
    }
  });
}

function cancelProjectForm() {
  projectDialogOpen.value = false
}

// 删除项目
function handleProjectDelete(row) {
  const ids = row ? [row.mainProjectId] : projectIds.value
  if (!ids || ids.length === 0) {
    proxy.$message.warning('请选择要删除的项目')
    return
  }
  
  proxy.$confirm(`确定要删除选中的 ${ids.length} 个项目吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delProject(ids).then(response => {
      proxy.$message.success('删除成功')
      getProjectList()
    }).catch(error => {
      console.error('删除项目失败:', error)
      proxy.$message.error('删除失败')
    })
  }).catch(() => {
    // 取消删除
  })
}

// 导出项目
function handleProjectExport() {
  // 处理导出的日期参数
  const processedParams = processDateParams({ ...projectQueryParams.value });
  
  proxy.$confirm('确定要导出所有项目数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    window.open(`/device/project/export?${new URLSearchParams(processedParams).toString()}`)
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

.view-container {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  min-height: calc(100vh - 140px);
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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

.member-section {
  margin-top: 15px;
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 6px;
  position: relative;
}

.invite-btn {
  margin-bottom: 20px;
  display: inline-block;
}

.member-list {
  margin-top: 10px;
  position: relative;
  z-index: 1;
}

.member-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 5px 0;
  min-height: 40px;
  align-items: flex-start;
}

.no-members {
  color: #86909c;
  padding: 12px 16px;
  background-color: #f0f2f5;
  border-radius: 4px;
  margin-top: 5px;
  font-size: 14px;
  line-height: 1.6;
}

.member-tags .el-tag {
  padding: 6px 12px;
  height: auto;
  max-width: 180px;
  word-break: break-all;
  transition: all 0.2s;
}

.el-divider {
  position: relative;
  z-index: 1;
}

.no-members {
  color: #909399;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.5;
}

.invite-btn {
  margin-bottom: 15px;
}

.members-table {
  width: 100%;
}

.project-tabs {
  background-color: #f5f7fa;
  padding: 5px 15px;
  border-radius: 4px;
}
</style>
