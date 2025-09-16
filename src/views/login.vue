<template>
  <div class="login-container">
    <!-- 顶部装饰条 - 渐变动画 -->
    <div class="top-accent"></div>
    
    <!-- 背景装饰元素 -->
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 品牌区域 -->
      <div class="brand-section">
        <div class="logo">
          <i class="el-icon-bricks"></i>
        </div>
        <h1 class="system-name">储砖选型报价工具</h1>
        <p class="system-desc">高效·精准·专业的选型报价解决方案</p>
      </div>
      
      <!-- 表单区域 -->
      <el-form 
        ref="loginRef" 
        :model="loginForm" 
        :rules="loginRules" 
        class="login-form"
        label-width="0px"
      >
        <!-- 用户名输入框 -->
        <el-form-item prop="username" class="form-item">
          <el-input
            v-model="loginForm.username"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="请输入账号"
            class="custom-input"
            @focus="inputFocus('username')"
            @blur="inputBlur('username')"
            :class="{ focused: focusedInput === 'username' }"
          >
            <template #prefix>
              <i class="el-icon-user input-icon" :class="{ active: focusedInput === 'username' }"></i>
            </template>
          </el-input>
        </el-form-item>
        
        <!-- 密码输入框 -->
        <el-form-item prop="password" class="form-item">
          <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
            class="custom-input"
            @focus="inputFocus('password')"
            @blur="inputBlur('password')"
            :class="{ focused: focusedInput === 'password' }"
          >
            <template #prefix>
              <i class="el-icon-lock input-icon" :class="{ active: focusedInput === 'password' }"></i>
            </template>
          </el-input>
        </el-form-item>
        
        <!-- 验证码 -->
        <el-form-item prop="code" class="form-item" v-if="captchaEnabled">
          <div class="code-container">
            <el-input
              v-model="loginForm.code"
              size="large"
              auto-complete="off"
              placeholder="请输入验证码"
              class="custom-input code-input"
              @keyup.enter="handleLogin"
              @focus="inputFocus('code')"
              @blur="inputBlur('code')"
              :class="{ focused: focusedInput === 'code' }"
            >
              <template #prefix>
                <i class="el-icon-shield input-icon" :class="{ active: focusedInput === 'code' }"></i>
              </template>
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img" alt="验证码图片，点击刷新"/>
            </div>
          </div>
        </el-form-item>
        
        <!-- 记住密码与注册链接 -->
        <div class="remember-register-container">
          <el-checkbox 
            v-model="loginForm.rememberMe" 
            class="remember-me"
          >
            记住密码
          </el-checkbox>
          
          <div v-if="register" class="register-link">
            <router-link class="link-type" :to="'/register'">立即注册</router-link>
          </div>
        </div>
        
        <!-- 登录按钮 -->
        <el-form-item class="submit-item">
          <el-button
            :loading="loading"
            size="large"
            type="primary"
            style="width:100%;"
            @click.prevent="handleLogin"
            class="login-btn"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>
              <i class="el-icon-loading loading-icon"></i>
              登录中...
            </span>
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 页脚信息 -->
      <div class="login-footer">
        <p>© {{ new Date().getFullYear() }} 智能储运事业部 - 让每一次进步都充满力量</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCodeImg } from "@/api/login"
import Cookies from "js-cookie"
import { encrypt, decrypt } from "@/utils/jsencrypt"
import useUserStore from '@/store/modules/user'
import { ElMessage } from 'element-plus'

// 环境变量与状态管理
const title = import.meta.env.VITE_APP_TITLE
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

// 登录表单数据
const loginForm = ref({
  username: "admin",
  password: "admin123",
  rememberMe: false,
  code: "",
  uuid: ""
})

// 表单验证规则
const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
}

// 验证码与登录状态
const codeUrl = ref("")
const loading = ref(false)
const captchaEnabled = ref(true) // 验证码开关
const register = ref(false) // 注册开关
const redirect = ref(undefined)
const focusedInput = ref('') // 跟踪输入框焦点状态

// 监听路由变化获取重定向地址
watch(route, (newRoute) => {
  redirect.value = newRoute.query && newRoute.query.redirect
}, { immediate: true })

