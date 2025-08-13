<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="自增主键" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入自增主键"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料编码" prop="goodCode">
        <el-input
          v-model="queryParams.goodCode"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料描述" prop="goodDescriptin">
        <el-input
          v-model="queryParams.goodDescriptin"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="适用砖宽度范围" prop="suitWidth">
        <el-input
          v-model="queryParams.suitWidth"
          placeholder="请输入适用砖宽度范围"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="适用砖厚度" prop="suitThick">
        <el-input
          v-model="queryParams.suitThick"
          placeholder="请输入适用砖厚度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="安装适用线架宽度" prop="suitXjk">
        <el-input
          v-model="queryParams.suitXjk"
          placeholder="请输入安装适用线架宽度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="拍齐气缸" prop="sameGang">
        <el-input
          v-model="queryParams.sameGang"
          placeholder="请输入拍齐气缸"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="顶升气缸" prop="liftGang">
        <el-input
          v-model="queryParams.liftGang"
          placeholder="请输入顶升气缸"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="托砖板长度" prop="liftLength">
        <el-input
          v-model="queryParams.liftLength"
          placeholder="请输入托砖板长度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="拍齐轮个数" prop="liftLunNum">
        <el-input
          v-model="queryParams.liftLunNum"
          placeholder="请输入拍齐轮个数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="导向形式" prop="gpsMode">
        <el-input
          v-model="queryParams.gpsMode"
          placeholder="请输入导向形式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="挡砖胶皮厚度" prop="stopThick">
        <el-input
          v-model="queryParams.stopThick"
          placeholder="请输入挡砖胶皮厚度"
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
          v-hasPermi="['device:lift:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['device:lift:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:lift:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['device:lift:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="liftList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增主键" align="center" prop="id" />
      <el-table-column label="物料编码" align="center" prop="goodCode" />
      <el-table-column label="物料描述" align="center" prop="goodDescriptin" />
      <el-table-column label="适用砖宽度范围" align="center" prop="suitWidth" />
      <el-table-column label="适用砖厚度" align="center" prop="suitThick" />
      <el-table-column label="安装适用线架宽度" align="center" prop="suitXjk" />
      <el-table-column label="底架形式" align="center" prop="buttonMode" />
      <el-table-column label="拍齐气缸" align="center" prop="sameGang" />
      <el-table-column label="顶升气缸" align="center" prop="liftGang" />
      <el-table-column label="托砖板长度" align="center" prop="liftLength" />
      <el-table-column label="拍齐轮个数" align="center" prop="liftLunNum" />
      <el-table-column label="导向形式" align="center" prop="gpsMode" />
      <el-table-column label="导向滑块" align="center" prop="gpsHk" />
      <el-table-column label="挡砖胶皮厚度" align="center" prop="stopThick" />
      <el-table-column label="备注" align="center" prop="note" />
      <el-table-column label="在用项目" align="center" prop="useProject" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['device:lift:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['device:lift:remove']">删除</el-button>
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

    <!-- 添加或修改拍齐顶升对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="liftRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料编码" prop="goodCode">
          <el-input v-model="form.goodCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料描述" prop="goodDescriptin">
          <el-input v-model="form.goodDescriptin" placeholder="请输入物料描述" />
        </el-form-item>
        <el-form-item label="适用砖宽度范围" prop="suitWidth">
          <el-input v-model="form.suitWidth" placeholder="请输入适用砖宽度范围" />
        </el-form-item>
        <el-form-item label="适用砖厚度" prop="suitThick">
          <el-input v-model="form.suitThick" placeholder="请输入适用砖厚度" />
        </el-form-item>
        <el-form-item label="安装适用线架宽度" prop="suitXjk">
          <el-input v-model="form.suitXjk" placeholder="请输入安装适用线架宽度" />
        </el-form-item>
        <el-form-item label="拍齐气缸" prop="sameGang">
          <el-input v-model="form.sameGang" placeholder="请输入拍齐气缸" />
        </el-form-item>
        <el-form-item label="顶升气缸" prop="liftGang">
          <el-input v-model="form.liftGang" placeholder="请输入顶升气缸" />
        </el-form-item>
        <el-form-item label="托砖板长度" prop="liftLength">
          <el-input v-model="form.liftLength" placeholder="请输入托砖板长度" />
        </el-form-item>
        <el-form-item label="拍齐轮个数" prop="liftLunNum">
          <el-input v-model="form.liftLunNum" placeholder="请输入拍齐轮个数" />
        </el-form-item>
        <el-form-item label="导向形式" prop="gpsMode">
          <el-input v-model="form.gpsMode" placeholder="请输入导向形式" />
        </el-form-item>
        <el-form-item label="挡砖胶皮厚度" prop="stopThick">
          <el-input v-model="form.stopThick" placeholder="请输入挡砖胶皮厚度" />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="在用项目" prop="useProject">
          <el-input v-model="form.useProject" type="textarea" placeholder="请输入内容" />
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

<script setup name="Lift">
import { listLift, getLift, delLift, addLift, updateLift } from "@/api/device/lift"

const { proxy } = getCurrentInstance()

const liftList = ref([])
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
    id: null,
    goodCode: null,
    goodDescriptin: null,
    suitWidth: null,
    suitThick: null,
    suitXjk: null,
    buttonMode: null,
    sameGang: null,
    liftGang: null,
    liftLength: null,
    liftLunNum: null,
    gpsMode: null,
    gpsHk: null,
    stopThick: null,
    note: null,
    useProject: null,
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询拍齐顶升列表 */
function getList() {
  loading.value = true
  listLift(queryParams.value).then(response => {
    liftList.value = response.rows
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
    goodDescriptin: null,
    suitWidth: null,
    suitThick: null,
    suitXjk: null,
    buttonMode: null,
    sameGang: null,
    liftGang: null,
    liftLength: null,
    liftLunNum: null,
    gpsMode: null,
    gpsHk: null,
    stopThick: null,
    note: null,
    useProject: null,
    updateTime: null
  }
  proxy.resetForm("liftRef")
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
  title.value = "添加拍齐顶升"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getLift(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改拍齐顶升"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["liftRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateLift(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addLift(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除拍齐顶升编号为"' + _ids + '"的数据项？').then(function() {
    return delLift(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('device/lift/export', {
    ...queryParams.value
  }, `lift_${new Date().getTime()}.xlsx`)
}

getList()
</script>
