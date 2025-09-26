import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const isLoading = ref(false)
  
  // 计算属性
  const isLoggedIn = computed(() => {
    return !!token.value && !!user.value
  })
  
  const isAdmin = computed(() => {
    return user.value?.role === 'admin'
  })
  
  const userInfo = computed(() => {
    return user.value || {}
  })
  
  // 方法
  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
      // 设置axios默认header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }
  
  const setUser = (userData) => {
    user.value = userData
  }
  
  // 登录
  const login = async (credentials) => {
    isLoading.value = true
    
    try {
      const response = await axios.post('/api/auth/login', credentials)
      
      if (response.data.code === 200) {
        const { token: newToken, user: userData } = response.data.data
        
        setToken(newToken)
        setUser(userData)
        
        ElMessage.success('登录成功')
        return { success: true, data: response.data.data }
      } else {
        ElMessage.error(response.data.message || '登录失败')
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('登录错误:', error)
      ElMessage.error('网络错误，请稍后重试')
      return { success: false, message: '网络错误' }
    } finally {
      isLoading.value = false
    }
  }
  
  // 注册
  const register = async (userData) => {
    isLoading.value = true
    
    try {
      const response = await axios.post('/api/auth/register', userData)
      
      if (response.data.code === 200) {
        const { token: newToken, user: newUser } = response.data.data
        
        setToken(newToken)
        setUser(newUser)
        
        ElMessage.success('注册成功')
        return { success: true, data: response.data.data }
      } else {
        ElMessage.error(response.data.message || '注册失败')
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('注册错误:', error)
      ElMessage.error('网络错误，请稍后重试')
      return { success: false, message: '网络错误' }
    } finally {
      isLoading.value = false
    }
  }
  
  // 退出登录
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch (error) {
      console.error('退出登录错误:', error)
    } finally {
      setToken('')
      setUser(null)
      ElMessage.success('已退出登录')
    }
  }
  
  // 获取用户信息
  const fetchUserProfile = async () => {
    if (!token.value) {
      return { success: false, message: '未登录' }
    }
    
    try {
      const response = await axios.get('/api/user/profile')
      
      if (response.data.code === 200) {
        setUser(response.data.data)
        return { success: true, data: response.data.data }
      } else {
        // token可能已过期
        logout()
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('获取用户信息错误:', error)
      // 如果是401错误，说明token无效
      if (error.response?.status === 401) {
        logout()
      }
      return { success: false, message: '获取用户信息失败' }
    }
  }
  
  // 更新用户信息
  const updateProfile = async (profileData) => {
    isLoading.value = true
    
    try {
      const response = await axios.put('/api/user/profile', profileData)
      
      if (response.data.code === 200) {
        setUser(response.data.data)
        ElMessage.success('更新成功')
        return { success: true, data: response.data.data }
      } else {
        ElMessage.error(response.data.message || '更新失败')
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('更新用户信息错误:', error)
      ElMessage.error('网络错误，请稍后重试')
      return { success: false, message: '网络错误' }
    } finally {
      isLoading.value = false
    }
  }
  
  // 检查权限
  const hasPermission = (permission) => {
    if (!user.value) return false
    
    // 管理员拥有所有权限
    if (user.value.role === 'admin') return true
    
    // 根据具体权限检查
    switch (permission) {
      case 'post.create':
      case 'post.edit':
      case 'post.delete':
        return isLoggedIn.value
      case 'app.submit':
        return isLoggedIn.value
      case 'paper.submit':
        return isLoggedIn.value
      case 'admin.access':
        return user.value.role === 'admin'
      default:
        return false
    }
  }
  
  // 初始化用户状态
  const initializeAuth = async () => {
    if (token.value) {
      // 设置axios默认header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      // 尝试获取用户信息
      await fetchUserProfile()
    }
  }
  
  // 重置状态
  const resetState = () => {
    setToken('')
    setUser(null)
    isLoading.value = false
  }
  
  return {
    // 状态
    user,
    token,
    isLoading,
    
    // 计算属性
    isLoggedIn,
    isAdmin,
    userInfo,
    
    // 方法
    login,
    register,
    logout,
    fetchUserProfile,
    updateProfile,
    hasPermission,
    initializeAuth,
    resetState,
    setToken,
    setUser
  }
})