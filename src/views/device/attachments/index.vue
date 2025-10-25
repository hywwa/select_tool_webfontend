<template>
  <div class="app-container">
    <!-- 状态切换标签 -->
    <el-radio-group v-model="currentTab" @change="handleTabChange" class="mb8">
          <el-radio-button label="noAttachment">未添加附件设备</el-radio-button>
      <el-radio-button label="all">全部设备</el-radio-button>

    </el-radio-group>

    <!-- 砖机搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物料编码" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料描述" prop="materialDescription">
        <el-input
          v-model="queryParams.materialDescription"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最大砖宽" prop="brickSpec">
        <el-select
          v-model="queryParams.brickSpec"
          placeholder="请选择最大砖宽"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in brickSpecOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="移砖行程" prop="travelDistance">
        <el-select
          v-model="queryParams.travelDistance"
          placeholder="请选择移砖行程"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in travelDistanceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

       <!-- 砖机列表 -->
    <el-table v-loading="loading" :data="brickList" @selection-change="handleSelectionChange">
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- 查看附件按钮（所有有权限的用户可见） -->
          <el-button 
            link type="primary" 
            icon="Eye" 
            @click="handleViewAttachment(scope.row)"
            v-if="scope.row.brickAttachmentId"
            v-hasPermi="['device:attachments:query']"
          >
            查看附件
          </el-button>
          
          <!-- 管理附件按钮（仅管理员可见） -->
          <el-button 
            link type="primary" 
            icon="Setting" 
            @click="handleManageAttachment(scope.row)"
            v-hasPermi="['device:attachments:edit']"
          >
            {{ scope.row.brickAttachmentId ? '修改附件' : '添加附件' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料描述" align="center" prop="materialDescription" width="200"/>
      <el-table-column label="适用最大砖宽" align="center" prop="brickSpec" />
      <el-table-column label="移砖行程(mm)" align="center" prop="travelDistance" />
      <el-table-column label="样式" align="center" prop="style" />
      <el-table-column label="工位数" align="center" prop="workstationCount" />
      <el-table-column label="附件状态" align="center">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.brickAttachmentId">已添加</el-tag>
          <el-tag type="warning" v-else>未添加</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="notes" width="200"/>
    </el-table>
    

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

        <!-- 查看附件对话框（不含价格） -->
    <el-dialog :title="viewAttachmentTitle" v-model="viewAttachmentOpen" width="500px" append-to-body>
      <el-descriptions column="1" border>
        <el-descriptions-item label="备注">{{ viewAttachmentData.remark }}</el-descriptions-item>
        <el-descriptions-item label="功能">{{ viewAttachmentData.functionality }}</el-descriptions-item>
        <el-descriptions-item label="特殊配置">{{ viewAttachmentData.specialConfig }}</el-descriptions-item>
        <el-descriptions-item label="工作行程">{{ viewAttachmentData.workingStrokeMm }}</el-descriptions-item>
        <el-descriptions-item label="叠垛高度">{{ viewAttachmentData.stackingHeightMm }}</el-descriptions-item>
        <el-descriptions-item label="升降驱动">{{ viewAttachmentData.liftingDriveType }}</el-descriptions-item>
        <el-descriptions-item label="水平驱动">{{ viewAttachmentData.horizontalDriveType }}</el-descriptions-item>
        <el-descriptions-item label="耗气量">{{ viewAttachmentData.airConsumptionLpm }}</el-descriptions-item>
        <el-descriptions-item label="总功率">{{ viewAttachmentData.totalPowerKw }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ viewAttachmentData.creator }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewAttachmentData.createTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeViewAttachment">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 砖机附件管理对话框 -->
    <el-dialog :title="attachmentTitle" v-model="attachmentOpen" width="500px" append-to-body>
      <el-form ref="attachmentRef" :model="attachmentForm" :rules="attachmentRules" label-width="80px">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="attachmentForm.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="功能" prop="functionality">
          <el-input v-model="attachmentForm.functionality" placeholder="请输入功能" />
        </el-form-item>
        <el-form-item label="特殊配置" prop="specialConfig">
          <el-input v-model="attachmentForm.specialConfig" placeholder="请输入特殊配置" />
        </el-form-item>
        <el-form-item label="工作行程" prop="workingStrokeMm">
          <el-input v-model="attachmentForm.workingStrokeMm" placeholder="请输入工作行程" />
        </el-form-item>
        <el-form-item label="叠垛高度" prop="stackingHeightMm">
          <el-input v-model="attachmentForm.stackingHeightMm" placeholder="请输入叠垛高度" />
        </el-form-item>
        <el-form-item label="升降驱动" prop="liftingDriveType">
          <el-input v-model="attachmentForm.liftingDriveType" placeholder="请输入升降驱动形式" />
        </el-form-item>
        <el-form-item label="水平驱动" prop="horizontalDriveType">
          <el-input v-model="attachmentForm.horizontalDriveType" placeholder="请输入水平移动驱动形式" />
        </el-form-item>
        <el-form-item label="耗气量" prop="airConsumptionLpm">
          <el-input v-model="attachmentForm.airConsumptionLpm" placeholder="请输入耗气量" />
        </el-form-item>
        <el-form-item label="总功率" prop="totalPowerKw">
          <el-input v-model="attachmentForm.totalPowerKw" placeholder="请输入总功率" />
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <el-input v-model="attachmentForm.unitPrice" placeholder="请输入单价" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitAttachmentForm">确 定</el-button>
          <el-button @click="cancelAttachment">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="BrickAttachmentManagement">
// 导入砖机API（包含更新附件ID的接口）
import { listBrick, updateBrick } from "@/api/device/brick"
// 导入附件API（附件表无设备ID字段）
import { listAttachments, getAttachments, addAttachments, updateAttachments } from "@/api/device/attachments"
// 导入字典API
import { listFixeddropdownitems } from "@/api/device/fixeddropdownitems"

import { ref, reactive, getCurrentInstance, toRefs } from "vue"
import useUserStore from '@/store/modules/user'

const { proxy } = getCurrentInstance()

// 标签切换相关
const currentTab = ref('noAttachment') // all:全部设备 noAttachment:未添加附件设备

// 字典相关响应式变量
const dictOptions = reactive({
  brickSpecOptions: [],    // 最大砖宽字典选项
  travelDistanceOptions: [], // 移砖行程字典选项
  styleOptions: [],        // 样式字典选项
  workstationCountOptions: [] // 工位数字典选项
})

// 砖机列表相关变量
const brickList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const currentBrick = ref(null) // 当前选中的砖机

// 砖机查询参数
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    materialCode: null,
    materialDescription: null,
    brickSpec: null,
    travelDistance: null,
    style: null,
    workstationCount: null,
    brickAttachmentId: null // 用于筛选未添加附件的设备（null表示未添加）
  }
})

