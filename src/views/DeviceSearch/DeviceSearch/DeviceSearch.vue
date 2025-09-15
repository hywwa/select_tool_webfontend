<template>
  <div class="device-search-page">
    <!-- 步骤指示器 -->
    <div class="steps-indicator">
      <div class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
        <div class="step-number">1</div>
        <div class="step-name">参数设置</div>
      </div>
      <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
      <div class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
        <div class="step-number">2</div>
        <div class="step-name">设备选择</div>
      </div>
      <div class="step-line" :class="{ completed: currentStep > 2 }"></div>
      <div class="step-item" :class="{ active: currentStep >= 3 }">
        <div class="step-number">3</div>
        <div class="step-name">选购记录</div>
      </div>
    </div>

    <!-- 步骤内容区域 -->
    <div class="steps-content">
      <!-- 步骤1：参数设置 -->
      <div v-if="currentStep === 1" class="step-content">
        <h2>设备参数设置</h2>
        
        <div class="param-form-container">
          <!-- 砖规格数量设置 -->
          <div class="form-section">
            <h3>砖规格与数量</h3>
            <el-table :data="brickSpecs" border>
              <el-table-column prop="spec" label="砖规格（长×宽）" width="200"></el-table-column>
              <el-table-column label="砖片数">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.quantity"
                    :min="0"
                    controls-position="right"
                    size="small"
                    @change="handleBrickQuantityChange(scope.row)"
                  ></el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 砖机设备参数 -->
          <div class="form-section">
            <h3>砖机设备参数</h3>
            <el-form ref="formRef" :model="form" label-width="120px">
              <el-form-item label="最大砖宽">
                <el-select v-model="form.brickSpec" placeholder="请选择最大砖宽">
                  <el-option label="900" value="900"></el-option>
                  <el-option label="1600" value="1600"></el-option>
                  <el-option label="1200" value="1200"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="样式">
                <el-select v-model="form.style" placeholder="请选择样式">
                  <el-option label="一体式" value="一体式"></el-option>
                  <el-option label="分体式" value="分体式"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工位数">
                <el-select v-model="form.workstationCount" placeholder="请选择工位数">
                  <el-option label="2" value="2"></el-option>
                  <el-option label="3" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <!-- 摆渡车设备参数 -->
          <div class="form-section">
            <h3>摆渡车设备参数</h3>
            <el-form ref="transferFormRef" :model="transferForm" label-width="120px">
              <el-form-item label="摆渡坑宽">
                <el-select v-model="transferForm.ferryPitWidth"  placeholder="请输入摆渡坑宽度">
                  <el-option label="4500" value="4500"></el-option>
                  <el-option label="4800" value="4800"></el-option>
                  <el-option label="5500" value="5500"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="摆渡车关键特征">
                <el-select v-model="transferForm.ferryKeyFeature" placeholder="请选择摆渡车关键特征">
                  <el-option label="常规" value="常规"></el-option>
                  <el-option label="鱼骨" value="鱼骨"></el-option>
                  <el-option label="升降摆渡" value="升降摆渡"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="最大砖宽">
                <el-select v-model="transferForm.maxBrickWidth" placeholder="请选择最大砖宽">
                  <el-option label="非液压升降摆渡" value="非液压升降摆渡"></el-option>
                  <el-option label="900" value="900"></el-option>
                  <el-option label="1200" value="1200"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="有无坑">
                <el-select v-model="transferForm.hasPit" placeholder="请选择">
                  <el-option label="有坑" value="有坑"></el-option>
                  <el-option label="无坑" value="无坑"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <!-- 运输车设备参数 -->
          <div class="form-section">
            <h3>运输车设备参数</h3>
            <el-form ref="transportFormRef" :model="transportForm" label-width="120px">
              <el-form-item label="摆渡坑宽">
                <el-select v-model="transportForm.pitWidth"  placeholder="请输入摆渡坑宽度">
                  <el-option label="4500" value="4500"></el-option>
                  <el-option label="5500" value="5500"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="托升支架形式">
                <el-select v-model="transportForm.supportType" placeholder="请选择托升支架形式">
                  <el-option label="常规" value="常规"></el-option>
                  <el-option label="鱼骨" value="鱼骨"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="电力形式">
                <el-select v-model="transportForm.powerType" placeholder="请选择电力形式">
                  <el-option label="交流" value="交流"></el-option>
                  <el-option label="直流" value="直流"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <!-- 拍齐顶升设备参数 -->
          <div class="form-section">
            <h3>拍齐顶升设备参数</h3>
            <el-form ref="liftFormRef" :model="liftForm" label-width="120px">    
              <el-form-item label="最大砖厚度">
                <el-select v-model="liftForm.maxBrickThickness" placeholder="请选择最大砖厚度">
                  <el-option label="15" value="15"></el-option>
                  <el-option label="20" value="20"></el-option>
                  <el-option label="48" value="48"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <div class="form-actions">
            <el-button type="primary" @click="searchDevices">搜索设备</el-button>
            <el-button @click="resetAllForms">重置所有</el-button>
          </div>

          <!-- 搜索结果预览 -->
          <div v-if="showSearchResult" class="search-result-preview">
            <h4>搜索结果预览</h4>
            <p>砖机: {{ totalCounts.brick }} 条 | 摆渡车: {{ totalCounts.transfer }} 条 | 运输车: {{ totalCounts.transport }} 条 | 拍齐顶升: {{ totalCounts.lift }} 条</p>
            <p>请点击"下一步"查看完整结果并选择设备</p>
          </div>
        </div>

        <div class="step-actions">
          <el-button type="primary" @click="nextStep" :disabled="!showSearchResult">下一步</el-button>
        </div>
      </div>

      <!-- 步骤2：设备选择 -->
      <div v-if="currentStep === 2" class="step-content">
        <h2>设备选择</h2>
        
        <!-- 加载状态 -->
        <div v-if="isStep2Loading" class="loading-container">
          <el-loading :visible="isStep2Loading" text="正在加载设备数据..."></el-loading>
        </div>
        
        <!-- 设备数据为空提示 -->
        <div v-else-if="isEmptyState" class="empty-state">
          <el-empty description="没有找到匹配的设备数据，请调整搜索条件"></el-empty>
        </div>
        
        <!-- 设备列表内容 -->
        <div v-else>
          <!-- 四个设备列表导航 -->
          <el-tabs v-model="activeTab" type="card" class="sticky-tabs">
            <el-tab-pane label="砖机" name="brick">
              <div class="tab-content">
                <el-table :data="brickDevices" border>
                  <el-table-column label="数量">
                    <template #default="scope">
                      <el-input-number
                          v-model="scope.row.quantity"
                          :min="1"
                          size="small"
                          :controls-position="'right'"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="materialCode" label="物料编码" width="100"></el-table-column>
                  <el-table-column prop="materialDescription" label="物料描述" width="200"></el-table-column>
                  <el-table-column prop="brickSpec" label="适用最大砖宽"></el-table-column>
                  <el-table-column prop="travelDistance" label="移砖行程(mm)"></el-table-column>
                  <el-table-column prop="style" label="样式"></el-table-column>
                  <el-table-column prop="workstationCount" label="工位数"></el-table-column>
                  <el-table-column prop="liftRatio" label="提升速比"></el-table-column>
                  <el-table-column prop="liftGearDiameter" label="提升齿轮直径(mm)"></el-table-column>
                  <el-table-column prop="driveRatio" label="水平驱动速比"></el-table-column>
                  <el-table-column prop="driveShaftDiameter" label="水平驱动轴径(mm)"></el-table-column>
                  <el-table-column prop="drivePulleyDiameter" label="水平驱动同步带轮直径(mm)"></el-table-column>
                  <el-table-column prop="drivenShaftDiameter" label="从动轴径(mm)"></el-table-column>
                  <el-table-column prop="suctionCupCount" label="吸盘数量"></el-table-column>
                  <el-table-column prop="suctionCupType" label="吸盘形式"></el-table-column>
                  <el-table-column prop="suctionCupSize" label="吸盘大小(mm)"></el-table-column>
                  <el-table-column prop="solenoidValveCount" label="电磁阀数量"></el-table-column>
                  <el-table-column prop="solenoidValveModel" label="电磁阀型号"></el-table-column>
                  <el-table-column prop="vacuumGeneratorCount" label="真空发生器数量"></el-table-column>
                  <el-table-column prop="vacuumGeneratorModel" label="真空发生器型号"></el-table-column>
                  <el-table-column prop="forkOpening" label="叉砖口内空(mm)"></el-table-column>
                  <el-table-column prop="notes" label="备注" width="300"></el-table-column>
                  <el-table-column prop="usedProjects" label="在用项目" width="200"></el-table-column>
                  <el-table-column label="操作">
                    <template #default="scope">
                      <el-button
                          type="text"
                          @click="selectDevice(scope.row, 'brick')"
                      >
                        选择
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination-container">
                  <el-pagination
                      v-model:current-page="pagination.brick.currentPage"
                      v-model:page-size="pagination.brick.pageSize"
                      :total="totalCounts.brick"
                      :page-sizes="[10, 20, 50]"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="handlePageSizeChange('brick', $event)"
                      @current-change="handleCurrentPageChange('brick', $event)"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="运输车" name="transport">
              <div class="tab-content">
                <el-table :data="transportDevices" border>
                  <el-table-column label="数量">
                    <template #default="scope">
                      <el-input-number
                          v-model="scope.row.quantity"
                          :min="1"
                          size="small"
                          :controls-position="'right'"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="materialCode" label="物料编码" width="100"></el-table-column>
                  <el-table-column prop="materialDescription" label="物料描述" width="200"></el-table-column>
                  <el-table-column prop="pitWidth" label="坑宽(mm)"></el-table-column>
                  <el-table-column prop="brickCount600" label="600规格砖片数(片)"></el-table-column>
                  <el-table-column prop="brickCount600x1200" label="600X1200规格砖片数(片)"></el-table-column>
                  <el-table-column prop="vehicleLength" label="车身总长(mm)"></el-table-column>
                  <el-table-column prop="supportLength" label="托升支架长度(mm)"></el-table-column>
                  <el-table-column prop="supportWidth" label="托升支架宽度(mm)"></el-table-column>
                  <el-table-column prop="supportType" label="托升支架形式"></el-table-column>
                  <el-table-column prop="positioning" label="定位模式"></el-table-column>
                  <el-table-column prop="powerType" label="电力形式"></el-table-column>
                  <el-table-column prop="liftingMechanism" label="顶升结构"></el-table-column>
                  <el-table-column prop="liftingMotor" label="顶升电机"></el-table-column>
                  <el-table-column prop="travelMotor" label="行走电机"></el-table-column>
                  <el-table-column prop="reducerRatio" label="行走减速机速比"></el-table-column>
                  <el-table-column prop="hasControl" label="有电气控制"></el-table-column>
                  <el-table-column prop="notes" label="备注"></el-table-column>
                  <el-table-column prop="projects" label="使用项目"></el-table-column>
                  <el-table-column label="操作">
                    <template #default="scope">
                      <el-button
                          type="text"
                          @click="selectDevice(scope.row, 'transport')"
                      >
                        选择
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination-container">
                  <el-pagination
                      v-model:current-page="pagination.transport.currentPage"
                      v-model:page-size="pagination.transport.pageSize"
                      :total="totalCounts.transport"
                      :page-sizes="[10, 20, 50]"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="handlePageSizeChange('transport', $event)"
                      @current-change="handleCurrentPageChange('transport', $event)"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="摆渡车" name="transfer">
              <div class="tab-content">
                <el-table :data="transferDevices" border>
                  <el-table-column label="数量">
                    <template #default="scope">
                      <el-input-number
                          v-model="scope.row.quantity"
                          :min="1"
                          size="small"
                          :controls-position="'right'"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="materialCode" label="物料编码" width="100"></el-table-column>
                  <el-table-column prop="materialDescription" label="物料描述" width="200"></el-table-column>
                  <el-table-column prop="ferryPitWidth" label="摆渡坑宽度(mm)"></el-table-column>
                  <el-table-column prop="ferryKeyFeature" label="摆渡车关键特征"></el-table-column>
                  <el-table-column prop="maxBrickWidth" label="使用最大砖宽度(mm)"></el-table-column>
                  <el-table-column prop="ferryLength" label="摆渡车长度(mm)"></el-table-column>
                  <el-table-column prop="trackWidth" label="轨道内宽(mm)"></el-table-column>
                  <el-table-column prop="hasPit" label="有无坑"></el-table-column>
                  <el-table-column prop="positioning" label="定位模式"></el-table-column>
                  <el-table-column prop="powerType" label="电力形式"></el-table-column>
                  <el-table-column prop="motor" label="行走电机"></el-table-column>
                  <el-table-column prop="hydraulicPower" label="液压功率(KW)"></el-table-column>
                  <el-table-column prop="reducerRatio" label="减速机速比"></el-table-column>
                  <el-table-column prop="hasControl" label="有电气控制"></el-table-column>
                  <el-table-column prop="notes" label="备注" width="200"></el-table-column>
                  <el-table-column prop="projects" label="使用项目" width="100"></el-table-column>
                  <el-table-column label="操作">
                    <template #default="scope">
                      <el-button
                          type="text"
                          @click="selectDevice(scope.row, 'transfer')"
                      >
                        选择
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination-container">
                  <el-pagination
                      v-model:current-page="pagination.transfer.currentPage"
                      v-model:page-size="pagination.transfer.pageSize"
                      :total="totalCounts.transfer"
                      :page-sizes="[10, 20, 50]"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="handlePageSizeChange('transfer', $event)"
                      @current-change="handleCurrentPageChange('transfer', $event)"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="拍齐顶升" name="lift">
              <div class="tab-content">
                <el-table :data="liftDevices" border>
                  <el-table-column label="数量">
                    <template #default="scope">
                      <el-input-number
                          v-model="scope.row.quantity"
                          :min="1"
                          size="small"
                          :controls-position="'right'"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="materialCode" label="物料编码" width="100"></el-table-column>
                  <el-table-column prop="materialDescription" label="物料描述" width="200"></el-table-column>
                  <el-table-column prop="brickWidthRange" label="适用砖宽度范围(mm)" width="100"></el-table-column>
                  <el-table-column prop="brickThickness" label="适用砖厚度(mm)"></el-table-column>
                  <el-table-column prop="frameWidth" label="安装适用线架宽度(mm)"></el-table-column>
                  <el-table-column prop="baseType" label="底架形式"></el-table-column>
                  <el-table-column prop="alignCylinder" label="拍齐气缸"></el-table-column>
                  <el-table-column prop="liftCylinder" label="顶升气缸"></el-table-column>
                  <el-table-column prop="plateLength" label="托砖板长度(mm)"></el-table-column>
                  <el-table-column prop="alignWheelCount" label="拍齐轮个数"></el-table-column>
                  <el-table-column prop="guideType" label="导向形式"></el-table-column>
                  <el-table-column prop="guideSlider" label="导向滑块"></el-table-column>
                  <el-table-column prop="rubberThickness" label="挡砖胶皮厚度(mm)"></el-table-column>
                  <el-table-column prop="notes" label="备注" width="200"></el-table-column>
                  <el-table-column prop="usedProjects" label="在用项目" width="200"></el-table-column>
                  <el-table-column label="操作">
                    <template #default="scope">
                      <el-button
                          type="text"
                          @click="selectDevice(scope.row, 'lift')"
                      >
                        选择
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination-container">
                  <el-pagination
                      v-model:current-page="pagination.lift.currentPage"
                      v-model:page-size="pagination.lift.pageSize"
                      :total="totalCounts.lift"
                      :page-sizes="[10, 20, 50]"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="handlePageSizeChange('lift', $event)"
                      @current-change="handleCurrentPageChange('lift', $event)"
                  />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>

          <!-- 已选设备预览（购物车） -->
          <div class="selected-preview">
            <h4>已选设备 ({{ selectedDevices.length }})</h4>
            <el-table :data="selectedDevices.slice(0, 3)" border size="mini">
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="type" label="类型"></el-table-column>
              <el-table-column prop="materialCode" label="编码"></el-table-column>
              <el-table-column prop="name" label="物料描述" min-width="180"></el-table-column>
              <el-table-column prop="quantity" label="数量"></el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                      type="text"
                      @click="removeDeviceFromPreview(scope.$index)"
                      style="color: #f56c6c"
                      size="small"
                  >
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="selectedDevices.length > 3" class="preview-more">
              还有 {{ selectedDevices.length - 3 }} 项...
            </div>
          </div>
        </div>

        <div class="step-actions">
          <el-button @click="prevStep">上一步</el-button>
          <el-button type="primary" @click="nextStep" :disabled="selectedDevices.length === 0">下一步</el-button>
        </div>
      </div>

      <!-- 步骤3：结果处理（选购记录） -->
      <div v-if="currentStep === 3" class="step-content">
        <h2>选购记录</h2>
        
        <div class="selected-devices">
          <el-table :data="currentSelectedDevices" border>
            <el-table-column prop="type" label="设备类型"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="materialCode" label="物料编码"></el-table-column>
            <el-table-column prop="name" label="物料描述"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                    type="text"
                    @click="removeDevice(scope.$index)"
                    style="color: #f56c6c"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="pagination-container" v-if="selectedDevices.length > 0">
            <el-pagination
                v-model:current-page="selectedPagination.currentPage"
                v-model:page-size="selectedPagination.pageSize"
                :total="selectedDevices.length"
                :page-sizes="[5, 10, 20]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSelectedPageSizeChange"
                @current-change="handleSelectedCurrentPageChange"
            />
          </div>
        </div>

        <div class="step-actions">
          <el-button @click="prevStep">上一步</el-button>
          <el-button 
            v-loading.fullscreen.lock="fullscreenLoading" 
            @click="exportSelected" 
            class="export-btn" 
            v-if="selectedDevices.length > 0"
          >
            导出选购记录
          </el-button>
          <el-button type="success" @click="finishProcess">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="DeviceSearchFlow">
