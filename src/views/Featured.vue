<template>
  <div class="featured-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">精选推荐</h1>
        <p class="page-subtitle">发现最优质的AI应用，提升您的工作效率</p>
      </div>
      
      <!-- 轮播图 -->
      <div class="hero-section">
        <el-carousel height="300px" :interval="5000">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <div class="carousel-item" :style="{ backgroundImage: `url(${item.image})` }">
              <div class="carousel-content">
                <h2 class="carousel-title">{{ item.title }}</h2>
                <p class="carousel-desc">{{ item.description }}</p>
                <el-button type="primary" size="large" @click="handleBannerClick(item)">
                  立即体验
                </el-button>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      
      <!-- 分类导航 -->
      <div class="category-section">
        <h2 class="section-title">热门分类</h2>
        <div class="category-grid">
          <div 
            v-for="category in categoryList" 
            :key="category.id"
            class="category-card card-hover"
            @click="handleCategoryClick(category)"
          >
            <div class="category-icon">
              <el-icon :size="32" :color="category.color">
                <component :is="category.icon" />
              </el-icon>
            </div>
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-count">{{ category.count }} 个应用</p>
          </div>
        </div>
      </div>
      
      <!-- 推荐应用 -->
      <div class="apps-section">
        <div class="section-header">
          <h2 class="section-title">推荐应用</h2>
          <el-button text type="primary" @click="handleViewMore">
            查看更多 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        
        <div class="apps-grid">
          <AiAppCard 
            v-for="app in featuredApps" 
            :key="app.id"
            :app="app"
            @click="handleAppClick(app)"
          />
        </div>
      </div>
      
      <!-- 最新论文 -->
      <div class="papers-section">
        <div class="section-header">
          <h2 class="section-title">最新论文</h2>
          <el-button text type="primary" @click="handleViewMorePapers">
            查看更多 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        
        <div class="papers-list">
          <div 
            v-for="paper in latestPapers" 
            :key="paper.id"
            class="paper-item"
            @click="handlePaperClick(paper)"
          >
            <div class="paper-content">
              <h3 class="paper-title">{{ paper.title }}</h3>
              <p class="paper-authors">{{ paper.authors.join(', ') }}</p>
              <p class="paper-abstract">{{ paper.abstract }}</p>
              <div class="paper-meta">
                <span class="paper-date">{{ formatDate(paper.publishDate) }}</span>
                <span class="paper-citations">引用: {{ paper.citations }}</span>
              </div>
            </div>
            <div class="paper-actions">
              <el-button size="small" @click.stop="handleDownload(paper)">
                <el-icon><Download /></el-icon>
                下载
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AiAppCard from '@/components/AiAppCard.vue'

const router = useRouter()

// 响应式数据
const bannerList = ref([])
const categoryList = ref([])
const featuredApps = ref([])
const latestPapers = ref([])

// 方法
const handleBannerClick = (item) => {
  if (item.link) {
    router.push(item.link)
  }
}

const handleCategoryClick = (category) => {
  router.push(`/ai-domain/category/${category.id}`)
}

const handleAppClick = (app) => {
  router.push(`/ai-domain/app/${app.id}`)
}

const handlePaperClick = (paper) => {
  router.push(`/papers/detail/${paper.id}`)
}

const handleViewMore = () => {
  router.push('/ai-domain')
}

const handleViewMorePapers = () => {
  router.push('/papers')
}

