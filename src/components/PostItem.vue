<template>
  <div 
    class="post-item" 
    :class="{ 'pinned': pinned, 'featured': post.featured }"
    @click="handlePostClick"
  >
    <!-- 置顶标识 -->
    <div v-if="pinned" class="pinned-badge">
      <el-icon><Top /></el-icon>
      <span>置顶</span>
    </div>
    
    <!-- 精华标识 -->
    <div v-if="post.featured" class="featured-badge">
      <el-icon><Star /></el-icon>
      <span>精华</span>
    </div>
    
    <div class="post-content">
      <!-- 帖子头部 -->
      <div class="post-header">
        <div class="author-info">
          <el-avatar :size="32" :src="post.author.avatar">
            {{ post.author.username.charAt(0) }}
          </el-avatar>
          <div class="author-details">
            <div class="author-name">{{ post.author.username }}</div>
            <div class="post-meta">
              <span class="post-time">{{ formatTime(post.createdAt) }}</span>
              <el-divider direction="vertical" />
              <span class="post-category">
                <el-tag :type="getCategoryType(post.category)" size="small">
                  {{ getCategoryLabel(post.category) }}
                </el-tag>
              </span>
            </div>
          </div>
        </div>
        
        <div class="post-actions">
          <el-dropdown trigger="click" @command="handleActionCommand">
            <el-button text>
              <el-icon><MoreFilled /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="share">
                  <el-icon><Share /></el-icon>
                  分享
                </el-dropdown-item>
                <el-dropdown-item command="report">
                  <el-icon><Warning /></el-icon>
                  举报
                </el-dropdown-item>
                <el-dropdown-item v-if="isAuthor" command="edit">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-dropdown-item>
                <el-dropdown-item v-if="isAuthor" command="delete" divided>
                  <el-icon><Delete /></el-icon>
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 帖子标题 -->
      <h3 class="post-title">{{ post.title }}</h3>
      
      <!-- 帖子内容预览 -->
      <div class="post-preview">
        {{ getContentPreview(post.content) }}
      </div>
      
      <!-- 帖子标签 -->
      <div v-if="post.tags && post.tags.length > 0" class="post-tags">
        <el-tag
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          size="small"
          class="tag-item"
          @click.stop="handleTagClick(tag)"
        >
          {{ tag }}
        </el-tag>
        <span v-if="post.tags.length > 3" class="more-tags">
          +{{ post.tags.length - 3 }}
        </span>
      </div>
      
      <!-- 帖子统计和操作 -->
      <div class="post-footer">
        <div class="post-stats">
          <div class="stat-item">
            <el-icon><View /></el-icon>
            <span>{{ formatNumber(post.views) }}</span>
          </div>
          
          <div class="stat-item">
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ formatNumber(post.replies) }}</span>
          </div>
          
          <div class="stat-item">
            <el-icon><Timer /></el-icon>
            <span>{{ formatTime(post.lastReplyAt) }}</span>
          </div>
        </div>
        
        <div class="post-interactions">
          <el-button
            text
            :class="{ 'liked': post.liked }"
            @click.stop="handleLike"
          >
            <el-icon><component :is="post.liked ? 'StarFilled' : 'Star'" /></el-icon>
            <span>{{ formatNumber(post.likes) }}</span>
          </el-button>
          
          <el-button text @click.stop="handleReply">
            <el-icon><ChatDotRound /></el-icon>
            <span>回复</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Top, 
  Star, 
  StarFilled,
  MoreFilled, 
  Share, 
  Warning, 
  Edit, 
  Delete,
  View,
  ChatDotRound,
  Timer
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  pinned: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['click', 'like', 'reply'])

// 计算属性
const isAuthor = computed(() => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  return userInfo.id === props.post.author.id
})

// 方法
const formatTime = (timeString) => {
  const time = new Date(timeString)
  const now = new Date()
  const diff = now - time
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return time.toLocaleDateString('zh-CN')
  }
}

const formatNumber = (num) => {
  if (num < 1000) {
    return num.toString()
  } else if (num < 10000) {
    return (num / 1000).toFixed(1) + 'k'
  } else {
    return (num / 10000).toFixed(1) + 'w'
  }
}

const getCategoryType = (category) => {
  const typeMap = {
    'qa': 'primary',
    'share': 'success',
    'discussion': 'warning',
    'featured': 'danger',
    'announcement': 'info'
  }
  return typeMap[category] || 'default'
}

const getCategoryLabel = (category) => {
  const labelMap = {
    'qa': '问答',
    'share': '分享',
    'discussion': '讨论',
    'featured': '精华',
    'announcement': '公告'
  }
  return labelMap[category] || '其他'
}

const getContentPreview = (content) => {
  if (!content) return ''
  return content.length > 120 ? content.substring(0, 120) + '...' : content
}

const handlePostClick = () => {
  emit('click', props.post)
}

const handleLike = () => {
  // 检查登录状态
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录')
    return
  }
  
  // 切换点赞状态
  props.post.liked = !props.post.liked
  if (props.post.liked) {
    props.post.likes++
  } else {
    props.post.likes--
  }
  
  emit('like', props.post)
}

const handleReply = () => {
  emit('reply', props.post)
}

const handleTagClick = (tag) => {
  // 触发标签搜索
  ElMessage.info(`搜索标签: ${tag}`)
}

const handleActionCommand = (command) => {
  switch (command) {
    case 'share':
      ElMessage.success('分享链接已复制到剪贴板')
      break
    case 'report':
      ElMessage.info('举报功能开发中...')
      break
    case 'edit':
      ElMessage.info('编辑功能开发中...')
      break
    case 'delete':
      ElMessage.warning('删除功能开发中...')
      break
  }
}
</script>

<style scoped>
.post-item {
  position: relative;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.post-item:hover {
  background: #f9fafb;
}

.post-item:last-child {
  border-bottom: none;
}

.post-item.pinned {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
}

.post-item.pinned:hover {
  background: #fef3c7;
}

.post-item.featured {
  background: #fef2f2;
  border-left: 4px solid #ef4444;
}

.post-item.featured:hover {
  background: #fef2f2;
}

.pinned-badge,
.featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.pinned-badge {
  background: #fbbf24;
  color: white;
}

.featured-badge {
  background: #ef4444;
  color: white;
}

.post-content {
  width: 100%;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-details {
  flex: 1;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.post-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #6b7280;
}

.post-time {
  margin-right: 8px;
}

.post-category {
  margin-left: 8px;
}

.post-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.post-item:hover .post-actions {
  opacity: 1;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.post-preview {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 12px;
}

.post-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tag-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-item:hover {
  transform: translateY(-1px);
}

.more-tags {
  font-size: 12px;
  color: #9ca3af;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.post-interactions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-interactions .el-button {
  font-size: 12px;
  color: #6b7280;
  padding: 4px 8px;
}

.post-interactions .el-button.liked {
  color: #f59e0b;
}

.post-interactions .el-button:hover {
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-item {
    padding: 16px;
  }
  
  .post-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .post-actions {
    opacity: 1;
    align-self: flex-end;
  }
  
  .post-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .post-stats {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .post-item {
    padding: 12px;
  }
  
  .author-info {
    gap: 8px;
  }
  
  .post-title {
    font-size: 15px;
  }
  
  .post-preview {
    font-size: 13px;
  }
}
</style>