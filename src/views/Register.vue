<template>
  <div class="register-page">
    <div class="register-container">
      <!-- 品牌展示区域 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="brand-logo">
            <el-icon :size="32">
              <User />
            </el-icon>
            <h1 class="brand-title">加入我们</h1>
          </div>
          <p class="brand-subtitle">
            创建您的账户，开启智能学术研究之旅。探索前沿AI技术，参与学术讨论，发现更多可能。
          </p>
          <div class="features">
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>免费访问学术资源</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>参与学术讨论社区</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>个性化推荐系统</span>
            </div>
            <div class="feature-item">
              <el-icon><Check /></el-icon>
              <span>AI工具免费体验</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 注册表单区域 -->
      <div class="form-section">
        <div class="form-container">
          <div class="form-header">
            <h2 class="form-title">创建新账户</h2>
            <p class="form-subtitle">请填写以下信息完成注册</p>
          </div>

          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-position="top"
            size="large"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="formData.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item label="邮箱地址" prop="email">
              <el-input
                v-model="formData.email"
                type="email"
                placeholder="请输入邮箱地址"
                :prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="请输入手机号"
                :prefix-icon="Phone"
              />
            </el-form-item>

            <el-form-item label="验证码" prop="verifyCode">
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

            <el-form-item>
              <el-checkbox v-model="agreeTerms">
                我已阅读并同意
                <el-button type="primary" link @click="handleShowTerms">
                  用户协议
                </el-button>
                和
                <el-button type="primary" link @click="handleShowPrivacy">
                  隐私政策
                </el-button>
              </el-checkbox>
            </el-form-item>

            <el-button
              type="primary"
              class="submit-btn"
              :loading="loading"
              @click="handleSubmit"
            >
              {{ loading ? '注册中...' : '立即注册' }}
            </el-button>
          </el-form>



          <!-- 页面底部 -->
          <div class="form-footer">
            <span class="footer-text">已有账户？</span>
            <el-button type="primary" link @click="goToLogin">
              立即登录
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, Check, Phone } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const formRef = ref()
const loading = ref(false)
const agreeTerms = ref(false)

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  verifyCode: ''
})

// 验证码倒计时
const countdown = ref(0)
let countdownTimer = null

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
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
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

// 方法
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (!agreeTerms.value) {
      ElMessage.warning('请先同意用户协议和隐私政策')
      return
    }
    
    loading.value = true
    
    // 注册逻辑
    await userStore.register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      verifyCode: formData.verifyCode
    })
    
    ElMessage.success('注册成功！请登录')
    
    // 跳转到登录页面
    router.push('/login')
  } catch (error) {
    ElMessage.error(error.message || '注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

const handleShowTerms = () => {
  ElMessage.info('用户协议页面开发中...')
}

const handleShowPrivacy = () => {
  ElMessage.info('隐私政策页面开发中...')
}

// 发送验证码
const sendVerifyCode = async () => {
  if (!formData.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    ElMessage.error('请输入正确的手机号')
    return
  }
  
  try {
    // 模拟发送验证码API调用
    ElMessage.success('验证码已发送，请注意查收')
    
    // 开始倒计时
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('验证码发送失败，请稍后重试')
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
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

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 16px;
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

.verify-code-input {
  display: flex;
  gap: 12px;
  align-items: center;
}

.send-code-btn {
  white-space: nowrap;
  min-width: 100px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
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
  

}

@media (max-width: 480px) {
  .register-page {
    padding: 10px;
  }
  
  .brand-section,
  .form-section {
    padding: 30px 20px;
  }
}
</style>