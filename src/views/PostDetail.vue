<template>
  <div class="post-detail-page">
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/forum' }">论坛</el-breadcrumb-item>
        <el-breadcrumb-item>{{ post?.category }}</el-breadcrumb-item>
        <el-breadcrumb-item>帖子详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="content-wrapper" v-if="post">
      <div class="main-content">
        <div class="post-header">
          <div class="post-badges">
            <el-tag v-if="post.isPinned" type="danger" size="small">置顶</el-tag>
            <el-tag v-if="post.isFeatured" type="warning" size="small">精华</el-tag>
            <el-tag :type="getCategoryType(post.category)" size="small">{{ post.category }}</el-tag>
          </div>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <div class="author-info">
              <img :src="post.author.avatar" :alt="post.author.name" class="author-avatar" />
              <div>
                <div class="author-name">{{ post.author.name }}</div>
                <div class="post-time">{{ formatTime(post.createdAt) }}</div>
              </div>
            </div>
            <div class="post-stats">
              <span class="stat-item">
                <el-icon><View /></el-icon>
                {{ post.views }}
              </span>
              <span class="stat-item">
                <el-icon><ChatDotRound /></el-icon>
                {{ post.replies }}
              </span>
              <span class="stat-item">
                <el-icon><Star /></el-icon>
                {{ post.likes }}
              </span>
            </div>
          </div>
        </div>

        <div class="post-content">
          <div class="content-body" v-html="post.content"></div>
          <div class="post-tags" v-if="post.tags.length">
            <el-tag v-for="tag in post.tags" :key="tag" type="info" size="small">{{ tag }}</el-tag>
          </div>
        </div>

        <div class="post-actions">
          <el-button :type="post.isLiked ? 'primary' : 'default'" @click="handleLike">
            <el-icon><Star /></el-icon>
            {{ post.isLiked ? '已点赞' : '点赞' }} ({{ post.likes }})
          </el-button>
          <el-button @click="handleShare">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
          <el-button @click="handleReport">
            <el-icon><Warning /></el-icon>
            举报
          </el-button>
        </div>

        <div class="replies-section">
          <div class="replies-header">
            <h3>回复 ({{ replies.length }})</h3>
            <el-select v-model="sortBy" size="small" @change="handleSort">
              <el-option label="最新" value="latest" />
              <el-option label="最早" value="earliest" />
              <el-option label="最热" value="popular" />
            </el-select>
          </div>

          <div class="reply-form">
            <el-input
              v-model="replyContent"
              type="textarea"
              :rows="4"
              placeholder="写下你的回复..."
              maxlength="1000"
              show-word-limit
            />
            <div class="reply-actions">
              <el-button type="primary" @click="handleReply" :disabled="!replyContent.trim()">
                发布回复
              </el-button>
            </div>
          </div>

          <div class="replies-list">
            <div v-for="reply in sortedReplies" :key="reply.id" class="reply-item">
              <div class="reply-header">
                <div class="reply-author">
                  <img :src="reply.author.avatar" :alt="reply.author.name" class="reply-avatar" />
                  <div>
                    <div class="reply-author-name">{{ reply.author.name }}</div>
                    <div class="reply-time">{{ formatTime(reply.createdAt) }}</div>
                  </div>
                </div>
                <div class="reply-actions-menu">
                  <el-dropdown>
                    <el-icon><MoreFilled /></el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="handleReplyLike(reply)">
                          {{ reply.isLiked ? '取消点赞' : '点赞' }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="handleReplyToReply(reply)">回复</el-dropdown-item>
                        <el-dropdown-item @click="handleReportReply(reply)">举报</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
              <div class="reply-content">{{ reply.content }}</div>
              <div class="reply-stats">
                <span class="reply-likes" :class="{ active: reply.isLiked }" @click="handleReplyLike(reply)">
                  <el-icon><Star /></el-icon>
                  {{ reply.likes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <div class="author-card">
          <div class="author-header">
            <img :src="post.author.avatar" :alt="post.author.name" class="author-large-avatar" />
            <div>
              <h4 class="author-large-name">{{ post.author.name }}</h4>
              <p class="author-title">{{ post.author.title || 'AI爱好者' }}</p>
            </div>
          </div>
          <div class="author-stats">
            <div class="stat">
              <span class="stat-value">{{ post.author.posts || 42 }}</span>
              <span class="stat-label">帖子</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ post.author.followers || 128 }}</span>
              <span class="stat-label">关注者</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ post.author.reputation || 856 }}</span>
              <span class="stat-label">声望</span>
            </div>
          </div>
          <el-button type="primary" size="small" @click="handleFollow">
            {{ post.author.isFollowed ? '已关注' : '关注' }}
          </el-button>
        </div>

        <div class="related-posts">
          <h4>相关帖子</h4>
          <div class="related-list">
            <div v-for="relatedPost in relatedPosts" :key="relatedPost.id" class="related-item">
              <router-link :to="`/forum/post/${relatedPost.id}`" class="related-link">
                {{ relatedPost.title }}
              </router-link>
              <div class="related-meta">
                <span>{{ relatedPost.replies }} 回复</span>
                <span>{{ formatTime(relatedPost.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { View, ChatDotRound, Star, Share, Warning, MoreFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const postId = ref(route.params.id)
const post = ref(null)
const replies = ref([])
const relatedPosts = ref([])
const replyContent = ref('')
const sortBy = ref('latest')

const sortedReplies = computed(() => {
  const sorted = [...replies.value]
  switch (sortBy.value) {
    case 'earliest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'popular':
      return sorted.sort((a, b) => b.likes - a.likes)
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
})

const getCategoryType = (category) => {
  const types = {
    '技术讨论': 'primary',
    '经验分享': 'success',
    '问题求助': 'warning',
    '资源分享': 'info'
  }
  return types[category] || 'default'
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const handleLike = () => {
  post.value.isLiked = !post.value.isLiked
  post.value.likes += post.value.isLiked ? 1 : -1
  ElMessage.success(post.value.isLiked ? '点赞成功' : '取消点赞')
}

const handleShare = () => {
  ElMessage.success('分享链接已复制到剪贴板')
}

const handleReport = () => {
  ElMessage.warning('举报功能开发中')
}

const handleSort = () => {
  // 排序逻辑在computed中处理
}

const handleReply = () => {
  if (!replyContent.value.trim()) return
  
  const newReply = {
    id: Date.now(),
    content: replyContent.value,
    author: {
      name: '当前用户',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar&image_size=square'
    },
    createdAt: new Date().toISOString(),
    likes: 0,
    isLiked: false
  }
  
  replies.value.unshift(newReply)
  post.value.replies += 1
  replyContent.value = ''
  ElMessage.success('回复发布成功')
}

const handleReplyLike = (reply) => {
  reply.isLiked = !reply.isLiked
  reply.likes += reply.isLiked ? 1 : -1
}

const handleReplyToReply = (reply) => {
  replyContent.value = `@${reply.author.name} `
}

const handleReportReply = (reply) => {
  ElMessage.warning('举报功能开发中')
}

const handleFollow = () => {
  post.value.author.isFollowed = !post.value.author.isFollowed
  ElMessage.success(post.value.author.isFollowed ? '关注成功' : '取消关注')
}

const fetchPostDetail = async () => {
  // Mock data
  post.value = {
    id: postId.value,
    title: 'ChatGPT在代码生成中的最佳实践分享',
    content: `<p>最近在项目中大量使用ChatGPT来辅助代码生成，总结了一些最佳实践，分享给大家：</p>
    <h3>1. 明确需求描述</h3>
    <p>在向ChatGPT提问时，要尽可能详细地描述你的需求，包括：</p>
    <ul>
      <li>使用的编程语言和框架</li>
      <li>具体的功能要求</li>
      <li>代码风格偏好</li>
      <li>性能要求</li>
    </ul>
    <h3>2. 分步骤提问</h3>
    <p>对于复杂的功能，建议分步骤提问，这样可以获得更准确的代码。</p>
    <h3>3. 代码审查</h3>
    <p>生成的代码一定要仔细审查，特别注意：</p>
    <ul>
      <li>安全性问题</li>
      <li>性能优化</li>
      <li>错误处理</li>
    </ul>`,
    category: '经验分享',
    author: {
      name: 'AI开发者',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20developer%20avatar&image_size=square',
      title: '高级AI工程师',
      posts: 156,
      followers: 1240,
      reputation: 3580,
      isFollowed: false
    },
    createdAt: '2024-01-15T10:30:00Z',
    views: 1250,
    replies: 23,
    likes: 89,
    isLiked: false,
    isPinned: false,
    isFeatured: true,
    tags: ['ChatGPT', '代码生成', '最佳实践', 'AI编程']
  }
  
  replies.value = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    content: `这是第${i + 1}条回复内容，感谢分享这么有用的经验！我也在项目中使用ChatGPT，确实需要注意这些问题。`,
    author: {
      name: `用户${i + 1}`,
      avatar: `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20${i + 1}&image_size=square`
    },
    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 20),
    isLiked: Math.random() > 0.7
  }))
  
  relatedPosts.value = Array.from({ length: 5 }, (_, i) => ({
    id: i + 100,
    title: `相关帖子标题 ${i + 1}`,
    replies: Math.floor(Math.random() * 50),
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  }))
}

onMounted(() => {
  fetchPostDetail()
})
</script>

<style scoped>
.post-detail-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

.main-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.post-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.post-badges {
  margin-bottom: 12px;
}

.post-badges .el-tag {
  margin-right: 8px;
}

.post-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1f2937;
  line-height: 1.3;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
  color: #1f2937;
}

.post-time {
  font-size: 14px;
  color: #6b7280;
}

.post-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 14px;
}

