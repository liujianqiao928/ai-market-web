<template>
  <div class="ai-category-page">
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/ai-domain' }">AI域</el-breadcrumb-item>
        <el-breadcrumb-item>{{ categoryName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="page-title">{{ categoryName }}</h1>
      <p class="page-subtitle">{{ categoryDescription }}</p>
    </div>

    <div class="content-wrapper">
      <!-- 应用列表 -->
      <div class="apps-section">
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>
        
        <div v-else class="apps-grid">
          <AiAppCard
            v-for="app in categoryApps"
            :key="app.id"
            :app="app"
            @try="handleTryApp"
            @favorite="handleFavoriteApp"
          />
        </div>
        
        <!-- 空状态 -->
        <div v-if="!loading && categoryApps.length === 0" class="empty-state">
          <el-empty description="该分类下暂无应用">
            <el-button type="primary" @click="goBack">返回AI域</el-button>
          </el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AiAppCard from '@/components/AiAppCard.vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const categoryApps = ref([])

// 分类信息
const categoryMap = {
  'image': { name: '图像处理', description: '专业的图像编辑和处理工具' },
  'nlp': { name: '自然语言', description: '文本分析和语言处理应用' },
  'video': { name: '视频编辑', description: '视频制作和编辑工具' },
  'audio': { name: '语音识别', description: '语音转文字和音频处理' },
  'document': { name: '文档处理', description: '文档编辑和格式转换工具' },
  'data': { name: '数据分析', description: '数据可视化和分析平台' },
  'design': { name: '创意设计', description: '设计和创意工具' },
  'business': { name: '商业智能', description: '商业分析和决策支持工具' }
}

const categoryId = computed(() => route.params.id)
const categoryInfo = computed(() => categoryMap[categoryId.value] || { name: '未知分类', description: '' })
const categoryName = computed(() => categoryInfo.value.name)
const categoryDescription = computed(() => categoryInfo.value.description)

// 方法
const loadCategoryApps = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里应该根据分类ID获取应用数据
    categoryApps.value = generateMockApps(categoryId.value)
  } catch (error) {
    ElMessage.error('加载应用失败')
  } finally {
    loading.value = false
  }
}

const generateMockApps = (category) => {
  const mockApps = []
  for (let i = 1; i <= 8; i++) {
    mockApps.push({
      id: `${category}-${i}`,
      name: `${categoryName.value}应用 ${i}`,
      description: `这是一个专业的${categoryName.value}工具，提供强大的功能和优秀的用户体验。`,
      icon: `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20application%20icon%20for%20${category}&image_size=square`,
      category: category,
      rating: (Math.random() * 2 + 3).toFixed(1),
      downloads: Math.floor(Math.random() * 10000) + 1000,
      price: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 100) + 10,
      tags: [`${categoryName.value}`, 'AI', '工具'],
      featured: Math.random() > 0.7,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  return mockApps
}

const handleTryApp = (app) => {
  ElMessage.success(`正在启动 ${app.name}`)
}

const handleFavoriteApp = (app) => {
  ElMessage.success(`已收藏 ${app.name}`)
}

const goBack = () => {
  router.push('/ai-domain')
}

// 生命周期
onMounted(() => {
  loadCategoryApps()
})
</script>

<style scoped>
.ai-category-page {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: white;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 16px 0 8px 0;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

.content-wrapper {
  padding: 0 24px;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.loading-container {
  padding: 24px;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 16px;
  }
  
  .content-wrapper {
    padding: 0 16px;
  }
  
  .apps-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
}
</style>