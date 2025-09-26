<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-illustration">
        <div class="error-number">404</div>
        <div class="error-icon">
          <el-icon size="120"><DocumentDelete /></el-icon>
        </div>
      </div>
      
      <div class="error-content">
        <h1 class="error-title">页面未找到</h1>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <p class="error-suggestion">
          可能的原因：
        </p>
        <ul class="error-reasons">
          <li>页面地址输入错误</li>
          <li>页面已被删除或移动</li>
          <li>您没有访问权限</li>
          <li>服务器临时故障</li>
        </ul>
        
        <div class="error-actions">
          <el-button type="primary" @click="goHome">
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
          <el-button @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
          <el-button @click="refresh">
            <el-icon><Refresh /></el-icon>
            刷新页面
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="helpful-links">
      <h3>您可能感兴趣的页面：</h3>
      <div class="links-grid">
        <router-link to="/" class="link-card">
          <el-icon><Star /></el-icon>
          <span>精选推荐</span>
        </router-link>
        <router-link to="/ai" class="link-card">
          <el-icon><Cpu /></el-icon>
          <span>AI应用</span>
        </router-link>
        <router-link to="/forum" class="link-card">
          <el-icon><ChatDotRound /></el-icon>
          <span>社区论坛</span>
        </router-link>
        <router-link to="/papers" class="link-card">
          <el-icon><Document /></el-icon>
          <span>学术论文</span>
        </router-link>
      </div>
    </div>
    
    <div class="search-section">
      <h3>或者搜索您需要的内容：</h3>
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索AI应用、论坛帖子、学术论文..."
          size="large"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      
      <div class="popular-searches">
        <span class="popular-label">热门搜索：</span>
        <el-tag
          v-for="tag in popularSearches"
          :key="tag"
          class="search-tag"
          @click="searchTag(tag)"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  DocumentDelete, House, ArrowLeft, Refresh, Star, Cpu,
  ChatDotRound, Document, Search
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const searchQuery = ref('')

const popularSearches = ref([
  'ChatGPT', 'AI绘画', '机器学习', 'Vue.js', 'Python',
  '深度学习', '自然语言处理', '计算机视觉'
])

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const refresh = () => {
  window.location.reload()
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  // 跳转到搜索页面（这里假设有一个搜索页面）
  router.push({
    path: '/search',
    query: { q: searchQuery.value }
  })
}

const searchTag = (tag) => {
  searchQuery.value = tag
  handleSearch()
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
}

.error-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
  pointer-events: none;
}

.error-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.error-illustration {
  margin-bottom: 40px;
  position: relative;
}

.error-number {
  font-size: 120px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.error-icon {
  color: #9ca3af;
  opacity: 0.6;
}

.error-content {
  color: #374151;
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #1f2937;
}

.error-description {
  font-size: 18px;
  color: #6b7280;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.error-suggestion {
  font-size: 16px;
  color: #374151;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.error-reasons {
  text-align: left;
  max-width: 300px;
  margin: 0 auto 32px auto;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.error-reasons li {
  margin-bottom: 8px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.helpful-links {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  max-width: 800px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.helpful-links h3 {
  text-align: center;
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px 0;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #374151;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
  color: #667eea;
}

.link-card .el-icon {
  font-size: 32px;
}

.link-card span {
  font-weight: 500;
  font-size: 14px;
}

.search-section {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.search-section h3 {
  text-align: center;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
}

.popular-searches {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.popular-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin-right: 8px;
}

.search-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.search-tag:hover {
  background: #667eea;
  color: white;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .error-page {
    padding: 20px 16px;
  }
  
  .error-container {
    padding: 40px 24px;
  }
  
  .error-number {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-description {
    font-size: 16px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .el-button {
    width: 200px;
  }
  
  .helpful-links,
  .search-section {
    padding: 24px 20px;
  }
  
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .popular-searches {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .error-reasons {
    max-width: 100%;
  }
}
</style>