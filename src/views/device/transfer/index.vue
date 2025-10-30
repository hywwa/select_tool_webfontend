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
      <!-- 摆渡坑宽改为下拉选择 -->
      <el-form-item label="摆渡坑宽" prop="ferryPitWidth">
        <el-select
          v-model="queryParams.ferryPitWidth"
          placeholder="请选择摆渡坑宽"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in ferryPitWidthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 摆渡车关键特征改为下拉选择 -->
      <el-form-item label="关键特征" prop="ferryKeyFeature">
        <el-select
          v-model="queryParams.ferryKeyFeature"
          placeholder="请选择关键特征"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in ferryKeyFeatureOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 最大砖宽度改为下拉选择 -->
      <el-form-item label="最大砖宽" prop="maxBrickWidth">
        <el-select
          v-model="queryParams.maxBrickWidth"
          placeholder="请选择最大砖宽"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in maxBrickWidthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
      <el-form-item label="有无坑" prop="hasPit">
        <el-select
    v-model="queryParams.hasPit"
    placeholder="请选择有无坑"
    clearable
    style="width: 180px"
    @change="handleQuery"
  >
    <el-option label="有坑" value="有坑"></el-option>
    <el-option label="无坑" value="无坑"></el-option>
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
       <el-form-item label="电力形式" prop="powerType">
        <el-input
          v-model="queryParams.powerType"
          placeholder="请输入电力形式"
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
  <el-select
    v-model="queryParams.hasControl"
    placeholder="请选择是否有电气控制"
    clearable
    style="width: 180px"
    @change="handleQuery"
  >
    <el-option label="是" value="是"></el-option>
    <el-option label="否" value="否"></el-option>
  </el-select>
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
      <el-col :span="1.5">
    <el-button
      type="info"
      plain
      icon="Upload"
      @click="handleImport"
      v-hasPermi="['device:transfer:add']"
    >导入</el-button>
  </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="transferList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
       <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['device:transfer:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['device:transfer:remove']">删除</el-button>
        </template>
      </el-table-column>
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
      <el-table-column label="有电气控制" align="center">
  <template #default="scope">
    {{ scope.row.hasControl === 1 ? '是' : '否' }}
  </template>
</el-table-column>
      <el-table-column label="备注" align="center" prop="notes" width="200"/>
      <el-table-column label="使用项目" align="center" prop="projects" />
     
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog
  :title="importDialog.title"
  v-model="importDialog.open"
  width="400px"
  append-to-body
>
  <el-upload
    ref="upload"
    :limit="1"
    accept=".xlsx, .xls"
    :headers="importDialog.headers"
    :action="importDialog.url + '?updateSupport=' + importDialog.updateSupport"
    :disabled="importDialog.isUploading"
    :on-progress="handleFileUploadProgress"
    :on-success="handleFileSuccess"
    :auto-upload="false"
    drag
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip text-center" slot="tip">
      <el-checkbox v-model="importDialog.updateSupport" />是否更新已存在的摆渡车数据
      <br />
      <span>仅允许导入xls、xlsx格式文件。</span>
    </div>
  </el-upload>
  <div slot="footer" class="dialog-footer">
    <el-button @click="importDialog.open = false">取 消</el-button>
    <el-button type="primary" @click="submitFileForm">确 定</el-button>
  </div>
</el-dialog>

    <!-- 添加或修改摆渡车对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="transferRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料描述" prop="materialDescription">
          <el-input v-model="form.materialDescription" placeholder="请输入物料描述" />
        </el-form-item>
        <!-- 摆渡坑宽改为下拉选择+管理按钮 -->
        <el-form-item label="摆渡坑宽" prop="ferryPitWidth">
          <div class="flex items-center">
            <el-select
              v-model="form.ferryPitWidth"
              placeholder="请选择摆渡坑宽"
              style="width: 320px"
            >
              <el-option
                v-for="item in ferryPitWidthOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              icon="Setting"
              @click="openDictDialog('摆渡坑宽')"
              style="margin-left: 10px"
            >
              管理
            </el-button>
          </div>
        </el-form-item>
        <!-- 摆渡车关键特征改为下拉选择+管理按钮 -->
        <el-form-item label="关键特征" prop="ferryKeyFeature">
          <div class="flex items-center">
            <el-select
              v-model="form.ferryKeyFeature"
              placeholder="请选择关键特征"
              style="width: 320px"
            >
              <el-option
                v-for="item in ferryKeyFeatureOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              icon="Setting"
              @click="openDictDialog('摆渡车关键特征')"
              style="margin-left: 10px"
            >
              管理
            </el-button>
          </div>
        </el-form-item>
        <!-- 最大砖宽度改为下拉选择+管理按钮 -->
        <el-form-item 
  v-if="form.ferryKeyFeature === '升降摆渡'" 
  label="最大砖宽" 
  prop="maxBrickWidth"
>
  <div class="flex items-center">
    <el-select
      v-model="form.maxBrickWidth"
      placeholder="请选择最大砖宽"
      style="width: 320px"
    >
      <el-option
        v-for="item in maxBrickWidthOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-button
      type="text"
      icon="Setting"
      @click="openDictDialog('最大砖宽度')"
      style="margin-left: 10px"
    >
      管理
    </el-button>
  </div>
</el-form-item>
        <el-form-item label="摆渡车长" prop="ferryLength">
          <el-input v-model="form.ferryLength" placeholder="请输入摆渡车长度(mm)" />
        </el-form-item>
        <el-form-item label="轨道内宽" prop="trackWidth">
          <el-input v-model="form.trackWidth" placeholder="请输入轨道内宽(mm)" />
        </el-form-item>
        <el-form-item label="有无坑" prop="hasPit">
           <el-select
    v-model="form.hasPit"
    placeholder="请选择有无坑"
    style="width: 320px"
  >
    <el-option label="有坑" value="有坑"></el-option>
    <el-option label="无坑" value="无坑"></el-option>
  </el-select>
</el-form-item>
        <el-form-item label="定位模式" prop="positioning">
          <el-input v-model="form.positioning" placeholder="请输入定位模式" />
        </el-form-item>
          <el-form-item label="电力形式" prop="powerType">
          <el-input v-model="form.powerType" placeholder="请输入电力形式" />
        </el-form-item>
        <el-form-item label="行走电机" prop="motor">
          <el-input v-model="form.motor" placeholder="请输入行走电机" />
        </el-form-item>
        <el-form-item label="液压功率" prop="hydraulicPower">
          <el-input v-model="form.hydraulicPower" placeholder="请输入液压功率(KW)" />
        </el-form-item>
        <el-form-item label="减速机速比" prop="reducerRatio">
          <el-input v-model="form.reducerRatio" placeholder="请输入减速机速比" />
        </el-form-item>
        <el-form-item label="有电气控制" prop="hasControl">
  <el-select
    v-model="form.hasControl"
    placeholder="请选择是否有电气控制"
    style="width: 320px"
  >
    <el-option label="是" value="是"></el-option>
    <el-option label="否" value="否"></el-option>
  </el-select>
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
            <el-option label="摆渡坑宽" value="摆渡坑宽"></el-option>
            <el-option label="摆渡车关键特征" value="摆渡车关键特征"></el-option>
            <el-option label="最大砖宽度" value="最大砖宽度"></el-option>
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

<script setup name="Transfer">
import { listTransfer, getTransfer, delTransfer, addTransfer, updateTransfer, importTransfer } from "@/api/device/transfer"
// 新增：导入token工具（用于请求头）
import { getToken } from "@/utils/auth";
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
  ferryPitWidthOptions: [],    // 摆渡坑宽字典选项
  ferryKeyFeatureOptions: [],  // 摆渡车关键特征字典选项
  maxBrickWidthOptions: []     // 最大砖宽度字典选项
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

// 新增：导入相关响应式变量（与砖机完全一致）
const importDialog = reactive({
  open: false,                // 弹窗开关
  title: "摆渡车导入",        // 弹窗标题
  isUploading: false,         // 是否正在上传
  updateSupport: false,       // 是否覆盖已有数据
  headers: { Authorization: "Bearer " + getToken() }, // 认证请求头
  url: import.meta.env.VITE_APP_BASE_API + "/device/transfer/importData" // 导入接口地址
})

// 原有变量
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
    materialCode: [
      { required: true, message: "物料编号不能为空", trigger: "blur" }
    ],
    materialDescription: [
      { required: true, message: "物料描述不能为空", trigger: "blur" }
    ],
    ferryPitWidth: [
      { required: true, message: "摆渡坑宽不能为空", trigger: "change" }
    ],
    ferryKeyFeature: [
      { required: true, message: "摆渡车关键特征不能为空", trigger: "change" }
    ],
    hasPit: [
      { required: true, message: "有无坑不能为空", trigger: "blur" }
    ],
     hasControl: [
      { required: true, message: "请选择是否有电气控制", trigger: "change" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)
const { ferryPitWidthOptions, ferryKeyFeatureOptions, maxBrickWidthOptions } = toRefs(dictOptions)

/** 加载字典选项 */
function loadDictOptions() {
  // 加载“摆渡坑宽”字典
  listFixeddropdownitems({ category: "摆渡坑宽" }).then(res => {
    dictOptions.ferryPitWidthOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });

  // 加载“摆渡车关键特征”字典
  listFixeddropdownitems({ category: "摆渡车关键特征" }).then(res => {
    dictOptions.ferryKeyFeatureOptions = res.rows.map(item => ({
      label: item.itemName,
      value: item.itemName
    }));
  });

  // 加载“最大砖宽度”字典
  listFixeddropdownitems({ category: "最大砖宽度" }).then(res => {
    dictOptions.maxBrickWidthOptions = res.rows.map(item => ({
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
   if (queryParams.value.hasControl === "是") {
    queryParams.value.hasControl = 1;
  } else if (queryParams.value.hasControl === "否") {
    queryParams.value.hasControl = 0;
  } else {
    queryParams.value.hasControl = null; // 清空时传null，避免后端接收空字符串
  }

  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  queryParams.value.hasControl = null;
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
   const resData = response.data;
    // 新增：转换hasControl回显值
    resData.hasControl = resData.hasControl === 1 ? "是" : "否";
    form.value = resData; // 赋值后下拉框自动匹配“是/否”
    open.value = true;
    title.value = "修改摆渡车";
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["transferRef"].validate(valid => {
     if (valid) {
      // 2. 判断：若关键特征是“升降摆渡”，但最大砖宽未选 → 提示必填
      if (form.value.ferryKeyFeature === '升降摆渡' && !form.value.maxBrickWidth) {
        proxy.$modal.msgError("选择“升降摆渡”时，最大砖宽不能为空");
        return; // 终止提交
      }

      // 3. 原有提交逻辑（不变）
      const submitData = {
        ...form.value,
        hasControl: form.value.hasControl === "是" ? 1 : 0
      };

      // 原有提交逻辑：用submitData替换form.value
      if (form.value.id != null) {
        updateTransfer(submitData).then(response => { // 传转换后的数据
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTransfer(submitData).then(response => { // 传转换后的数据
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
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

// 新增：打开导入弹窗
const handleImport = () => {
  importDialog.title = "摆渡车导入"
  importDialog.open = true
}

// 新增：文件上传中回调
const handleFileUploadProgress = (event, file, fileList) => {
  importDialog.isUploading = true
}

// 新增：文件上传成功回调
const handleFileSuccess = (response) => {
  importDialog.open = false
  importDialog.isUploading = false
  proxy.$refs.upload.clearFiles() // 清空上传文件
  // 显示导入结果（与砖机格式一致）
  proxy.$alert(
    `<div style='overflow: auto;max-height: 70vh;padding: 10px;'>${response.msg || '导入成功'}</div>`,
    "导入结果",
    { dangerouslyUseHTMLString: true }
  )
  getList() // 重新加载列表
}

// 新增：提交上传文件
const submitFileForm = () => {
  proxy.$refs.upload.submit()
}


// 初始化：先加载字典，再加载摆渡车列表
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
