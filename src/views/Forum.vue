<template>
  <div class="forum-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">技术论坛</h1>
          <p class="page-subtitle">与AI开发者交流经验，分享技术见解</p>
        </div>
        
        <div class="header-actions">
          <el-button type="primary" size="large" @click="handleCreatePost">
            <el-icon><EditPen /></el-icon>
            发布帖子
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 论坛导航 -->
    <div class="forum-nav">
      <div class="nav-content">
        <div class="nav-tabs">
          <el-button
            v-for="tab in forumTabs"
            :key="tab.value"
            :type="activeTab === tab.value ? 'primary' : 'default'"
            :plain="activeTab !== tab.value"
            @click="handleTabChange(tab.value)"
          >
            <el-icon><component :is="tab.icon" /></el-icon>
            {{ tab.label }}
            <el-badge v-if="tab.count" :value="tab.count" class="tab-badge" />
          </el-button>
        </div>
        
        <div class="nav-filters">
          <el-select
            v-model="sortBy"
            placeholder="排序方式"
            size="default"
            @change="handleSortChange"
          >
            <el-option label="最新回复" value="latest" />
            <el-option label="最新发布" value="newest" />
            <el-option label="最多回复" value="replies" />
            <el-option label="最多点赞" value="likes" />
          </el-select>
          
          <el-input
            v-model="searchQuery"
            placeholder="搜索帖子..."
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    
    <!-- 帖子列表 -->
    <div class="forum-content">
      <div class="content-container">
        <!-- 置顶帖子 -->
        <div v-if="pinnedPosts.length > 0" class="pinned-section">
          <h3 class="section-title">
            <el-icon><Top /></el-icon>
            置顶帖子
          </h3>
          <div class="posts-list">
            <PostItem
              v-for="post in pinnedPosts"
              :key="post.id"
              :post="post"
              :pinned="true"
              @click="handlePostClick"
              @like="handlePostLike"
              @reply="handlePostReply"
            />
          </div>
        </div>
        
        <!-- 普通帖子 -->
        <div class="posts-section">
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-container">
            <el-skeleton :rows="5" animated />
          </div>
          
          <!-- 帖子列表 -->
          <div v-else-if="filteredPosts.length > 0" class="posts-list">
            <PostItem
              v-for="post in paginatedPosts"
              :key="post.id"
              :post="post"
              @click="handlePostClick"
              @like="handlePostLike"
              @reply="handlePostReply"
            />
          </div>
          
          <!-- 空状态 -->
          <div v-else class="empty-state">
            <el-empty description="暂无帖子">
              <el-button type="primary" @click="handleCreatePost">发布第一个帖子</el-button>
            </el-empty>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="!loading && filteredPosts.length > 0" class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            :total="totalPosts"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      
      <!-- 侧边栏 -->
      <div class="sidebar">
        <!-- 热门标签 -->
        <div class="sidebar-card">
          <h3 class="card-title">热门标签</h3>
          <div class="tags-container">
            <el-tag
              v-for="tag in popularTags"
              :key="tag.name"
              :type="tag.type"
              class="tag-item"
              @click="handleTagClick(tag.name)"
            >
              {{ tag.name }}
              <el-badge :value="tag.count" class="tag-count" />
            </el-tag>
          </div>
        </div>
        
        <!-- 活跃用户 -->
        <div class="sidebar-card">
          <h3 class="card-title">活跃用户</h3>
          <div class="users-list">
            <div
              v-for="user in activeUsers"
              :key="user.id"
              class="user-item"
              @click="handleUserClick(user)"
            >
              <el-avatar :size="32" :src="user.avatar">
                {{ user.username.charAt(0) }}
              </el-avatar>
              <div class="user-info">
                <div class="username">{{ user.username }}</div>
                <div class="user-stats">{{ user.posts }}帖 · {{ user.replies }}回复</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 论坛统计 -->
        <div class="sidebar-card">
          <h3 class="card-title">论坛统计</h3>
          <div class="stats-list">
            <div class="stat-item">
              <span class="stat-label">总帖子数</span>
              <span class="stat-value">{{ forumStats.totalPosts }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">总用户数</span>
              <span class="stat-value">{{ forumStats.totalUsers }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">今日新帖</span>
              <span class="stat-value">{{ forumStats.todayPosts }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">在线用户</span>
              <span class="stat-value">{{ forumStats.onlineUsers }}</span>
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
import { 
  EditPen, 
  Search, 
  Top, 
  ChatDotRound, 
  QuestionFilled, 
  Share, 
  TrendCharts,
  Star
} from '@element-plus/icons-vue'
import PostItem from '@/components/PostItem.vue'

const router = useRouter()

// 响应式数据
const loading = ref(true)
const activeTab = ref('all')
const sortBy = ref('latest')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 论坛标签页
const forumTabs = ref([
  { label: '全部', value: 'all', icon: 'ChatDotRound', count: 0 },
  { label: '问答', value: 'qa', icon: 'QuestionFilled', count: 15 },
  { label: '分享', value: 'share', icon: 'Share', count: 8 },
  { label: '讨论', value: 'discussion', icon: 'TrendCharts', count: 12 },
  { label: '精华', value: 'featured', icon: 'Star', count: 5 }
])

// 帖子数据
const posts = ref([])
const pinnedPosts = ref([])

// 侧边栏数据
const popularTags = ref([
  { name: 'ChatGPT', count: 45, type: 'primary' },
  { name: '机器学习', count: 38, type: 'success' },
  { name: 'Python', count: 32, type: 'warning' },
  { name: '深度学习', count: 28, type: 'danger' },
  { name: 'TensorFlow', count: 25, type: 'info' },
  { name: 'AI绘画', count: 22, type: 'primary' },
  { name: '自然语言处理', count: 18, type: 'success' },
  { name: 'OpenAI', count: 15, type: 'warning' }
])

const activeUsers = ref([
  { id: 1, username: 'AI研究员', avatar: '', posts: 45, replies: 128 },
  { id: 2, username: '机器学习专家', avatar: '', posts: 38, replies: 95 },
  { id: 3, username: 'Python开发者', avatar: '', posts: 32, replies: 87 },
  { id: 4, username: '深度学习爱好者', avatar: '', posts: 28, replies: 76 },
  { id: 5, username: 'AI产品经理', avatar: '', posts: 25, replies: 65 }
])

const forumStats = ref({
  totalPosts: 1248,
  totalUsers: 3567,
  todayPosts: 23,
  onlineUsers: 156
})

// 计算属性
const filteredPosts = computed(() => {
  let result = [...posts.value]
  
  // 标签页过滤
  if (activeTab.value !== 'all') {
    result = result.filter(post => post.category === activeTab.value)
  }
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 排序
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'replies':
      result.sort((a, b) => b.replies - a.replies)
      break
    case 'likes':
      result.sort((a, b) => b.likes - a.likes)
      break
    case 'latest':
    default:
      result.sort((a, b) => new Date(b.lastReplyAt) - new Date(a.lastReplyAt))
      break
  }
  
  return result
})

const totalPosts = computed(() => filteredPosts.value.length)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPosts.value.slice(start, end)
})

