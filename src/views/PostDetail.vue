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
        <!-- 发布人信息卡片 -->
        <div class="author-info-card">
          <div class="author-avatar-section">
            <img :src="post.author.avatar" :alt="post.author.name" class="author-avatar-large" />
            <div class="author-status" :class="post.author.isOnline ? 'online' : 'offline'"></div>
          </div>
          <div class="author-details">
            <div class="author-main-info">
              <h3 class="author-name">{{ post.author.name }}</h3>
              <div class="author-badges">
                <el-tag v-if="post.author.isVip" type="warning" size="small" effect="dark">VIP</el-tag>
                <el-tag v-if="post.author.level" type="success" size="small">Lv.{{ post.author.level }}</el-tag>
              </div>
            </div>
            <p class="author-title">{{ post.author.title || 'AI爱好者' }}</p>
            <div class="author-stats-inline">
              <span class="stat-item">帖子: {{ post.author.posts || 42 }}</span>
              <span class="stat-item">关注者: {{ post.author.followers || 128 }}</span>
              <span class="stat-item">声望: {{ post.author.reputation || 856 }}</span>
            </div>
          </div>
          <div class="author-actions">
            <el-button type="primary" size="small" @click="handleFollow">
              <el-icon><Plus /></el-icon>
              {{ post.author.isFollowed ? '已关注' : '关注' }}
            </el-button>
            <el-button size="small" @click="handleMessage">
              <el-icon><Message /></el-icon>
              私信
            </el-button>
          </div>
        </div>

        <!-- 帖子主体内容 -->
        <div class="post-main-card">
          <div class="post-header">
            <div class="post-badges">
              <el-tag v-if="post.isPinned" type="danger" size="small" effect="dark">
                <el-icon><Top /></el-icon>
                置顶
              </el-tag>
              <el-tag v-if="post.isFeatured" type="warning" size="small" effect="dark">
                <el-icon><Star /></el-icon>
                精华
              </el-tag>
              <el-tag :type="getCategoryType(post.category)" size="small">{{ post.category }}</el-tag>
            </div>
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-meta">
              <div class="post-time-info">
                <span class="publish-time">
                  <el-icon><Clock /></el-icon>
                  发布于 {{ formatTime(post.createdAt) }}
                </span>
                <span v-if="post.updatedAt !== post.createdAt" class="update-time">
                  <el-icon><Edit /></el-icon>
                  更新于 {{ formatTime(post.updatedAt) }}
                </span>
              </div>
              <div class="post-stats">
                <span class="stat-item">
                  <el-icon><View /></el-icon>
                  {{ formatNumber(post.views) }} 浏览
                </span>
                <span class="stat-item">
                  <el-icon><ChatDotRound /></el-icon>
                  {{ post.replies }} 回复
                </span>
                <span class="stat-item">
                  <el-icon><Star /></el-icon>
                  {{ post.likes }} 点赞
                </span>
              </div>
            </div>
          </div>

          <!-- 帖子内容区域 - 左右分栏布局 -->
          <div class="post-content-wrapper">
            <!-- 左侧正文内容 -->
            <div class="post-content-left">
              <div class="content-body" v-html="renderedContent"></div>
              
              <!-- 标签区域 -->
              <div class="post-tags" v-if="post.tags && post.tags.length">
                <div class="tags-header">
                  <el-icon><Collection /></el-icon>
                  <span>标签</span>
                </div>
                <div class="tags-list">
                  <el-tag 
                    v-for="tag in post.tags" 
                    :key="tag" 
                    type="info" 
                    size="small"
                    class="post-tag"
                    @click="searchByTag(tag)"
                  >
                    #{{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>


          </div>

          <!-- 操作按钮 -->
          <div class="post-actions">
            <el-button 
              @click="handleLike" 
              :type="post.isLiked ? 'primary' : 'default'"
              class="action-btn like-btn"
              :class="{ 'liked': post.isLiked }"
            >
              <el-icon><Star /></el-icon>
              {{ post.isLiked ? '已点赞' : '点赞' }} ({{ formatNumber(post.likes) }})
            </el-button>
            <el-button @click="handleShare" class="action-btn share-btn">
              <el-icon><Share /></el-icon>
              分享
            </el-button>
            <el-button @click="handleCollect" class="action-btn collect-btn" :class="{ 'collected': post.isCollected }">
              <el-icon><Collection /></el-icon>
              {{ post.isCollected ? '已收藏' : '收藏' }}
            </el-button>
            <el-button @click="handleReport" type="danger" plain class="action-btn report-btn">
              <el-icon><Warning /></el-icon>
              举报
            </el-button>
          </div>
        </div>

        <!-- 评论区域 -->
        <div class="comments-section">
          <div class="comments-header">
            <h3>
              <el-icon><ChatDotRound /></el-icon>
              评论 ({{ formatNumber(comments.length) }})
            </h3>
            <el-select v-model="commentSort" size="small" class="sort-select">
              <el-option label="最新" value="newest" />
              <el-option label="最热" value="hottest" />
              <el-option label="最早" value="oldest" />
            </el-select>
          </div>
          
          <!-- 发表评论 -->
          <div class="comment-form">
            <div class="comment-input-wrapper">
              <img :src="currentUser?.avatar || '/default-avatar.png'" class="comment-avatar" />
              <div class="comment-input-area">
                <el-input
                  v-model="newComment"
                  type="textarea"
                  :rows="4"
                  placeholder="写下你的评论..."
                  class="comment-textarea"
                  maxlength="1000"
                  show-word-limit
                />
                <div class="comment-actions">
                  <div class="comment-tools">
                    <el-button size="small" text @click="insertEmoji">
                      <el-icon><Sunny /></el-icon>
                      表情
                    </el-button>
                    <el-button size="small" text @click="insertImage">
                      <el-icon><Picture /></el-icon>
                      图片
                    </el-button>
                  </div>
                  <el-button type="primary" @click="submitComment" :loading="submittingComment">
                    发表评论
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="comments-list">
            <div v-for="comment in sortedComments" :key="comment.id" class="comment-item">
              <img :src="comment.author.avatar" :alt="comment.author.name" class="comment-avatar" />
              <div class="comment-content">
                <div class="comment-header">
                  <div class="comment-author-info">
                    <span class="comment-author">{{ comment.author.name }}</span>
                    <el-tag v-if="comment.author.isVip" type="warning" size="small" effect="plain">VIP</el-tag>
                    <el-tag v-if="comment.author.id === post.author.id" type="primary" size="small" effect="plain">楼主</el-tag>
                  </div>
                  <div class="comment-meta">
                    <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                    <span class="comment-floor">#{{ comment.floor }}</span>
                  </div>
                </div>
                <div class="comment-body" v-html="renderCommentContent(comment.content)"></div>
                <div class="comment-actions">
                  <el-button size="small" text @click="replyToComment(comment)">
                    <el-icon><ChatDotRound /></el-icon>
                    回复
                  </el-button>
                  <el-button 
                    size="small" 
                    text 
                    @click="likeComment(comment)"
                    :class="{ 'liked': comment.isLiked }"
                  >
                    <el-icon><Star /></el-icon>
                    {{ comment.likes || 0 }}
                  </el-button>
                  <el-button size="small" text @click="reportComment(comment)">
                    <el-icon><Warning /></el-icon>
                    举报
                  </el-button>
                </div>
                
                <!-- 回复列表 -->
                <div v-if="comment.replies && comment.replies.length" class="replies-list">
                  <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                    <img :src="reply.author.avatar" :alt="reply.author.name" class="reply-avatar" />
                    <div class="reply-content">
                      <div class="reply-header">
                        <span class="reply-author">{{ reply.author.name }}</span>
                        <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
                      </div>
                      <div class="reply-body">{{ reply.content }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 加载更多评论 -->
          <div v-if="hasMoreComments" class="load-more-comments">
            <el-button @click="loadMoreComments" :loading="loadingComments">加载更多评论</el-button>
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar">
        <!-- 相关推荐 -->
        <div class="sidebar-card related-posts">
          <div class="card-header">
            <h4>
              <el-icon><Connection /></el-icon>
              相关推荐
            </h4>
          </div>
          <div class="related-posts-list">
            <div v-for="relatedPost in relatedPosts" :key="relatedPost.id" class="related-post-item">
              <router-link :to="`/forum/post/${relatedPost.id}`" class="related-post-link">
                <div class="related-post-content">
                  <h5 class="related-post-title">{{ relatedPost.title }}</h5>
                  <div class="related-post-meta">
                    <span class="author">{{ relatedPost.author.name }}</span>
                    <span class="stats">
                      <el-icon><View /></el-icon>
                      {{ formatNumber(relatedPost.views) }}
                    </span>
                  </div>
                </div>
                <div class="related-post-thumbnail">
                  <img :src="relatedPost.thumbnail || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=tech%20discussion%20abstract%20background&image_size=square'" :alt="relatedPost.title" />
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 热度排行榜 -->
        <div class="sidebar-card hot-topics">
          <div class="card-header">
            <h4>
              <el-icon><TrendCharts /></el-icon>
              本话题热度排行榜
            </h4>
          </div>
          <div class="hot-topics-list">
            <div v-for="(hotPost, index) in hotTopics" :key="hotPost.id" class="hot-topic-item">
              <div class="rank-number" :class="`rank-${index + 1}`">
                {{ index + 1 }}
              </div>
              <router-link :to="`/forum/post/${hotPost.id}`" class="hot-topic-link">
                <div class="hot-topic-content">
                  <h6 class="hot-topic-title">{{ hotPost.title }}</h6>
                  <div class="hot-topic-stats">
                    <span class="heat-score">
                      <el-icon><Sunny /></el-icon>
                      {{ formatNumber(hotPost.heatScore) }}
                    </span>
                    <span class="views">
                      <el-icon><View /></el-icon>
                      {{ formatNumber(hotPost.views) }}
                    </span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 话题统计 -->
        <div class="sidebar-card topic-stats">
          <div class="card-header">
            <h4>
              <el-icon><DataAnalysis /></el-icon>
              话题统计
            </h4>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(topicStats.totalPosts) }}</div>
              <div class="stat-label">总帖子数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(topicStats.totalViews) }}</div>
              <div class="stat-label">总浏览量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(topicStats.activeUsers) }}</div>
              <div class="stat-label">活跃用户</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(topicStats.todayPosts) }}</div>
              <div class="stat-label">今日新帖</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import {
  View,
  ChatDotRound,
  Star,
  Share,
  Warning,
  Collection,
  Clock,
  Edit,
  Plus,
  Message,
  Top,
  Sunny,
  Picture,
  Connection,
  TrendCharts,
  DataAnalysis
} from '@element-plus/icons-vue'

