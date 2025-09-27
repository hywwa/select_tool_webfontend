<template>
  <div class="app-container">
    <!-- 导航路径指示器 -->
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
      <!-- 新增：项目分类切换选项卡 -->
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
        <!-- 搜索表单内容保持不变 -->
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
            @click="switchToProductionLineView"
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
          <el-table-column label="成员数量" align="center" min-width="100">
  <template #default="scope">
    <el-button 
      link 
      type="primary" 
      @click="handleViewMembers(scope.row)"
      class="member-count-btn"
    >
      <!-- 修复：使用成员关系表的实际计数 -->
      {{ getMemberCount(scope.row.mainProjectId) || 0 }}人
    </el-button>
  </template>
</el-table-column>
          <el-table-column label="最后修改时间" align="center" prop="lastModifyTime" min-width="160">
            <template #default="scope">
              <span>{{ parseTime(scope.row.lastModifyTime) }}</span>
            </template>
          </el-table-column>
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

          <!-- 项目成员邀请区域（修改后） -->
<el-form-item label="项目成员" prop="members"> <!-- 增加label和prop，与其他表单项结构一致 -->
  <div class="member-section">
    <!-- 邀请按钮：增加明确的label关联，提升可访问性 -->
    <el-button 
      type="primary" 
      plain 
      size="small" 
      @click="showInviteMembersDialog = true"
      class="invite-btn"
    >
      <el-icon><UserPlus /></el-icon> 邀请成员
    </el-button>
    
    <!-- 成员列表容器：增加v-if判断，避免空容器占位 -->
    <div v-if="projectForm.mainProjectId || projectDialogTitle === '添加项目'" class="member-list">
      
      <!-- 成员标签：v-else显示无成员提示，避免结构错乱 -->
    <template v-if="projectMembers.length > 0">
  <!-- 替换el-space为原生div，避免组件样式干扰 -->
  <div class="member-tags"> 
    <el-tag 
      v-for="member in projectMembers" 
      :key="member.userId" 
      closable 
      :disable-transitions="false"
      @close="removeProjectMember(member)"
      effect="light"
    >
      {{ member.userName || member.user_name }} <!-- 兼容两种字段命名 -->
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
      <!-- 使用分组选择器，按角色展示用户 -->
      <el-select
        v-model="inviteMembersForm.userIds"
        multiple
        placeholder="请选择成员"
        class="user-select"
      >
        <!-- 选型员分组 -->
        <el-option-group label="机械部">
          <el-option
            v-for="user in selectorUsers"
            :key="user.userId"
            :label="user.userName"
            :value="user.userId"
          />
        </el-option-group>
        
        <!-- 报价员分组 -->
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
      <!-- 修改成员列表表格 -->
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

    <!-- 2. 产线管理视图 -->
    <div v-if="viewState === 'productionLine'" class="view-container animate-fade-in">
      <!-- 显示当前关联的项目信息 -->
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
              <p>关联选型记录ID：{{ selectedTemplate.recordId || '-' }}</p>
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
    </div>
  </div>
</template>

<script setup name="ProjectProductionFlow">
import { ref, reactive, toRefs, onMounted, getCurrentInstance, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// 导入API
import { listProject, getProject, delProject, addProject, updateProject } from "@/api/device/project"
import { listManagement, getManagement, delManagement, addManagement, updateManagement } from "@/api/device/management"
import { listRelation, addRelation, delRelation } from "@/api/device/relation"
import { listUser } from "@/api/system/user"
import useUserStore from '@/store/modules/user'
import { listProjectByIds } from "@/api/device/project"

// 新增：项目分类选项卡状态
const activeProjectTab = ref('myProjects') // 默认显示"我的项目"

// 添加新的响应式变量
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

// 模版相关
const templateList = ref([]) // 选型模版列表
const useTemplate = ref(false) // 是否复用模版
const selectedTemplate = ref(null) // 当前选中的模版

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

// 产线表单数据
const productionLineData = reactive({
  form: {
    projectId: null,
    mainProjectId: null,
    projectName: null,
    remarks: null,
    templateId: null,
    recordId: null,
    isQuoted: 0,
    projectStatus: 0
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    mainProjectId: null,
    projectName: null,
    creator: null,
    isQuoted: null
  },
  rules: {
    projectName: [
      { required: true, message: "项目名称不能为空", trigger: "blur" }
    ]
  }
})

const { form: productionLineForm, queryParams: productionLineQueryParams, rules: productionLineRules } = toRefs(productionLineData)

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
  
  console.log('用户角色信息 - admin:', isAdmin.value, 'keda:', isKeda.value)
})

