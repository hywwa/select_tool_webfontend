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
      <!-- 坑宽改为下拉选择 -->
      <el-form-item label="坑宽" prop="pitWidth">
        <el-select
          v-model="queryParams.pitWidth"
          placeholder="请选择坑宽"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in pitWidthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
      <!-- 支架形式改为下拉选择 -->
      <el-form-item label="支架形式" prop="supportType">
        <el-select
          v-model="queryParams.supportType"
          placeholder="请选择支架形式"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in supportTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="定位模式" prop="positioning">
        <el-input
          v-model="queryParams.positioning"
          placeholder="请输入定位模式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- 电力形式改为下拉选择 -->
      <el-form-item label="电力形式" prop="powerType">
        <el-select
          v-model="queryParams.powerType"
          placeholder="请选择电力形式"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in powerTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
        <!-- 坑宽改为下拉选择+管理按钮 -->
        <el-form-item label="坑宽(mm)" prop="pitWidth">
          <div class="flex items-center">
            <el-select
              v-model="form.pitWidth"
              placeholder="请选择坑宽"
              style="width: 320px"
            >
              <el-option
                v-for="item in pitWidthOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              icon="Setting"
              @click="openDictDialog('坑宽')"
              style="margin-left: 10px"
            >
              管理
            </el-button>
          </div>
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
        <!-- 支架形式改为下拉选择+管理按钮 -->
        <el-form-item label="托升支架形式" prop="supportType">
          <div class="flex items-center">
            <el-select
              v-model="form.supportType"
              placeholder="请选择支架形式"
              style="width: 320px"
            >
              <el-option
                v-for="item in supportTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              icon="Setting"
              @click="openDictDialog('支架形式')"
              style="margin-left: 10px"
            >
              管理
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="定位模式" prop="positioning">
          <el-input v-model="form.positioning" placeholder="请输入定位模式" />
        </el-form-item>
        <!-- 电力形式改为下拉选择+管理按钮 -->
        <el-form-item label="电力形式" prop="powerType">
          <div class="flex items-center">
            <el-select
              v-model="form.powerType"
              placeholder="请选择电力形式"
              style="width: 320px"
            >
              <el-option
                v-for="item in powerTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              icon="Setting"
              @click="openDictDialog('电力形式')"
              style="margin-left: 10px"
            >
              管理
            </el-button>
          </div>
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
            <el-option label="坑宽" value="坑宽"></el-option>
            <el-option label="支架形式" value="支架形式"></el-option>
            <el-option label="电力形式" value="电力形式"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典值" prop="itemName">
          <el-input
            v-model="dictDialog.form.itemName"
            placeholder="请输入字典值"
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

<script setup name="Transport">
import { listTransport, getTransport, delTransport, addTransport, updateTransport } from "@/api/device/transport"
// 导入字典相关API
import { 
  listFixeddropdownitems, 
  getFixeddropdownitems, 
  addFixeddropdownitems, 
  updateFixeddropdownitems, 
  delFixeddropdownitems 
} from "@/api/device/fixeddropdownitems"

import { ref, reactive, getCurrentInstance, toRefs } from "vue"

const { proxy } = getCurrentInstance()

// 字典相关响应式变量
const dictOptions = reactive({
  pitWidthOptions: [],       // 坑宽字典选项
  supportTypeOptions: [],    // 支架形式字典选项
  powerTypeOptions: []       // 电力形式字典选项
})
const dictDialog = reactive({
  open: false,             // 字典管理弹窗开关
  title: "",               // 弹窗标题（新增/修改字典）
  form: {                  // 字典表单数据
    itemId: null,
    category: "",          // 字典分类
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
    materialCode: [
      { required: true, message: "物料编号不能为空", trigger: "blur" }
    ],
    materialDescription: [
      { required: true, message: "物料描述不能为空", trigger: "blur" }
    ],
    pitWidth: [
      { required: true, message: "坑宽不能为空", trigger: "change" }
    ],
    supportType: [
      { required: true, message: "支架形式不能为空", trigger: "change" }
    ],
    powerType: [
      { required: true, message: "电力形式不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)
const { pitWidthOptions, supportTypeOptions, powerTypeOptions } = toRefs(dictOptions)

/** 加载字典选项 */
function loadDictOptions() {
  // 加载“坑宽”字典
  listFixeddropdownitems({ category: "坑宽" }).then(res => {
    dictOptions.pitWidthOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });

  // 加载“支架形式”字典
  listFixeddropdownitems({ category: "支架形式" }).then(res => {
    dictOptions.supportTypeOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });

  // 加载“电力形式”字典
  listFixeddropdownitems({ category: "电力形式" }).then(res => {
    dictOptions.powerTypeOptions = res.rows.map(item => ({
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

/** 字典删除 */
function handleDictDelete(item) {
  proxy.$modal.confirm(`是否确认删除${item.itemName}？`).then(() => {
    // 传递数组[item.itemId]，与API要求的格式匹配
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

// 初始化：先加载字典，再加载运输车列表
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
