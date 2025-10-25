<template>
  <div class="app-container home">
    <!-- 顶部装饰条 -->
    <div class="top-accent"></div>
    
    <el-row :gutter="20" class="main-content">
      <!-- 系统介绍区域 -->
      <el-col :sm="24" :lg="12" class="intro-column">
        <div class="intro-card">
          <h2 class="main-title">智能储运事业部储砖选型报价工具</h2>
          <p class="description">
            无限进步！创新不止！<br>
            高效选型，精准报价，助力业务腾飞！
          </p>
          <p class="version-info">
            <b>当前版本:</b> <span class="version-number">v{{ version }}</span>
          </p>
          
          <!-- 动态装饰元素 -->
          <div class="animated-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
        </div>
      </el-col>

      <!-- 功能入口区 -->
      <el-col :sm="24" :lg="12" class="features-column">
        <div class="features-grid">          

          <div class="feature-card" @mouseenter="featureHover = 'project'" @mouseleave="featureHover = ''">
            <div class="feature-icon" :class="{ active: featureHover === 'project' }">
              <i class="el-icon-sitemap"></i>
            </div>
            <h3>项目选型</h3>
            <p>高效管理选型项目，快速生成选型报价成果</p>
            <el-button type="primary" size="small" @click="$router.push('/selectDevice/project')">
              立即进入
            </el-button>
          </div>

          <div class="feature-card" @mouseenter="featureHover = 'analysis'" @mouseleave="featureHover = ''">
            <div class="feature-icon" :class="{ active: featureHover === 'analysis' }">
              <i class="el-icon-line-chart"></i>
            </div>
            <h3>附件管理</h3>
            <p>快速管理设备的附件数据</p>
            <el-button type="primary" size="small" @click="$router.push('/attachment/attachments')">
              管理附件
            </el-button>
          </div>
          
          <div class="feature-card" @mouseenter="featureHover = 'quotation'" @mouseleave="featureHover = ''">
            <div class="feature-icon" :class="{ active: featureHover === 'quotation' }">
              <i class="el-icon-calculator"></i>
            </div>
            <h3>设备管理</h3>
            <p>快速管理设备</p>
            <el-button type="primary" size="small" @click="$router.push('/device/brick')">
              管理设备
            </el-button>
          </div>
          
         
        </div>
      </el-col>
    </el-row>
    
    <el-divider class="custom-divider" />
    
    <!-- 底部信息 -->
    <div class="footer-info">
      <p>© 2025 智能储运事业部 - 让每一次进步都充满力量</p>
    </div>
  </div>
</template>

<script setup name="Index">
import { ref } from 'vue';

// 系统版本号
const version = ref('3.0.0');
// 功能卡片hover状态
const featureHover = ref('');
</script>

<style scoped lang="scss">
// 主色调采用活力橙红色系，营造热情氛围
$primary-color: #FF5722;
$secondary-color: #FF9800;
$accent-color: #FFEB3B;
$text-color: #333333;

.home {
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
  color: $text-color;
  overflow-x: hidden;
  background-color: #FFF8F5;
  min-height: 100vh;
  
  // 顶部装饰条
  .top-accent {
    height: 6px;
    background: linear-gradient(90deg, $primary-color, $secondary-color, $accent-color);
    background-size: 200% 100%;
    animation: gradientShift 5s ease infinite;
  }
  
  .main-content {
    padding: 40px 20px;
  }
  
  .intro-column {
    display: flex;
    align-items: center;
    padding: 0 20px;
  }
  
  .intro-card {
    background-color: white;
    border-radius: 12px;
    padding: 30px;
    width: 100%;
    box-shadow: 0 8px 24px rgba(255, 87, 34, 0.1);
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
  
  .main-title {
    color: $primary-color;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -8px;
      width: 60px;
      height: 4px;
      background-color: $secondary-color;
      border-radius: 2px;
    }
  }
  
  .description {
    font-size: 16px;
    line-height: 1.8;
    margin: 30px 0;
    color: #555;
    
    br {
      margin-bottom: 10px;
    }
  }
  
  .version-info {
    font-size: 14px;
    margin-top: 20px;
    
    .version-number {
      color: $primary-color;
      font-weight: bold;
      font-size: 16px;
    }
  }
  
  // 动态装饰形状
  .animated-shapes {
    position: absolute;
    right: -20px;
    bottom: -20px;
    width: 150px;
    height: 150px;
    pointer-events: none;
  }
  
  .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
    animation: float 6s ease-in-out infinite;
  }
  
  .shape-1 {
    width: 80px;
    height: 80px;
    background-color: $primary-color;
    top: 0;
    left: 0;
    animation-delay: 0s;
  }
  
  .shape-2 {
    width: 50px;
    height: 50px;
    background-color: $secondary-color;
    top: 30px;
    right: 10px;
    animation-delay: 2s;
  }
  
  .shape-3 {
    width: 30px;
    height: 30px;
    background-color: $accent-color;
    bottom: 10px;
    left: 40px;
    animation-delay: 4s;
  }
  
  // 功能卡片区域
  .features-column {
    padding: 0 20px;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
  }
  
  .feature-card {
    background-color: white;
    border-radius: 12px;
    padding: 25px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border-top: 4px solid transparent;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 20px rgba(255, 87, 34, 0.15);
      border-top-color: $primary-color;
    }
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 15px;
    border-radius: 50%;
    background-color: #FFF0E8;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    i {
      font-size: 24px;
      color: $primary-color;
    }
    
    &.active {
      background-color: $primary-color;
      
      i {
        color: white;
        transform: scale(1.1);
      }
    }
  }
  
  .feature-card h3 {
    color: $text-color;
    margin-bottom: 10px;
    font-size: 18px;
  }
  
  .feature-card p {
    color: #666;
    font-size: 14px;
    margin-bottom: 20px;
    line-height: 1.6;
  }
  
  .feature-card .el-button {
    background-color: $primary-color;
    border-color: $primary-color;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: #E64A19;
      border-color: #E64A19;
      transform: scale(1.05);
    }
  }
  
  // 分隔线
  .custom-divider {
    margin: 30px 0;
    background: linear-gradient(90deg, transparent, $primary-color, transparent);
    height: 2px;
  }
  
  // 页脚
  .footer-info {
    text-align: center;
    padding: 20px;
    color: #888;
    font-size: 14px;
    background-color: white;
    border-top: 1px solid #FFE0D2;
  }
}

// 动画定义
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
</style>
