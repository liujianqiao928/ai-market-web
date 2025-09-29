<template>
  <div class="papers-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">学术论文</h1>
          <p class="page-subtitle">探索AI领域的最新研究成果和学术进展</p>
        </div>
        
        <div class="header-actions">
          <el-button type="primary" size="large" @click="handleSubmitPaper">
            <el-icon><Upload /></el-icon>
            提交论文
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-section">
      <div class="search-content">
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索论文标题、作者、关键词..."
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
            v-model="selectedField"
            placeholder="研究领域"
            size="large"
            clearable
            @change="handleFieldChange"
          >
            <el-option
              v-for="field in researchFields"
              :key="field.value"
              :label="field.label"
              :value="field.value"
            />
          </el-select>
          
          <el-select
            v-model="selectedYear"
            placeholder="发表年份"
            size="large"
            clearable
            @change="handleYearChange"
          >
            <el-option
              v-for="year in availableYears"
              :key="year"
              :label="year + '年'"
              :value="year"
            />
          </el-select>
          
          <el-select
            v-model="sortBy"
            placeholder="排序方式"
            size="large"
            @change="handleSortChange"
          >
            <el-option label="最新发表" value="latest" />
            <el-option label="引用最多" value="citations" />
            <el-option label="相关度" value="relevance" />
            <el-option label="影响因子" value="impact" />
          </el-select>
        </div>
      </div>
    </div>
    
    <!-- 论文列表 -->
    <div class="papers-content">
      <div class="content-container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        
        <!-- 论文列表 -->
        <div v-else-if="filteredPapers.length > 0" class="papers-list">
          <PaperItem
            v-for="paper in paginatedPapers"
            :key="paper.id"
            :paper="paper"
            @click="handlePaperClick"
            @download="handlePaperDownload"
            @cite="handlePaperCite"
            @bookmark="handlePaperBookmark"
          />
        </div>
        
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <el-empty description="暂无相关论文">
            <el-button type="primary" @click="clearFilters">清除筛选条件</el-button>
          </el-empty>
        </div>
        
        <!-- 分页 -->
        <div v-if="!loading && filteredPapers.length > 0" class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :total="totalPapers"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      
      <!-- 侧边栏 -->
      <div class="sidebar">
        <!-- 热门研究领域 -->
        <div class="sidebar-card">
          <h3 class="card-title">热门研究领域</h3>
          <div class="fields-container">
            <div
              v-for="field in popularFields"
              :key="field.value"
              class="field-item"
              @click="handleFieldSelect(field.value)"
            >
              <div class="field-info">
                <span class="field-name">{{ field.label }}</span>
                <span class="field-count">{{ field.count }}篇</span>
              </div>
              <div class="field-progress">
                <el-progress
                  :percentage="(field.count / maxFieldCount) * 100"
                  :show-text="false"
                  :stroke-width="4"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 顶级期刊/会议 -->
        <div class="sidebar-card">
          <h3 class="card-title">顶级期刊/会议</h3>
          <div class="venues-list">
            <div
              v-for="venue in topVenues"
              :key="venue.name"
              class="venue-item"
              @click="handleVenueClick(venue)"
            >
              <div class="venue-info">
                <div class="venue-name">{{ venue.name }}</div>
                <div class="venue-details">
                  <span class="venue-type">{{ venue.type }}</span>
                  <span class="venue-impact">IF: {{ venue.impactFactor }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 研究趋势 -->
        <div class="sidebar-card">
          <h3 class="card-title">研究趋势</h3>
          <div class="trends-container">
            <div class="trend-chart">
              <!-- 这里可以集成图表库显示趋势 -->
              <div class="chart-placeholder">
                <el-icon size="48" color="#d1d5db"><TrendCharts /></el-icon>
                <p class="chart-text">论文发表趋势图</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 统计信息 -->
        <div class="sidebar-card">
          <h3 class="card-title">统计信息</h3>
          <div class="stats-list">
            <div class="stat-item">
              <span class="stat-label">总论文数</span>
              <span class="stat-value">{{ paperStats.totalPapers }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">本月新增</span>
              <span class="stat-value">{{ paperStats.monthlyNew }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">总引用数</span>
              <span class="stat-value">{{ paperStats.totalCitations }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">平均影响因子</span>
              <span class="stat-value">{{ paperStats.avgImpactFactor }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Upload, Search, TrendCharts } from '@element-plus/icons-vue'
import PaperItem from '@/components/PaperItem.vue'

const router = useRouter()

// 响应式数据
const loading = ref(true)
const searchQuery = ref('')
const selectedField = ref('')
const selectedYear = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(10)

// 研究领域
const researchFields = ref([
  { label: '机器学习', value: 'ml' },
  { label: '深度学习', value: 'dl' },
  { label: '自然语言处理', value: 'nlp' },
  { label: '计算机视觉', value: 'cv' },
  { label: '强化学习', value: 'rl' },
  { label: '知识图谱', value: 'kg' },
  { label: '推荐系统', value: 'rs' },
  { label: '语音识别', value: 'asr' },
  { label: '机器人学', value: 'robotics' },
  { label: '生成式AI', value: 'generative' }
])

// 可用年份
const availableYears = ref([
  2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015
])

// 论文数据
const papers = ref([])

// 侧边栏数据
const popularFields = ref([
  { label: '机器学习', value: 'ml', count: 245 },
  { label: '深度学习', value: 'dl', count: 198 },
  { label: '自然语言处理', value: 'nlp', count: 156 },
  { label: '计算机视觉', value: 'cv', count: 134 },
  { label: '强化学习', value: 'rl', count: 89 },
  { label: '生成式AI', value: 'generative', count: 76 }
])

const topVenues = ref([
  { name: 'NeurIPS', type: '会议', impactFactor: '9.2' },
  { name: 'ICML', type: '会议', impactFactor: '8.9' },
  { name: 'ICLR', type: '会议', impactFactor: '8.5' },
  { name: 'Nature Machine Intelligence', type: '期刊', impactFactor: '25.9' },
  { name: 'JMLR', type: '期刊', impactFactor: '6.1' },
  { name: 'AAAI', type: '会议', impactFactor: '7.8' }
])

const paperStats = ref({
  totalPapers: 1248,
  monthlyNew: 89,
  totalCitations: 45672,
  avgImpactFactor: '7.2'
})

// 计算属性
const maxFieldCount = computed(() => {
  return Math.max(...popularFields.value.map(f => f.count))
})

const filteredPapers = computed(() => {
  let result = [...papers.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(paper => 
      paper.title.toLowerCase().includes(query) ||
      paper.authors.some(author => author.toLowerCase().includes(query)) ||
      paper.abstract.toLowerCase().includes(query) ||
      paper.keywords.some(keyword => keyword.toLowerCase().includes(query))
    )
  }
  
  // 领域过滤
  if (selectedField.value) {
    result = result.filter(paper => paper.field === selectedField.value)
  }
  
  // 年份过滤
  if (selectedYear.value) {
    result = result.filter(paper => paper.year === selectedYear.value)
  }
  
  // 排序
  switch (sortBy.value) {
    case 'citations':
      result.sort((a, b) => b.citations - a.citations)
      break
    case 'relevance':
      // 简单的相关度排序（实际应该基于搜索算法）
      result.sort((a, b) => b.relevanceScore - a.relevanceScore)
      break
    case 'impact':
      result.sort((a, b) => b.impactFactor - a.impactFactor)
      break
    case 'latest':
    default:
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      break
  }
  
  return result
})

const totalPapers = computed(() => filteredPapers.value.length)

const paginatedPapers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPapers.value.slice(start, end)
})

// 方法
const loadPapers = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成模拟数据
    papers.value = generateMockPapers()
  } catch (error) {
    ElMessage.error('加载论文失败')
  } finally {
    loading.value = false
  }
}

