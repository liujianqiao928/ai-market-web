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
            <h2 class="form-title">{{ isLogin ? '登录' : '注册' }}</h2>
            <p class="form-subtitle">
              {{ isLogin ? '欢迎回来！请登录您的账户' : '创建新账户，开始您的AI之旅' }}
            </p>
          </div>
          
          <!-- 登录表单 -->
          <el-form 
            ref="formRef"
            :model="formData"
            :rules="formRules"
            size="large"
            @submit.prevent="handleSubmit"
          >
            <!-- 用户名/邮箱 -->
            <el-form-item prop="username">
              <el-input
                v-model="formData.username"
                :placeholder="isLogin ? '请输入用户名或邮箱' : '请输入用户名'"
                :prefix-icon="User"
              />
            </el-form-item>
            
            <!-- 邮箱（仅注册时显示） -->
            <el-form-item v-if="!isLogin" prop="email">
              <el-input
                v-model="formData.email"
                placeholder="请输入邮箱地址"
                :prefix-icon="Message"
              />
            </el-form-item>
            
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            
            <!-- 确认密码（仅注册时显示） -->
            <el-form-item v-if="!isLogin" prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="请确认密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            
            <!-- 记住我/忘记密码 -->
            <div v-if="isLogin" class="form-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-button type="primary" text @click="handleForgotPassword">
                忘记密码？
              </el-button>
            </div>
            
            <!-- 用户协议（仅注册时显示） -->
            <div v-if="!isLogin" class="form-options">
              <el-checkbox v-model="agreeTerms" required>
                我已阅读并同意
                <el-button type="primary" text @click="handleShowTerms">
                  用户协议
                </el-button>
                和
                <el-button type="primary" text @click="handleShowPrivacy">
                  隐私政策
                </el-button>
              </el-checkbox>
            </div>
            
            <!-- 提交按钮 -->
            <el-form-item>
              <el-button 
                type="primary" 
                native-type="submit"
                :loading="loading"
                class="submit-btn"
              >
                {{ isLogin ? '登录' : '注册' }}
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
            <el-button type="primary" text @click="toggleMode">
              {{ isLogin ? '立即注册' : '立即登录' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, Check, Platform, ChromeFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const formRef = ref()
const loading = ref(false)
const rememberMe = ref(false)
const agreeTerms = ref(false)

// 表单模式
const isLogin = ref(true)

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
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
  agreeTerms.value = false
  formRef.value?.clearValidate()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (!isLogin.value && !agreeTerms.value) {
      ElMessage.warning('请先同意用户协议和隐私政策')
      return
    }
    
    loading.value = true
    
    if (isLogin.value) {
      // 登录逻辑
      await userStore.login({
        username: formData.username,
        password: formData.password,
        rememberMe: rememberMe.value
      })
      
      ElMessage.success('登录成功！')
      
      // 跳转到首页或之前的页面
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      // 注册逻辑
      await userStore.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      
      ElMessage.success('注册成功！请登录')
      isLogin.value = true
      resetForm()
    }
  } catch (error) {
    ElMessage.error(error.message || (isLogin.value ? '登录失败，请检查用户名和密码' : '注册失败，请稍后重试'))
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

// 生命周期
onMounted(() => {
  // 检查URL参数，确定是登录还是注册模式
  if (route.query.type === 'register') {
    isLogin.value = false
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
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