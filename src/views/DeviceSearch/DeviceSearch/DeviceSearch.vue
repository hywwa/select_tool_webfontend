<template>
  <div class="device-search-page">
    <!-- 步骤指示器 - 优化移动端显示 -->
    <div class="steps-indicator">
      <div class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
        <div class="step-number">1</div>
        <div class="step-name">参数</div>
      </div>
      <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
      <div class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
        <div class="step-number">2</div>
        <div class="step-name">选择</div>
      </div>
      <div class="step-line" :class="{ completed: currentStep > 2 }"></div>
      <div class="step-item" :class="{ active: currentStep >= 3 }">
        <div class="step-number">3</div>
        <div class="step-name">记录</div>
      </div>
    </div>

    <!-- 步骤内容区域 -->
    <div class="steps-content">
      <!-- 步骤1：参数设置 -->
      <div v-if="currentStep === 1" class="step-content">
        <h2>设备参数设置</h2>
        
        <div class="param-form-container">
          <!-- 砖规格数量设置 - 移动端优化为滚动列表 -->
          <div class="form-section">
            <h3>砖规格与数量</h3>
            <div class="scrollable-table-container">
              <el-table :data="brickSpecs" border size="mini">
                <el-table-column prop="spec" label="砖规格（长×宽）" width="150"></el-table-column>
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
          </div>

          <!-- 砖机设备参数 - 移动端优化为紧凑布局 -->
          <div class="form-section">
            <h3>砖机设备参数</h3>
            <el-form ref="formRef" :model="form" label-width="100px" size="small">
              <el-form-item label="最大砖宽">
                <el-select v-model="form.brickSpec" placeholder="请选择">
                  <el-option label="900" value="900"></el-option>
                  <el-option label="1600" value="1600"></el-option>
                  <el-option label="1200" value="1200"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="样式">
                <el-select v-model="form.style" placeholder="请选择">
                  <el-option label="一体式" value="一体式"></el-option>
                  <el-option label="分体式" value="分体式"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工位数">
                <el-select v-model="form.workstationCount" placeholder="请选择">
                  <el-option label="2" value="2"></el-option>
                  <el-option label="3" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>

         <!-- 其他设备参数区域 -->
          <div class="device-params-container">
            <!-- 摆渡车设备参数 -->
            <div class="form-section">
              <h3>摆渡车设备参数</h3>
              <el-form ref="transferFormRef" :model="transferForm" label-width="100px" size="small">
                <el-form-item label="摆渡坑宽">
                  <el-select v-model="transferForm.ferryPitWidth"  placeholder="请选择">
                    <el-option label="4500" value="4500"></el-option>
                    <el-option label="4800" value="4800"></el-option>
                    <el-option label="5500" value="5500"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="摆渡车关键特征">
                  <el-select v-model="transferForm.ferryKeyFeature" placeholder="请选择">
                    <el-option label="常规" value="常规"></el-option>
                    <el-option label="鱼骨" value="鱼骨"></el-option>
                    <el-option label="升降摆渡" value="升降摆渡"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="最大砖宽度">
                  <el-select v-model="transferForm.maxBrickWidth" placeholder="请选择">
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
              <el-form ref="transportFormRef" :model="transportForm" label-width="100px" size="small">
                <el-form-item label="摆渡坑宽">
                  <el-select v-model="transportForm.pitWidth"  placeholder="请选择">
                    <el-option label="4500" value="4500"></el-option>
                    <el-option label="5500" value="5500"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="支架形式">
                  <el-select v-model="transportForm.supportType" placeholder="请选择">
                    <el-option label="常规" value="常规"></el-option>
                    <el-option label="鱼骨" value="鱼骨"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="电力形式">
                  <el-select v-model="transportForm.powerType" placeholder="请选择">
                    <el-option label="交流" value="交流"></el-option>
                    <el-option label="直流" value="直流"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 拍齐顶升设备参数 -->
            <div class="form-section">
              <h3>拍齐顶升设备参数</h3>
              <el-form ref="liftFormRef" :model="liftForm" label-width="100px" size="small">    
                <el-form-item label="最大砖厚度">
                  <el-select v-model="liftForm.maxBrickThickness" placeholder="请选择">
                    <el-option label="15" value="15"></el-option>
                    <el-option label="20" value="20"></el-option>
                    <el-option label="48" value="48"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
    
          <div class="form-actions">
            <el-button type="primary" @click="searchDevices" class="btn-block">搜索设备</el-button>
            <el-button @click="resetAllForms" class="btn-block">重置所有</el-button>
          </div>

          <!-- 搜索结果预览 -->
          <div v-if="showSearchResult" class="search-result-preview">
            <h4>搜索结果预览</h4>
            <p>砖机: {{ totalCounts.brick }} 条 | 摆渡车: {{ totalCounts.transfer }} 条</p>
            <p>运输车: {{ totalCounts.transport }} 条 | 拍齐顶升: {{ totalCounts.lift }} 条</p>
            <p>请点击"下一步"查看完整结果并选择设备</p>
          </div>
        </div>

        <div class="step-actions">
          <el-button type="primary" @click="nextStep" :disabled="!showSearchResult" class="btn-block">下一步</el-button>
        </div>
      </div>

      <!-- 步骤2：设备选择 - 重点优化表格显示 -->
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
          <!-- 四个设备列表导航 - 移动端优化为可滚动标签 -->
          <div class="scrollable-tabs">
            <el-tabs v-model="activeTab" type="card" class="device-tabs">
              <el-tab-pane label="砖机" name="brick"></el-tab-pane>
              <el-tab-pane label="运输车" name="transport"></el-tab-pane>
              <el-tab-pane label="摆渡车" name="transfer"></el-tab-pane>
              <el-tab-pane label="拍齐顶升" name="lift"></el-tab-pane>
            </el-tabs>
          </div>

          <!-- 表格内容 - 移动端使用卡片式布局 -->
          <div class="tab-content">
            <!-- 桌面端表格 -->
            <div class="desktop-view">
              <el-table v-if="activeTab === 'brick'" :data="brickDevices" border size="mini">
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
              </el-table>

              <el-table v-if="activeTab === 'transport'" :data="transportDevices" border size="mini">
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
              </el-table>

              <el-table v-if="activeTab === 'transfer'" :data="transferDevices" border size="mini">
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
              </el-table>

              <el-table v-if="activeTab === 'lift'" :data="liftDevices" border size="mini">
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
              </el-table>
            </div>

            <!-- 移动端卡片布局 -->
            <div class="mobile-view">
              <!-- 砖机卡片列表 -->
              <div v-if="activeTab === 'brick'" class="device-cards">
                <div class="device-card" v-for="(device, index) in brickDevices" :key="index">
                  <div class="card-header">
                    <span class="material-code">{{ device.materialCode }}</span>
                    <div class="quantity-selector">
                      <span>数量:</span>
                      <el-input-number
                        v-model="device.quantity"
                        :min="1"
                        controls-position="right"
                        size="mini"
                      ></el-input-number>
                    </div>
                  </div>
                  <div class="card-body">
                    <h4 class="card-title">{{ device.materialDescription }}</h4>
                    <div class="card-attributes">
                      <div class="attribute-row">
                        <span class="attr-name">适用最大砖宽:</span>
                        <span class="attr-value">{{ device.brickSpec }}</span>
                      </div>
                      <div class="attribute-row">
                        <span class="attr-name">移砖行程:</span>
                        <span class="attr-value">{{ device.travelDistance }}mm</span>
                      </div>
                      <div class="attribute-row">
                        <span class="attr-name">样式:</span>
                        <span class="attr-value">{{ device.style }}</span>
                      </div>
                      <div class="attribute-row">
                        <span class="attr-name">工位数:</span>
                        <span class="attr-value">{{ device.workstationCount }}</span>
                      </div>
                      <el-collapse>
                        <el-collapse-item title="查看更多参数">
                          <div class="attribute-row">
                            <span class="attr-name">提升速比:</span>
                            <span class="attr-value">{{ device.liftRatio }}</span>
                          </div>
                          <div class="attribute-row">
                            <span class="attr-name">吸盘数量:</span>
                            <span class="attr-value">{{ device.suctionCupCount }}</span>
                          </div>
                          <div class="attribute-row">
                            <span class="attr-name">电磁阀数量:</span>
                            <span class="attr-value">{{ device.solenoidValveCount }}</span>
                          </div>
                          <div class="attribute-row">
                            <span class="attr-name">备注:</span>
                            <span class="attr-value">{{ device.notes }}</span>
                          </div>
                        </el-collapse-item>
                      </el-collapse>
                    </div>
                  </div>
                  <div class="card-actions">
                    <el-button 
                      type="primary" 
                      size="small" 
                      @click="selectDevice(device, 'brick')"
                      class="btn-block"
                    >
                      选择
                    </el-button>
                  </div>
                </div>
              </div>

              <!-- 运输车卡片列表 -->
              <div v-if="activeTab === 'transport'" class="device-cards">
                <div class="device-card" v-for="(device, index) in transportDevices" :key="index">
                  <div class="card-header">
                    <span class="material-code">{{ device.materialCode }}</span>
                    <div class="quantity-selector">
                      <span>数量:</span>
                      <el-input-number
                        v-model="device.quantity"
                        :min="1"
                        controls-position="right"
                        size="mini"
                      ></el-input-number>
                    </div>
                  </div>
                  <div class="card-body">
                    <h4 class="card-title">{{ device.materialDescription }}</h4>
                    <div class="card-attributes">
                      <div class="attribute-row">
                        <span class="attr-name">坑宽:</span>
                        <span class="attr-value">{{ device.pitWidth }}mm</span>
                      </div>
                      <div class="attribute-row">
                        <span class="attr-name">支架形式:</span>
                        <span class="attr-value">{{ device.supportType }}</span>
                      </div>
                      <div class="attribute-row">
                        <span class="attr-name">电力形式:</span>
                        <span class="attr-value">{{ device.powerType }}</span>
                      </div>
                      <el-collapse>
                        <el-collapse-item title="查看更多参数">
                          <div class="attribute-row">
                            <span class="attr-name">600规格砖片数:</span>
                            <span class="attr-value">{{ device.brickCount600 }}片</span>
                          </div>
                          <div class="attribute-row">
                            <span class="attr-name">车身总长:</span>
                            <span class="attr-value">{{ device.vehicleLength }}mm</span>
                          </div>
                          <div class="attribute-row">
                            <span class="attr-name">使用项目:</span>
                            <span class="attr-value">{{ device.projects }}</span>
                          </div>
                        </el-collapse-item>
                      </el-collapse>
                    </div>
                  </div>
                  <div class="card-actions">
                    <el-button 
                      type="primary" 
                      size="small" 
                      @click="selectDevice(device, 'transport')"
                      class="btn-block"
                    >
                      选择
                    </el-button>
                  </div>
                </div>
              </div>

              <!-- 摆渡车卡片列表 -->
              <div v-if="activeTab === 'transfer'" class="device-cards">
                <div class="device-card" v-for="(device, index) in transferDevices" :key="index">
                  <div class="card-header">
                    <span class="material-code">{{ device.materialCode }}</span>
                    <div class="quantity-selector">
                      <span>数量:</span>
                      <el-input-number
                        v-model="device.quantity"
                        :min="1"
                        controls-position="right"
                        size="mini"
                      ></el-input-number>
                    </div>
                  </div>
                  <div class="card-body">
                    <h4 class="card-title">{{ device.materialDescription }}</h4>
                    <div class="card-attributes">
                      <div class="attribute-row">
                        <span class="attr-name">摆渡坑宽度:</span>
                        <span class="attr-value">{{ device.ferryPitWidth }}mm</span>
                      </div>
                      <div class="attribute-row">
                        <span class="attr-name">关键特征:</span>
                        <span class="attr-value">{{ device.ferryKeyFeature }}</span>
                      </div>
                      <div class="attribute-row">
                        <span class="attr-name">有无坑:</span>
                        <span class="attr-value">{{ device.hasPit }}</span>
                      </div>
                      <el-collapse>
                        <el-collapse-item title="查看更多参数">
                          <div class="attribute-row">
                            <span class="attr-name">最大砖宽度:</span>
                            <span class="attr-value">{{ device.maxBrickWidth }}mm</span>
                          </div>
                          <div class="attribute-row">
                            <span class="attr-name">轨道内宽:</span>
                            <span class="attr-value">{{ device.trackWidth }}mm</span>
                          </div>
                        </el-collapse-item>
                      </el-collapse>
                    </div>
                  </div>
                  <div class="card-actions">
                    <el-button 
                      type="primary" 
                      size="small" 
                      @click="selectDevice(device, 'transfer')"
                      class="btn-block"
                    >
                      选择
                    </el-button>
                  </div>
                </div>
              </div>

              <!-- 拍齐顶升卡片列表 -->
              <div v-if="activeTab === 'lift'" class="device-cards">
                <div class="device-card" v-for="(device, index) in liftDevices" :key="index">
                  <div class="card-header">
                    <span class="material-code">{{ device.materialCode }}</span>
                    <div class="quantity-selector">
                      <span>数量:</span>
                      <el-input-number
                        v-model="device.quantity"
                        :min="1"
                        controls-position="right"
                        size="mini"
                      ></el-input-number>
                    </div>
                  </div>
                  <div class="card-body">
                    <h4 class="card-title">{{ device.materialDescription }}</h4>
                    <div class="card-attributes">
                      <div class="attribute-row">
                        <span class="attr-name">适用砖宽范围:</span>
                        <span class="attr-value">{{ device.brickWidthRange }}mm</span>
                      </div>
                      <div class="attribute-row">
                        <span class="attr-name">适用砖厚度:</span>
                        <span class="attr-value">{{ device.brickThickness }}mm</span>
                      </div>
                      <div class="attribute-row">
                        <span class="attr-name">底架形式:</span>
                        <span class="attr-value">{{ device.baseType }}</span>
                      </div>
                      <el-collapse>
                        <el-collapse-item title="查看更多参数">
                          <div class="attribute-row">
                            <span class="attr-name">托砖板长度:</span>
                            <span class="attr-value">{{ device.plateLength }}mm</span>
                          </div>
                          <div class="attribute-row">
                            <span class="attr-name">拍齐轮个数:</span>
                            <span class="attr-value">{{ device.alignWheelCount }}</span>
                          </div>
                        </el-collapse-item>
                      </el-collapse>
                    </div>
                  </div>
                  <div class="card-actions">
                    <el-button 
                      type="primary" 
                      size="small" 
                      @click="selectDevice(device, 'lift')"
                      class="btn-block"
                    >
                      选择
                    </el-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination
                  v-model:current-page="pagination[activeTab].currentPage"
                  v-model:page-size="pagination[activeTab].pageSize"
                  :total="totalCounts[activeTab]"
                  :page-sizes="[5, 10, 20]"
                  layout="total, prev, pager, next"
                  @size-change="handlePageSizeChange(activeTab, $event)"
                  @current-change="handleCurrentPageChange(activeTab, $event)"
              />
            </div>
          </div>

          <!-- 已选设备预览（购物车） -->
          <div class="selected-preview">
            <h4>已选设备 ({{ selectedDevices.length }})</h4>
            <div class="selected-list">
              <div class="selected-item" v-for="(item, index) in selectedDevices" :key="index">
                <div class="item-info">
                  <div class="item-type">{{ item.type }}</div>
                  <div class="item-code">{{ item.materialCode }}</div>
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-quantity">数量: {{ item.quantity }}</div>
                </div>
                <el-button
                  type="text"
                  @click="removeDeviceFromPreview(index)"
                  class="remove-btn"
                  size="small"
                >
                  <i class="el-icon-delete"></i>
                </el-button>
              </div>
            </div>
            <div v-if="selectedDevices.length === 0" class="empty-selected">
              暂无选中设备
            </div>
          </div>
        </div>

        <div class="step-actions">
          <el-button @click="prevStep" class="btn-block btn-prev">上一步</el-button>
          <el-button type="primary" @click="nextStep" :disabled="selectedDevices.length === 0" class="btn-block btn-next">下一步</el-button>
        </div>
      </div>

      <!-- 步骤3：结果处理（选购记录） -->
      <div v-if="currentStep === 3" class="step-content">
        <h2>选购记录</h2>
        
        <div class="selected-devices">
          <!-- 桌面端表格 -->
          <div class="desktop-view">
            <el-table :data="currentSelectedDevices" border size="mini">
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
          </div>
          
          <!-- 移动端列表 -->
          <div class="mobile-view">
            <div class="selected-record" v-for="(item, index) in currentSelectedDevices" :key="index">
              <div class="record-header">
                <span class="record-type">{{ item.type }}</span>
                <span class="record-quantity">数量: {{ item.quantity }}</span>
              </div>
              <div class="record-body">
                <div class="record-code">{{ item.materialCode }}</div>
                <div class="record-name">{{ item.name }}</div>
              </div>
              <div class="record-actions">
                <el-button
                  type="text"
                  @click="removeDevice(index)"
                  style="color: #f56c6c"
                  size="small"
                >
                  移除
                </el-button>
              </div>
            </div>
            <div v-if="currentSelectedDevices.length === 0" class="empty-selected">
              暂无选购记录
            </div>
          </div>
          
          <!-- 分页 -->
          <div class="pagination-container" v-if="selectedDevices.length > 0">
            <el-pagination
                v-model:current-page="selectedPagination.currentPage"
                v-model:page-size="selectedPagination.pageSize"
                :total="selectedDevices.length"
                :page-sizes="[5, 10, 20]"
                layout="total, prev, pager, next"
                @size-change="handleSelectedPageSizeChange"
                @current-change="handleSelectedCurrentPageChange"
            />
          </div>
        </div>

        <div class="step-actions">
          <el-button @click="prevStep" class="btn-block btn-prev">上一步</el-button>
          <div class="btn-group">
            <!-- 根据报价状态显示不同的导出按钮 -->
            <template v-if="isQuoted === '0'">
              <!-- 未报价状态：显示技术附件和报价清单导出按钮 -->
              <el-button
                v-loading.fullscreen.lock="isExporting"
                @click="handleExportTechnicalAttachment"
                class="export-btn btn-block"
                v-if="selectedDevices.length > 0"
                v-hasPermi="['device:records:export']"
              >
                <i class="el-icon-document" v-if="!isExporting"></i>
                <span v-if="!isExporting">导出技术附件</span>
                <span v-else>
                  <i class="el-icon-loading loading-icon"></i>
                  导出中...
                </span>
              </el-button>
              
              <el-button
                v-loading.fullscreen.lock="isQuotationExporting"
                @click="handleExportQuotationList"
                class="export-btn btn-block"
                v-if="selectedDevices.length > 0"
                v-hasPermi="['device:records:export']"
              >
                <i class="el-icon-s-grid" v-if="!isQuotationExporting"></i>
                <span v-if="!isQuotationExporting">导出报价清单</span>
                <span v-else>
                  <i class="el-icon-loading loading-icon"></i>
                  导出中...
                </span>
              </el-button>
            </template>
            
            <template v-if="isQuoted === '1'">
              <!-- 已报价状态：显示导出设备清单按钮 -->
              <el-button 
                v-loading.fullscreen.lock="fullscreenLoading" 
                @click="exportSelected" 
                class="export-btn btn-block" 
                v-if="selectedDevices.length > 0"
                v-hasPermi="['device:records:export']"
              >
                导出设备清单
              </el-button>
            </template>
            
            <!-- 完成按钮保持不变 -->
            <el-button type="success" @click="finishProcess" class="btn-block btn-finish">完成</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="DeviceSearchFlow">
