<template>
  <div class="navbar">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo和品牌名 -->
        <div class="navbar-brand">
          <router-link to="/" class="brand-link">
            <div class="logo">
              <el-icon size="28" color="#409EFF">
                <Shop />
              </el-icon>
            </div>
            <span class="brand-text">AI超市</span>
          </router-link>
        </div>
        
        <!-- 主导航菜单 -->
        <div class="navbar-nav">
          <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            :ellipsis="false"
            @select="handleMenuSelect"
            class="main-menu"
          >
            <el-menu-item index="/featured">
              <el-icon><Star /></el-icon>
              <span>精选</span>
            </el-menu-item>
            <el-menu-item index="/ai-domain">
              <el-icon><Cpu /></el-icon>
              <span>AI域</span>
            </el-menu-item>
            <el-menu-item index="/forum">
              <el-icon><ChatDotRound /></el-icon>
              <span>论坛</span>
            </el-menu-item>
            <el-menu-item index="/papers">
              <el-icon><Document /></el-icon>
              <span>论文</span>
            </el-menu-item>
          </el-menu>
        </div>
        
        <!-- 搜索框 -->
        <div class="navbar-search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索AI应用、论文..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #suffix>
              <el-icon class="cursor-pointer" @click="handleSearch">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
        
        <!-- 用户操作区 -->
        <div class="navbar-actions">
          <template v-if="isLoggedIn">
            <!-- 发布按钮 -->
            <el-button type="primary" @click="handlePublish">
              <el-icon><Plus /></el-icon>
              发布
            </el-button>
            
            <!-- 通知 -->
            <el-badge :value="notificationCount" :hidden="notificationCount === 0">
              <el-icon size="20" class="cursor-pointer hover:text-blue-600">
                <Bell />
              </el-icon>
            </el-badge>
            
            <!-- 用户菜单 -->
            <el-dropdown @command="handleUserMenuCommand">
              <div class="user-avatar">
                <el-avatar :size="32" :src="userInfo.avatar">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <span class="username">{{ userInfo.username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon><Setting /></el-icon>
                    设置
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          
          <template v-else>
            <el-button @click="handleLogin">登录</el-button>
            <el-button type="primary" @click="handleRegister">注册</el-button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import {
  Search,
  Bell,
  Plus,
  User,
  Setting,
  SwitchButton,
  Star,
  Cpu,
  ChatDotRound,
  Document,
  ArrowDown,
  Shop
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const searchKeyword = ref('')
const notificationCount = ref(0)

// 从store获取用户状态
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)

// 计算当前激活的菜单项
const activeIndex = computed(() => {
  const path = route.path
  if (path === '/' || path === '/featured') return '/featured'
  if (path.startsWith('/ai-domain')) return '/ai-domain'
  if (path.startsWith('/forum')) return '/forum'
  if (path.startsWith('/papers')) return '/papers'
  return '/featured'
})

// 方法
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    ElMessage.info(`搜索: ${searchKeyword.value}`)
    // 这里应该跳转到搜索结果页面
  }
}

const handleMenuSelect = (index) => {
  // index现在直接是路径字符串
  router.push(index)
}

const handlePublish = () => {
  router.push('/forum/create')
}

const handleNotifications = () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  ElMessage.info('通知功能开发中...')
}

const handleProfile = () => {
  router.push('/profile')
}

const handleSettings = () => {
  router.push('/settings')
}

const handleUserMenuCommand = (command) => {
  switch (command) {
    case 'profile':
      handleProfile()
      break
    case 'settings':
      handleSettings()
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/')
}

const handleLogin = () => {
  router.push('/login')
}

const handleRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.navbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.navbar-content {
  display: flex;
  align-items: center;
  height: 60px;
  gap: 20px;
}

.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
}

.brand-text {
  font-size: 20px;
  font-weight: 600;
  color: #409EFF;
}

.navbar-nav {
  flex: 1;
}

.main-menu {
  border-bottom: none;
}

.navbar-search {
  width: 300px;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.user-avatar:hover {
  background-color: #f5f5f5;
}

.username {
  font-size: 14px;
  color: #333;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .navbar-search {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .navbar-search {
    display: none;
  }
  
  .username {
    display: none;
  }
  
  .navbar-content {
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .brand-text {
    display: none;
  }
  
  .main-menu .el-menu-item span {
    display: none;
  }
}
</style>