// 处理登录
const handleLogin = () => {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true
      // 记住密码逻辑
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 })
        Cookies.set("password", encrypt(loginForm.value.password), { expires: 30 })
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 })
      } else {
        Cookies.remove("username")
        Cookies.remove("password")
        Cookies.remove("rememberMe")
      }
      
      // 调用登录接口
      userStore.login(loginForm.value).then(() => {
        const query = route.query
        const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
        router.push({ path: redirect.value || "/", query: otherQueryParams })
      }).catch(() => {
        loading.value = false
        // 登录失败刷新验证码
        if (captchaEnabled.value) {
          getCode()
        }
      })
    }
  })
}

// 获取验证码
const getCode = () => {
  getCodeImg().then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img
      loginForm.value.uuid = res.uuid
    }
  })
}

// 从Cookie获取记住的账号密码
const getCookie = () => {
  const username = Cookies.get("username")
  const password = Cookies.get("password")
  const rememberMe = Cookies.get("rememberMe")
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
    code: "",
    uuid: ""
  }
}

// 处理输入框焦点状态
const inputFocus = (field) => {
  focusedInput.value = field
}

const inputBlur = () => {
  focusedInput.value = ''
}

// 初始化
getCode()
getCookie()
</script>

<style lang='scss' scoped>
// 主色调
$primary-color: #FF5722;
$secondary-color: #FF9800;
$accent-color: #FFEB3B;
$light-gray: #FFF8F5;
$text-color: #333333;

.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $light-gray; /* 移除背景图，使用浅灰色背景 */
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
  
  // 顶部装饰条
  .top-accent {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, $primary-color, $secondary-color, $accent-color);
    background-size: 200% 100%;
    animation: gradientShift 5s ease infinite;
  }
  
  // 背景装饰元素
  .background-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
    animation: float 8s ease-in-out infinite;
  }
  
  .shape-1 {
    width: 200px;
    height: 200px;
    background-color: $primary-color;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  
  .shape-2 {
    width: 150px;
    height: 150px;
    background-color: $secondary-color;
    bottom: 15%;
    right: 15%;
    animation-delay: 2s;
  }
  
  .shape-3 {
    width: 100px;
    height: 100px;
    background-color: $accent-color;
    top: 60%;
    left: 20%;
    animation-delay: 4s;
  }
}

// 登录卡片
.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(255, 87, 34, 0.1);
  padding: 40px 30px;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(255, 87, 34, 0.15);
  }
}

.brand-section {
  text-align: center;
  margin-bottom: 35px;
  
  .logo {
    width: 70px;
    height: 70px;
    margin: 0 auto 25px;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary-color, $secondary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28px;
    box-shadow: 0 4px 15px rgba(255, 87, 34, 0.2);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05) rotate(5deg);
    }
  }
  
  .system-name {
    color: $primary-color;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  
  .system-desc {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
  }
}

.form-item {
  margin-bottom: 22px;
}

// 验证码容器
.code-container {
  display: flex;
  gap: 10px;
  width: 100%;
  
  .code-input {
    flex: 1;
  }
}

// 自定义输入框
.custom-input {
  height: 52px;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
  
  &.focused {
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba(255, 87, 34, 0.1);
  }
  
  &:hover {
    border-color: #bbb;
  }
}

.input-icon {
  color: #999;
  margin-right: 10px;
  transition: color 0.3s ease;
  
  &.active {
    color: $primary-color;
  }
}

// 验证码图片
.login-code {
  flex-shrink: 0;
  width: 120px;
  
  .login-code-img {
    height: 52px;
    width: 100%;
    border-radius: 8px;
    cursor: pointer;
    object-fit: cover;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
}

// 记住密码与注册链接容器
.remember-register-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

// 记住密码选项
.remember-me {
  color: #666;
  font-size: 14px;
  
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: $primary-color;
    border-color: $primary-color;
  }
  
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: $primary-color;
  }
}

// 注册链接
.register-link {
  .link-type {
    color: $primary-color;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      color: #E64A19;
      text-decoration: underline;
    }
  }
}

// 登录按钮
.login-btn {
  height: 52px;
  background: linear-gradient(90deg, $primary-color, $secondary-color);
  border: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: all 0.6s ease;
  }
  
  &:hover {
    background: linear-gradient(90deg, #E64A19, #F57C00);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
    
    &::after {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

.loading-icon {
  margin-right: 8px;
  font-size: 16px;
}

// 页脚信息
.login-footer {
  text-align: center;
  margin-top: 30px;
  color: #888;
  font-size: 14px;
  padding-top: 20px;
  border-top: 1px solid #FFE0D2;
}

// 动画定义
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
</style>