import { ref, reactive, onMounted, computed, watch, getCurrentInstance, onUnmounted } from 'vue';
import { listBrick, listTransport, listTransfer, listLift } from "../../../api/device.js";
import { addRecords, getRecords } from "../../../api/device/records.js";
import { updateManagement } from "../../../api/device/management.js";
import { addDevices } from "../../../api/device/devices.js";
import { exportSelectedDevices, downloadExportFile } from "../../../api/device/export.js";
// 导入技术附件和报价单导出API
import { exportEquipmentTechnicalAttachment } from '@/api/device/wordExport'
import { exportQuotation } from '@/api/device/exportQuotation'
import { ElMessage, ElLoading, ElEmpty } from 'element-plus';
import { useRoute } from 'vue-router'

// 修复：更安全地获取组件实例
let proxy = null;
const instance = getCurrentInstance();
if (instance) {
  proxy = instance.proxy;
}

// 路由实例和参数存储
const route = useRoute()
const productionLineId = ref(null);
const selectionRecordId = ref(0); // 初始化ID为0
const isQuoted = ref('0'); // 报价状态：0-未报价，1-已报价

// 步骤控制
const currentStep = ref(1);
const showSearchResult = ref(false);
const isStep2Loading = ref(false); // 第二步加载状态

// 设备标签页状态
const activeTab = ref('brick');

