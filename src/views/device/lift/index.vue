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
      <el-form-item label="砖宽范围" prop="brickWidthRange">
        <el-input
          v-model="queryParams.brickWidthRange"
          placeholder="请输入适用砖宽度范围(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最大砖厚" prop="brickThickness">
        <el-input
          v-model="queryParams.brickThickness"
          placeholder="请输入最大砖厚度(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="线架宽度" prop="frameWidth">
        <el-input
          v-model="queryParams.frameWidth"
          placeholder="请输入安装适用线架宽度(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="拍齐气缸" prop="alignCylinder">
        <el-input
          v-model="queryParams.alignCylinder"
          placeholder="请输入拍齐气缸"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="顶升气缸" prop="liftCylinder">
        <el-input
          v-model="queryParams.liftCylinder"
          placeholder="请输入顶升气缸"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="托砖板长" prop="plateLength">
        <el-input
          v-model="queryParams.plateLength"
          placeholder="请输入托砖板长度(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="拍齐轮数" prop="alignWheelCount">
        <el-input
          v-model="queryParams.alignWheelCount"
          placeholder="请输入拍齐轮个数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="导向滑块" prop="guideSlider">
        <el-input
          v-model="queryParams.guideSlider"
          placeholder="请输入导向滑块"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="挡砖胶皮" prop="rubberThickness">
        <el-input
          v-model="queryParams.rubberThickness"
          placeholder="请输入挡砖胶皮厚度(mm)"
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
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料描述" align="center" prop="materialDescription" width="200"/>
      <el-table-column label="适用砖宽度范围(mm)" align="center" prop="brickWidthRange" />
      <el-table-column label="适用砖厚度(mm)" align="center" prop="brickThickness" />
      <el-table-column label="安装适用线架宽度(mm)" align="center" prop="frameWidth" />
      <el-table-column label="底架形式" align="center" prop="baseType" />
      <el-table-column label="拍齐气缸" align="center" prop="alignCylinder" />
      <el-table-column label="顶升气缸" align="center" prop="liftCylinder" />
      <el-table-column label="托砖板长度(mm)" align="center" prop="plateLength" />
      <el-table-column label="拍齐轮个数" align="center" prop="alignWheelCount" />
      <el-table-column label="导向形式" align="center" prop="guideType" />
      <el-table-column label="导向滑块" align="center" prop="guideSlider" />
      <el-table-column label="挡砖胶皮厚度(mm)" align="center" prop="rubberThickness" />
      <el-table-column label="备注" align="center" prop="notes" width="200"/>
      <el-table-column label="在用项目" align="center" prop="usedProjects" width="200"/>
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
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料描述" prop="materialDescription">
          <el-input v-model="form.materialDescription" placeholder="请输入物料描述" />
        </el-form-item>
        <el-form-item label="适用砖宽度范围(mm)" prop="brickWidthRange">
          <el-input v-model="form.brickWidthRange" placeholder="请输入适用砖宽度范围(mm)" />
        </el-form-item>
        <el-form-item label="适用砖厚度(mm)" prop="brickThickness">
          <el-input v-model="form.brickThickness" placeholder="请输入适用砖厚度(mm)" />
        </el-form-item>
        <el-form-item label="安装适用线架宽度(mm)" prop="frameWidth">
          <el-input v-model="form.frameWidth" placeholder="请输入安装适用线架宽度(mm)" />
        </el-form-item>
        <el-form-item label="拍齐气缸" prop="alignCylinder">
          <el-input v-model="form.alignCylinder" placeholder="请输入拍齐气缸" />
        </el-form-item>
        <el-form-item label="顶升气缸" prop="liftCylinder">
          <el-input v-model="form.liftCylinder" placeholder="请输入顶升气缸" />
        </el-form-item>
        <el-form-item label="托砖板长度(mm)" prop="plateLength">
          <el-input v-model="form.plateLength" placeholder="请输入托砖板长度(mm)" />
        </el-form-item>
        <el-form-item label="拍齐轮个数" prop="alignWheelCount">
          <el-input v-model="form.alignWheelCount" placeholder="请输入拍齐轮个数" />
        </el-form-item>
        <el-form-item label="导向滑块" prop="guideSlider">
          <el-input v-model="form.guideSlider" placeholder="请输入导向滑块" />
        </el-form-item>
        <el-form-item label="挡砖胶皮厚度(mm)" prop="rubberThickness">
          <el-input v-model="form.rubberThickness" placeholder="请输入挡砖胶皮厚度(mm)" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="在用项目" prop="usedProjects">
          <el-input v-model="form.usedProjects" type="textarea" placeholder="请输入内容" />
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
    materialCode: null,
    materialDescription: null,
    brickWidthRange: null,
    brickThickness: null,
    frameWidth: null,
    baseType: null,
    alignCylinder: null,
    liftCylinder: null,
    plateLength: null,
    alignWheelCount: null,
    guideType: null,
    guideSlider: null,
    rubberThickness: null,
    notes: null,
    usedProjects: null
  },
  rules: {
    materialCode: [
      { required: true, message: "物料编码不能为空", trigger: "blur" }
    ],
    materialDescription: [
      { required: true, message: "物料描述不能为空", trigger: "blur" }
    ],
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
    materialCode: null,
    materialDescription: null,
    brickWidthRange: null,
    brickThickness: null,
    frameWidth: null,
    baseType: null,
    alignCylinder: null,
    liftCylinder: null,
    plateLength: null,
    alignWheelCount: null,
    guideType: null,
    guideSlider: null,
    rubberThickness: null,
    notes: null,
    usedProjects: null
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