.post-content {
  padding: 24px;
}

.content-body {
  line-height: 1.6;
  color: #374151;
  margin-bottom: 24px;
}

.content-body h3 {
  margin: 24px 0 12px 0;
  color: #1f2937;
}

.content-body ul {
  margin: 12px 0;
  padding-left: 20px;
}

.content-body li {
  margin-bottom: 8px;
}

.post-tags .el-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.post-actions {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
}

.replies-section {
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.replies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.replies-header h3 {
  margin: 0;
  color: #1f2937;
}

.reply-form {
  margin-bottom: 32px;
}

.reply-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.replies-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reply-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.reply-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.reply-author-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
}

.reply-time {
  font-size: 12px;
  color: #6b7280;
}

.reply-actions-menu {
  cursor: pointer;
  color: #6b7280;
}

.reply-content {
  line-height: 1.5;
  color: #374151;
  margin-bottom: 12px;
}

.reply-stats {
  display: flex;
  align-items: center;
}

.reply-likes {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}

.reply-likes:hover,
.reply-likes.active {
  color: #3b82f6;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.author-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.author-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.author-large-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.author-large-name {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 16px;
}

.author-title {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.author-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.related-posts {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.related-posts h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.related-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.related-link {
  display: block;
  color: #1f2937;
  text-decoration: none;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.related-link:hover {
  color: #3b82f6;
}

.related-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .post-detail-page {
    padding: 16px;
  }
  
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .post-stats {
    align-self: flex-start;
  }
  
  .post-actions {
    flex-wrap: wrap;
  }
  
  .replies-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .reply-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .author-stats {
    justify-content: space-around;
  }
}
</style>