const brickSpecs = ref([
// 砖规格与数量数据 - 增加code映射，用于匹配SelectionRecor
  { spec: '300×600', quantity: 0, code: 1}, // 对应brickCount1
  { spec: '400×800', quantity: 0, code: 2 }, // 对应brickCount2
  { spec: '600×600', quantity: 0, code: 3 }, // 对应brickCount3
  { spec: '800×800', quantity: 0, code: 4 }, // 对应brickCount4
  { spec: '600×1200', quantity: 0, code: 5 }, // 对应brickCount5
  { spec: '1200×600', quantity: 0, code: 6 }, // 对应brickCount6
  { spec: '750×1500', quantity: 0, code: 7 }, // 对应brickCount7
  { spec: '800×1600', quantity: 0, code: 8 }, // 对应brickCount8
  { spec: '900×1800', quantity: 0, code: 9 }  // 对应brickCount9
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
  powerType: '',
  brickCount3: 0,
  brickCount5: 0
});

// 拍齐顶升表单数据
const liftForm = reactive({
  maxBrickThickness: '',
  minBrickWidth: 0,
  maxBrickWidth: 0,
  requiredBoardLength: 0
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

// 总数量计数
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

// 导出状态管理
const isExporting = ref(false);                // 技术附件导出状态
const isQuotationExporting = ref(false);       // 报价单导出状态

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
      reloadStep2Data().catch(err => {
        console.error('步骤2数据加载失败:', err);
        ElMessage.error('加载设备数据失败');
      });
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

// 搜索所有设备
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
  
  // 更新运输车的特殊参数
  if (row.code === 3) {
    transportForm.brickCount3 = row.quantity;
  }
  if (row.code === 5) {
    transportForm.brickCount5 = row.quantity;
  }
  
  // 计算拍齐顶升的特殊参数
  calculateBrickParams();
};

// 解析砖规格（格式：长×宽），返回{ length: 数值, width: 数值 }
const parseBrickSpec = (spec) => {
  if (!spec || typeof spec !== 'string') return null;
  const [lengthStr, widthStr] = spec.split('×');
  const length = parseInt(lengthStr, 10);
  const width = parseInt(widthStr, 10);
  // 校验：排除非数字或无效值
  if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
    console.warn(`无效砖规格：${spec}，已忽略`);
    return null;
  }
  return { length, width };
};

