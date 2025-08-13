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
      <el-form-item label="物料描述" prop="goodDescription">
        <el-input
          v-model="queryParams.goodDescription"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车身总长" prop="lengthCar">
        <el-input
          v-model="queryParams.lengthCar"
          placeholder="请输入车身总长"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="托升支架长度" prop="tsLength">
        <el-input
          v-model="queryParams.tsLength"
          placeholder="请输入托升支架长度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="托升支架宽度" prop="tsWidth">
        <el-input
          v-model="queryParams.tsWidth"
          placeholder="请输入托升支架宽度"
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
      <el-form-item label="测试布尔" prop="testBool">
        <el-input
          v-model="queryParams.testBool"
          placeholder="请输入测试布尔"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="顶升结构" prop="swifArchitech">
        <el-input
          v-model="queryParams.swifArchitech"
          placeholder="请输入顶升结构"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="顶升电机" prop="liftMachine">
        <el-input
          v-model="queryParams.liftMachine"
          placeholder="请输入顶升电机"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行走电机" prop="walkMachine">
        <el-input
          v-model="queryParams.walkMachine"
          placeholder="请输入行走电机"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否带电气控制系统" prop="hsControl">
        <el-input
          v-model="queryParams.hsControl"
          placeholder="请输入是否带电气控制系统"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="test_length" prop="testLength">
        <el-input
          v-model="queryParams.testLength"
          placeholder="请输入test_length"
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
      <el-table-column label="自增主键" align="center" prop="id" />
      <el-table-column label="物料编码" align="center" prop="goodCode" />
      <el-table-column label="物料描述" align="center" prop="goodDescription" />
      <el-table-column label="车身总长" align="center" prop="lengthCar" />
      <el-table-column label="托升支架长度" align="center" prop="tsLength" />
      <el-table-column label="托升支架宽度" align="center" prop="tsWidth" />
      <el-table-column label="托升支架形式" align="center" prop="tsType" />
      <el-table-column label="定位模式" align="center" prop="gpsMode" />
      <el-table-column label="测试布尔" align="center" prop="testBool" />
      <el-table-column label="电力形式" align="center" prop="elecMode" />
      <el-table-column label="顶升结构" align="center" prop="swifArchitech" />
      <el-table-column label="顶升电机" align="center" prop="liftMachine" />
      <el-table-column label="行走电机" align="center" prop="walkMachine" />
      <el-table-column label="是否带电气控制系统" align="center" prop="hsControl" />
      <el-table-column label="备注" align="center" prop="note" />
      <el-table-column label="在用项目" align="center" prop="useProject" />
      <el-table-column label="test_length" align="center" prop="testLength" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['device:transport:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['device:transport:remove']">删除</el-button>
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

    <!-- 添加或修改运输车对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="transportRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料编码" prop="goodCode">
          <el-input v-model="form.goodCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料描述" prop="goodDescription">
          <el-input v-model="form.goodDescription" placeholder="请输入物料描述" />
        </el-form-item>
        <el-form-item label="车身总长" prop="lengthCar">
          <el-input v-model="form.lengthCar" placeholder="请输入车身总长" />
        </el-form-item>
        <el-form-item label="托升支架长度" prop="tsLength">
          <el-input v-model="form.tsLength" placeholder="请输入托升支架长度" />
        </el-form-item>
        <el-form-item label="托升支架宽度" prop="tsWidth">
          <el-input v-model="form.tsWidth" placeholder="请输入托升支架宽度" />
        </el-form-item>
        <el-form-item label="定位模式" prop="gpsMode">
          <el-input v-model="form.gpsMode" placeholder="请输入定位模式" />
        </el-form-item>
        <el-form-item label="测试布尔" prop="testBool">
          <el-input v-model="form.testBool" placeholder="请输入测试布尔" />
        </el-form-item>
        <el-form-item label="顶升结构" prop="swifArchitech">
          <el-input v-model="form.swifArchitech" placeholder="请输入顶升结构" />
        </el-form-item>
        <el-form-item label="顶升电机" prop="liftMachine">
          <el-input v-model="form.liftMachine" placeholder="请输入顶升电机" />
        </el-form-item>
        <el-form-item label="行走电机" prop="walkMachine">
          <el-input v-model="form.walkMachine" placeholder="请输入行走电机" />
        </el-form-item>
        <el-form-item label="是否带电气控制系统" prop="hsControl">
          <el-input v-model="form.hsControl" placeholder="请输入是否带电气控制系统" />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="在用项目" prop="useProject">
          <el-input v-model="form.useProject" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="test_length" prop="testLength">
          <el-input v-model="form.testLength" placeholder="请输入test_length" />
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
    goodCode: null,
    goodDescription: null,
    lengthCar: null,
    tsLength: null,
    tsWidth: null,
    tsType: null,
    gpsMode: null,
    testBool: null,
    elecMode: null,
    swifArchitech: null,
    liftMachine: null,
    walkMachine: null,
    hsControl: null,
    note: null,
    useProject: null,
    testLength: null,
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
    goodCode: null,
    goodDescription: null,
    lengthCar: null,
    tsLength: null,
    tsWidth: null,
    tsType: null,
    gpsMode: null,
    testBool: null,
    elecMode: null,
    swifArchitech: null,
    liftMachine: null,
    walkMachine: null,
    hsControl: null,
    note: null,
    useProject: null,
    testLength: null,
    updateTime: null
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