const generateMockPapers = () => {
  const fieldValues = researchFields.value.map(f => f.value)
  const venues = ['NeurIPS', 'ICML', 'ICLR', 'AAAI', 'IJCAI', 'CVPR', 'ICCV', 'ECCV', 'ACL', 'EMNLP']
  const titles = [
    'Attention Is All You Need: A Comprehensive Study',
    'Deep Reinforcement Learning for Autonomous Systems',
    'Transformer Networks in Computer Vision Applications',
    'Large Language Models: Capabilities and Limitations',
    'Generative Adversarial Networks: Recent Advances',
    'Self-Supervised Learning in Natural Language Processing',
    'Neural Architecture Search: Methods and Applications',
    'Federated Learning: Privacy-Preserving Machine Learning',
    'Graph Neural Networks for Knowledge Representation',
    'Multi-Modal Learning: Bridging Vision and Language'
  ]
  
  const mockPapers = []
  
  for (let i = 0; i < 30; i++) {
    const field = fieldValues[i % fieldValues.length]
    const title = titles[i % titles.length]
    const year = availableYears.value[Math.floor(Math.random() * 5)] // 最近5年
    
    mockPapers.push({
      id: i + 1,
      title,
      authors: [`作者${i + 1}`, `作者${i + 2}`, `作者${i + 3}`],
      abstract: `这是关于${title}的详细摘要。本研究提出了一种新的方法来解决相关问题，通过实验验证了方法的有效性。`,
      field,
      keywords: ['人工智能', '机器学习', '深度学习'],
      venue: venues[i % venues.length],
      year,
      citations: Math.floor(Math.random() * 1000) + 10,
      impactFactor: (Math.random() * 10 + 1).toFixed(1),
      publishedAt: new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
      pdfUrl: `https://example.com/papers/${i + 1}.pdf`,
      relevanceScore: Math.random() * 100,
      bookmarked: Math.random() > 0.8
    })
  }
  
  return mockPapers
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleFieldChange = () => {
  currentPage.value = 1
}

const handleYearChange = () => {
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
  selectedField.value = ''
  selectedYear.value = ''
  sortBy.value = 'latest'
  currentPage.value = 1
}

const handleFieldSelect = (field) => {
  selectedField.value = selectedField.value === field ? '' : field
  currentPage.value = 1
}

const handleVenueClick = (venue) => {
  ElMessage.info(`查看 ${venue.name} 的所有论文`)
}

const handleSubmitPaper = () => {
  // 检查登录状态
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  ElMessage.info('论文提交功能开发中...')
}

const handlePaperClick = (paper) => {
  router.push(`/papers/detail/${paper.id}`)
}

const handlePaperDownload = (paper) => {
  ElMessage.success(`正在下载论文: ${paper.title}`)
}

const handlePaperCite = (paper) => {
  ElMessage.success('引用信息已复制到剪贴板')
}

const handlePaperBookmark = (paper) => {
  ElMessage.success(`已${paper.bookmarked ? '取消收藏' : '收藏'}论文`)
}

// 生命周期
onMounted(() => {
  loadPapers()
})
</script>

<style scoped>
.papers-page {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: white;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.search-section {
  background: white;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.search-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: center;
}

.search-bar {
  width: 100%;
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-controls .el-select {
  min-width: 140px;
  width: auto;
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

.papers-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

.content-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.loading-container {
  padding: 24px;
}

.papers-list {
  /* 论文列表样式由 PaperItem 组件处理 */
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.fields-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-item {
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.field-item:hover {
  background: #f3f4f6;
}

.field-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.field-name {
  font-size: 14px;
  color: #1f2937;
}

.field-count {
  font-size: 12px;
  color: #6b7280;
}

.field-progress {
  width: 100%;
}

.venues-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.venue-item {
  cursor: pointer;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.venue-item:hover {
  border-color: #409eff;
  background: #f0f9ff;
}

.venue-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.venue-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.trends-container {
  text-align: center;
}

.chart-placeholder {
  padding: 40px 20px;
  color: #9ca3af;
}

.chart-text {
  margin: 12px 0 0 0;
  font-size: 14px;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .search-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .filter-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .filter-controls .el-select {
    min-width: 120px;
    flex: 1;
    max-width: 200px;
  }
  
  .papers-content {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .sidebar {
    order: -1;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 16px;
  }
  
  .search-section {
    padding: 16px;
  }
  
  .filter-controls {
    flex-direction: column;
    width: 100%;
    gap: 16px;
  }
  
  .filter-controls .el-select {
    width: 100%;
    min-width: unset;
  }
}
</style>