// 计算砖相关关键参数：minBrickWidth、maxBrickWidth、RequiredBoardLength
const calculateBrickParams = () => {
  // 筛选用户实际使用的砖规格（quantity > 0）并解析
  const usedBricks = brickSpecs.value
    .filter(brick => brick.quantity > 0)
    .map(brick => ({
      ...brick,
      ...parseBrickSpec(brick.spec)
    }))
    .filter(brick => brick.length !== undefined && brick.width !== undefined);

  if (usedBricks.length === 0) {
    liftForm.minBrickWidth = 0;
    liftForm.maxBrickWidth = 0;
    liftForm.requiredBoardLength = 0;
    return;
  }

  // 计算最小/最大砖宽
  const widths = usedBricks.map(brick => brick.width);
  liftForm.minBrickWidth = Math.min(...widths);
  liftForm.maxBrickWidth = Math.max(...widths);

  // 计算最小砖长并确定托板长度
  const lengths = usedBricks.map(brick => brick.length);
  const minBrickLength = Math.min(...lengths);
  
  if (minBrickLength <= 300) {
    liftForm.requiredBoardLength = 300;
  } else if (minBrickLength <= 400) {
    liftForm.requiredBoardLength = 370;
  } else {
    liftForm.requiredBoardLength = 550;
  }

  console.log(`计算砖参数：最小宽=${liftForm.minBrickWidth}, 最大宽=${liftForm.maxBrickWidth}, 托板长=${liftForm.requiredBoardLength}`);
};

