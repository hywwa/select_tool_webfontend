<template>
  <div class="app-container">
    <!-- 状态切换标签 -->
    <el-radio-group v-model="currentTab" @change="handleTabChange" class="mb8">
      <el-radio-button label="noAttachment">未添加附件设备</el-radio-button>
      <el-radio-button label="all">全部设备</el-radio-button>
      
    </el-radio-group>

    <!-- 摆渡车搜索表单 -->
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
      <el-form-item label="摆渡坑宽" prop="ferryPitWidth">
        <el-select
          v-model="queryParams.ferryPitWidth"
          placeholder="请选择摆渡坑宽"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in ferryPitWidthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键特征" prop="ferryKeyFeature">
        <el-select
          v-model="queryParams.ferryKeyFeature"
          placeholder="请选择关键特征"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in ferryKeyFeatureOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最大砖宽" prop="maxBrickWidth">
        <el-select
          v-model="queryParams.maxBrickWidth"
          placeholder="请选择最大砖宽"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in maxBrickWidthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电气控制" prop="hasControl">
        <el-select
          v-model="queryParams.hasControl"
          placeholder="请选择是否有电气控制"
          clearable
          style="width: 180px"
        >
          <el-option label="是" value="是"></el-option>
          <el-option label="否" value="否"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

     <!-- 摆渡车列表 -->
    <el-table v-loading="loading" :data="transferList" @selection-change="handleSelectionChange">
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- 查看附件按钮（所有有权限的用户可见） -->
          <el-button 
            link type="primary" 
            icon="Eye" 
            @click="handleViewAttachment(scope.row)"
            v-if="scope.row.transferAttachmentId"
            v-hasPermi="['device:transferattachments:query']"
          >
            查看附件
          </el-button>
          
          <!-- 管理附件按钮（仅管理员可见） -->
          <el-button 
            link type="primary" 
            icon="Setting" 
            @click="handleManageAttachment(scope.row)"
            v-hasPermi="['device:transferattachments:edit']"
          >
            {{ scope.row.transferAttachmentId ? '修改附件' : '添加附件' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料描述" align="center" prop="materialDescription" width="200"/>
      <el-table-column label="摆渡坑宽度(mm)" align="center" prop="ferryPitWidth" />
      <el-table-column label="摆渡车关键特征" align="center" prop="ferryKeyFeature" />
      <el-table-column label="使用最大砖宽度(mm)" align="center" prop="maxBrickWidth" />
      <el-table-column label="摆渡车长度(mm)" align="center" prop="ferryLength" />
      <el-table-column label="轨道内宽(mm)" align="center" prop="trackWidth" />
      <el-table-column label="电力形式" align="center" prop="powerType" />
      <el-table-column label="有电气控制" align="center">
        <template #default="scope">
          {{ scope.row.hasControl === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="附件状态" align="center">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.transferAttachmentId">已添加</el-tag>
          <el-tag type="warning" v-else>未添加</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="使用项目" align="center" prop="projects" />
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
        <el-descriptions-item label="最大载重(Kg)">{{ viewAttachmentData.maxLoadKg }}</el-descriptions-item>
        <el-descriptions-item label="运行速度">{{ viewAttachmentData.runningSpeedMpm }}</el-descriptions-item>
        <el-descriptions-item label="驱动形式">{{ viewAttachmentData.driveType }}</el-descriptions-item>
        <el-descriptions-item label="总功率">{{ viewAttachmentData.totalPowerKw }}</el-descriptions-item>
        <el-descriptions-item label="外形尺寸">{{ viewAttachmentData.overallDimensions }}</el-descriptions-item>
        <el-descriptions-item label="设备总重(Kg)">{{ viewAttachmentData.totalWeightKg }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ viewAttachmentData.creator }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewAttachmentData.createTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeViewAttachment">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 摆渡车附件管理对话框 -->
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
        <el-form-item label="最大载重" prop="maxLoadKg">
          <el-input v-model="attachmentForm.maxLoadKg" placeholder="请输入最大载重量(Kg)" />
        </el-form-item>
        <el-form-item label="运行速度" prop="runningSpeedMpm">
          <el-input v-model="attachmentForm.runningSpeedMpm" placeholder="请输入运行速度" />
        </el-form-item>
        <el-form-item label="驱动形式" prop="driveType">
          <el-input v-model="attachmentForm.driveType" placeholder="请输入驱动形式" />
        </el-form-item>
        <el-form-item label="总功率" prop="totalPowerKw">
          <el-input v-model="attachmentForm.totalPowerKw" placeholder="请输入总功率" />
        </el-form-item>
        <el-form-item label="外形尺寸" prop="overallDimensions">
          <el-input v-model="attachmentForm.overallDimensions" placeholder="请输入外形尺寸" />
        </el-form-item>
        <el-form-item label="设备总重" prop="totalWeightKg">
          <el-input v-model="attachmentForm.totalWeightKg" placeholder="请输入设备总重约(Kg)" />
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

<script setup name="TransferAttachmentManagement">
// 导入摆渡车API（包含更新附件ID的接口）
import { listTransfer, updateTransfer } from "@/api/device/transfer"
// 导入附件API
import { listTransferattachments, getTransferattachments, addTransferattachments, updateTransferattachments } from "@/api/device/transferattachments"
// 导入字典API
import { listFixeddropdownitems } from "@/api/device/fixeddropdownitems"

import { ref, reactive, getCurrentInstance, toRefs } from "vue"
import useUserStore from '@/store/modules/user'

const { proxy } = getCurrentInstance()

// 标签切换相关
const currentTab = ref('noAttachment') // all:全部设备 noAttachment:未添加附件设备

// 字典相关响应式变量
const dictOptions = reactive({
  ferryPitWidthOptions: [],    // 摆渡坑宽字典选项
  ferryKeyFeatureOptions: [],  // 摆渡车关键特征字典选项
  maxBrickWidthOptions: []     // 最大砖宽度字典选项
})

// 摆渡车列表相关变量
const transferList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const currentTransfer = ref(null) // 当前选中的摆渡车

// 摆渡车查询参数
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    materialCode: null,
    materialDescription: null,
    ferryPitWidth: null,
    ferryKeyFeature: null,
    maxBrickWidth: null,
    hasControl: null,
    transferAttachmentId: null // 用于筛选未添加附件的设备（null表示未添加）
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
  maxLoadKg: null,
  runningSpeedMpm: null,
  driveType: null,
  totalPowerKw: null,
  overallDimensions: null,
  totalWeightKg: null,
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
  maxLoadKg: null,
  runningSpeedMpm: null,
  driveType: null,
  totalPowerKw: null,
  overallDimensions: null,
  totalWeightKg: null,
  creator: null,
  createTime: null
})

const { queryParams } = toRefs(data)
const { ferryPitWidthOptions, ferryKeyFeatureOptions, maxBrickWidthOptions } = toRefs(dictOptions)

/** 加载字典选项 */
function loadDictOptions() {
  // 加载“摆渡坑宽”字典
  listFixeddropdownitems({ category: "摆渡坑宽" }).then(res => {
    dictOptions.ferryPitWidthOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });

  // 加载“摆渡车关键特征”字典
  listFixeddropdownitems({ category: "摆渡车关键特征" }).then(res => {
    dictOptions.ferryKeyFeatureOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });

  // 加载“最大砖宽度”字典
  listFixeddropdownitems({ category: "最大砖宽度" }).then(res => {
    dictOptions.maxBrickWidthOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });
}

/** 查询摆渡车列表 */
function getList() {
  loading.value = true
  delete queryParams.value.brickAttachmentId; 
  // 根据当前标签设置查询参数
  if (currentTab.value === 'noAttachment') {
    queryParams.value.transferAttachmentId = 0 // 只查询未添加附件的设备
  }  else {
    // 全部设备：删除该参数，不进行附件筛选
    delete queryParams.value.transferAttachmentId; 
  }

  // 处理电气控制的搜索参数转换
  const params = { ...queryParams.value }
  if (params.hasControl === "是") {
    params.hasControl = 1
  } else if (params.hasControl === "否") {
    params.hasControl = 0
  } else {
    params.hasControl = null
  }

  listTransfer(params).then(response => {
    transferList.value = response.rows
    total.value = response.total
    loading.value = false
  })
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
  queryParams.value.hasControl = null
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  // 保留逻辑，如需批量操作可扩展
}

/** 管理附件按钮操作 */
function handleManageAttachment(row) {
  currentTransfer.value = row
  resetAttachmentForm()
  
  // 如果摆渡车已关联附件，查询附件详情
  if (row.transferAttachmentId) {
    getTransferattachments(row.transferAttachmentId).then(detailRes => {
      const attachmentDetail = detailRes.data
      // 填充表单数据
      attachmentForm.id = attachmentDetail.id
      attachmentForm.remark = attachmentDetail.remark
      attachmentForm.functionality = attachmentDetail.functionality
      attachmentForm.specialConfig = attachmentDetail.specialConfig
      attachmentForm.maxLoadKg = attachmentDetail.maxLoadKg
      attachmentForm.runningSpeedMpm = attachmentDetail.runningSpeedMpm
      attachmentForm.driveType = attachmentDetail.driveType
      attachmentForm.totalPowerKw = attachmentDetail.totalPowerKw
      attachmentForm.overallDimensions = attachmentDetail.overallDimensions
      attachmentForm.totalWeightKg = attachmentDetail.totalWeightKg
      attachmentForm.unitPrice = attachmentDetail.unitPrice
      attachmentForm.creator = attachmentDetail.creator
      attachmentTitle.value = `修改摆渡车[${row.materialCode}]的附件`
      attachmentOpen.value = true
    }).catch(error => {
      proxy.$modal.msgError("加载附件详情失败：" + error.message)
    })
  } else {
    // 未关联附件，进入新增模式
    attachmentForm.creator = useUserStore().name;
    attachmentForm.remark = "下2台，上2台";
      attachmentForm.functionality = "通过摆渡轨道，把运输车送至到不同轨道。";
      attachmentForm.maxLoadKg = "5500";
      attachmentForm.runningSpeedMpm = "≤20";
      attachmentForm.driveType = "采用变频调速，齿轮减速器带动齿轮齿条驱动"
      attachmentForm.totalPowerKw = "2.2";
      attachmentForm.overallDimensions = "4200×1300×680";
      attachmentForm.totalWeightKg = "710";
    attachmentTitle.value = `新增摆渡车[${row.materialCode}]的附件`
    attachmentOpen.value = true
  }
}

/** 重置附件表单 */
function resetAttachmentForm() {
  attachmentForm.id = null
  attachmentForm.remark = null
  attachmentForm.functionality = null
  attachmentForm.specialConfig = null
  attachmentForm.maxLoadKg = null
  attachmentForm.runningSpeedMpm = null
  attachmentForm.driveType = null
  attachmentForm.totalPowerKw = null
  attachmentForm.overallDimensions = null
  attachmentForm.totalWeightKg = null
  attachmentForm.unitPrice = null
  attachmentForm.creator = null
  
  if (proxy.$refs["attachmentRef"]) {
    proxy.resetForm("attachmentRef")
  }
}

// 新增：查看附件方法
function handleViewAttachment(row) {
  if (!row.transferAttachmentId) return
  
  getTransferattachments(row.transferAttachmentId).then(detailRes => {
    const attachmentDetail = detailRes.data
    // 填充查看数据（不含价格）
    viewAttachmentData.remark = attachmentDetail.remark
    viewAttachmentData.functionality = attachmentDetail.functionality
    viewAttachmentData.specialConfig = attachmentDetail.specialConfig
    viewAttachmentData.maxLoadKg = attachmentDetail.maxLoadKg
    viewAttachmentData.runningSpeedMpm = attachmentDetail.runningSpeedMpm
    viewAttachmentData.driveType = attachmentDetail.driveType
    viewAttachmentData.totalPowerKw = attachmentDetail.totalPowerKw
    viewAttachmentData.overallDimensions = attachmentDetail.overallDimensions
    viewAttachmentData.totalWeightKg = attachmentDetail.totalWeightKg
    viewAttachmentData.creator = attachmentDetail.creator
    viewAttachmentData.createTime = attachmentDetail.createTime
    
    viewAttachmentTitle.value = `查看摆渡车[${row.materialCode}]的附件`
    viewAttachmentOpen.value = true
  }).catch(error => {
    proxy.$modal.msgError("加载附件详情失败：" + error.message)
  })
}

// 新增：关闭查看附件对话框
function closeViewAttachment() {
  viewAttachmentOpen.value = false
  // 清空查看数据
  Object.keys(viewAttachmentData).forEach(key => {
    viewAttachmentData[key] = null
  })
}

/** 提交附件表单 */
function submitAttachmentForm() {
  proxy.$refs["attachmentRef"].validate(valid => {
    if (valid) {
      if (attachmentForm.id) {
        // 修改附件
        updateTransferattachments(attachmentForm).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          attachmentOpen.value = false
          getList() // 刷新列表
        }).catch(error => {
          proxy.$modal.msgError("修改失败：" + (error.response?.data?.msg || "网络异常"))
        })
      } else {
        // 新增附件（核心逻辑：先新增附件，再更新设备表关联ID）
        addTransferattachments(attachmentForm).then(attachRes => {
          const newAttachmentId = attachRes.data // 获取新增附件的ID
          
          // 更新摆渡车表的关联附件ID
          updateTransfer({
            id: currentTransfer.value.id,
            transferAttachmentId: newAttachmentId // 将设备表的附件ID设为新增附件的ID
          }).then(() => {
            proxy.$modal.msgSuccess("新增附件并关联成功")
            attachmentOpen.value = false
            getList() // 刷新列表
          }).catch(updateError => {
            // 设备表更新失败时，删除已创建的附件（回滚操作）
            proxy.$modal.confirm('附件创建成功，但设备关联失败，是否删除已创建的附件？').then(() => {
              // 调用删除附件接口（需后端提供）
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

// 初始化：先加载字典，再加载摆渡车列表
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