const route = useRoute()
const postId = route.params.id

// 响应式数据
const post = ref(null)
const comments = ref([])
const newComment = ref('')
const commentSort = ref('newest')
const loading = ref(true)
const submittingComment = ref(false)
const loadingComments = ref(false)
const hasMoreComments = ref(true)
const relatedPosts = ref([])
const hotTopics = ref([])
const topicStats = ref({})
const currentUser = ref({
  id: 'current-user',
  name: '当前用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current'
})

// 计算属性
const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  
  // 检测内容类型并渲染
  const content = post.value.content
  
  // 如果包含Markdown语法，使用marked解析
  if (content.includes('#') || content.includes('```') || content.includes('*') || content.includes('_')) {
    const htmlContent = marked(content)
    return DOMPurify.sanitize(htmlContent)
  }
  
  // 否则直接返回HTML内容（已经过安全处理）
  return DOMPurify.sanitize(content)
})

const sortedComments = computed(() => {
  const sorted = [...comments.value]
  switch (commentSort.value) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'hottest':
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    default:
      return sorted
  }
})

// 工具方法
const getCategoryType = (category) => {
  const typeMap = {
    '技术讨论': 'primary',
    '经验分享': 'success',
    '问题求助': 'warning',
    '资源分享': 'info',
    '产品发布': 'danger',
    '其他': 'default'
  }
  return typeMap[category] || 'default'
}