const handleDownload = (paper) => {
  ElMessage.success(`开始下载论文: ${paper.title}`)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 初始化数据
const initData = () => {
  // 轮播图数据
  bannerList.value = [
    {
      id: 1,
      title: 'ChatGPT 4.0',
      description: '最强大的对话AI，助力您的创作和工作',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20AI%20chatbot%20interface%20with%20blue%20gradient%20background&image_size=landscape_16_9',
      link: '/ai-domain/app/1'
    },
    {
      id: 2,
      title: 'Midjourney',
      description: '创造令人惊叹的AI艺术作品',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20art%20generation%20colorful%20digital%20painting%20interface&image_size=landscape_16_9',
      link: '/ai-domain/app/2'
    },
    {
      id: 3,
      title: 'GitHub Copilot',
      description: 'AI编程助手，提升开发效率',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=programming%20code%20editor%20with%20AI%20assistance%20dark%20theme&image_size=landscape_16_9',
      link: '/ai-domain/app/3'
    }
  ]
  
  // 分类数据
  categoryList.value = [
    { id: 1, name: '对话助手', icon: 'ChatDotRound', color: '#409EFF', count: 25 },
    { id: 2, name: '图像生成', icon: 'Picture', color: '#67C23A', count: 18 },
    { id: 3, name: '代码助手', icon: 'Monitor', color: '#E6A23C', count: 15 },
    { id: 4, name: '文本处理', icon: 'Document', color: '#F56C6C', count: 22 },
    { id: 5, name: '数据分析', icon: 'DataAnalysis', color: '#909399', count: 12 },
    { id: 6, name: '语音识别', icon: 'Microphone', color: '#606266', count: 8 }
  ]
  
  // 推荐应用数据
  featuredApps.value = [
    {
      id: 1,
      name: 'ChatGPT',
      description: '强大的对话AI助手',
      category: '对话助手',
      rating: 4.8,
      downloads: '1M+',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=ChatGPT%20logo%20modern%20AI%20assistant%20icon&image_size=square',
      tags: ['免费', '热门']
    },
    {
      id: 2,
      name: 'Midjourney',
      description: 'AI艺术创作平台',
      category: '图像生成',
      rating: 4.9,
      downloads: '500K+',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Midjourney%20AI%20art%20colorful%20creative%20logo&image_size=square',
      tags: ['付费', '专业']
    },
    {
      id: 3,
      name: 'GitHub Copilot',
      description: 'AI编程助手',
      category: '代码助手',
      rating: 4.7,
      downloads: '800K+',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=GitHub%20Copilot%20programming%20AI%20assistant%20logo&image_size=square',
      tags: ['付费', '开发']
    },
    {
      id: 4,
      name: 'Notion AI',
      description: '智能笔记助手',
      category: '文本处理',
      rating: 4.6,
      downloads: '300K+',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Notion%20AI%20note%20taking%20productivity%20app%20logo&image_size=square',
      tags: ['免费增值', '生产力']
    }
  ]
  
  // 最新论文数据
  latestPapers.value = [
    {
      id: 1,
      title: 'Attention Is All You Need',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
      abstract: '本文提出了Transformer模型，完全基于注意力机制，在机器翻译任务上取得了最先进的结果...',
      publishDate: '2023-12-01',
      citations: 15420
    },
    {
      id: 2,
      title: 'GPT-4 Technical Report',
      authors: ['OpenAI Team'],
      abstract: 'GPT-4是一个大规模的多模态模型，能够接受图像和文本输入，产生文本输出...',
      publishDate: '2023-11-28',
      citations: 8932
    },
    {
      id: 3,
      title: 'LLaMA: Open and Efficient Foundation Language Models',
      authors: ['Hugo Touvron', 'Thibaut Lavril', 'Gautier Izacard'],
      abstract: '我们介绍了LLaMA，一个基础语言模型的集合，参数范围从7B到65B...',
      publishDate: '2023-11-25',
      citations: 6754
    }
  ]
}

// 生命周期
onMounted(() => {
  initData()
})
</script>

<style scoped>
.featured-page {
  padding: 20px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.hero-section {
  margin-bottom: 60px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.carousel-item {
  height: 300px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  position: relative;
}

.carousel-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.carousel-content {
  position: relative;
  z-index: 1;
  color: white;
  padding: 0 60px;
  max-width: 600px;
}

.carousel-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
}

.carousel-desc {
  font-size: 16px;
  margin-bottom: 24px;
  opacity: 0.9;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.category-section {
  margin-bottom: 60px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #e5e7eb;
}

.category-icon {
  margin-bottom: 16px;
}

.category-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.category-count {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.apps-section {
  margin-bottom: 60px;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.papers-section {
  margin-bottom: 40px;
}

.papers-list {
  space-y: 16px;
}

.paper-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.paper-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.paper-content {
  flex: 1;
}

.paper-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.paper-authors {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.paper-abstract {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.paper-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.paper-actions {
  flex-shrink: 0;
  margin-left: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel-content {
    padding: 0 30px;
  }
  
  .carousel-title {
    font-size: 24px;
  }
  
  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
  }
  
  .apps-grid {
    grid-template-columns: 1fr;
  }
  
  .paper-item {
    flex-direction: column;
    gap: 16px;
  }
  
  .paper-actions {
    margin-left: 0;
    align-self: flex-end;
  }
}
</style>