// 添加调试方法
function debugUserInfo() {
  const userStore = useUserStore();
  console.log('=== 若依用户信息调试 ===');
  console.log('userStore:', userStore);
  console.log('userStore.user:', userStore.user);
  console.log('userStore.userId:', userStore.userId);
  console.log('userStore.name:', userStore.name);
  console.log('userStore.roles:', userStore.roles);
  console.log('userStore.token:', userStore.token ? '有token' : '无token');
  
  // 检查user对象的详细结构
  if (userStore.user) {
    console.log('user对象详情:', userStore.user);
    console.log('user对象所有属性:', Object.keys(userStore.user));
  }
  
  // 检查localStorage中的用户信息
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

// 新增：存储项目成员数量的缓存
const projectMemberCounts = ref({})

// 新增：获取项目成员数量的方法
function getMemberCount(projectId) {
  // 如果已有缓存，直接返回
  if (projectMemberCounts.value[projectId] !== undefined) {
    return projectMemberCounts.value[projectId]
  }
  
  // 否则获取并缓存成员数量
  listRelation({ mainProjectId: projectId }).then(response => {
    projectMemberCounts.value[projectId] = response.rows.length
  }).catch(error => {
    console.error(`获取项目 ${projectId} 成员数量失败:`, error)
    projectMemberCounts.value[projectId] = 0
  })
  
  // 暂时返回0，数据加载后会自动更新
  return 0
}

// 项目列表相关方法
function getProjectList() {
  return new Promise((resolve, reject) => {
    projectLoading.value = true;
    
    // 关键修改：根据选项卡决定查询逻辑
    if (activeProjectTab.value === 'myProjects') {
      // "我的项目"逻辑：先查询用户参与的项目关系，再查询项目详情
      getUserProjects().then(processedList => {
        projectList.value = processedList;
        projectTotal.value = processedList.length; // 我的项目不分页，显示全部
        projectLoading.value = false;
        
        // 为每个项目预加载成员数量
        processedList.forEach(project => {
          getMemberCount(project.mainProjectId);
        });
        
        resolve(processedList);
      }).catch(error => {
        console.error('获取我的项目列表失败:', error);
        projectLoading.value = false;
        reject(error);
      });
    } else {
      // "全部项目"逻辑：直接查询所有项目（原有逻辑）
      listProject(projectQueryParams.value).then(response => {
        // 处理项目数据，确保mainProjectId存在
        const processedList = response.rows.map(project => {
          if (project.id && !project.mainProjectId) {
            project.mainProjectId = project.id;
            console.log(`项目${project.projectName}缺少mainProjectId，已使用id替代`);
          }
          return project;
        });
        
        projectList.value = processedList;
        projectTotal.value = response.total;
        projectLoading.value = false;
        
        // 为每个项目预加载成员数量
        processedList.forEach(project => {
          getMemberCount(project.mainProjectId);
        });
        
        resolve(processedList);
      }).catch(error => {
        console.error('获取全部项目列表失败:', error);
        projectLoading.value = false;
        reject(error);
      });
    }
  });
}

function getUserProjects() {
  return new Promise((resolve, reject) => {
    const userStore = useUserStore();
    
    // 获取用户ID
    let currentUserId = null;
    
    // 尝试从不同位置获取有效的数字ID
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
    
    // 验证用户ID有效性
    if (!currentUserId || isNaN(currentUserId) || typeof currentUserId !== 'number') {
      // 尝试重新获取用户信息
      userStore.getInfo().then(() => {
        getUserProjects().then(resolve).catch(reject);
      }).catch(() => {
        proxy.$message.error('用户信息错误，请重新登录');
        reject(new Error('获取的用户ID无效，必须是数字类型'));
      });
      return;
    }
    
    // 查询用户参与的项目关系
    listRelation({ userId: currentUserId }).then(relationResponse => {
      const relations = relationResponse.rows;
      
      if (!relations || relations.length === 0) {
        resolve([]);
        return;
      }
      
      // 提取有效的项目ID列表
      const projectIds = relations
        .map(relation => relation.mainProjectId)
        .filter(id => id && !isNaN(Number(id)))
        .map(id => Number(id));
      
      if (projectIds.length === 0) {
        resolve([]);
        return;
      }
      
      // 批量查询项目信息
      listProjectByIds(projectIds).then(response => {
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
  // 重置页码和查询条件
  projectQueryParams.value.pageNum = 1;
  projectQueryParams.value.createUser = null; // 清除创建人筛选
  
  // 重新获取项目列表，并处理可能的错误
  getProjectList().catch(error => {
    console.error('切换标签页获取项目列表失败:', error);
    proxy.$message.error('加载项目失败，请稍后重试');
    // 失败时切换回之前的标签
    activeProjectTab.value = tabName === 'myProjects' ? 'allProjects' : 'myProjects';
  });
}
// 重置项目查询 - 修改以适应选项卡
function resetProjectQuery() {
  const { projectQueryRef } = proxy.$refs
  if (projectQueryRef) {
    projectQueryRef.resetFields()
  }
  // 保留选项卡状态，重新获取项目列表
  getProjectList()
}

// 处理项目选择变化
function handleProjectSelectionChange(selection) {
  projectIds.value = selection.map(item => item.mainProjectId)
  projectSingle.value = selection.length !== 1
  projectMultiple.value = !selection.length
  // 记录当前选中的项目
  selectedProject.value = selection.length === 1 ? selection[0] : null
}



// 切换到项目视图
function switchToProjectView() {
  viewState.value = 'project'
  currentProjectId.value = ''
  currentProjectName.value = ''
  productionLineQueryParams.value.mainProjectId = null
}

// 切换到产线视图
function switchToProductionLineView(row) {
  if (row) {
    currentProjectId.value = row.mainProjectId
    currentProjectName.value = row.projectName
  }
  viewState.value = 'productionLine'
  productionLineQueryParams.value.mainProjectId = currentProjectId.value
  getProductionLineList()
  getTemplateList()
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
  getProductionLineList()
}

// 获取选型模版列表
function getTemplateList() {
  const params = {
    pageNum: 1,
    pageSize: 100,
    mainProjectId: currentProjectId.value,
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

// 获取选型提示信息
function getSelectionTip(row) {
  if (row.isQuoted === 1) {
    return '报价已完成，不可修改选型'
  }
  return ''
}

// 判断是否可以进入选型
function canEnterSelection(row) {
  // 只有未完成报价的产线可以进入选型
  return row.isQuoted !== 1
}

// 进入选型页面
function goToSelectionPage(row) {
  if (!canEnterSelection(row)) return
  
  router.push({
    path: 'DeviceSearch/DeviceSearch/DeviceSearch',  // 选型页面路由路径
     query: {
        productionLineId: row.projectId,
    //   productionLineName: row.projectName,
    //   mainProjectId: currentProjectId.value,
    //   mainProjectName: currentProjectName.value
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
  if (row.isQuoted !== 1) {
    return '只有报价完成的产线才能设为模版'
  }
  return ''
}

// 设置为模版
function setAsTemplate(row) {
  if (row.projectStatus === 1) return
  
  if (row.isQuoted !== 1) {
    proxy.$message.warning('只有报价完成的产线才能设为模版')
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

// 项目新增/编辑相关方法
function handleProjectAdd() {
  projectDialogTitle.value = '添加项目'
  projectForm.value.mainProjectId = null
  projectForm.value.projectCode = null
  projectForm.value.projectName = null
  projectForm.value.projectDesc = null
  projectForm.value.projectStatus = 1 // 默认进行中
  projectForm.value.createUser = useUserStore().username
  
  // 清空成员列表
  projectMembers.value = []
  
  projectDialogOpen.value = true
}
// 同时检查项目编辑时的成员加载方法
function handleProjectUpdate(row) {
  projectDialogTitle.value = '修改项目'
  projectForm.value.mainProjectId = row.mainProjectId
  projectForm.value.projectCode = row.projectCode
  projectForm.value.projectName = row.projectName
  projectForm.value.projectDesc = row.projectDesc
  projectForm.value.projectStatus = row.projectStatus
  projectForm.value.createUser = row.createUser
  
  // 关键修复：先清空现有成员列表
  projectMembers.value = [];
  
  // 获取项目成员
  getProjectMembers(row.mainProjectId)
  
  projectDialogOpen.value = true
}

// 修改新增项目的处理逻辑
function submitProjectForm() {
  proxy.$refs.projectRef.validate(valid => {
    if (valid) {
      if (projectForm.value.mainProjectId) {
        // 编辑项目逻辑：保存成员
        updateProject(projectForm.value).then(response => {
          proxy.$message.success('修改项目成功');
          
          // 保存成员
          saveProjectMembers().then(() => {
            // 编辑项目成功后更新缓存
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
        // 新增项目逻辑：添加项目后保存成员
        addProject(projectForm.value).then(response => {
          const newProjectId = response.data;
          
          if (!newProjectId || newProjectId <= 0) {
            throw new Error('未能获取有效的项目ID');
          }
          
          // 关键修复：将新项目ID设置到表单，用于保存成员
          projectForm.value.mainProjectId = newProjectId;
          
          proxy.$message.success('新增项目成功');
          
          // 先刷新项目列表
          return getProjectList().then(processedList => {
            const newProject = processedList.find(item => item.mainProjectId === newProjectId);
            if (newProject) {
              console.log('新项目数据完整:', newProject);
            } else {
              console.warn('未在列表中找到新项目，可能需要再次刷新');
            }
            
            // 关键修复：如果有邀请的成员，保存成员关系
            if (projectMembers.value.length > 0) {
              return saveProjectMembers().then(() => {
                // 新增项目成功保存成员后更新缓存
                projectMemberCounts.value[newProjectId] = projectMembers.value.length;
                return newProjectId;
              });
            }
            // 没有成员也更新缓存为0
            projectMemberCounts.value[newProjectId] = 0;
            return newProjectId;
          });
        }).then(newProjectId => {
          projectDialogOpen.value = false;
          // 再次刷新列表，确保成员数量正确显示
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

// 导出项目
function handleProjectExport() {
  proxy.$confirm('确定要导出所有项目数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    // 调用导出API
    window.open(`/device/project/export?${new URLSearchParams(projectQueryParams.value).toString()}`)
  }).catch(() => {
    // 取消导出
  })
}

// 导出产线
function handleProductionLineExport() {
  proxy.$confirm('确定要导出所有产线数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    // 调用导出API
    window.open(`/device/management/export?${new URLSearchParams(productionLineQueryParams.value).toString()}`)
  }).catch(() => {
    // 取消导出
  })
}

// 1. 修改用户列表获取和过滤逻辑
function getUserList() {
  userLoading.value = true;
  listUser({ pageNum: 1, pageSize: 1000 }).then(response => {
    allAvailableUsers.value = response.rows;
    
    // 关键修改：使用user_name字段作为用户名
    // 修复角色判断逻辑，确保selector正确识别
    selectorUsers.value = response.rows.filter(user => 
      user.remark === 'selector'
    );
    
    quoterUsers.value = response.rows.filter(user => 
      user.remark === 'quoter'
    );
    
    userLoading.value = false;
  }).catch(error => {
    console.error('获取用户列表失败:', error);
    userLoading.value = false;
  });
}

// 修改获取项目成员的方法，确保正确获取用户角色
function getProjectMembers(projectId) {
  listRelation({ mainProjectId: projectId }).then(response => {
    // 获取关联表中的成员列表
    const relations = response.rows;
    
    // 遍历成员，从用户列表中匹配完整信息（包括角色）
    const membersWithRoles = relations.map(relation => {
      // 从所有用户中找到对应的用户信息
      const userInfo = allAvailableUsers.value.find(user => user.userId === relation.userId);
      
      return {
        ...relation,
        // 从用户表的remark字段获取角色
        roleName: userInfo ? userInfo.remark : 'unknown',
        // 确保userName正确显示
        userName: userInfo ? (userInfo.user_name || userInfo.userName) : '未知用户'
      };
    });
    
    projectMembers.value = membersWithRoles;
  }).catch(error => {
    console.error('获取项目成员失败:', error)
  })
}


// 修改处理管理成员的方法
function handleManageMembers(row) {
  // 确保row和row.mainProjectId存在
  if (!row || !row.mainProjectId) {
    proxy.$message.error('无法获取项目信息，请刷新页面重试');
    return;
  }
  
  currentViewProjectId.value = row.mainProjectId;
  currentViewProjectName.value = row.projectName || '未知项目';
  canManageMembers.value = true;
  
  // 清空现有成员列表
  viewMembersList.value = [];
  
  // 明确传递当前项目ID获取成员
  listRelation({ mainProjectId: row.mainProjectId }).then(response => {
    const relations = response.rows || [];
    
    // 过滤并确保只显示当前项目的成员
    const membersWithRoles = relations
      .filter(relation => relation.mainProjectId === row.mainProjectId)
      .map(relation => {
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
    console.error(`获取项目 ${row.mainProjectId} 成员失败:`, error);
    proxy.$message.error('获取成员列表失败，请稍后重试');
  })
}

// 修改查看成员列表的方法
function handleViewMembers(row) {
  currentViewProjectId.value = row.mainProjectId
  currentViewProjectName.value = row.projectName
  canManageMembers.value = isAdmin.value || row.createUser === useUserStore().username
  
  // 关键修复：先清空现有成员列表
  viewMembersList.value = [];
  
  // 获取项目成员并正确设置角色
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


// 修改确认邀请成员的方法
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
        // 明确从user.remark获取角色
        roleName: user.remark || 'selector'
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
function saveProjectMembers() {
  return new Promise((resolve, reject) => {
    console.log('进入 saveProjectMembers ---');
    console.log('项目ID mainProjectId:', projectForm.value.mainProjectId);
    console.log('待插入成员数量:', projectMembers.value.length);

    if (!projectForm.value.mainProjectId || projectMembers.value.length === 0) {
      console.log('无需同步成员：项目ID不存在或无成员数据');
      resolve();
      return;
    }

    // 先删除旧成员
    listRelation({ mainProjectId: projectForm.value.mainProjectId }).then(response => {
      const existingRelations = response.rows;
      const deletePromise = existingRelations.length > 0 
        ? delRelation(existingRelations.map(rel => rel.relationId))
        : Promise.resolve();

      deletePromise.then(() => {
        console.log('旧成员删除完成，开始插入新成员');
        // 全部成功才resolve，有一个失败就reject
        const promises = projectMembers.value.map(member => {
          const singleData = {
            mainProjectId: projectForm.value.mainProjectId,
            userId: member.userId,
            joinTime: new Date()
          };
          return addRelation(singleData);
        });

        Promise.all(promises)
          .then(() => {
            console.log('所有成员添加成功');
            resolve();
          })
          .catch(error => {
            console.error('成员添加失败:', error);
            reject(error);
          });
      }).catch(error => {
        console.error('删除旧成员失败:', error);
        reject(error);
      });
    }).catch(error => {
      console.error('获取现有成员失败:', error);
      reject(error);
    });
  });
}

function addNewMembers() {
  // 1. 记录成功/失败数量，用于最终反馈
  let successCount = 0;
  let failCount = 0;
  const failUsers = [];

  // 2. 遍历成员列表，单条插入
  projectMembers.value.forEach(member => {
    // 构造符合后端实体类的单条数据（字段名严格匹配）
    const singleData = {
      mainProjectId: projectForm.value.mainProjectId, // 匹配后端 mainProjectId 字段
      userId: member.userId,                          // 匹配后端 userId 字段
      joinTime: new Date()                            // 新增：设置当前时间为加入时间
    };

    // 3. 单条调用添加接口
    addRelation(singleData).then(() => {
      successCount++;
    }).catch(error => {
      failCount++;
      failUsers.push(member.userName || member.user_name);
      console.error(`插入成员 ${member.userName} 失败:`, error);
    }).finally(() => {
      // 4. 所有请求完成后反馈结果
      if (successCount + failCount === projectMembers.value.length) {
        let message = `成功添加 ${successCount} 名成员`;
        if (failCount > 0) {
          message += `，失败 ${failCount} 名（${failUsers.join('、')}）`;
        }
        proxy.$message.success(message);
      }
    });
  });
}

// 移除项目成员
function removeProjectMember(member, fromViewDialog = false) {
  // 确保有有效的项目ID
  const projectId = fromViewDialog ? currentViewProjectId.value : projectForm.value.mainProjectId;
  if (!projectId) {
    proxy.$message.error('无法获取项目信息，操作失败');
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
    
    // 调用API删除时明确指定项目ID
    delRelation({ 
      mainProjectId: projectId, 
      userId: member.userId 
    }).then(() => {
      proxy.$message.success('移除成员成功');
      // 更新成员数量缓存
      if (projectId) {
        const currentCount = projectMemberCounts.value[projectId] || 0;
        projectMemberCounts.value[projectId] = Math.max(0, currentCount - 1);
      }
    }).catch(error => {
      console.error('移除成员失败:', error);
      proxy.$message.error('移除成员失败');
    })
  }).catch(() => {
    // 取消移除
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

/* 成员区域整体样式优化 */
.member-section {
  margin-top: 15px;
  padding: 15px; /* 增加内边距，形成独立区域 */
  background-color: #f9fafb; /* 轻微背景色，区分区域 */
  border-radius: 6px; /* 圆角增强视觉分离感 */
  position: relative; /* 建立定位上下文 */
}

/* 邀请按钮样式调整 */
.invite-btn {
  margin-bottom: 20px; /* 增加与下方内容的间距 */
  display: inline-block; /* 确保margin-bottom生效 */
}

/* 成员列表容器样式 */
.member-list {
  margin-top: 10px;
  position: relative;
  z-index: 1; /* 确保内容在正确层级 */
}

/* 成员标题样式优化 */
.member-title {
  margin: 0 0 15px 0; /* 仅保留底部间距 */
  padding-top: 5px; /* 顶部内边距，避免紧贴 */
  font-weight: 500;
  color: #4e5969;
  position: relative;
  z-index: 2;
}

/* 成员标签容器样式 */
.member-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 增加标签间距 */
  padding: 5px 0;
  min-height: 40px;
  align-items: flex-start;
}

/* 无成员提示样式 */
.no-members {
  color: #86909c;
  padding: 12px 16px;
  background-color: #f0f2f5;
  border-radius: 4px;
  margin-top: 5px;
  font-size: 14px;
  line-height: 1.6;
}

/* 标签样式优化 */
.member-tags .el-tag {
  padding: 6px 12px;
  height: auto;
  max-width: 180px;
  word-break: break-all;
  transition: all 0.2s; /* 增加过渡效果 */
}

/* 解决分割线与其他元素的重叠问题 */
.el-divider {
  position: relative;
  z-index: 1;
}

/* 无成员提示：优化样式，避免与其他元素紧贴 */
.no-members {
  color: #909399;
  padding: 12px 16px; /* 增加内边距，提升可读性 */
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.5; /* 行高优化，避免文本拥挤 */
}
.invite-btn {
  margin-bottom: 15px; /* 增加与下方标题的间距 */
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
.project-tabs {
  background-color: #f5f7fa;
  padding: 5px 15px;
  border-radius: 4px;
}
</style>