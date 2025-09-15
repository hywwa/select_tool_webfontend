<template>
  <div class="app-container">
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
      <el-form-item label="坑宽" prop="ferryPitWidth">
        <el-input
          v-model="queryParams.ferryPitWidth"
          placeholder="请输入摆渡坑宽度(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关键特征" prop="ferryKeyFeature">
        <el-input
          v-model="queryParams.ferryKeyFeature"
          placeholder="请输入摆渡车关键特征"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最大砖宽" prop="maxBrickWidth">
        <el-input
          v-model="queryParams.maxBrickWidth"
          placeholder="请输入使用最大砖宽度(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="摆渡车长" prop="ferryLength">
        <el-input
          v-model="queryParams.ferryLength"
          placeholder="请输入摆渡车长度(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="轨道内宽" prop="trackWidth">
        <el-input
          v-model="queryParams.trackWidth"
          placeholder="请输入轨道内宽(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="定位模式" prop="positioning">
        <el-input
          v-model="queryParams.positioning"
          placeholder="请输入定位模式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行走电机" prop="motor">
        <el-input
          v-model="queryParams.motor"
          placeholder="请输入行走电机"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="液压功率" prop="hydraulicPower">
        <el-input
          v-model="queryParams.hydraulicPower"
          placeholder="请输入液压功率(KW)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="减速比" prop="reducerRatio">
        <el-input
          v-model="queryParams.reducerRatio"
          placeholder="请输入减速机速比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电气控制" prop="hasControl">
        <el-input
          v-model="queryParams.hasControl"
          placeholder="请输入有电气控制"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="notes">
        <el-input
          v-model="queryParams.notes"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="使用项目" prop="projects">
        <el-input
          v-model="queryParams.projects"
          placeholder="请输入使用项目"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['device:transfer:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['device:transfer:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:transfer:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['device:transfer:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="transferList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料描述" align="center" prop="materialDescription" width="200"/>
      <el-table-column label="摆渡坑宽度(mm)" align="center" prop="ferryPitWidth" />
      <el-table-column label="摆渡车关键特征" align="center" prop="ferryKeyFeature" />
      <el-table-column label="使用最大砖宽度(mm)" align="center" prop="maxBrickWidth" />
      <el-table-column label="摆渡车长度(mm)" align="center" prop="ferryLength" />
      <el-table-column label="轨道内宽(mm)" align="center" prop="trackWidth" />
      <el-table-column label="有无坑" align="center" prop="hasPit" />
      <el-table-column label="定位模式" align="center" prop="positioning" />
      <el-table-column label="电力形式" align="center" prop="powerType" />
      <el-table-column label="行走电机" align="center" prop="motor" />
      <el-table-column label="液压功率(KW)" align="center" prop="hydraulicPower" />
      <el-table-column label="减速机速比" align="center" prop="reducerRatio" />
      <el-table-column label="有电气控制" align="center" prop="hasControl" />
      <el-table-column label="备注" align="center" prop="notes" width="200"/>
      <el-table-column label="使用项目" align="center" prop="projects" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['device:transfer:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['device:transfer:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改摆渡车对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="transferRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料描述" prop="materialDescription">
          <el-input v-model="form.materialDescription" placeholder="请输入物料描述" />
        </el-form-item>
        <el-form-item label="摆渡坑宽度(mm)" prop="ferryPitWidth">
          <el-input v-model="form.ferryPitWidth" placeholder="请输入摆渡坑宽度(mm)" />
        </el-form-item>
        <el-form-item label="摆渡车关键特征" prop="ferryKeyFeature">
          <el-input v-model="form.ferryKeyFeature" placeholder="请输入摆渡车关键特征" />
        </el-form-item>
        <el-form-item label="使用最大砖宽度(mm)" prop="maxBrickWidth">
          <el-input v-model="form.maxBrickWidth" placeholder="请输入使用最大砖宽度(mm)" />
        </el-form-item>
        <el-form-item label="摆渡车长度(mm)" prop="ferryLength">
          <el-input v-model="form.ferryLength" placeholder="请输入摆渡车长度(mm)" />
        </el-form-item>
        <el-form-item label="轨道内宽(mm)" prop="trackWidth">
          <el-input v-model="form.trackWidth" placeholder="请输入轨道内宽(mm)" />
        </el-form-item>
        <el-form-item label="定位模式" prop="positioning">
          <el-input v-model="form.positioning" placeholder="请输入定位模式" />
        </el-form-item>
        <el-form-item label="行走电机" prop="motor">
          <el-input v-model="form.motor" placeholder="请输入行走电机" />
        </el-form-item>
        <el-form-item label="液压功率(KW)" prop="hydraulicPower">
          <el-input v-model="form.hydraulicPower" placeholder="请输入液压功率(KW)" />
        </el-form-item>
        <el-form-item label="减速机速比" prop="reducerRatio">
          <el-input v-model="form.reducerRatio" placeholder="请输入减速机速比" />
        </el-form-item>
        <el-form-item label="有电气控制" prop="hasControl">
          <el-input v-model="form.hasControl" placeholder="请输入有电气控制" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="使用项目" prop="projects">
          <el-input v-model="form.projects" placeholder="请输入使用项目" />
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

<script setup name="Transfer">
import { listTransfer, getTransfer, delTransfer, addTransfer, updateTransfer } from "@/api/device/transfer"

const { proxy } = getCurrentInstance()

const transferList = ref([])
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
    ferryPitWidth: null,
    ferryKeyFeature: null,
    maxBrickWidth: null,
    ferryLength: null,
    trackWidth: null,
    hasPit: null,
    positioning: null,
    powerType: null,
    motor: null,
    hydraulicPower: null,
    reducerRatio: null,
    hasControl: null,
    notes: null,
    projects: null
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询摆渡车列表 */
function getList() {
  loading.value = true
  listTransfer(queryParams.value).then(response => {
    transferList.value = response.rows
    total.value = response.total
    loading.value = false
  })
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
    ferryPitWidth: null,
    ferryKeyFeature: null,
    maxBrickWidth: null,
    ferryLength: null,
    trackWidth: null,
    hasPit: null,
    positioning: null,
    powerType: null,
    motor: null,
    hydraulicPower: null,
    reducerRatio: null,
    hasControl: null,
    notes: null,
    projects: null
  }
  proxy.resetForm("transferRef")
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

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加摆渡车"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getTransfer(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改摆渡车"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["transferRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateTransfer(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addTransfer(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除摆渡车编号为"' + _ids + '"的数据项？').then(function() {
    return delTransfer(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('device/transfer/export', {
    ...queryParams.value
  }, `transfer_${new Date().getTime()}.xlsx`)
}

getList()
</script>
