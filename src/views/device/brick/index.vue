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
      <!-- 最大砖宽改为下拉选择 -->
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
        <el-input
          v-model="queryParams.travelDistance"
          placeholder="请输入移砖行程(mm)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- 样式改为下拉选择 -->
      <el-form-item label="样式" prop="style">
        <el-select
          v-model="queryParams.style"
          placeholder="请选择样式"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in styleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 工位数改为下拉选择 -->
      <el-form-item label="工位数" prop="workstationCount">
        <el-select
          v-model="queryParams.workstationCount"
          placeholder="请选择工位数"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in workstationCountOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
        <!-- 最大砖宽改为下拉选择+管理按钮 -->
        <el-form-item label="最大砖宽" prop="brickSpec">
          <div class="flex items-center">
            <el-select
              v-model="form.brickSpec"
              placeholder="请选择最大砖宽"
              style="width: 320px"
            >
              <el-option
                v-for="item in brickSpecOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              icon="Setting"
              @click="openDictDialog('最大砖宽')"
              style="margin-left: 10px"
            >
              管理
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="移砖行程" prop="travelDistance">
          <el-input v-model="form.travelDistance" placeholder="请输入移砖行程(mm)" />
        </el-form-item>
        <!-- 样式改为下拉选择+管理按钮 -->
        <el-form-item label="样式" prop="style">
          <div class="flex items-center">
            <el-select
              v-model="form.style"
              placeholder="请选择样式"
              style="width: 320px"
            >
              <el-option
                v-for="item in styleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              icon="Setting"
              @click="openDictDialog('样式')"
              style="margin-left: 10px"
            >
              管理
            </el-button>
          </div>
        </el-form-item>
        <!-- 工位数改为下拉选择+管理按钮 -->
        <el-form-item label="工位数" prop="workstationCount">
          <div class="flex items-center">
            <el-select
              v-model="form.workstationCount"
              placeholder="请选择工位数"
              style="width: 320px"
            >
              <el-option
                v-for="item in workstationCountOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              icon="Setting"
              @click="openDictDialog('工位数')"
              style="margin-left: 10px"
            >
              管理
            </el-button>
          </div>
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

    <!-- 字典管理弹窗 -->
    <el-dialog :title="dictDialog.title" v-model="dictDialog.open" width="500px" append-to-body>
      <!-- 字典表单 -->
      <el-form ref="dictRef" :model="dictDialog.form" :rules="dictDialog.rules" label-width="80px" class="mb10">
        <el-form-item label="参数类型" prop="category">
          <el-select
            v-model="dictDialog.form.category"
            placeholder="请选择参数类型"
            :disabled="true"
          >
            <el-option label="最大砖宽" value="最大砖宽"></el-option>
            <el-option label="样式" value="样式"></el-option>
            <el-option label="工位数" value="工位数"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典值" prop="itemName">
          <el-input
            v-model="dictDialog.form.itemName"
            placeholder="请输入字典值（如：1200mm、双列、6工位）"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitDictForm">保存</el-button>
          <el-button @click="dictDialog.open = false">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 字典列表表格 -->
      <el-table :data="dictDialog.dictList" border size="mini" style="width: 100%">
        <el-table-column label="字典值" prop="itemName" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-button
              type="text"
              icon="Edit"
              size="mini"
              @click="handleDictEdit(scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              icon="Delete"
              size="mini"
              @click="handleDictDelete(scope.row)"
              style="color: #f56c6c"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup name="Brick">
import { listBrick, getBrick, delBrick, addBrick, updateBrick } from "@/api/device/brick"
// 导入字典相关API
import { 
  listFixeddropdownitems, 
  getFixeddropdownitems, 
  addFixeddropdownitems, 
  updateFixeddropdownitems, 
  delFixeddropdownitems 
} from "@/api/device/fixeddropdownitems"

import { ref, reactive, getCurrentInstance, toRefs } from "vue"
// 导入axios
import axios from 'axios'

const { proxy } = getCurrentInstance()

