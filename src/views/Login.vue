<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="brand-logo">
            <el-icon size="48" color="#409EFF">
              <Shop />
            </el-icon>
            <h1 class="brand-title">AI超市</h1>
          </div>
          <p class="brand-subtitle">发现最优质的AI应用，探索人工智能的无限可能</p>
          
          <!-- 特性列表 -->
          <div class="features">
            <div class="feature-item">
              <el-icon color="#67C23A"><Check /></el-icon>
              <span>精选优质AI应用</span>
            </div>
            <div class="feature-item">
              <el-icon color="#67C23A"><Check /></el-icon>
              <span>最新学术论文</span>
            </div>
            <div class="feature-item">
              <el-icon color="#67C23A"><Check /></el-icon>
              <span>活跃技术社区</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧登录表单 -->
      <div class="form-section">
        <div class="form-container">
          <!-- 表单头部 -->
          <div class="form-header">
            <h2 class="form-title">登录</h2>
            <p class="form-subtitle">欢迎回来！请登录您的账户</p>
          </div>
          
          <!-- 登录方式切换 -->
          <el-tabs v-model="loginType" class="login-tabs">
            <el-tab-pane label="邮箱登录" name="email"></el-tab-pane>
            <el-tab-pane label="手机验证码" name="phone"></el-tab-pane>
          </el-tabs>
          
          <!-- 登录表单 -->
          <el-form 
            ref="formRef"
            :model="formData"
            :rules="formRules"
            size="large"
            @submit.prevent="handleSubmit"
          >
            <!-- 邮箱登录 -->
            <template v-if="loginType === 'email'">
              <el-form-item prop="email">
                <el-input
                  v-model="formData.email"
                  placeholder="请输入邮箱地址"
                  :prefix-icon="Message"
                />
              </el-form-item>
              
              <el-form-item prop="password">
                <el-input
                  v-model="formData.password"
                  type="password"
                  placeholder="请输入密码"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
              
              <div class="form-options">
                <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                <el-button type="primary" text @click="handleForgotPassword">
                  忘记密码？
                </el-button>
              </div>
            </template>
            
            <!-- 手机验证码登录 -->
            <template v-if="loginType === 'phone'">
              <el-form-item prop="phone">
                <el-input
                  v-model="formData.phone"
                  placeholder="请输入手机号"
                  :prefix-icon="Phone"
                />
              </el-form-item>
              
              <el-form-item prop="verifyCode">
                <div class="verify-code-input">
                  <el-input
                    v-model="formData.verifyCode"
                    placeholder="请输入验证码"
                    :prefix-icon="Message"
                    style="flex: 1;"
                  />
                  <el-button
                    type="primary"
                    :disabled="countdown > 0 || !formData.phone"
                    @click="sendVerifyCode"
                    class="send-code-btn"
                  >
                    {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
                  </el-button>
                </div>
              </el-form-item>
            </template>
            
            <!-- 提交按钮 -->
            <el-form-item>
              <el-button 
                type="primary" 
                native-type="submit"
                :loading="loading"
                class="submit-btn"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
          
          <!-- 第三方登录 -->
          <div class="social-login">
            <div class="divider">
              <span>或者</span>
            </div>
            
            <div class="social-buttons">
              <el-button class="social-btn github" @click="handleSocialLogin('github')">
                <el-icon><Platform /></el-icon>
                GitHub
              </el-button>
              <el-button class="social-btn google" @click="handleSocialLogin('google')">
                <el-icon><ChromeFilled /></el-icon>
                Google
              </el-button>
            </div>
          </div>
          
          <!-- 切换登录/注册 -->
          <div class="form-footer">
            <span class="footer-text">
              {{ isLogin ? '还没有账户？' : '已有账户？' }}
            </span>
            <el-button type="primary" text @click="isLogin ? goToRegister() : toggleMode()">
              {{ isLogin ? '立即注册' : '立即登录' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, Phone, Check, Platform, ChromeFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const formRef = ref()
const loading = ref(false)
const rememberMe = ref(false)
const agreeTerms = ref(false)
const loginType = ref('email')
const countdown = ref(0)
const countdownTimer = ref(null)

// 表单模式
const isLogin = ref(true)

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  verifyCode: ''
})

// 表单验证规则
const formRules = computed(() => {
  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
    ]
  }
  
  if (loginType.value === 'email') {
    rules.email = [
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
  } else if (loginType.value === 'phone') {
    rules.phone = [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ]
    rules.verifyCode = [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'blur' }
    ]
  }
  
  if (!isLogin.value) {
    rules.email = [
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
    
    rules.confirmPassword = [
      { required: true, message: '请确认密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== formData.password) {
            callback(new Error('两次输入密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  
  return rules
})

// 方法
const toggleMode = () => {
  isLogin.value = !isLogin.value
  resetForm()
}

const resetForm = () => {
  formData.username = ''
  formData.email = ''
  formData.password = ''
  formData.confirmPassword = ''
  formData.phone = ''
  formData.verifyCode = ''
  agreeTerms.value = false
  formRef.value?.clearValidate()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    loading.value = true
    
    if (loginType.value === 'email') {
      // 邮箱密码登录
      await userStore.login({
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe.value
      })
    } else if (loginType.value === 'phone') {
      // 手机验证码登录
      await userStore.loginByPhone({
        phone: formData.phone,
        verifyCode: formData.verifyCode
      })
    }
    
    ElMessage.success('登录成功')
    
    // 跳转到首页或之前的页面
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    ElMessage.error(error.message || '登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = () => {
  ElMessage.info('忘记密码功能开发中...')
}

const handleShowTerms = () => {
  ElMessage.info('用户协议页面开发中...')
}

const handleShowPrivacy = () => {
  ElMessage.info('隐私政策页面开发中...')
}

const handleSocialLogin = (provider) => {
  ElMessage.info(`${provider} 登录功能开发中...`)
}

const sendVerifyCode = async () => {
  if (!formData.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  
  try {
    // 这里应该调用发送验证码的API
    ElMessage.success('验证码已发送')
    
    // 开始倒计时
    countdown.value = 60
    countdownTimer.value = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer.value)
        countdownTimer.value = null
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('发送验证码失败，请稍后重试')
  }
}

const goToRegister = () => {
  router.push('/register')
}

// 生命周期
onMounted(() => {
  // 检查URL参数，确定是登录还是注册模式
  if (route.query.type === 'register') {
    isLogin.value = false
  }
})

onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 900px;
  width: 100%;
  min-height: 600px;
}

.brand-section {
  background: linear-gradient(135deg, #409EFF 0%, #5dade2 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  align-items: center;
}

.brand-content {
  width: 100%;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.brand-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.brand-subtitle {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 40px;
}

.features {
  space-y: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  margin-bottom: 16px;
}

.form-section {
  padding: 60px 40px;
  display: flex;
  align-items: center;
}

.form-container {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.login-tabs {
  margin-bottom: 24px;
}

.login-tabs :deep(.el-tabs__header) {
  margin: 0 0 20px 0;
}

.login-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

.login-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
}

.verify-code-input {
  display: flex;
  gap: 12px;
  align-items: center;
}

.send-code-btn {
  min-width: 120px;
  white-space: nowrap;
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.social-login {
  margin-top: 32px;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 24px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  padding: 0 16px;
  color: #666;
  font-size: 14px;
}

.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.social-btn {
  height: 44px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
}

.social-btn:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.form-footer {
  text-align: center;
  margin-top: 32px;
  font-size: 14px;
}

.footer-text {
  color: #666;
  margin-right: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  
  .brand-section {
    padding: 40px 30px;
    text-align: center;
  }
  
  .form-section {
    padding: 40px 30px;
  }
  
  .social-buttons {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 10px;
  }
  
  .brand-section,
  .form-section {
    padding: 30px 20px;
  }
}
</style>