<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物料编码" prop="goodCode">
        <el-input
          v-model="queryParams.goodCode"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料描述" prop="descxxtion">
        <el-input
          v-model="queryParams.descxxtion"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="摆渡车长度" prop="longToall">
        <el-input
          v-model="queryParams.longToall"
          placeholder="请输入摆渡车长度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="摆渡车上轨道内度" prop="longInner">
        <el-input
          v-model="queryParams.longInner"
          placeholder="请输入摆渡车上轨道内度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="坑宽" prop="kWidth">
        <el-input
          v-model="queryParams.kWidth"
          placeholder="请输入坑宽"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="有、无坑" prop="hasButt">
        <el-input
          v-model="queryParams.hasButt"
          placeholder="请输入有、无坑"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="定位模式" prop="gpsMode">
        <el-input
          v-model="queryParams.gpsMode"
          placeholder="请输入定位模式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电力形式" prop="eleMode">
        <el-input
          v-model="queryParams.eleMode"
          placeholder="请输入电力形式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行走电机" prop="walkDj">
        <el-input
          v-model="queryParams.walkDj"
          placeholder="请输入行走电机"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行走减速机速比" prop="walkSlow">
        <el-input
          v-model="queryParams.walkSlow"
          placeholder="请输入行走减速机速比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否带电气控制系统" prop="hasEleContro">
        <el-input
          v-model="queryParams.hasEleContro"
          placeholder="请输入是否带电气控制系统"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input
          v-model="queryParams.note"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="在用项目" prop="usePro">
        <el-input
          v-model="queryParams.usePro"
          placeholder="请输入在用项目"
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
      <el-table-column label="自增主键" align="center" prop="id" />
      <el-table-column label="物料编码" align="center" prop="goodCode" />
      <el-table-column label="物料描述" align="center" prop="descxxtion" />
      <el-table-column label="摆渡车长度" align="center" prop="longToall" />
      <el-table-column label="摆渡车上轨道内度" align="center" prop="longInner" />
      <el-table-column label="坑宽" align="center" prop="kWidth" />
      <el-table-column label="有、无坑" align="center" prop="hasButt" />
      <el-table-column label="定位模式" align="center" prop="gpsMode" />
      <el-table-column label="电力形式" align="center" prop="eleMode" />
      <el-table-column label="行走电机" align="center" prop="walkDj" />
      <el-table-column label="行走减速机速比" align="center" prop="walkSlow" />
      <el-table-column label="是否带电气控制系统" align="center" prop="hasEleContro" />
      <el-table-column label="备注" align="center" prop="note" />
      <el-table-column label="在用项目" align="center" prop="usePro" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
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
        <el-form-item label="物料编码" prop="goodCode">
          <el-input v-model="form.goodCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料描述" prop="descxxtion">
          <el-input v-model="form.descxxtion" placeholder="请输入物料描述" />
        </el-form-item>
        <el-form-item label="摆渡车长度" prop="longToall">
          <el-input v-model="form.longToall" placeholder="请输入摆渡车长度" />
        </el-form-item>
        <el-form-item label="摆渡车上轨道内度" prop="longInner">
          <el-input v-model="form.longInner" placeholder="请输入摆渡车上轨道内度" />
        </el-form-item>
        <el-form-item label="坑宽" prop="kWidth">
          <el-input v-model="form.kWidth" placeholder="请输入坑宽" />
        </el-form-item>
        <el-form-item label="有、无坑" prop="hasButt">
          <el-input v-model="form.hasButt" placeholder="请输入有、无坑" />
        </el-form-item>
        <el-form-item label="定位模式" prop="gpsMode">
          <el-input v-model="form.gpsMode" placeholder="请输入定位模式" />
        </el-form-item>
        <el-form-item label="电力形式" prop="eleMode">
          <el-input v-model="form.eleMode" placeholder="请输入电力形式" />
        </el-form-item>
        <el-form-item label="行走电机" prop="walkDj">
          <el-input v-model="form.walkDj" placeholder="请输入行走电机" />
        </el-form-item>
        <el-form-item label="行走减速机速比" prop="walkSlow">
          <el-input v-model="form.walkSlow" placeholder="请输入行走减速机速比" />
        </el-form-item>
        <el-form-item label="是否带电气控制系统" prop="hasEleContro">
          <el-input v-model="form.hasEleContro" placeholder="请输入是否带电气控制系统" />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="在用项目" prop="usePro">
          <el-input v-model="form.usePro" placeholder="请输入在用项目" />
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
    goodCode: null,
    descxxtion: null,
    longToall: null,
    longInner: null,
    kWidth: null,
    hasButt: null,
    gpsMode: null,
    eleMode: null,
    walkDj: null,
    walkSlow: null,
    hasEleContro: null,
    note: null,
    usePro: null,
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
    goodCode: null,
    descxxtion: null,
    longToall: null,
    longInner: null,
    kWidth: null,
    hasButt: null,
    gpsMode: null,
    eleMode: null,
    walkDj: null,
    walkSlow: null,
    hasEleContro: null,
    note: null,
    usePro: null,
    updateTime: null
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