// 附件管理相关变量
const attachmentOpen = ref(false)
const attachmentTitle = ref("")
const attachmentForm = reactive({
  id: null,
  remark: null,
  functionality: null,
  specialConfig: null,
  workingStrokeMm: null,
  stackingHeightMm: null,
  liftingDriveType: null,
  horizontalDriveType: null,
  airConsumptionLpm: null,
  totalPowerKw: null,
  unitPrice: null,
  creator: null,
  createTime: null
})

// 附件表单校验规则
const attachmentRules = reactive({
  functionality: [
    { required: true, message: "请输入功能", trigger: "blur" }
  ]
})

// 新增：查看附件相关变量
const viewAttachmentOpen = ref(false)
const viewAttachmentTitle = ref("")
const viewAttachmentData = reactive({
  remark: null,
  functionality: null,
  specialConfig: null,
  workingStrokeMm: null,
  stackingHeightMm: null,
  liftingDriveType: null,
  horizontalDriveType: null,
  airConsumptionLpm: null,
  totalPowerKw: null,
  creator: null,
  createTime: null
})

/** 查看附件按钮操作（新增方法） */
function handleViewAttachment(row) {
  if (!row.brickAttachmentId) return
  
  getAttachments(row.brickAttachmentId).then(detailRes => {
    const attachmentDetail = detailRes.data
    // 填充查看表单数据（不含价格）
    viewAttachmentData.remark = attachmentDetail.remark
    viewAttachmentData.functionality = attachmentDetail.functionality
    viewAttachmentData.specialConfig = attachmentDetail.specialConfig
    viewAttachmentData.workingStrokeMm = attachmentDetail.workingStrokeMm
    viewAttachmentData.stackingHeightMm = attachmentDetail.stackingHeightMm
    viewAttachmentData.liftingDriveType = attachmentDetail.liftingDriveType
    viewAttachmentData.horizontalDriveType = attachmentDetail.horizontalDriveType
    viewAttachmentData.airConsumptionLpm = attachmentDetail.airConsumptionLpm
    viewAttachmentData.totalPowerKw = attachmentDetail.totalPowerKw
    viewAttachmentData.creator = attachmentDetail.creator
    viewAttachmentData.createTime = attachmentDetail.createTime
    
    viewAttachmentTitle.value = `查看砖机[${row.materialCode}]的附件`
    viewAttachmentOpen.value = true
  }).catch(error => {
    proxy.$modal.msgError("加载附件详情失败：" + error.message)
  })
}