// 根据类型获取设备数据 - 完全依赖后端筛选
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
      // 运输车特殊筛选参数（对应后端brickCount3和brickCount5）
      params.pitWidth = transportForm.pitWidth || undefined;
      params.supportType = transportForm.supportType || undefined;
      params.powerType = transportForm.powerType || undefined;
      params.brickCount3 = transportForm.brickCount3 || undefined;
      params.brickCount5 = transportForm.brickCount5 || undefined;
    } else if (type === 'lift') {
      // 拍齐顶升特殊筛选参数
      params.brickThickness = liftForm.maxBrickThickness || undefined;
      params.minBrickWidth = liftForm.minBrickWidth || undefined;
      params.maxBrickWidth = liftForm.maxBrickWidth || undefined;
      params.requiredBoardLength = liftForm.requiredBoardLength || undefined;
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

    // 确保每个设备都有quantity属性
    const deviceRefs = {
      brick: brickDevices,
      transport: transportDevices,
      transfer: transferDevices,
      lift: liftDevices
    };

    // 直接使用后端返回的数据，不做前端筛选
    deviceRefs[type].value = response.rows.map(item => ({ 
      ...item, 
      quantity: 1 
    }));
    
    // 更新总记录数
    totalCounts[type] = response.total || 0;
    
    console.log(`加载${type}设备成功: 当前页${response.rows.length}条，共${response.total || 0}条`);
  } catch (error) {
    console.error(`获取${type}设备失败:`, error);
  }
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
  transportForm.brickCount3 = 0;
  transportForm.brickCount5 = 0;
  
  // 重置拍齐顶升表单
  liftForm.maxBrickThickness = '';
  liftForm.minBrickWidth = 0;
  liftForm.maxBrickWidth = 0;
  liftForm.requiredBoardLength = 0;
  
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