// 字典相关响应式变量
const dictOptions = reactive({
  brickSpecOptions: [],    // 最大砖宽字典选项
  styleOptions: [],        // 样式字典选项
  workstationCountOptions: [] // 工位数字典选项
})
const dictDialog = reactive({
  open: false,             // 字典管理弹窗开关
  title: "",               // 弹窗标题（新增/修改字典）
  form: {                  // 字典表单数据
    itemId: null,
    category: "",          // 字典分类（对应：最大砖宽/样式/工位数）
    itemName: ""           // 字典值
  },
  rules: {                 // 字典表单校验
    category: [{ required: true, message: "请选择字典分类", trigger: "blur" }],
    itemName: [{ required: true, message: "请输入字典值", trigger: "blur" }]
  },
  currentCategory: "",     // 当前操作的字典分类
  dictList: []             // 当前分类的字典列表（弹窗内显示）
})

// 原有变量
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
      { required: true, message: "最大砖宽不能为空", trigger: "change" } // 改为change触发
    ],
    style: [
      { required: true, message: "样式不能为空", trigger: "change" } // 改为change触发
    ],
    workstationCount: [
      { required: true, message: "工位数不能为空", trigger: "change" } // 改为change触发
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)
const { brickSpecOptions, styleOptions, workstationCountOptions } = toRefs(dictOptions)

/** 加载字典选项 */
function loadDictOptions() {
  // 加载“最大砖宽”字典（Category=最大砖宽）
  listFixeddropdownitems({ category: "最大砖宽" }).then(res => {
    dictOptions.brickSpecOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });

  // 加载“样式”字典（Category=样式）
  listFixeddropdownitems({ category: "样式" }).then(res => {
    dictOptions.styleOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });

  // 加载“工位数”字典（Category=工位数）
  listFixeddropdownitems({ category: "工位数" }).then(res => {
    dictOptions.workstationCountOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });
}

/** 打开字典管理弹窗 */
function openDictDialog(category) {
  dictDialog.currentCategory = category;
  dictDialog.form = { itemId: null, category: category, itemName: "" };
  dictDialog.title = `管理${category}字典`;
  dictDialog.open = true;
  // 加载当前分类的字典列表
  loadDictList(category);
}

/** 加载当前分类的字典列表 */
function loadDictList(category) {
  listFixeddropdownitems({ category: category }).then(res => {
    dictDialog.dictList = res.rows;
  });
}

/** 字典新增/修改提交 */
function submitDictForm() {
  proxy.$refs["dictRef"].validate(valid => {
    if (valid) {
      const dictData = {
        itemId: dictDialog.form.itemId,
        category: dictDialog.form.category,
        itemName: dictDialog.form.itemName
      };

      // 新增字典
      if (!dictData.itemId) {
        addFixeddropdownitems(dictData).then(() => {
          proxy.$modal.msgSuccess("字典新增成功");
          dictDialog.open = false;
          loadDictList(dictDialog.currentCategory);
          loadDictOptions(); // 刷新下拉选项
        });
      } 
      // 修改字典
      else {
        updateFixeddropdownitems(dictData).then(() => {
          proxy.$modal.msgSuccess("字典修改成功");
          dictDialog.open = false;
          loadDictList(dictDialog.currentCategory);
          loadDictOptions(); // 刷新下拉选项
        });
      }
    }
  });
}

/** 字典删除（修正后） */
function handleDictDelete(item) {
  proxy.$modal.confirm(`是否确认删除${item.itemName}？`).then(() => {
    // 关键：传递数组[item.itemId]，与API要求的格式匹配
    delFixeddropdownitems([item.itemId]).then(() => { 
      proxy.$modal.msgSuccess("删除成功");
      loadDictList(dictDialog.currentCategory);
      loadDictOptions(); // 刷新下拉选项
    });
  }).catch(() => {});
}

/** 编辑字典 */
function handleDictEdit(item) {
  dictDialog.form = {
    itemId: item.itemId,
    category: item.category,
    itemName: item.itemName
  };
  dictDialog.title = `修改${item.category}字典`;
}

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

// 初始化：先加载字典，再加载砖机列表
loadDictOptions();
getList()
</script>

<style scoped>
/* 补充样式 */
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.mb10 {
  margin-bottom: 10px;
}
</style>
