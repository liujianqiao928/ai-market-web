<template>
  <div class="paper-item" @click="handleClick">
    <div class="paper-content">
      <!-- 论文标题和基本信息 -->
      <div class="paper-header">
        <h3 class="paper-title">{{ paper.title }}</h3>
        <div class="paper-meta">
          <span class="authors">
            <el-icon><User /></el-icon>
            {{ formatAuthors(paper.authors) }}
          </span>
          <span class="venue">
            <el-icon><Document /></el-icon>
            {{ paper.venue }} {{ paper.year }}
          </span>
          <span class="field">
            <el-tag size="small" :type="getFieldTagType(paper.field)">{{ getFieldLabel(paper.field) }}</el-tag>
          </span>
        </div>
      </div>
      
      <!-- 论文摘要 -->
      <div class="paper-abstract">
        <p>{{ paper.abstract }}</p>
      </div>
      
      <!-- 关键词 -->
      <div class="paper-keywords">
        <el-tag
          v-for="keyword in paper.keywords"
          :key="keyword"
          size="small"
          effect="plain"
          class="keyword-tag"
        >
          {{ keyword }}
        </el-tag>
      </div>
      
      <!-- 统计信息 -->
      <div class="paper-stats">
        <div class="stat-item">
          <el-icon><View /></el-icon>
          <span>引用 {{ paper.citations }}</span>
        </div>
        <div class="stat-item">
          <el-icon><Star /></el-icon>
          <span>影响因子 {{ paper.impactFactor }}</span>
        </div>
        <div class="stat-item">
          <el-icon><Calendar /></el-icon>
          <span>{{ formatDate(paper.publishedAt) }}</span>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="paper-actions">
      <el-button
        size="small"
        type="primary"
        @click.stop="handleDownload"
      >
        <el-icon><Download /></el-icon>
        下载
      </el-button>
      
      <el-button
        size="small"
        @click.stop="handleCite"
      >
        <el-icon><DocumentCopy /></el-icon>
        引用
      </el-button>
      
      <el-button
        size="small"
        :type="paper.bookmarked ? 'warning' : 'default'"
        @click.stop="handleBookmark"
      >
        <el-icon><Star /></el-icon>
        {{ paper.bookmarked ? '已收藏' : '收藏' }}
      </el-button>
      
      <el-dropdown trigger="click" @click.stop>
        <el-button size="small" circle>
          <el-icon><MoreFilled /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleShare">
              <el-icon><Share /></el-icon>
              分享
            </el-dropdown-item>
            <el-dropdown-item @click="handleReport">
              <el-icon><Warning /></el-icon>
              举报
            </el-dropdown-item>
            <el-dropdown-item @click="handleViewDetails">
              <el-icon><View /></el-icon>
              查看详情
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  User,
  Document,
  View,
  Star,
  Calendar,
  Download,
  DocumentCopy,
  MoreFilled,
  Share,
  Warning
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  paper: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['click', 'download', 'cite', 'bookmark'])

// 研究领域映射
const fieldLabels = {
  ml: '机器学习',
  dl: '深度学习',
  nlp: '自然语言处理',
  cv: '计算机视觉',
  rl: '强化学习',
  kg: '知识图谱',
  rs: '推荐系统',
  asr: '语音识别',
  robotics: '机器人学',
  generative: '生成式AI'
}

// 方法
const formatAuthors = (authors) => {
  if (authors.length <= 3) {
    return authors.join(', ')
  }
  return `${authors.slice(0, 3).join(', ')} 等`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getFieldLabel = (field) => {
  return fieldLabels[field] || field
}

const getFieldTagType = (field) => {
  const typeMap = {
    ml: 'primary',
    dl: 'success',
    nlp: 'info',
    cv: 'warning',
    rl: 'danger',
    kg: 'primary',
    rs: 'success',
    asr: 'info',
    robotics: 'warning',
    generative: 'danger'
  }
  return typeMap[field] || 'default'
}

const handleClick = () => {
  emit('click', props.paper)
}

const handleDownload = () => {
  emit('download', props.paper)
}

const handleCite = () => {
  emit('cite', props.paper)
}

const handleBookmark = () => {
  emit('bookmark', props.paper)
}

const handleShare = () => {
  // 复制分享链接到剪贴板
  const shareUrl = `${window.location.origin}/papers/${props.paper.id}`
  navigator.clipboard.writeText(shareUrl).then(() => {
    ElMessage.success('分享链接已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const handleReport = () => {
  ElMessage.info('举报功能开发中...')
}

const handleViewDetails = () => {
  emit('click', props.paper)
}
</script>

<style scoped>
.paper-item {
  display: flex;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s;
}

.paper-item:hover {
  background: #f9fafb;
}

.paper-item:last-child {
  border-bottom: none;
}

.paper-content {
  flex: 1;
  margin-right: 16px;
}

.paper-header {
  margin-bottom: 12px;
}

.paper-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
  cursor: pointer;
}

.paper-title:hover {
  color: #409eff;
}

.paper-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  font-size: 14px;
  color: #6b7280;
}

.paper-meta .el-icon {
  margin-right: 4px;
}

.authors {
  display: flex;
  align-items: center;
}

.venue {
  display: flex;
  align-items: center;
}

.field {
  display: flex;
  align-items: center;
}

.paper-abstract {
  margin-bottom: 12px;
}

.paper-abstract p {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.paper-keywords {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.keyword-tag {
  font-size: 12px;
}

.paper-stats {
  display: flex;
  gap: 20px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #6b7280;
}

.stat-item .el-icon {
  margin-right: 4px;
  font-size: 14px;
}

.paper-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  min-width: 120px;
}

.paper-actions .el-button {
  width: 80px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .paper-item {
    flex-direction: column;
    padding: 16px;
  }
  
  .paper-content {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .paper-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .paper-actions {
    flex-direction: row;
    justify-content: flex-start;
    min-width: auto;
  }
  
  .paper-actions .el-button {
    width: auto;
  }
}

@media (max-width: 480px) {
  .paper-title {
    font-size: 16px;
  }
  
  .paper-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .paper-actions {
    flex-wrap: wrap;
  }
}
</style>