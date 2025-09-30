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
      <el-form-item label="最大砖宽" prop="brickSpec">
        <el-input
          v-model="queryParams.brickSpec"
          placeholder="请输入最大砖宽"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="移砖行程" prop="travelDistance">
        <el-input
          v-model="queryParams.travelDistance"
          placeholder="请输入移砖行程(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="样式" prop="style">
        <el-input
          v-model="queryParams.style"
          placeholder="请输入样式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工位数" prop="workstationCount">
        <el-input
          v-model="queryParams.workstationCount"
          placeholder="请输入工位数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提升速比" prop="liftRatio">
        <el-input
          v-model="queryParams.liftRatio"
          placeholder="请输入提升速比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提升齿轮" prop="liftGearDiameter">
        <el-input
          v-model="queryParams.liftGearDiameter"
          placeholder="请输入提升齿轮直径(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="驱动速比" prop="driveRatio">
        <el-input
          v-model="queryParams.driveRatio"
          placeholder="请输入水平驱动速比"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="驱动轴径" prop="driveShaftDiameter">
        <el-input
          v-model="queryParams.driveShaftDiameter"
          placeholder="请输入水平驱动轴径(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="带轮直径" prop="drivePulleyDiameter">
        <el-input
          v-model="queryParams.drivePulleyDiameter"
          placeholder="请输入水平驱动同步带轮直径(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="从动轴径" prop="drivenShaftDiameter">
        <el-input
          v-model="queryParams.drivenShaftDiameter"
          placeholder="请输入从动轴径(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="吸盘数量" prop="suctionCupCount">
        <el-input
          v-model="queryParams.suctionCupCount"
          placeholder="请输入吸盘数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="吸盘形式" prop="suctionCupType">
        <el-input
          v-model="queryParams.suctionCupType"
          placeholder="请输入吸盘形式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="吸盘大小" prop="suctionCupSize">
        <el-input
          v-model="queryParams.suctionCupSize"
          placeholder="请输入吸盘大小(mm)"
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['device:brick:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['device:brick:remove']">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料描述" align="center" prop="materialDescription" width="200"/>
      <el-table-column label="适用最大砖宽" align="center" prop="brickSpec" />
      <el-table-column label="移砖行程(mm)" align="center" prop="travelDistance" />
      <el-table-column label="样式" align="center" prop="style" />
      <el-table-column label="工位数" align="center" prop="workstationCount" />
      <el-table-column label="提升速比" align="center" prop="liftRatio" />
      <el-table-column label="提升齿轮直径(mm)" align="center" prop="liftGearDiameter" />
      <el-table-column label="水平驱动速比" align="center" prop="driveRatio" />
      <el-table-column label="水平驱动轴径(mm)" align="center" prop="driveShaftDiameter" />
      <el-table-column label="水平驱动同步带轮直径(mm)" align="center" prop="drivePulleyDiameter" />
      <el-table-column label="从动轴径(mm)" align="center" prop="drivenShaftDiameter" />
      <el-table-column label="吸盘数量" align="center" prop="suctionCupCount" />
      <el-table-column label="吸盘形式" align="center" prop="suctionCupType" />
      <el-table-column label="吸盘大小(mm)" align="center" prop="suctionCupSize" />
      <el-table-column label="电磁阀数量" align="center" prop="solenoidValveCount" />
      <el-table-column label="电磁阀型号" align="center" prop="solenoidValveModel" />
      <el-table-column label="真空发生器数量" align="center" prop="vacuumGeneratorCount" />
      <el-table-column label="真空发生器型号" align="center" prop="vacuumGeneratorModel" />
      <el-table-column label="叉砖口内空(mm)" align="center" prop="forkOpening" />
      <el-table-column label="备注" align="center" prop="notes" width="200"/>
      <el-table-column label="在用项目" align="center" prop="usedProjects" width="200"/>
      
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
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料描述" prop="materialDescription">
          <el-input v-model="form.materialDescription" placeholder="请输入物料描述" />
        </el-form-item>
        <el-form-item label="最大砖宽" prop="brickSpec">
          <el-input v-model="form.brickSpec" placeholder="请输入适用最大砖宽" />
        </el-form-item>
        <el-form-item label="移砖行程" prop="travelDistance">
          <el-input v-model="form.travelDistance" placeholder="请输入移砖行程(mm)" />
        </el-form-item>
        <el-form-item label="样式" prop="style">
          <el-input v-model="form.style" placeholder="请输入样式" />
        </el-form-item>
        <el-form-item label="工位数" prop="workstationCount">
          <el-input v-model="form.workstationCount" placeholder="请输入工位数" />
        </el-form-item>
        <el-form-item label="提升速比" prop="liftRatio">
          <el-input v-model="form.liftRatio" placeholder="请输入提升速比" />
        </el-form-item>
        <el-form-item label="齿轮直径" prop="liftGearDiameter" >
          <el-input v-model="form.liftGearDiameter" placeholder="请输入提升齿轮直径(mm)" />
        </el-form-item>
        <el-form-item label="驱动速比" prop="driveRatio">
          <el-input v-model="form.driveRatio" placeholder="请输入水平驱动速比" />
        </el-form-item>
        <el-form-item label="驱动轴径" prop="driveShaftDiameter">
          <el-input v-model="form.driveShaftDiameter" placeholder="请输入水平驱动轴径(mm)" />
        </el-form-item>
        <el-form-item label="带轮直径" prop="drivePulleyDiameter">
          <el-input v-model="form.drivePulleyDiameter" placeholder="请输入水平驱动同步带轮直径(mm)" />
        </el-form-item>
        <el-form-item label="从动轴径" prop="drivenShaftDiameter">
          <el-input v-model="form.drivenShaftDiameter" placeholder="请输入从动轴径(mm)" />
        </el-form-item>
        <el-form-item label="吸盘数量" prop="suctionCupCount">
          <el-input v-model="form.suctionCupCount" placeholder="请输入吸盘数量" />
        </el-form-item>
          <el-form-item label="吸盘形式" prop="suctionCupType">
          <el-input v-model="form.suctionCupType" placeholder="请输入吸盘形式" />
        </el-form-item>
        <el-form-item label="吸盘大小" prop="suctionCupSize">
          <el-input v-model="form.suctionCupSize" placeholder="请输入吸盘大小(mm)" />
        </el-form-item>
        <el-form-item label="电磁阀数" prop="solenoidValveCount">
          <el-input v-model="form.solenoidValveCount" placeholder="请输入电磁阀数量" />
        </el-form-item>
        <el-form-item label="电磁阀型号" prop="solenoidValveModel">
          <el-input v-model="form.solenoidValveModel" placeholder="请输入电磁阀型号" />
        </el-form-item>
        <el-form-item label="真空发生器数量" prop="vacuumGeneratorCount">
          <el-input v-model="form.vacuumGeneratorCount" placeholder="请输入真空发生器数量" />
        </el-form-item>
        <el-form-item label="真空发生器型号" prop="vacuumGeneratorModel">
          <el-input v-model="form.vacuumGeneratorModel" placeholder="请输入真空发生器型号" />
        </el-form-item>
        <el-form-item label="叉砖口内空" prop="forkOpening">
          <el-input v-model="form.forkOpening" placeholder="请输入叉砖口内空(mm)" />
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

<script setup name="Brick">
import { listBrick, getBrick, delBrick, addBrick, updateBrick } from "@/api/device/brick"
// 首先在脚本开头静态导入axios，避免动态导入失败
import axios from 'axios'


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
    materialCode: null,
    materialDescription: null,
    brickSpec: null,
    travelDistance: null,
    style: null,
    workstationCount: null,
    liftRatio: null,
    liftGearDiameter: null,
    driveRatio: null,
    driveShaftDiameter: null,
    drivePulleyDiameter: null,
    drivenShaftDiameter: null,
    suctionCupCount: null,
    suctionCupType: null,
    suctionCupSize: null,
    solenoidValveCount: null,
    solenoidValveModel: null,
    vacuumGeneratorCount: null,
    vacuumGeneratorModel: null,
    forkOpening: null,
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
    brickSpec: [
      { required: true, message: "最大砖宽不能为空", trigger: "blur" }
    ],
    style: [
      { required: true, message: "样式不能为空", trigger: "blur" }
    ],
    workstationCount: [
      { required: true, message: "工位数不能为空", trigger: "blur" }
    ],
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
    materialCode: null,
    materialDescription: null,
    brickSpec: null,
    travelDistance: null,
    style: null,
    workstationCount: null,
    liftRatio: null,
    liftGearDiameter: null,
    driveRatio: null,
    driveShaftDiameter: null,
    drivePulleyDiameter: null,
    drivenShaftDiameter: null,
    suctionCupCount: null,
    suctionCupType: null,
    suctionCupSize: null,
    solenoidValveCount: null,
    solenoidValveModel: null,
    vacuumGeneratorCount: null,
    vacuumGeneratorModel: null,
    forkOpening: null,
    notes: null,
    usedProjects: null
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