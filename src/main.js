import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import { useUserStore } from './stores/user'
import axios from 'axios'
import './mock'

// 创建应用实例
const app = createApp(App)
const pinia = createPinia()

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 配置axios
axios.defaults.baseURL = '/'
axios.defaults.timeout = 10000

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // token过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      const userStore = useUserStore()
      userStore.resetState()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

app.use(pinia)
app.use(ElementPlus)
app.use(router)

// 初始化用户认证状态
const userStore = useUserStore()
userStore.initializeAuth()

app.mount('#app')