const formatTime = (time) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const renderCommentContent = (content) => {
  // 简单的评论内容渲染，支持基本的HTML和表情
  return DOMPurify.sanitize(content.replace(/\n/g, '<br>'))
}

// 交互方法
const handleLike = async () => {
  try {
    post.value.isLiked = !post.value.isLiked
    post.value.likes += post.value.isLiked ? 1 : -1
    ElMessage.success(post.value.isLiked ? '点赞成功' : '取消点赞')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleShare = () => {
  navigator.clipboard.writeText(window.location.href)
  ElMessage.success('链接已复制到剪贴板')
}

const handleCollect = async () => {
  try {
    post.value.isCollected = !post.value.isCollected
    ElMessage.success(post.value.isCollected ? '收藏成功' : '取消收藏')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleReport = () => {
  ElMessage.warning('举报功能开发中')
}

const handleFollow = async () => {
  try {
    post.value.author.isFollowed = !post.value.author.isFollowed
    ElMessage.success(post.value.author.isFollowed ? '关注成功' : '取消关注')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleMessage = () => {
  ElMessage.info('私信功能开发中')
}

const searchByTag = (tag) => {
  // 跳转到标签搜索页面
  ElMessage.info(`搜索标签: ${tag}`)
}

const handleImageError = (event) => {
  // 设置默认图片
  event.target.src = 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tech%20abstract%20background%20with%20AI%20elements%20and%20digital%20patterns&image_size=portrait_4_3'
}

const submitComment = async () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  try {
    submittingComment.value = true
    
    const comment = {
      id: Date.now(),
      content: newComment.value,
      author: currentUser.value,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      floor: comments.value.length + 1,
      replies: []
    }
    
    comments.value.unshift(comment)
    newComment.value = ''
    ElMessage.success('评论发表成功')
  } catch (error) {
    ElMessage.error('评论发表失败')
  } finally {
    submittingComment.value = false
  }
}

const insertEmoji = () => {
  ElMessage.info('表情功能开发中')
}

const insertImage = () => {
  ElMessage.info('图片上传功能开发中')
}

const replyToComment = (comment) => {
  newComment.value = `@${comment.author.name} `
}

const likeComment = async (comment) => {
  try {
    comment.isLiked = !comment.isLiked
    comment.likes = (comment.likes || 0) + (comment.isLiked ? 1 : -1)
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const reportComment = (comment) => {
  ElMessage.warning('举报功能开发中')
}

const loadMoreComments = async () => {
  try {
    loadingComments.value = true
    // 模拟加载更多评论
    await new Promise(resolve => setTimeout(resolve, 1000))
    hasMoreComments.value = false
    ElMessage.success('没有更多评论了')
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loadingComments.value = false
  }
}

const fetchPostDetail = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    post.value = {
      id: postId,
      title: 'ChatGPT在代码生成中的最佳实践分享',
      coverImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=ChatGPT%20code%20generation%20best%20practices%20with%20AI%20and%20programming%20elements&image_size=portrait_4_3',
      content: `
        <h2>前言</h2>
        <p>随着AI技术的发展，ChatGPT在代码生成领域展现出了强大的能力。本文将分享一些在实际项目中使用ChatGPT进行代码生成的最佳实践。</p>
        
        <h3>1. 明确需求描述</h3>
        <p>在使用ChatGPT生成代码时，清晰、具体的需求描述是关键。例如：</p>
        <pre><code>// 好的描述
请帮我写一个Vue 3组件，用于显示用户列表，包含头像、姓名、邮箱，支持搜索和分页功能

// 不好的描述
帮我写个用户组件</code></pre>
        
        <h3>2. 提供上下文信息</h3>
        <p>提供项目的技术栈、代码风格、现有的组件结构等上下文信息，能够让ChatGPT生成更符合项目需求的代码。</p>
        
        <h3>3. 迭代优化</h3>
        <p>不要期望一次就能得到完美的代码，通过多轮对话来逐步优化和完善代码是更好的策略。</p>
      `,
      author: {
        id: 'user-123',
        name: 'AI开发者',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=developer',
        title: '高级前端工程师',
        posts: 156,
        followers: 1024,
        reputation: 2580,
        isFollowed: false,
        isVip: true,
        level: 8,
        isOnline: true
      },
      category: '技术讨论',
      tags: ['ChatGPT', 'AI', '代码生成', '最佳实践'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      views: 1250,
      replies: 23,
      likes: 89,
      isLiked: false,
      isCollected: false,
      isPinned: false,
      isFeatured: true
    }
    
    // 模拟获取评论数据
    comments.value = [
      {
        id: 1,
        content: '非常实用的分享！我在项目中也经常使用ChatGPT，确实需要清晰的需求描述才能得到好的结果。',
        author: {
          id: 'user-456',
          name: '前端小白',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend',
          isVip: false
        },
        createdAt: '2024-01-15T11:00:00Z',
        likes: 12,
        isLiked: false,
        floor: 1,
        replies: []
      },
      {
        id: 2,
        content: '补充一点：在使用ChatGPT生成代码时，最好也提供一些示例代码，这样生成的代码风格会更一致。',
        author: {
          id: 'user-789',
          name: '资深架构师',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=architect',
          isVip: true
        },
        createdAt: '2024-01-15T12:15:00Z',
        likes: 8,
        isLiked: true,
        floor: 2,
        replies: []
      }
    ]
    
    // 模拟获取相关帖子
    relatedPosts.value = [
      {
        id: 'post-2',
        title: 'AI辅助编程工具对比：ChatGPT vs GitHub Copilot',
        author: { name: 'Tech评测员' },
        views: 892,
        thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20programming%20tools%20comparison%20ChatGPT%20vs%20GitHub%20Copilot&image_size=square'
      },
      {
        id: 'post-3',
        title: '如何提高ChatGPT代码生成的准确性',
        author: { name: 'AI研究者' },
        views: 1340,
        thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=improving%20ChatGPT%20code%20generation%20accuracy%20with%20AI%20programming&image_size=square'
      }
    ]
    
    // 模拟热门话题
    hotTopics.value = [
      {
        id: 'hot-1',
        title: 'GPT-4 Turbo 最新功能解析',
        heatScore: 9580,
        views: 15600
      },
      {
        id: 'hot-2',
        title: 'AI编程助手使用技巧分享',
        heatScore: 8420,
        views: 12300
      }
    ]
    
    // 模拟话题统计
    topicStats.value = {
      totalPosts: 1256,
      totalViews: 89400,
      activeUsers: 342,
      todayPosts: 23
    }
    
  } catch (error) {
    ElMessage.error('加载帖子详情失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  fetchPostDetail()
})
</script>

<style scoped>
.post-detail-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  align-items: start;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.98), 
    rgba(248, 250, 252, 0.96));
  backdrop-filter: blur(25px);
  border-radius: 24px;
  box-shadow: 
    0 16px 48px rgba(102, 126, 234, 0.12),
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(102, 126, 234, 0.1);
  overflow: hidden;
  position: relative;
  padding: 24px;
}

.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(102, 126, 234, 0.6), 
    rgba(118, 75, 162, 0.6), 
    rgba(102, 126, 234, 0.6));
  background-size: 200% 100%;
  animation: gradientFlow 4s ease infinite;
}

@keyframes gradientFlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* 作者信息卡片 */
.author-info-card {
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.08), 
    rgba(118, 75, 162, 0.06),
    rgba(102, 126, 234, 0.04));
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 
    0 8px 24px rgba(102, 126, 234, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(102, 126, 234, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.author-info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(102, 126, 234, 0.4), 
    transparent);
}

.author-info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.author-avatar-section {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.author-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  object-fit: cover;
}

.author-status {
  position: absolute;
  bottom: 2px;
  right: calc(50% - 40px + 8px);
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 50%;
}

.author-status.online {
  background: #52c41a;
  animation: pulse 2s infinite;
}

.author-status.offline {
  background: #d9d9d9;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.author-details {
  text-align: center;
  margin-bottom: 20px;
}

.author-main-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.author-name {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.author-badges {
  display: flex;
  gap: 4px;
}

.author-title {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px 0;
}

.author-stats-inline {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 13px;
  color: #666;
}

.author-actions {
  display: flex;
  gap: 8px;
}

/* 帖子主要内容卡片 */
.post-main-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.post-main-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* 帖子内容包装器 */
.post-content-wrapper {
  padding: 0 24px;
  margin-bottom: 24px;
}

.post-header {
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.post-badges {
  margin-bottom: 16px;
}

.post-badges .el-tag {
  margin-right: 8px;
}

.post-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, 
    #1a202c, 
    #667eea, 
    #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: titleGradient 6s ease infinite;
  margin: 0 0 16px 0;
  line-height: 1.3;
  position: relative;
}

.post-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, 
    rgba(102, 126, 234, 0.8), 
    rgba(118, 75, 162, 0.8));
  border-radius: 2px;
  animation: titleUnderline 3s ease infinite;
}