/**
 * 处理技术附件导出逻辑
 */
const handleExportTechnicalAttachment = async () => {
  // 1. 防重复点击 + 初始化状态
  if (isExporting.value) return
  isExporting.value = true
  let loadingInstance = null

  try {
    // 2. 显示全局加载提示（增强用户感知）
    loadingInstance = ElLoading.service({
      text: '正在生成Word文档...',
      background: 'rgba(255, 255, 255, 0.8)'
    })

    // 3. 调用导出接口（获取Blob流）
    const blob = await exportEquipmentTechnicalAttachment()

    // 4. 生成动态文件名
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const fileName = `${dateStr}-沙特RAK-窑后储砖线技术附件.docx`

    // 5. 触发文件下载
    downloadExportFile(blob, fileName)

    // 6. 导出成功提示
    ElMessage.success('Word文档导出成功！')

  } catch (error) {
    // 7. 导出失败处理
    ElMessage.error(`导出失败：${error.message || '请稍后重试'}`)
    console.error('技术附件导出接口异常：', error)

  } finally {
    // 8. 清理状态
    isExporting.value = false
    if (loadingInstance) loadingInstance.close()
  }
}

/**
 * 处理报价单导出逻辑
 */
const handleExportQuotationList = async () => {
  // 1. 防重复点击 + 初始化状态
  if (isQuotationExporting.value) return
  isQuotationExporting.value = true
  let loadingInstance = null

  try {
    // 2. 显示全局加载提示
    loadingInstance = ElLoading.service({
      text: '正在生成报价单Excel...',
      background: 'rgba(255, 255, 255, 0.8)'
    })

    // 3. 调用报价单导出接口
    const blob = await exportQuotation()

    // 4. 生成动态文件名
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const fileName = `${dateStr}-沙特RAK-窑后储砖报价单.xlsx`

    // 5. 触发文件下载
    downloadExportFile(blob, fileName)

    // 6. 导出成功提示
    ElMessage.success('报价单Excel导出成功！')

  } catch (error) {
    // 7. 导出失败处理
    ElMessage.error(`导出失败：${error.message || '请稍后重试'}`)
    console.error('报价单导出接口异常：', error)

  } finally {
    // 8. 清理状态
    isQuotationExporting.value = false
    if (loadingInstance) loadingInstance.close()
  }
}

// 导出设备清单（已报价状态）
const exportSelected = async () => {
  fullscreenLoading.value = true;
  try {
    if (selectedDevices.value.length === 0) {
      ElMessage.error('请至少选择一条数据');
      fullscreenLoading.value = false;
      return;
    }

    // 1. 创建选型主记录
    const selectionRecord = createSelectionRecordData();
    const recordResponse = await addRecords(selectionRecord);
    console.log("后端返回的完整响应：", recordResponse);
    if (!recordResponse || !recordResponse.recordId) {
      throw new Error('创建选型记录失败，未返回有效ID');
    }
    const newRecordId = recordResponse.recordId;
    console.log('创建选型主记录成功，ID:', newRecordId);


    // 2. 向中间表插入设备记录（循环单条添加）
    // 2.1 转换设备类型为数字
    const deviceTypeMap = {
      '砖机': 1,
      '运输车': 2,
      '摆渡车': 3,
      '拍齐顶升': 4
    };

    // 2.2 循环添加每条设备记录
    const addPromises = selectedDevices.value.map(device => {
      // 构造单条记录数据
      const deviceData = {
        recordId: newRecordId,
        materialCode: device.materialCode,
        deviceType: deviceTypeMap[device.type],
        cartQuantity: device.quantity.toString(),
        addTime: formatDateToBackend(new Date())
      };
      
      return addDevices(deviceData);
    });

    // 等待所有添加操作完成
    const addResponses = await Promise.all(addPromises);

    // 检查响应状态
    const failedRecords = addResponses.filter(res => res.code !== 200);
    if (failedRecords.length > 0) {
      throw new Error(`部分设备记录保存失败，失败数量: ${failedRecords.length}`);
    }
    console.log('设备记录已保存到中间表，数量:', selectedDevices.value.length);


    // 3. 关联产线项目
    if (productionLineId.value) {
         await updateManagement({
          projectId: productionLineId.value,
          recordId: newRecordId
        });
    }
    // 4. 执行导出操作
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
            id: device.id,
            quantity: device.quantity
          });
          break;
        case '运输车':
          selectedDevicesMap.transport.push({
            id: device.id,
            quantity: device.quantity
          });
          break;
        case '摆渡车':
          selectedDevicesMap.transfer.push({
            id: device.id,
            quantity: device.quantity
          });
          break;
        case '拍齐顶升':
          selectedDevicesMap.lift.push({
            id: device.id,
            quantity: device.quantity
          });
          break;
      }
    });

    // 构造导出数据
    const exportData = {
      brick: selectedDevicesMap.brick,
      transport: selectedDevicesMap.transport,
      transfer: selectedDevicesMap.transfer,
      lift: selectedDevicesMap.lift
    };

    // 调用导出API
    const blob = await exportSelectedDevices(exportData);
    
    // 处理下载
    downloadExportFile(blob, `设备选型清单_${new Date().getTime()}.xlsx`);
    
    fullscreenLoading.value = false;
    ElMessage.success('导出成功，已创建选型记录');

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