/** 关闭查看附件对话框（新增方法） */
function closeViewAttachment() {
  viewAttachmentOpen.value = false
  // 清空查看数据
  Object.keys(viewAttachmentData).forEach(key => {
    viewAttachmentData[key] = null
  })
}

const { queryParams } = toRefs(data)
const { brickSpecOptions, travelDistanceOptions, styleOptions, workstationCountOptions } = toRefs(dictOptions)

/** 加载字典选项 */
function loadDictOptions() {
  // 加载“最大砖宽”字典
  listFixeddropdownitems({ category: "最大砖宽" }).then(res => {
    dictOptions.brickSpecOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });

  // 加载“移砖行程”字典
  listFixeddropdownitems({ category: "移砖行程", pageNum: 1, pageSize: 1000 }).then(res => {
    dictOptions.travelDistanceOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });

  // 加载“样式”字典
  listFixeddropdownitems({ category: "样式" }).then(res => {
    dictOptions.styleOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });

  // 加载“工位数”字典
  listFixeddropdownitems({ category: "工位数" }).then(res => {
    dictOptions.workstationCountOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });
}

function getList() {
    loading.value = true;
    // 清除之前的筛选条件
    delete queryParams.value.brickAttachmentId; 

    // 未添加附件标签：传递 0（数字类型），匹配后端默认值
    if (currentTab.value === 'noAttachment') {
        queryParams.value.brickAttachmentId = 0; // 这里直接写数字0，不是字符串
    }

    listBrick(queryParams.value).then(response => {
        brickList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
}

/** 标签切换事件 */
function handleTabChange() {
  queryParams.value.pageNum = 1
  getList()
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  // 保留逻辑，如需批量操作可扩展
}

/** 管理附件按钮操作 */
function handleManageAttachment(row) {
  currentBrick.value = row
  resetAttachmentForm()
  
  // 如果砖机已关联附件，查询附件详情
  if (row.brickAttachmentId) {
    getAttachments(row.brickAttachmentId).then(detailRes => {
      const attachmentDetail = detailRes.data
      // 填充表单数据
      attachmentForm.id = attachmentDetail.id
      attachmentForm.remark = attachmentDetail.remark
      attachmentForm.functionality = attachmentDetail.functionality
      attachmentForm.specialConfig = attachmentDetail.specialConfig
      attachmentForm.workingStrokeMm = attachmentDetail.workingStrokeMm
      attachmentForm.stackingHeightMm = attachmentDetail.stackingHeightMm
      attachmentForm.liftingDriveType = attachmentDetail.liftingDriveType
      attachmentForm.horizontalDriveType = attachmentDetail.horizontalDriveType
      attachmentForm.airConsumptionLpm = attachmentDetail.airConsumptionLpm
      attachmentForm.totalPowerKw = attachmentDetail.totalPowerKw
      attachmentForm.unitPrice = attachmentDetail.unitPrice
      attachmentForm.creator = attachmentDetail.creator
      attachmentTitle.value = `修改砖机[${row.materialCode}]的附件`
      attachmentOpen.value = true
    }).catch(error => {
      proxy.$modal.msgError("加载附件详情失败：" + error.message)
    })
  } else {
    // 未关联附件，进入新增模式
    attachmentForm.creator = useUserStore().name;
    attachmentForm.remark="安装在抛光内，具有上、下砖功能，上、下砖通过人工切换。";
    attachmentForm.functionality="安装在抛光线内，具有上/下砖功能；上、下砖通过人工按钮切换上下砖功能。";
    attachmentForm.specialConfig="配置风机+条形海绵吸盘+按钮盒";
    attachmentForm.stackingHeightMm="≤720";
    attachmentForm.liftingDriveType = "采用伺服电机+齿轮齿条驱动";
    attachmentForm.horizontalDriveType = "采用伺服电机+同步带驱动";
    attachmentForm.airConsumptionLpm = "≤450";
    attachmentForm.totalPowerKw = "4.7";
    attachmentTitle.value = `新增砖机[${row.materialCode}]的附件`
    attachmentOpen.value = true
  }
}

/** 重置附件表单 */
function resetAttachmentForm() {
  attachmentForm.id = null
  attachmentForm.remark = null
  attachmentForm.functionality = null
  attachmentForm.specialConfig = null
  attachmentForm.workingStrokeMm = null
  attachmentForm.stackingHeightMm = null
  attachmentForm.liftingDriveType = null
  attachmentForm.horizontalDriveType = null
  attachmentForm.airConsumptionLpm = null
  attachmentForm.totalPowerKw = null
  attachmentForm.unitPrice = null
  attachmentForm.creator = null
  
  if (proxy.$refs["attachmentRef"]) {
    proxy.resetForm("attachmentRef")
  }
}

/** 提交附件表单 */
function submitAttachmentForm() {
  proxy.$refs["attachmentRef"].validate(valid => {
    if (valid) {
      if (attachmentForm.id) {
        // 修改附件
        updateAttachments(attachmentForm).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          attachmentOpen.value = false
          getList() // 刷新列表
        }).catch(error => {
          proxy.$modal.msgError("修改失败：" + (error.response?.data?.msg || "网络异常"))
        })
      } else {
        // 新增附件（核心逻辑：先新增附件，再更新设备表关联ID）
        addAttachments(attachmentForm).then(attachRes => {
          const newAttachmentId = attachRes.data // 获取新增附件的ID
          
          // 更新砖机表的关联附件ID
          updateBrick({
            id: currentBrick.value.id,
            brickAttachmentId: newAttachmentId // 将设备表的附件ID设为新增附件的ID
          }).then(() => {
            proxy.$modal.msgSuccess("新增附件并关联成功")
            attachmentOpen.value = false
            getList() // 刷新列表
          }).catch(updateError => {
            // 设备表更新失败时，删除已创建的附件（回滚操作）
            proxy.$modal.confirm('附件创建成功，但设备关联失败，是否删除已创建的附件？').then(() => {
              // 调用删除附件接口
            }).finally(() => {
              proxy.$modal.msgError("设备关联失败：" + updateError.message)
            })
          })
        }).catch(error => {
          proxy.$modal.msgError("新增附件失败：" + (error.response?.data?.msg || "网络异常"))
        })
      }
    }
  })
}

/** 取消附件操作 */
function cancelAttachment() {
  attachmentOpen.value = false
  resetAttachmentForm()
}

// 初始化：先加载字典，再加载砖机列表
loadDictOptions()
getList()
</script>

<style scoped>
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.mb8 {
  margin-bottom: 8px;
}
.mb10 {
  margin-bottom: 10px;
}
</style>