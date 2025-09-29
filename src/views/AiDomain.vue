<template>
  <div class="ai-domain-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">AI域</h1>
        <p class="page-subtitle">探索各个领域的AI应用，发现适合您需求的智能工具</p>
      </div>
      
      <!-- 搜索和筛选 -->
      <div class="search-filter-section">
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索AI应用..."
            size="large"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <div class="filter-controls">
          <el-select
            v-model="selectedCategory"
            placeholder="选择分类"
            size="large"
            clearable
            @change="handleCategoryChange"
          >
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
          
          <el-select
            v-model="sortBy"
            placeholder="排序方式"
            size="large"
            @change="handleSortChange"
          >
            <el-option label="最新发布" value="latest" />
            <el-option label="最受欢迎" value="popular" />
            <el-option label="评分最高" value="rating" />
            <el-option label="下载最多" value="downloads" />
          </el-select>
        </div>
      </div>
    </div>
    
    <!-- 分类导航 -->
    <div class="category-nav">
      <el-scrollbar>
        <div class="category-list">
          <el-button
            v-for="category in categories"
            :key="category.value"
            :type="selectedCategory === category.value ? 'primary' : 'default'"
            :plain="selectedCategory !== category.value"
            @click="handleCategorySelect(category.value)"
          >
            <el-icon><component :is="category.icon" /></el-icon>
            {{ category.label }}
          </el-button>
        </div>
      </el-scrollbar>
    </div>
    
    <!-- 应用列表 -->
    <div class="apps-section">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="6" animated />
      </div>
      
      <!-- 应用网格 -->
      <div v-else class="apps-grid">
        <AiAppCard
          v-for="app in filteredApps"
          :key="app.id"
          :app="app"
          @try="handleTryApp"
          @favorite="handleFavoriteApp"
        />
      </div>
      
      <!-- 空状态 -->
      <div v-if="!loading && filteredApps.length === 0" class="empty-state">
        <el-empty description="暂无相关应用">
          <el-button type="primary" @click="clearFilters">清除筛选条件</el-button>
        </el-empty>
      </div>
      
      <!-- 分页 -->
      <div v-if="!loading && filteredApps.length > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 48]"
          :total="totalApps"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  Picture, 
  ChatDotRound, 
  VideoCamera, 
  Microphone, 
  Document, 
  DataAnalysis, 
  Monitor,
  BrushFilled,
  TrendCharts
} from '@element-plus/icons-vue'
import AiAppCard from '@/components/AiAppCard.vue'

const router = useRouter()

// 响应式数据
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(12)

// 分类数据
const categories = ref([
  { label: '全部', value: '', icon: 'Monitor' },
  { label: '图像处理', value: '图像处理', icon: 'Picture' },
  { label: '自然语言', value: '自然语言', icon: 'ChatDotRound' },
  { label: '视频编辑', value: '视频编辑', icon: 'VideoCamera' },
  { label: '语音识别', value: '语音识别', icon: 'Microphone' },
  { label: '文档处理', value: '文档处理', icon: 'Document' },
  { label: '数据分析', value: '数据分析', icon: 'DataAnalysis' },
  { label: '创意设计', value: '创意设计', icon: 'BrushFilled' },
  { label: '商业智能', value: '商业智能', icon: 'TrendCharts' }
])

// 模拟应用数据
const apps = ref([])

// 计算属性
const filteredApps = computed(() => {
  let result = [...apps.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(app => 
      app.name.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      app.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 分类过滤
  if (selectedCategory.value) {
    result = result.filter(app => app.category === selectedCategory.value)
  }
  
  // 排序
  switch (sortBy.value) {
    case 'popular':
      result.sort((a, b) => b.downloads - a.downloads)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'downloads':
      result.sort((a, b) => b.downloads - a.downloads)
      break
    case 'latest':
    default:
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
  }
  
  return result
})

const totalApps = computed(() => filteredApps.value.length)

// 方法
const loadApps = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成模拟数据
    apps.value = generateMockApps()
  } catch (error) {
    ElMessage.error('加载应用失败')
  } finally {
    loading.value = false
  }
}

const generateMockApps = () => {
  const mockApps = []
  const categoryValues = categories.value.slice(1).map(c => c.value)
  const appNames = [
    'AI图像增强器', 'ChatBot助手', '视频剪辑大师', '语音转文字', '智能文档分析',
    '数据可视化工具', '创意海报生成', '商业报表分析', 'AI写作助手', '图片背景移除',
    '智能翻译器', '视频字幕生成', '音频降噪器', 'PDF智能解析', '销售数据分析',
    'Logo设计器', '财务预测模型', 'AI代码生成', '人脸识别系统', '智能客服机器人',
    '视频风格转换', '语音合成器', '合同智能审查', '市场趋势分析', '品牌设计助手'
  ]
  
  for (let i = 0; i < 25; i++) {
    const category = categoryValues[i % categoryValues.length]
    const name = appNames[i] || `AI应用 ${i + 1}`
    
    mockApps.push({
      id: i + 1,
      name,
      description: `这是一个强大的${name}，帮助您提高工作效率，简化复杂任务。`,
      icon: '🤖',
      image: `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20application%20icon%20for%20${encodeURIComponent(name)}%20modern%20tech%20style&image_size=square`,
      category: category,
      tags: ['AI', '效率工具', '智能'],
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      downloads: Math.floor(Math.random() * 10000) + 1000,
      price: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 100) + 10,
      featured: Math.random() > 0.7,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return mockApps
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleCategoryChange = () => {
  currentPage.value = 1
}

const handleCategorySelect = (category) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category
  currentPage.value = 1
}

const handleSortChange = () => {
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortBy.value = 'latest'
  currentPage.value = 1
}

const handleTryApp = (app) => {
  ElMessage.success(`正在启动 ${app.name}...`)
  // 这里可以添加跳转到应用详情页或外部链接的逻辑
}

const handleFavoriteApp = (app) => {
  ElMessage.success(`已${app.favorited ? '取消收藏' : '收藏'} ${app.name}`)
}

// 生命周期
onMounted(() => {
  loadApps()
})

// 监听路由查询参数
watch(() => router.currentRoute.value.query, (newQuery) => {
  if (newQuery.category) {
    selectedCategory.value = newQuery.category
  }
  if (newQuery.search) {
    searchQuery.value = newQuery.search
  }
}, { immediate: true })
</script>

<style scoped>
.ai-domain-page {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px 24px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.search-filter-section {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.search-bar {
  width: 100%;
}

.search-bar .el-input {
  border-radius: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-bar .el-input__wrapper {
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-controls .el-select {
  border-radius: 20px;
  min-width: 140px;
  width: auto;
}

.filter-controls .el-select .el-input__wrapper {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  min-width: 140px;
}

.filter-controls .el-select .el-select__wrapper {
  min-width: 140px;
}

.filter-controls .el-select .el-select__selection {
  overflow: visible;
}

.filter-controls .el-select .el-select__selected-item {
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
}

.category-nav {
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
}

.category-list {
  display: flex;
  gap: 12px;
  min-width: max-content;
  padding: 8px 0;
  justify-content: center;
  flex-wrap: wrap;
}

.category-list .el-button {
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.category-list .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.apps-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.loading-container {
  padding: 24px;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .apps-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .search-filter-section {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .filter-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .apps-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
  
  .category-list {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 24px 16px;
  }
  
  .apps-section {
    padding: 24px 16px;
  }
  
  .filter-controls {
    flex-direction: column;
    width: 100%;
  }
  
  .apps-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .category-nav {
    padding: 12px 16px;
  }
}
</style>