// 方法
const loadPosts = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成模拟数据
    posts.value = generateMockPosts()
    pinnedPosts.value = generateMockPinnedPosts()
    
    // 更新标签页计数
    updateTabCounts()
  } catch (error) {
    ElMessage.error('加载帖子失败')
  } finally {
    loading.value = false
  }
}

const generateMockPosts = () => {
  const categories = ['qa', 'share', 'discussion', 'featured']
  const titles = [
    '如何优化深度学习模型的训练速度？',
    '分享一个有趣的AI项目：智能聊天机器人',
    'ChatGPT在实际项目中的应用经验',
    '机器学习算法选择的几个关键因素',
    'Python数据处理的最佳实践',
    'AI绘画工具对比评测',
    '自然语言处理的最新进展讨论',
    'TensorFlow vs PyTorch：选择哪个？',
    '推荐系统算法实现心得',
    '计算机视觉项目开发经验分享'
  ]
  
  const mockPosts = []
  
  for (let i = 0; i < 25; i++) {
    const category = categories[i % categories.length]
    const title = titles[i % titles.length]
    
    mockPosts.push({
      id: i + 1,
      title,
      content: `这是关于${title}的详细内容...`,
      category,
      tags: ['AI', '机器学习', 'Python'],
      author: {
        id: i + 1,
        username: `用户${i + 1}`,
        avatar: ''
      },
      likes: Math.floor(Math.random() * 50),
      replies: Math.floor(Math.random() * 20),
      views: Math.floor(Math.random() * 500) + 100,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastReplyAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      pinned: false,
      featured: category === 'featured'
    })
  }
  
  return mockPosts
}

const generateMockPinnedPosts = () => {
  return [
    {
      id: 999,
      title: '论坛使用指南和规则说明',
      content: '欢迎来到AI超市技术论坛...',
      category: 'announcement',
      tags: ['公告', '规则'],
      author: {
        id: 0,
        username: '管理员',
        avatar: ''
      },
      likes: 128,
      replies: 45,
      views: 2580,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastReplyAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      pinned: true,
      featured: false
    }
  ]
}

const updateTabCounts = () => {
  forumTabs.value.forEach(tab => {
    if (tab.value === 'all') {
      tab.count = posts.value.length
    } else {
      tab.count = posts.value.filter(post => post.category === tab.value).length
    }
  })
}

const handleTabChange = (tab) => {
  activeTab.value = tab
  currentPage.value = 1
}

const handleSortChange = () => {
  currentPage.value = 1
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleCreatePost = () => {
  // 检查登录状态
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  router.push('/forum/create')
}

const handlePostClick = (post) => {
  router.push(`/forum/post/${post.id}`)
}

const handlePostLike = (post) => {
  ElMessage.success(`已${post.liked ? '取消点赞' : '点赞'}`)
}

const handlePostReply = (post) => {
  router.push(`/forum/post/${post.id}#reply`)
}

const handleTagClick = (tagName) => {
  searchQuery.value = tagName
  currentPage.value = 1
}

const handleUserClick = (user) => {
  ElMessage.info(`查看用户 ${user.username} 的详细信息`)
}

// 生命周期
onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.forum-page {
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

.forum-nav {
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-tabs {
  display: flex;
  gap: 8px;
}

.tab-badge {
  margin-left: 8px;
}

.nav-filters {
  display: flex;
  gap: 12px;
  align-items: center;
}

.forum-content {
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

.pinned-section {
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  padding: 16px 20px;
  margin: 0;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.posts-list {
  /* 帖子列表样式由 PostItem 组件处理 */
}

.loading-container {
  padding: 24px;
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

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  cursor: pointer;
  position: relative;
}

.tag-count {
  margin-left: 4px;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-item:hover {
  background: #f3f4f6;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.user-stats {
  font-size: 12px;
  color: #6b7280;
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
  
  .nav-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .nav-tabs {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .forum-content {
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
  
  .forum-nav {
    padding: 12px 16px;
  }
  
  .nav-filters {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }
}
</style>