import {ref, reactive, onMounted, computed, watch} from 'vue';
import { listBrick, listTransport, listTransfer, listLift } from "../../../api/device.js";
import axios from "axios";
import {ElMessage, ElLoading, ElEmpty} from "element-plus";

// 步骤控制
const currentStep = ref(1);
const showSearchResult = ref(false);
const isStep2Loading = ref(false); // 第二步加载状态

// 设备标签页状态
const activeTab = ref('brick');

// 砖规格与数量数据
const brickSpecs = ref([
  { spec: '300×600', quantity: 0}, // 对应BrickCount3
  { spec: '400×800', quantity: 0 },
  { spec: '600×600', quantity: 0 , code: 3 },
  { spec: '800×800', quantity: 0 },
  { spec: '600×1200', quantity: 0, code: 5 }, // 对应BrickCount5
  { spec: '1200×600', quantity: 0 },
  { spec: '750×1500', quantity: 0 },
  { spec: '800×1600', quantity: 0 },
  { spec: '900×1800', quantity: 0 }
]);

// 表单数据 - 包含所有设备类型的参数
const form = reactive({
  brickSpec: '',
  style: '',
  workstationCount: ''
});

const transferForm = reactive({
  ferryPitWidth: null,
  ferryKeyFeature: '',
  maxBrickWidth: '',
  hasPit: ''
});