@keyframes titleGradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes titleUnderline {
  0%, 100% { width: 60px; opacity: 0.8; }
  50% { width: 120px; opacity: 1; }
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.post-time-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.publish-time,
.update-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
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
  padding: 4px 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.stat-item:hover {
  background: rgba(102, 126, 234, 0.2);
}

.post-content {
  padding: 24px;
}

.content-body {
  line-height: 1.7;
  color: #333;
  font-size: 16px;
  margin-bottom: 24px;
}

.content-body h1,
.content-body h2,
.content-body h3 {
  margin-top: 32px;
  margin-bottom: 16px;
  color: #1a1a1a;
  font-weight: 600;
}

.content-body h1 {
  font-size: 32px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content-body h2 {
  font-size: 26px;
  color: #333;
}

.content-body h3 {
  font-size: 22px;
  color: #444;
}

.content-body p {
  margin-bottom: 16px;
  text-align: justify;
}

.content-body pre {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.content-body code {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 3px 6px;
  border-radius: 6px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
}

.post-tags {
  padding: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.tags-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.post-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-tag:hover {
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.post-actions {
  padding: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.action-btn.liked {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24) !important;
  border-color: transparent !important;
  color: white !important;
}

.action-btn.collected {
  background: linear-gradient(45deg, #feca57, #ff9ff3) !important;
  border-color: transparent !important;
  color: white !important;
}

/* 评论区域 */
.comments-section {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(240, 248, 255, 0.95));
  backdrop-filter: blur(25px);
  border-radius: 24px;
  box-shadow: 
    0 20px 60px rgba(102, 126, 234, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
  overflow: hidden;
}

.comments-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
  z-index: -1;
  border-radius: 24px;
}

.comments-section::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(240, 248, 255, 0.95));
  border-radius: 22px;
  z-index: -1;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.comments-header {
  padding: 28px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.08), 
    rgba(118, 75, 162, 0.08),
    rgba(102, 126, 234, 0.05));
  position: relative;
  overflow: hidden;
}

.comments-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(102, 126, 234, 0.1), 
    transparent);
  animation: shimmerEffect 3s infinite;
}