// 创建选型记录数据
const createSelectionRecordData = () => {
  const now = new Date();
  const formattedDate = formatDateToBackend(now);
  
  const record = {
    operationTime: formattedDate,
    exportTime: formattedDate,
    recordStatus: 1, // 1-有效
    brickSpec: form.brickSpec ? parseInt(form.brickSpec) : null,
    style: form.style,
    workstationCount: form.workstationCount ? parseInt(form.workstationCount) : null,
    ferryPitwidth: transferForm.ferryPitWidth ? parseInt(transferForm.ferryPitWidth) : null,
    ferryKeyFeature: transferForm.ferryKeyFeature,
    ferryMaxBrickWidth: transferForm.maxBrickWidth,
    ferryHasPit: transferForm.hasPit,
    transportPitwidth: transportForm.pitWidth ? parseInt(transportForm.pitWidth) : null,
    powerType: transportForm.powerType,
    supportType: transportForm.supportType,
    maxBrickThickness: liftForm.maxBrickThickness ? parseInt(liftForm.maxBrickThickness) : null
  };
  
  // 设置砖规格数量（对应brickCount1到brickCount9）
  brickSpecs.value.forEach(brick => {
    if (brick.code && brick.quantity > 0) {
      record[`brickCount${brick.code}`] = brick.quantity;
    }
  });
  
  return record;
};

// 日期格式化工具函数
const formatDateToBackend = (date) => {
  if (!(date instanceof Date)) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 完成流程
const finishProcess = async () => {
  fullscreenLoading.value = true; // 显示加载状态
  try {
    // 1. 若存在产线ID，更新产线的选型状态（isQuoted：0→1）
    if (productionLineId.value) {
      await updateManagement({
        projectId: productionLineId.value,
        isQuoted: parseInt(isQuoted.value) + 1
      });
      console.log(`产线${productionLineId.value}选型状态（isQuoted）更新为：${parseInt(isQuoted.value) + 1}`);
    }

    // 2. 重置流程到初始状态
    currentStep.value = 1;
    resetAllForms();

    // 3. 差异化提示
    ElMessage.success(productionLineId.value 
      ? '选购流程已完成，产线选型状态已更新'
      : '选购流程已完成（未关联产线，无需更新状态）'
    );
  } catch (error) {
    console.error('更新产线选型状态（isQuoted）失败:', error);
    ElMessage.error('选购流程已重置，但产线状态更新失败，请重试');
  } finally {
    fullscreenLoading.value = false; // 隐藏加载状态
  }
};

// 加载已有选型记录参数
const loadSelectionParams = async (recordId) => {
  try {
    if (!recordId || recordId === 0) return false;
    
    fullscreenLoading.value = true;
    const response = await getRecords(recordId);
    
    if (response && response.data) {
      const params = response.data;
      
      // 填充砖机参数
      form.brickSpec = params.brickSpec?.toString() || '';
      form.style = params.style || '';
      form.workstationCount = params.workstationCount?.toString() || '';
      
      // 填充摆渡车参数
      transferForm.ferryPitWidth = params.ferryPitwidth?.toString() || null;
      transferForm.ferryKeyFeature = params.ferryKeyFeature || '';
      transferForm.maxBrickWidth = params.ferryMaxBrickWidth || '';
      transferForm.hasPit = params.ferryHasPit || '';
      
      // 填充运输车参数
      transportForm.pitWidth = params.transportPitwidth?.toString() || '';
      transportForm.powerType = params.powerType || '';
      transportForm.supportType = params.supportType || '';
      
      // 填充拍齐顶升参数
      liftForm.maxBrickThickness = params.maxBrickThickness?.toString() || '';
      
      // 填充砖规格数量
      brickSpecs.value.forEach(brick => {
        const count = params[`brickCount${brick.code}`];
        if (count !== undefined && count !== null) {
          brick.quantity = count;
        }
      });
      
      // 自动计算相关参数
      calculateBrickParams();
      
      // 自动执行搜索
      await searchDevices();
      return true;
    }
    return false;
  } catch (error) {
    console.error('加载选型参数失败:', error);
    ElMessage.error('加载历史选型参数失败');
    return false;
  } finally {
    fullscreenLoading.value = false;
  }
};

// 初始化逻辑
onMounted(() => {
  const routeWatch = watch(
    () => [route.query.productionLineId, route.query.recordId, route.query.status],
    ([newProductionLineId, newRecordId, newStatus]) => {
      // 保存产线ID、记录ID和报价状态
      productionLineId.value = newProductionLineId ? Number(newProductionLineId) : null;
      selectionRecordId.value = newRecordId ? Number(newRecordId) : 0;
      isQuoted.value = newStatus || '0'; // 默认未报价状态
      
      console.log('当前产线ID:', productionLineId.value);
      console.log('当前选型记录ID:', selectionRecordId.value);
      console.log('当前报价状态:', isQuoted.value);
      
      initPage();
    },
    { immediate: true }
  );

  onUnmounted(() => {
    routeWatch();
  });
});

// 初始化页面逻辑
const initPage = async () => {
  try {
    if (!productionLineId.value) {
      ElMessage.warning("请创建项目和产线再开始选型，否则将无法关联项目保存选型");
    }
    
    fullscreenLoading.value = true;
    
    // 只有当记录ID不为0时才加载参数
    if (selectionRecordId.value !== 0) {
      const loaded = await loadSelectionParams(selectionRecordId.value);
      if (loaded) {
        fullscreenLoading.value = false;
        return;
      }
    }
    
    // 记录ID为0或加载失败，执行正常初始化
    const loadPromise = reloadStep2Data();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('数据加载超时')), 30000)
    );
    await Promise.race([loadPromise, timeoutPromise]);
  } catch (error) {
    console.error('组件初始化失败:', error);
    ElMessage.error(`页面加载失败: ${error.message || '未知错误'}`);
  } finally {
    fullscreenLoading.value = false;
  }
};
</script>