// 运输车表单数据
const transportForm = reactive({
  pitWidth: '',
  supportType: '',
  powerType: ''
});

// 拍齐顶升表单数据
const liftForm = reactive({
  maxBrickThickness: ''
});

// 设备数据
const brickDevices = ref([]);
const transportDevices = ref([]);
const transferDevices = ref([]);
const liftDevices = ref([]);
const selectedDevices = ref([]);

// 分页配置
const pagination = reactive({
  brick: { currentPage: 1, pageSize: 10 },
  transport: { currentPage: 1, pageSize: 10 },
  transfer: { currentPage: 1, pageSize: 10 },
  lift: { currentPage: 1, pageSize: 10 }
});

// 总数量计数（关键修复：使用独立的总数计数，而不是从当前页数据计算）
const totalCounts = reactive({
  brick: 0,
  transport: 0,
  transfer: 0,
  lift: 0
});

// 已选设备分页配置
const selectedPagination = reactive({
  currentPage: 1,
  pageSize: 5
});

// 计算属性 - 检查是否所有设备列表都为空
const isEmptyState = computed(() => {
  return totalCounts.brick === 0 &&
         totalCounts.transport === 0 &&
         totalCounts.transfer === 0 &&
         totalCounts.lift === 0;
});

// 已选设备分页数据
const currentSelectedDevices = computed(() => {
  const startIndex = (selectedPagination.currentPage - 1) * selectedPagination.pageSize;
  return selectedDevices.value.slice(startIndex, startIndex + selectedPagination.pageSize);
});