@keyframes shimmerEffect {
  0% { left: -100%; }
  100% { left: 100%; }
}

.comments-header h3 {
  margin: 0;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
}

.sort-select {
  min-width: 100px;
}

.comment-form {
  padding: 28px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.08);
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.02), 
    rgba(255, 255, 255, 0.05));
  position: relative;
}

.comment-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(102, 126, 234, 0.3), 
    transparent);
}

.comment-input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  flex-shrink: 0;
}

.comment-input-area {
  flex: 1;
}

.comment-textarea {
  margin-bottom: 12px;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-tools {
  display: flex;
  gap: 8px;
}

.comments-list {
  padding: 24px;
}

.comment-item {
  display: flex;
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid rgba(102, 126, 234, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.comment-item::before {
  content: '';
  position: absolute;
  left: -24px;
  right: -24px;
  top: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.03), 
    rgba(118, 75, 162, 0.02));
  border-radius: 16px;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.comment-item:hover {
  transform: translateY(-2px);
  padding: 24px;
  margin: 0 -24px;
}

.comment-item:hover::before {
  opacity: 1;
  transform: scale(1);
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.05);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.comment-author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-author {
  font-weight: 600;
  color: #1a1a1a;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.comment-time {
  color: #999;
}

.comment-floor {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.comment-body {
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
  font-size: 15px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.comment-actions .el-button {
  padding: 4px 8px;
  font-size: 12px;
  transition: all 0.2s ease;
}

.comment-actions .el-button:hover {
  background: rgba(102, 126, 234, 0.1);
}

.comment-actions .el-button.liked {
  color: #ff6b6b;
}

.replies-list {
  margin-top: 16px;
  padding-left: 20px;
  border-left: 2px solid rgba(102, 126, 234, 0.1);
}

.reply-item {
  display: flex;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.reply-content {
  flex: 1;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.reply-author {
  font-weight: 500;
  color: #333;
  font-size: 13px;
}

.reply-time {
  font-size: 11px;
  color: #999;
}

.reply-body {
  color: #333;
  font-size: 13px;
  line-height: 1.5;
}

.load-more-comments {
  text-align: center;
  padding: 20px;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.02), 
    rgba(118, 75, 162, 0.02));
  border-radius: 32px;
  z-index: -1;
  opacity: 0.5;
}

.sidebar-card {
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.98), 
    rgba(248, 250, 252, 0.95));
  backdrop-filter: blur(25px);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 
    0 16px 48px rgba(102, 126, 234, 0.12),
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 2px solid transparent;
  background-clip: padding-box;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.sidebar-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.1), 
    rgba(118, 75, 162, 0.1));
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: -1;
  border-radius: 24px;
}

