<template>
  <div class="ai-app-detail-page">
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/ai-domain' }">AI域</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/ai-domain/category/${app.categoryId}` }">{{ app.category }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ app.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="app-info" v-if="app">
      <div class="app-header">
        <div class="app-icon">
          <img :src="app.icon" :alt="app.name" />
        </div>
        <div class="app-meta">
          <h1 class="app-name">{{ app.name }}</h1>
          <p class="app-description">{{ app.description }}</p>
          <div class="app-tags">
            <el-tag v-for="tag in app.tags" :key="tag" type="info">{{ tag }}</el-tag>
          </div>
          <div class="app-stats">
            <div class="stat-item">
              <el-icon><Star /></el-icon>
              <span>{{ app.rating.toFixed(1) }}</span>
            </div>
            <div class="stat-item">
              <el-icon><Download /></el-icon>
              <span>{{ formatNumber(app.downloads) }}</span>
            </div>
            <div class="stat-item">
              <el-icon><Calendar /></el-icon>
              <span>{{ formatDate(app.createdAt) }}</span>
            </div>
          </div>
        </div>
        <div class="app-actions">
          <el-button type="primary" size="large" @click="handleTry">
            <el-icon><VideoPlay /></el-icon>
            立即试用
          </el-button>
          <el-button :type="app.isFavorite ? 'danger' : 'default'" @click="handleFavorite">
            <el-icon><Star /></el-icon>
            {{ app.isFavorite ? '取消收藏' : '收藏' }}
          </el-button>
          <el-button @click="handleShare">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="app-tabs">
        <el-tab-pane label="应用介绍" name="description">
          <div class="tab-content">
            <h3>功能特点</h3>
            <ul>
              <li v-for="feature in app.features" :key="feature">{{ feature }}</li>
            </ul>
            
            <h3>使用说明</h3>
            <div class="usage-guide">
              <p>{{ app.usageGuide }}</p>
            </div>
            
            <h3>技术规格</h3>
            <div class="tech-specs">
              <div class="spec-item">
                <span class="spec-label">支持格式：</span>
                <span class="spec-value">{{ app.supportedFormats.join(', ') }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">处理速度：</span>
                <span class="spec-value">{{ app.processingSpeed }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">API调用：</span>
                <span class="spec-value">{{ app.apiSupport ? '支持' : '不支持' }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="用户评价" name="reviews">
          <div class="tab-content">
            <div class="review-summary">
              <div class="rating-overview">
                <div class="rating-score">{{ app.rating.toFixed(1) }}</div>
                <div class="rating-stars">
                  <el-rate v-model="app.rating" disabled show-score />
                </div>
                <div class="rating-count">基于 {{ app.reviewCount }} 条评价</div>
              </div>
            </div>
            
            <div class="reviews-list">
              <div v-for="review in reviews" :key="review.id" class="review-item">
                <div class="review-header">
                  <div class="reviewer-info">
                    <img :src="review.avatar" :alt="review.username" class="reviewer-avatar" />
                    <div>
                      <div class="reviewer-name">{{ review.username }}</div>
                      <div class="review-date">{{ formatDate(review.createdAt) }}</div>
                    </div>
                  </div>
                  <el-rate v-model="review.rating" disabled />
                </div>
                <div class="review-content">{{ review.content }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="更新日志" name="changelog">
          <div class="tab-content">
            <div v-for="version in changelog" :key="version.version" class="changelog-item">
              <div class="version-header">
                <h4>版本 {{ version.version }}</h4>
                <span class="version-date">{{ formatDate(version.date) }}</span>
              </div>
              <ul class="version-changes">
                <li v-for="change in version.changes" :key="change">{{ change }}</li>
              </ul>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Star, Download, Calendar, VideoPlay, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const appId = ref(route.params.id)
const activeTab = ref('description')
const app = ref(null)
const reviews = ref([])
const changelog = ref([])

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const handleTry = () => {
  ElMessage.success('正在启动应用...')
}

const handleFavorite = () => {
  app.value.isFavorite = !app.value.isFavorite
  ElMessage.success(app.value.isFavorite ? '已添加到收藏' : '已取消收藏')
}

const handleShare = () => {
  ElMessage.success('分享链接已复制到剪贴板')
}

const fetchAppDetail = async () => {
  // Mock data
  app.value = {
    id: appId.value,
    name: 'AI图像增强工具',
    description: '基于深度学习的智能图像增强工具，支持多种图像处理算法',
    icon: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20image%20enhancement%20tool%20icon&image_size=square',
    category: '图像处理',
    categoryId: '1',
    tags: ['图像增强', 'AI', '深度学习'],
    rating: 4.7,
    downloads: 15420,
    reviewCount: 234,
    isFavorite: false,
    createdAt: '2024-01-15T10:00:00Z',
    features: [
      '智能图像去噪',
      '超分辨率重建',
      '色彩增强',
      '细节锐化',
      '批量处理'
    ],
    usageGuide: '上传图像文件，选择增强模式，点击处理按钮即可获得增强后的图像。支持JPG、PNG、TIFF等常见格式。',
    supportedFormats: ['JPG', 'PNG', 'TIFF', 'BMP'],
    processingSpeed: '平均 2-5 秒/张',
    apiSupport: true
  }
  
  reviews.value = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    username: `用户${i + 1}`,
    avatar: `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20${i + 1}&image_size=square`,
    rating: 4 + Math.random(),
    content: `这个工具非常好用，处理效果很棒！图像质量提升明显，推荐使用。`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }))
  
  changelog.value = [
    {
      version: '2.1.0',
      date: '2024-01-15T10:00:00Z',
      changes: [
        '新增超分辨率重建功能',
        '优化处理速度',
        '修复已知问题'
      ]
    },
    {
      version: '2.0.0',
      date: '2024-01-01T10:00:00Z',
      changes: [
        '全新UI设计',
        '支持批量处理',
        '新增API接口'
      ]
    }
  ]
}

onMounted(() => {
  fetchAppDetail()
})
</script>

<style scoped>
.ai-app-detail-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.app-header {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-icon img {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
}

.app-meta {
  flex: 1;
}

.app-name {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.app-description {
  color: #6b7280;
  font-size: 16px;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.app-tags {
  margin-bottom: 16px;
}

.app-tags .el-tag {
  margin-right: 8px;
}

.app-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
}

.app-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

.app-tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-content {
  padding: 24px;
}

.tab-content h3 {
  margin: 0 0 16px 0;
  color: #1f2937;
}

.tab-content ul {
  margin: 0 0 24px 0;
  padding-left: 20px;
}

.tab-content li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.usage-guide {
  margin-bottom: 24px;
  line-height: 1.6;
}

.tech-specs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spec-item {
  display: flex;
  align-items: center;
}

.spec-label {
  font-weight: 500;
  width: 120px;
  color: #374151;
}

.spec-value {
  color: #6b7280;
}

.review-summary {
  margin-bottom: 32px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 8px;
}

.rating-overview {
  display: flex;
  align-items: center;
  gap: 16px;
}

.rating-score {
  font-size: 48px;
  font-weight: 600;
  color: #1f2937;
}

.rating-count {
  color: #6b7280;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-name {
  font-weight: 500;
  color: #1f2937;
}

.review-date {
  font-size: 14px;
  color: #6b7280;
}

.review-content {
  line-height: 1.6;
  color: #374151;
}

.changelog-item {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.changelog-item:last-child {
  border-bottom: none;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.version-header h4 {
  margin: 0;
  color: #1f2937;
}

.version-date {
  color: #6b7280;
  font-size: 14px;
}

.version-changes {
  margin: 0;
  padding-left: 20px;
}

.version-changes li {
  margin-bottom: 8px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .ai-app-detail-page {
    padding: 16px;
  }
  
  .app-header {
    flex-direction: column;
    text-align: center;
  }
  
  .app-actions {
    align-items: stretch;
  }
  
  .app-stats {
    justify-content: center;
  }
  
  .rating-overview {
    flex-direction: column;
    text-align: center;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .version-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>