// 加载状态
const fullscreenLoading = ref(false);

// 监听步骤变化，确保第二步数据正确加载
watch(currentStep, (newVal, oldVal) => {
  console.log(`步骤变化: ${oldVal} -> ${newVal}`);
  
  // 当进入第二步时，确保数据已加载
  if (newVal === 2) {
    // 检查是否有数据，没有则重新加载
    if (totalCounts.brick === 0 && 
        totalCounts.transport === 0 &&
        totalCounts.transfer === 0 && 
        totalCounts.lift === 0) {
      reloadStep2Data();
    }
  }
});

// 步骤导航方法
const nextStep = async () => {
  // 防止快速点击跳过步骤
  if (currentStep.value === 1) {
    // 第一步到第二步：验证并加载数据
    if (showSearchResult.value) {
      isStep2Loading.value = true;
      try {
        // 确保数据已加载
        await reloadStep2Data();
        currentStep.value = 2;
      } catch (error) {
        ElMessage.error('加载设备数据失败，请重试');
        console.error('步骤2数据加载失败:', error);
      } finally {
        isStep2Loading.value = false;
      }
    }
  } else if (currentStep.value === 2) {
    // 第二步到第三步：验证是否选择了设备
    if (selectedDevices.value.length > 0) {
      currentStep.value = 3;
    } else {
      ElMessage.warning('请至少选择一个设备');
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// 重新加载第二步数据
const reloadStep2Data = async () => {
  try {
    // 并行加载所有类型设备
    await Promise.all([
      fetchDevicesByType('brick'),
      fetchDevicesByType('transfer'),
      fetchDevicesByType('transport'),
      fetchDevicesByType('lift')
    ]);
    
    // 验证是否有数据加载成功
    const hasData = totalCounts.brick > 0 || 
                   totalCounts.transport > 0 ||
                   totalCounts.transfer > 0 || 
                   totalCounts.lift > 0;
                   
    if (!hasData) {
      ElMessage.warning('没有找到匹配的设备数据');
    }
    
    return true;
  } catch (error) {
    console.error('重新加载设备数据失败:', error);
    throw error;
  }
};

// 搜索所有设备 - 简化逻辑，不验证参数完整性
const searchDevices = async () => {
  try {
    fullscreenLoading.value = true;
    
    // 重置所有分页
    Object.keys(pagination).forEach(type => {
      pagination[type].currentPage = 1;
    });
    
    // 并行搜索所有类型设备
    await Promise.all([
      fetchDevicesByType('brick'),
      fetchDevicesByType('transfer'),
      fetchDevicesByType('transport'),
      fetchDevicesByType('lift')
    ]);
    
    // 无论是否有参数，只要搜索完成就显示结果
    showSearchResult.value = true;
    
    fullscreenLoading.value = false;
    ElMessage.success('搜索完成');
  } catch (error) {
    console.error('搜索设备失败:', error);
    fullscreenLoading.value = false;
    ElMessage.error('搜索失败，请重试');
  }
};

// 分页事件处理
const handlePageSizeChange = async (type, pageSize) => {
  pagination[type].pageSize = pageSize;
  pagination[type].currentPage = 1;
  await fetchDevicesByType(type);
};

const handleCurrentPageChange = async (type, currentPage) => {
  pagination[type].currentPage = currentPage;
  await fetchDevicesByType(type);
};

// 处理砖规格数量变化
const handleBrickQuantityChange = (row) => {
  console.log(`砖规格 ${row.spec} 数量变更为: ${row.quantity}`);
  // 可以在这里添加数量变化的业务逻辑
};

// 工具函数：解析砖规格（格式：长×宽），返回{ length: 数值, width: 数值 }
const parseBrickSpec = (spec) => {
  if (!spec || typeof spec !== 'string') return null;
  const [lengthStr, widthStr] = spec.split('×');
  const length = parseInt(lengthStr, 10);
  const width = parseInt(widthStr, 10);
  // 校验：排除非数字或无效值（如“×”分割失败）
  if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
    console.warn(`无效砖规格：${spec}，已忽略`);
    return null;
  }
  return { length, width };
};

// 计算砖相关关键参数：minBrickWidth、maxBrickWidth、RequiredBoardLength
const calculateBrickParams = () => {
  // 步骤1：筛选用户实际使用的砖规格（quantity > 0）并解析
  const usedBricks = brickSpecs.value
    .filter(brick => brick.quantity > 0) // 排除数量为0的砖（不用的设备）
    .map(brick => ({
      ...brick,
      ...parseBrickSpec(brick.spec)
    }))
    .filter(brick => brick.length !== undefined && brick.width !== undefined); // 排除解析失败的规格

  if (usedBricks.length === 0) {
    return {
      minBrickWidth: null,
      maxBrickWidth: null,
      requiredBoardLength: null
    };
  }

  // 步骤2：计算最小/最大砖宽
  const widths = usedBricks.map(brick => brick.width);
  const minBrickWidth = Math.min(...widths);
  const maxBrickWidth = Math.max(...widths);

  // 步骤3：计算最小砖长并确定托板长度
  const lengths = usedBricks.map(brick => brick.length);
  const minBrickLength = Math.min(...lengths);
  let requiredBoardLength;
  if (minBrickLength <= 300) {
    requiredBoardLength = 300;
  } else if (minBrickLength <= 400) {
    requiredBoardLength = 370;
  } else {
    requiredBoardLength = 550;
  }

  console.log(`计算砖参数：最小宽=${minBrickWidth}, 最大宽=${maxBrickWidth}, 最小长=${minBrickLength}, 托板长=${requiredBoardLength}`);
  return {
    minBrickWidth,
    maxBrickWidth,
    requiredBoardLength
  };
};

// 应用拍齐顶升筛选条件（对应WPF版本的逻辑）
const applyLiftFilters = (lifts) => {
  let filtered = [...lifts];
  
  // 1. 物料编码筛选
  // （当前需求中没有提供物料编码输入，可根据实际情况添加）
  
  // 2. 适用最大砖厚度筛选（精确匹配）
  if (!stringNullOrEmpty(liftForm.maxBrickThickness)) {
    filtered = filtered.filter(l => l.brickThickness == liftForm.maxBrickThickness);
  }
  
  // 3. 计算砖参数并应用砖宽范围筛选
  const { minBrickWidth, maxBrickWidth, requiredBoardLength } = calculateBrickParams();
  
  if (minBrickWidth !== null && maxBrickWidth !== null) {
    filtered = filtered.filter(l => {
      if (stringNullOrEmpty(l.brickWidthRange)) {
        return false;
      }

      const dbRangeParts = l.brickWidthRange.split('~');
      if (dbRangeParts.length !== 2 ||
          !Number.isInteger(parseInt(dbRangeParts[0], 10)) ||
          !Number.isInteger(parseInt(dbRangeParts[1], 10))) {
        console.warn(`拍齐顶升 ${l.materialCode} 的砖宽范围格式错误：${l.brickWidthRange}`);
        return false;
      }

      const dbMinWidth = parseInt(dbRangeParts[0], 10);
      const dbMaxWidth = parseInt(dbRangeParts[1], 10);

      // 用户的砖宽范围完全落在数据库的范围区间内
      return minBrickWidth >= dbMinWidth && maxBrickWidth <= dbMaxWidth;
    });
  }
  
  // 4. 托板砖长筛选
  if (requiredBoardLength !== null) {
    filtered = filtered.filter(l => l.plateLength == requiredBoardLength);
  }
  
  return filtered;
};

// 根据类型获取设备数据
const fetchDevicesByType = async (type) => {
  try {
    let response;
    const params = {
      pageNum: pagination[type].currentPage,
      pageSize: pagination[type].pageSize,
      // 传递砖规格数量参数
      brickSpecs: brickSpecs.value.filter(item => item.quantity > 0)
    };

    // 添加对应类型的搜索参数
    if (type === 'brick') {
      params.brickSpec = form.brickSpec || undefined;
      params.style = form.style || undefined;
      params.workstationCount = form.workstationCount || undefined;
    } else if (type === 'transfer') {
      params.ferryPitWidth = transferForm.ferryPitWidth || undefined;
      params.ferryKeyFeature = transferForm.ferryKeyFeature || undefined;
      params.maxBrickWidth = transferForm.maxBrickWidth || undefined;
      params.hasPit = transferForm.hasPit || undefined;
    } else if (type === 'transport') {
      params.pitWidth = transportForm.pitWidth || undefined;
      params.supportType = transportForm.supportType || undefined;
      params.powerType = transportForm.powerType || undefined;
    } else if (type === 'lift') {
      params.brickThickness = liftForm.maxBrickThickness || undefined;
    }

    // 调用对应API
    switch (type) {
      case 'brick':
        response = await listBrick(params);
        break;
      case 'transport':
        response = await listTransport(params);
        break;
      case 'transfer':
        response = await listTransfer(params);
        break;
      case 'lift':
        response = await listLift(params);
        break;
      default:
        return;
    }

    // 检查API响应是否有效
    if (!response || !response.rows) {
      console.error(`获取${type}设备数据格式错误`, response);
      throw new Error(`获取${type}设备数据失败`);
    }

    // 获取砖规格数量用于特殊筛选
    const brickCount3 = brickSpecs.value.find(item => item.code === 3)?.quantity || 0;
    const brickCount5 = brickSpecs.value.find(item => item.code === 5)?.quantity || 0;
    
    // 更新数据，应用对应设备类型的筛选逻辑
    let filteredData = response.rows;
    if (type === 'transport') {
      filteredData = applyTransportFilters(response.rows, brickCount3, brickCount5);
    } else if (type === 'lift') {
      // 对拍齐顶升设备应用砖规格筛选
      filteredData = applyLiftFilters(response.rows);
    }

    // 确保每个设备都有quantity属性
    const deviceRefs = {
      brick: brickDevices,
      transport: transportDevices,
      transfer: transferDevices,
      lift: liftDevices
    };

    deviceRefs[type].value = filteredData.map(item => ({ 
      ...item, 
      quantity: 1 
    }));
    
    // 关键修复：使用API返回的总记录数，而不是筛选后的当前页数量
    totalCounts[type] = response.total || 0;
    
    console.log(`加载${type}设备成功: 当前页${filteredData.length}条，共${response.total || 0}条`);
  } catch (error) {
    console.error(`获取${type}设备失败:`, error);
  }
};

// 应用运输车筛选条件（对应WPF版本的逻辑）
const applyTransportFilters = (transports, brickCount3, brickCount5) => {
  let filtered = [...transports];
  
  // 应用基础筛选条件
  if (!stringNullOrEmpty(transportForm.pitWidth)) {
    filtered = filtered.filter(t => t.pitWidth == transportForm.pitWidth);
  }
  
  if (!stringNullOrEmpty(transportForm.supportType)) {
    filtered = filtered.filter(t => 
      t.supportType?.includes(transportForm.supportType) ?? false
    );
  }
  
  if (!stringNullOrEmpty(transportForm.powerType)) {
    filtered = filtered.filter(t => 
      t.powerType?.includes(transportForm.powerType) ?? false
    );
  }
  
  // 应用特殊条件筛选（对应WPF中的逻辑）
  if (transportForm.pitWidth) {
    // 转换为数字进行比较
    const pitWidth = parseInt(transportForm.pitWidth);
    
    // 特殊条件1: 坑宽5500且(3号砖数量=6或5号砖数量=3)
    if (pitWidth === 5500 && (brickCount3 === 6 || brickCount5 === 3)) {
      filtered = filtered.filter(t =>
        t.brickCount600 === 6 || t.brickCount600x1200 === 3
      );
    }
    // 特殊条件2: 坑宽5500且(3号砖数量=7或5号砖数量=4)
    else if (pitWidth === 5500 && (brickCount3 === 7 || brickCount5 === 4)) {
      filtered = filtered.filter(t =>
        t.brickCount600 === 7 || t.brickCount600x1200 === 4
      );
    }
    // 特殊条件3: 坑宽4500且3号砖数量=6且支架形式=常规且电力形式=交流
    else if (pitWidth === 4500 && brickCount3 === 6 && 
             transportForm.supportType === "常规" && 
             transportForm.powerType === "交流") {
      filtered = filtered.filter(t => t.brickCount600 === 6);
    }
  }
  
  return filtered;
};

// 辅助函数：检查字符串是否为null或空
const stringNullOrEmpty = (value) => {
  return value === null || value === undefined || value === '';
};

// 已选设备分页事件
const handleSelectedPageSizeChange = (pageSize) => {
  selectedPagination.pageSize = pageSize;
  selectedPagination.currentPage = 1;
};

const handleSelectedCurrentPageChange = (currentPage) => {
  selectedPagination.currentPage = currentPage;
};

// 重置所有表单 - 包含对砖规格数量的重置
const resetAllForms = () => {
  // 重置砖规格数量
  brickSpecs.value.forEach(item => {
    item.quantity = 0;
  });
  
  // 重置砖机表单
  form.brickSpec = '';
  form.style = '';
  form.workstationCount = '';
  
  // 重置摆渡车表单
  transferForm.ferryPitWidth = null;
  transferForm.ferryKeyFeature = '';
  transferForm.maxBrickWidth = '';
  transferForm.hasPit = '';
  
  // 重置运输车表单
  transportForm.pitWidth = '';
  transportForm.supportType = '';
  transportForm.powerType = '';
  
  // 重置拍齐顶升表单
  liftForm.maxBrickThickness = '';
  
  // 清除搜索结果
  showSearchResult.value = false;
  
  // 清空设备数据
  brickDevices.value = [];
  transportDevices.value = [];
  transferDevices.value = [];
  liftDevices.value = [];
  
  // 清空总数
  totalCounts.brick = 0;
  totalCounts.transport = 0;
  totalCounts.transfer = 0;
  totalCounts.lift = 0;
  
  // 清空已选设备
  selectedDevices.value = [];
};

// 选择设备（加入购物车）
const selectDevice = (device, type) => {
  const typeMap = {
    brick: '砖机',
    transport: '运输车',
    transfer: '摆渡车',
    lift: '拍齐顶升'
  };

  const deviceInfo = {
    id: device.id,
    type: typeMap[type],
    materialCode: device.materialCode,
    name: device.materialDescription,
    quantity: device.quantity
  };

  // 检查是否已选择该设备
  const existingIndex = selectedDevices.value.findIndex(
    item => item.id === deviceInfo.id && item.type === deviceInfo.type
  );

  if (existingIndex > -1) {
    // 更新数量
    selectedDevices.value[existingIndex].quantity = deviceInfo.quantity;
    ElMessage.success('已更新设备数量');
  } else {
    // 添加新设备
    selectedDevices.value.push(deviceInfo);
    ElMessage.success('已添加到购物车');
  }
};

// 从预览中移除设备
const removeDeviceFromPreview = (previewIndex) => {
  const originalIndex = selectedDevices.value.findIndex(
    item => item.id === selectedDevices.value[previewIndex].id
  );
  
  if (originalIndex !== -1) {
    const removed = selectedDevices.value.splice(originalIndex, 1);
    ElMessage.success(`已从购物车移除 ${removed[0].name}`);
  }
};

// 从选购记录中移除设备
const removeDevice = (index) => {
  const originalIndex = (selectedPagination.currentPage - 1) * selectedPagination.pageSize + index;
  const removed = selectedDevices.value.splice(originalIndex, 1);
  
  ElMessage.success(`已移除 ${removed[0].name}`);

  if (currentSelectedDevices.value.length === 0 && selectedPagination.currentPage > 1) {
    selectedPagination.currentPage--;
  }
};

// 导出选购记录
const exportSelected = async () => {
  fullscreenLoading.value = true;
  try {
    if (selectedDevices.value.length === 0) {
      ElMessage.error('请至少选择一条数据');
      fullscreenLoading.value = false;
      return;
    }

    const selectedDevicesMap = {
      brick: [],
      transport: [],
      transfer: [],
      lift: []
    };

    selectedDevices.value.forEach(device => {
      switch(device.type) {
        case '砖机':
          selectedDevicesMap.brick.push({
            materialCode: device.materialCode,
            quantity: device.quantity
          });
          break;
        case '运输车':
          selectedDevicesMap.transport.push({
            materialCode: device.materialCode,
            quantity: device.quantity
          });
          break;
        case '摆渡车':
          selectedDevicesMap.transfer.push({
            materialCode: device.materialCode,
            quantity: device.quantity
          });
          break;
        case '拍齐顶升':
          selectedDevicesMap.lift.push({
            materialCode: device.materialCode,
            quantity: device.quantity
          });
          break;
      }
    });

    // 添加砖规格数量到导出数据
    const exportData = {
      ...selectedDevicesMap,
      brickSpecs: brickSpecs.value.filter(item => item.quantity > 0)
    };

    const response = await axios.post(
      'http://106.53.219.143:8080/device/search/export-selected-together',
      exportData,
      {
        responseType: 'blob',
        headers: { 'Content-Type': 'application/json' },
        validateStatus: status => status === 200
      }
    );

    const blob = response.data;
    const excelBlob = new Blob([blob], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const contentDisposition = response.headers['content-disposition'] || '';
    const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    const fileName = fileNameMatch
      ? decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ''))
      : `selected_devices_${new Date().getTime()}.xlsx`;

    const url = window.URL.createObjectURL(excelBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    fullscreenLoading.value = false;
    ElMessage.success('导出成功');

  } catch (error) {
    console.error('导出失败:', error);
    fullscreenLoading.value = false;
    
    if (error.response && error.response.data instanceof Blob) {
      const errorText = await error.response.data.text();
      const errorObj = JSON.parse(errorText);
      ElMessage.error(errorObj.msg || '导出失败');
    } else {
      ElMessage.error(error.message || '导出失败');
    }
  }
};

// 完成流程
const finishProcess = () => {
  ElMessage.success('选购流程已完成');
  // 重置流程到第一步
  currentStep.value = 1;
  resetAllForms();
};

// 初始化页面
onMounted(() => {
  console.log('设备搜索流程页面已加载');
});
</script>

<style scoped>
/* 原有样式保持不变 */
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  padding: 0 20px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 120px;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e9e9e9;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-weight: bold;
}

.step-name {
  font-size: 14px;
  color: #666;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #e9e9e9;
  margin: 0 10px;
}

.step-item.active .step-number {
  background-color: #409eff;
  color: white;
}

.step-item.active .step-name {
  color: #409eff;
  font-weight: bold;
}

.step-item.completed .step-number {
  background-color: #67c23a;
  color: white;
}

.step-line.completed {
  background-color: #67c23a;
}

.steps-content {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  min-height: 400px;
}

.step-content {
  animation: fadeIn 0.3s;
}

.form-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.step-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.search-result-preview {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  text-align: center;
}

.devices-list {
  margin-top: 15px;
}

.pagination-container {
  margin-top: 15px;
  text-align: right;
}

.selected-preview {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.preview-more {
  text-align: center;
  margin-top: 10px;
  color: #666;
}

.loading-container {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.export-btn {
  margin-left: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 标签页内容样式 */
.tab-content {
  margin-top: 15px;
}

.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  padding-top: 10px;
}
</style>
    