.sidebar-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 24px 64px rgba(102, 126, 234, 0.2),
    0 12px 48px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

.sidebar-card:hover::before {
  opacity: 0.3;
}

.card-header h4 {
  margin: 0 0 16px 0;
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.related-posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-post-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 12px;
}

.related-post-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.related-post-link {
  display: flex;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 8px;
  margin: -8px;
}

.related-post-link:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateX(4px);
}

.related-post-content {
  flex: 1;
}

.related-post-title {
  font-size: 14px;
  color: #333;
  margin: 0 0 6px 0;
  line-height: 1.4;
  font-weight: 500;
}

.related-post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.related-post-thumbnail {
  width: 60px;
  height: 45px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.related-post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hot-topics-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-topic-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-radius: 8px;
}

.hot-topic-item:hover {
  background: rgba(102, 126, 234, 0.05);
  padding: 12px;
  margin: 0 -12px;
}

.hot-topic-item:last-child {
  border-bottom: none;
}

.rank-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.rank-number.rank-1 {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #8b4513;
}

.rank-number.rank-2 {
  background: linear-gradient(45deg, #c0c0c0, #e8e8e8);
  color: #666;
}

.rank-number.rank-3 {
  background: linear-gradient(45deg, #cd7f32, #daa520);
  color: white;
}

.hot-topic-link {
  flex: 1;
  text-decoration: none;
  color: inherit;
}

.hot-topic-content {
  flex: 1;
}

.hot-topic-title {
  font-size: 14px;
  color: #333;
  margin: 0 0 4px 0;
  font-weight: 500;
  line-height: 1.3;
}

.hot-topic-stats {
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 12px;
}

.heat-score,
.views {
  display: flex;
  align-items: center;
  gap: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  transform: translateY(-1px);
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #667eea;
  display: block;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    grid-template-columns: 1fr 300px;
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .sidebar {
    gap: 24px;
  }
  
  .sidebar-card {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .post-detail-page {
    padding: 12px;
  }
  
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .sidebar {
    order: -1;
    gap: 20px;
  }
  
  .sidebar::before {
    top: -16px;
    left: -16px;
    right: -16px;
    bottom: -16px;
    border-radius: 24px;
  }
  
  .author-info-card,
  .post-main-card,
  .comments-section,
  .sidebar-card {
    padding: 16px;
    border-radius: 16px;
  }
  
  .post-title {
    font-size: 1.75rem;
  }
  
  .post-title::after {
    width: 40px;
    height: 2px;
  }
  
  .post-meta {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .author-avatar-section {
    margin-bottom: 12px;
  }
  
  .author-stats-inline {
    justify-content: center;
  }
  
  .post-actions {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .comment-input-wrapper {
    flex-direction: column;
    gap: 8px;
  }
  
  .comment-avatar {
    align-self: flex-start;
  }
  
  .comment-item {
    flex-direction: column;
    gap: 12px;
    padding: 20px 0;
  }
  
  .comment-item:hover {
    padding: 20px 16px;
    margin: 0 -16px;
  }
  
  .comments-section,
  .main-content,
  .sidebar-card {
    border-radius: 20px;
  }
  
  .comments-header,
  .comment-form {
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .post-content-wrapper {
    flex-direction: column;
    gap: 16px;
  }
  
  .post-cover-right {
    flex: none;
    position: static;
  }
  
  .post-cover-container {
    max-width: 100%;
  }
  
  .post-cover-image {
    height: 160px;
  }
}

@media (max-width: 480px) {
  .post-detail-page {
    padding: 8px;
  }
  
  .content-wrapper {
    gap: 16px;
  }
  
  .author-info-card,
  .post-main-card,
  .comments-section,
  .sidebar-card {
    padding: 12px;
    border-radius: 16px;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
  
  .content-body {
    font-size: 14px;
  }
  
  .author-actions {
    flex-direction: column;
  }
  
  .comments-header,
  .comment-form {
    padding: 16px;
  }
  
  .comment-item:hover {
    padding: 16px 12px;
    margin: 0 -12px;
  }
}

/* 加载动画 */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #5a6fd8, #6a4190);
}
</style>