<style scoped>
/* 基础样式 */
.device-search-page {
  padding: 10px;
  background-color: #f5f7fa;
  min-height: 100vh;
  box-sizing: border-box;
}

h2 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #444;
}

h4 {
  font-size: 14px;
  margin-bottom: 10px;
  color: #555;
}

/* 响应式断点设置 */
@media (max-width: 768px) {
  .desktop-view {
    display: none !important;
  }
  .mobile-view {
    display: block !important;
  }
}

@media (min-width: 769px) {
  .desktop-view {
    display: block !important;
  }
  .mobile-view {
    display: none !important;
  }
  .device-search-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
}

/* 步骤指示器 */
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
  padding: 0 10px;
  flex-wrap: nowrap;
  overflow: hidden;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 60px;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #e9e9e9;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
}

.step-name {
  font-size: 12px;
  color: #666;
  text-align: center;
  white-space: nowrap;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #e9e9e9;
  margin: 0 5px;
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

/* 步骤内容区域 */
.steps-content {
  padding: 15px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.step-content {
  animation: fadeIn 0.3s;
}

/* 表单区域 */
.form-section {
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.scrollable-table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-collapse {
  margin-top: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

/* 按钮样式 */
.form-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.step-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-block {
  width: 100%;
  padding: 10px 0;
}

@media (min-width: 769px) {
  .form-actions {
    justify-content: center;
  }
  .step-actions {
    justify-content: center;
  }
  .btn-block {
    width: auto;
    padding: 10px 20px;
  }
  .btn-group {
    display: flex;
    gap: 10px;
  }
}

/* 搜索结果预览 */
.search-result-preview {
  margin-top: 15px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.search-result-preview p {
  margin: 5px 0;
}

/* 标签页样式 */
.scrollable-tabs {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 15px;
}

.device-tabs {
  width: max-content;
  min-width: 100%;
}

.tab-content {
  margin-top: 10px;
}

/* 分页样式 */
.pagination-container {
  margin-top: 15px;
  text-align: right;
  padding: 10px 0;
}

.el-pagination {
  font-size: 12px;
}

/* 已选设备预览 */
.selected-preview {
  margin-top: 15px;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.selected-list {
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.selected-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.selected-item:last-child {
  border-bottom: none;
}

.item-info {
  flex: 1;
}

.item-type {
  font-size: 12px;
  color: #888;
}

.item-code {
  font-size: 13px;
  font-weight: 500;
}

.item-name {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-quantity {
  font-size: 12px;
  color: #409eff;
}

.remove-btn {
  color: #f56c6c !important;
  padding: 5px;
}

.empty-selected {
  text-align: center;
  padding: 15px;
  color: #999;
  font-size: 14px;
}

/* 移动端设备卡片样式 */
.device-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
}

.device-card {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.material-code {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
}

.card-body {
  padding: 12px;
}

.card-title {
  font-size: 15px;
  margin-bottom: 10px;
  color: #333;
  line-height: 1.4;
}

.card-attributes {
  font-size: 13px;
}

.attribute-row {
  display: flex;
  margin-bottom: 8px;
  line-height: 1.5;
}

.attr-name {
  flex: 0 0 100px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attr-value {
  flex: 1;
  color: #333;
  word-break: break-word;
}

.card-actions {
  padding: 10px 12px;
  border-top: 1px solid #e4e7ed;
}

/* 选购记录样式 */
.selected-devices {
  margin-top: 15px;
}

.selected-record {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  margin-bottom: 10px;
  overflow: hidden;
}

.record-header {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  font-size: 13px;
}

.record-type {
  font-weight: 500;
}

.record-quantity {
  color: #409eff;
}

.record-body {
  padding: 10px 12px;
  font-size: 13px;
}

.record-code {
  font-weight: 500;
  margin-bottom: 5px;
}

.record-name {
  color: #666;
  font-size: 12px;
  line-height: 1.4;
}

.record-actions {
  padding: 8px 12px;
  border-top: 1px solid #e4e7ed;
  text-align: right;
}

/* 加载和空状态 */
.loading-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 按钮组样式 */
.btn-prev {
  background-color: #f5f7fa;
  color: #666;
  border-color: #e4e7ed;
}

.btn-next {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.btn-finish {
  background-color: #67c23a;
  color: white;
  border-color: #67c23a;
}

.export-btn {
  background-color: #faad14;
  color: white;
  border-color: #faad14;
}

/* 导出按钮加载图标 */
.loading-icon {
  animation: rotating 1s linear infinite;
  margin-right: 8px;
}

@keyframes rotating {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
    