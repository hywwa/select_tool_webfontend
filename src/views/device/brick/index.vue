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
      <el-form-item label="物料描述" prop="goodDes">
        <el-input
          v-model="queryParams.goodDes"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="移砖行程" prop="moveLength">
        <el-input
          v-model="queryParams.moveLength"
          placeholder="请输入移砖行程"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提升速比" prop="liftBi">
        <el-input
          v-model="queryParams.liftBi"
          placeholder="请输入提升速比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提升齿轮直径" prop="liftD">
        <el-input
          v-model="queryParams.liftD"
          placeholder="请输入提升齿轮直径"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="水平驱动速比" prop="liftQb">
        <el-input
          v-model="queryParams.liftQb"
          placeholder="请输入水平驱动速比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="水平驱动轴径" prop="liftJj">
        <el-input
          v-model="queryParams.liftJj"
          placeholder="请输入水平驱动轴径"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="水平驱动同步带轮直径" prop="horiD">
        <el-input
          v-model="queryParams.horiD"
          placeholder="请输入水平驱动同步带轮直径"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="从动轴径" prop="followD">
        <el-input
          v-model="queryParams.followD"
          placeholder="请输入从动轴径"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="吸盘数量" prop="xpNum">
        <el-input
          v-model="queryParams.xpNum"
          placeholder="请输入吸盘数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="吸盘大小" prop="xpRange">
        <el-input
          v-model="queryParams.xpRange"
          placeholder="请输入吸盘大小"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电磁阀数量" prop="dcfNum">
        <el-input
          v-model="queryParams.dcfNum"
          placeholder="请输入电磁阀数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="真空发生器数量" prop="jkNum">
        <el-input
          v-model="queryParams.jkNum"
          placeholder="请输入真空发生器数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="叉砖口内空" prop="xzhuanK">
        <el-input
          v-model="queryParams.xzhuanK"
          placeholder="请输入叉砖口内空"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-date-picker clearable
          v-model="queryParams.updateTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择更新时间">
        </el-date-picker>
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
          v-hasPermi="['device:brick:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['device:brick:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:brick:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['device:brick:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brickList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增主键" align="center" prop="id" />
      <el-table-column label="物料编码" align="center" prop="goodCode" />
      <el-table-column label="物料描述" align="center" prop="goodDes" />
      <el-table-column label="适用砖规格" align="center" prop="suitType" />
      <el-table-column label="移砖行程" align="center" prop="moveLength" />
      <el-table-column label="样式" align="center" prop="type" />
      <el-table-column label="提升速比" align="center" prop="liftBi" />
      <el-table-column label="提升齿轮直径" align="center" prop="liftD" />
      <el-table-column label="水平驱动速比" align="center" prop="liftQb" />
      <el-table-column label="水平驱动轴径" align="center" prop="liftJj" />
      <el-table-column label="水平驱动同步带轮直径" align="center" prop="horiD" />
      <el-table-column label="从动轴径" align="center" prop="followD" />
      <el-table-column label="吸盘数量" align="center" prop="xpNum" />
      <el-table-column label="吸盘形式" align="center" prop="xpType" />
      <el-table-column label="吸盘大小" align="center" prop="xpRange" />
      <el-table-column label="电磁阀数量" align="center" prop="dcfNum" />
      <el-table-column label="电磁阀型号" align="center" prop="dcfType" />
      <el-table-column label="真空发生器数量" align="center" prop="jkNum" />
      <el-table-column label="真空发生器型号" align="center" prop="jkType" />
      <el-table-column label="叉砖口内空" align="center" prop="xzhuanK" />
      <el-table-column label="备注1" align="center" prop="note" />
      <el-table-column label="项目地址" align="center" prop="usePlace" />
      <el-table-column label="备注2" align="center" prop="note2" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['device:brick:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['device:brick:remove']">删除</el-button>
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

    <!-- 添加或修改砖机对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="brickRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料编码" prop="goodCode">
          <el-input v-model="form.goodCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料描述" prop="goodDes">
          <el-input v-model="form.goodDes" placeholder="请输入物料描述" />
        </el-form-item>
        <el-form-item label="移砖行程" prop="moveLength">
          <el-input v-model="form.moveLength" placeholder="请输入移砖行程" />
        </el-form-item>
        <el-form-item label="提升速比" prop="liftBi">
          <el-input v-model="form.liftBi" placeholder="请输入提升速比" />
        </el-form-item>
        <el-form-item label="提升齿轮直径" prop="liftD">
          <el-input v-model="form.liftD" placeholder="请输入提升齿轮直径" />
        </el-form-item>
        <el-form-item label="水平驱动速比" prop="liftQb">
          <el-input v-model="form.liftQb" placeholder="请输入水平驱动速比" />
        </el-form-item>
        <el-form-item label="水平驱动轴径" prop="liftJj">
          <el-input v-model="form.liftJj" placeholder="请输入水平驱动轴径" />
        </el-form-item>
        <el-form-item label="水平驱动同步带轮直径" prop="horiD">
          <el-input v-model="form.horiD" placeholder="请输入水平驱动同步带轮直径" />
        </el-form-item>
        <el-form-item label="从动轴径" prop="followD">
          <el-input v-model="form.followD" placeholder="请输入从动轴径" />
        </el-form-item>
        <el-form-item label="吸盘数量" prop="xpNum">
          <el-input v-model="form.xpNum" placeholder="请输入吸盘数量" />
        </el-form-item>
        <el-form-item label="吸盘大小" prop="xpRange">
          <el-input v-model="form.xpRange" placeholder="请输入吸盘大小" />
        </el-form-item>
        <el-form-item label="电磁阀数量" prop="dcfNum">
          <el-input v-model="form.dcfNum" placeholder="请输入电磁阀数量" />
        </el-form-item>
        <el-form-item label="真空发生器数量" prop="jkNum">
          <el-input v-model="form.jkNum" placeholder="请输入真空发生器数量" />
        </el-form-item>
        <el-form-item label="叉砖口内空" prop="xzhuanK">
          <el-input v-model="form.xzhuanK" placeholder="请输入叉砖口内空" />
        </el-form-item>
        <el-form-item label="备注1" prop="note">
          <el-input v-model="form.note" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="项目地址" prop="usePlace">
          <el-input v-model="form.usePlace" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注2" prop="note2">
          <el-input v-model="form.note2" type="textarea" placeholder="请输入内容" />
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

<script setup name="Brick">
import { listBrick, getBrick, delBrick, addBrick, updateBrick } from "@/api/device/brick"

const { proxy } = getCurrentInstance()

const brickList = ref([])
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
    goodDes: null,
    suitType: null,
    moveLength: null,
    type: null,
    liftBi: null,
    liftD: null,
    liftQb: null,
    liftJj: null,
    horiD: null,
    followD: null,
    xpNum: null,
    xpType: null,
    xpRange: null,
    dcfNum: null,
    dcfType: null,
    jkNum: null,
    jkType: null,
    xzhuanK: null,
    note: null,
    usePlace: null,
    note2: null,
    updateTime: null
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询砖机列表 */
function getList() {
  loading.value = true
  listBrick(queryParams.value).then(response => {
    brickList.value = response.rows
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
    goodDes: null,
    suitType: null,
    moveLength: null,
    type: null,
    liftBi: null,
    liftD: null,
    liftQb: null,
    liftJj: null,
    horiD: null,
    followD: null,
    xpNum: null,
    xpType: null,
    xpRange: null,
    dcfNum: null,
    dcfType: null,
    jkNum: null,
    jkType: null,
    xzhuanK: null,
    note: null,
    usePlace: null,
    note2: null,
    updateTime: null
  }
  proxy.resetForm("brickRef")
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
  title.value = "添加砖机"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getBrick(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改砖机"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["brickRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBrick(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBrick(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除砖机编号为"' + _ids + '"的数据项？').then(function() {
    return delBrick(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('device/brick/export', {
    ...queryParams.value
  }, `brick_${new Date().getTime()}.xlsx`)
}

getList()
</script>
