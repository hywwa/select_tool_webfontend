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
      <el-form-item label="坑宽" prop="pitWidth">
        <el-input
          v-model="queryParams.pitWidth"
          placeholder="请输入坑宽(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
   
      <el-form-item label="车身总长" prop="vehicleLength">
        <el-input
          v-model="queryParams.vehicleLength"
          placeholder="请输入车身总长(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支架长" prop="supportLength">
        <el-input
          v-model="queryParams.supportLength"
          placeholder="请输入托升支架长度(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支架宽" prop="supportWidth">
        <el-input
          v-model="queryParams.supportWidth"
          placeholder="请输入托升支架宽度(mm)"
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
      <el-form-item label="顶升结构" prop="liftingMechanism">
        <el-input
          v-model="queryParams.liftingMechanism"
          placeholder="请输入顶升结构"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="顶升电机" prop="liftingMotor">
        <el-input
          v-model="queryParams.liftingMotor"
          placeholder="请输入顶升电机"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行走电机" prop="travelMotor">
        <el-input
          v-model="queryParams.travelMotor"
          placeholder="请输入行走电机"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="减速比" prop="reducerRatio">
        <el-input
          v-model="queryParams.reducerRatio"
          placeholder="请输入行走减速机速比"
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
          v-hasPermi="['device:transport:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['device:transport:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:transport:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['device:transport:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="transportList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['device:transport:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['device:transport:remove']">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料描述" align="center" prop="materialDescription" width="200"/>
      <el-table-column label="坑宽(mm)" align="center" prop="pitWidth" />
      <el-table-column label="600规格砖片数(片)" align="center" prop="brickCount600" />
      <el-table-column label="600X1200规格砖片数(片)" align="center" prop="brickCount600x1200" />
      <el-table-column label="车身总长(mm)" align="center" prop="vehicleLength" />
      <el-table-column label="托升支架长度(mm)" align="center" prop="supportLength" />
      <el-table-column label="托升支架宽度(mm)" align="center" prop="supportWidth" />
      <el-table-column label="托升支架形式" align="center" prop="supportType" />
      <el-table-column label="定位模式" align="center" prop="positioning" />
      <el-table-column label="电力形式" align="center" prop="powerType" />
      <el-table-column label="顶升结构" align="center" prop="liftingMechanism" />
      <el-table-column label="顶升电机" align="center" prop="liftingMotor" />
      <el-table-column label="行走电机" align="center" prop="travelMotor" />
      <el-table-column label="行走减速机速比" align="center" prop="reducerRatio" />
      <el-table-column label="有电气控制" align="center" prop="hasControl" />
      <el-table-column label="备注" align="center" prop="notes" />
      <el-table-column label="使用项目" align="center" prop="projects" />
      
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改运输车对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="transportRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料描述" prop="materialDescription">
          <el-input v-model="form.materialDescription" placeholder="请输入物料描述" />
        </el-form-item>
        <el-form-item label="坑宽(mm)" prop="pitWidth">
          <el-input v-model="form.pitWidth" placeholder="请输入坑宽(mm)" />
        </el-form-item>
        <el-form-item label="600砖片数" prop="brickCount600">
          <el-input v-model="form.brickCount600" placeholder="请输入600规格砖片数(片)" />
        </el-form-item>
        <el-form-item label="600X1200砖片数" prop="brickCount600x1200">
          <el-input v-model="form.brickCount600x1200" placeholder="请输入600X1200规格砖片数(片)" />
        </el-form-item>
        <el-form-item label="车身总长" prop="vehicleLength">
          <el-input v-model="form.vehicleLength" placeholder="请输入车身总长(mm)" />
        </el-form-item>
        <el-form-item label="托升支架长度" prop="supportLength">
          <el-input v-model="form.supportLength" placeholder="请输入托升支架长度(mm)" />
        </el-form-item>
        <el-form-item label="托升支架宽度" prop="supportWidth">
          <el-input v-model="form.supportWidth" placeholder="请输入托升支架宽度(mm)" />
        </el-form-item>
        <el-form-item label="定位模式" prop="positioning">
          <el-input v-model="form.positioning" placeholder="请输入定位模式" />
        </el-form-item>
        <el-form-item label="顶升结构" prop="liftingMechanism">
          <el-input v-model="form.liftingMechanism" placeholder="请输入顶升结构" />
        </el-form-item>
        <el-form-item label="顶升电机" prop="liftingMotor">
          <el-input v-model="form.liftingMotor" placeholder="请输入顶升电机" />
        </el-form-item>
        <el-form-item label="行走电机" prop="travelMotor">
          <el-input v-model="form.travelMotor" placeholder="请输入行走电机" />
        </el-form-item>
        <el-form-item label="行走减速机速比" prop="reducerRatio">
          <el-input v-model="form.reducerRatio" placeholder="请输入行走减速机速比" />
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

<script setup name="Transport">
import { listTransport, getTransport, delTransport, addTransport, updateTransport } from "@/api/device/transport"

const { proxy } = getCurrentInstance()

const transportList = ref([])
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
    pitWidth: null,
    brickCount600: null,
    brickCount600x1200: null,
    vehicleLength: null,
    supportLength: null,
    supportWidth: null,
    supportType: null,
    positioning: null,
    powerType: null,
    liftingMechanism: null,
    liftingMotor: null,
    travelMotor: null,
    reducerRatio: null,
    hasControl: null,
    notes: null,
    projects: null
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询运输车列表 */
function getList() {
  loading.value = true
  listTransport(queryParams.value).then(response => {
    transportList.value = response.rows
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
    pitWidth: null,
    brickCount600: null,
    brickCount600x1200: null,
    vehicleLength: null,
    supportLength: null,
    supportWidth: null,
    supportType: null,
    positioning: null,
    powerType: null,
    liftingMechanism: null,
    liftingMotor: null,
    travelMotor: null,
    reducerRatio: null,
    hasControl: null,
    notes: null,
    projects: null
  }
  proxy.resetForm("transportRef")
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
  title.value = "添加运输车"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getTransport(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改运输车"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["transportRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateTransport(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addTransport(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除运输车编号为"' + _ids + '"的数据项？').then(function() {
    return delTransport(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('device/transport/export', {
    ...queryParams.value
  }, `transport_${new Date().getTime()}.xlsx`)
}

getList()
</script>
