<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="header-background">
        <div class="gradient-overlay"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
      <div class="header-content">
        <div class="avatar-section">
          <div class="avatar-container">
            <el-avatar :size="120" :src="userInfo.avatar" class="user-avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="avatar-ring"></div>
            <div class="avatar-glow"></div>
          </div>
          <el-button v-if="isOwnProfile" size="small" class="edit-avatar-btn" @click="handleAvatarEdit">
            <el-icon><Camera /></el-icon>
          </el-button>
        </div>
        <div class="user-info">
          <h1 class="username">{{ userInfo.username }}</h1>
          <p class="user-title">{{ userInfo.title || '暂无简介' }}</p>
          <div class="user-stats">
            <div class="stat-item" v-for="(stat, index) in userStats" :key="index">
              <div class="stat-icon">
                <el-icon><component :is="stat.icon" /></el-icon>
              </div>
              <span class="stat-number">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
          <div class="user-actions" v-if="!isOwnProfile">
            <el-button type="primary" class="action-btn primary-btn" @click="handleFollow">
              <el-icon><component :is="isFollowing ? 'UserFilled' : 'User'" /></el-icon>
              {{ isFollowing ? '取消关注' : '关注' }}
            </el-button>
            <el-button class="action-btn secondary-btn" @click="handleMessage">
              <el-icon><Message /></el-icon>
              私信
            </el-button>
          </div>
          <div class="user-actions" v-else>
            <el-button class="action-btn primary-btn" @click="handleEditProfile">
              <el-icon><Edit /></el-icon>
              编辑资料
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="content-tabs">
        <el-tabs v-model="activeTab" class="profile-tabs">
          <el-tab-pane label="动态" name="posts">
            <div class="posts-section">
              <div v-if="posts.length === 0" class="empty-state">
                <div class="empty-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <h3>暂无动态</h3>
                <p>还没有发布任何内容</p>
              </div>
              <div v-else class="posts-grid">
                <div
                  v-for="post in posts"
                  :key="post.id"
                  class="post-card"
                  @click="handlePostClick(post.id)"
                >
                  <div class="post-header">
                    <span class="post-category">{{ post.category }}</span>
                    <span class="post-date">{{ formatDate(post.createdAt) }}</span>
                  </div>
                  <h3 class="post-title">{{ post.title }}</h3>
                  <p class="post-excerpt">{{ post.excerpt }}</p>
                  <div class="post-stats">
                    <span class="stat">
                      <el-icon><View /></el-icon>
                      {{ post.views }}
                    </span>
                    <span class="stat">
                      <el-icon><ChatDotRound /></el-icon>
                      {{ post.replies }}
                    </span>
                    <span class="stat">
                      <el-icon><Star /></el-icon>
                      {{ post.likes }}
                    </span>
                  </div>
                  <div class="card-glow"></div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="收藏" name="favorites">
            <div class="favorites-section">
              <div v-if="favorites.length === 0" class="empty-state">
                <div class="empty-icon">
                  <el-icon><Star /></el-icon>
                </div>
                <h3>暂无收藏</h3>
                <p>还没有收藏任何内容</p>
              </div>
              <div v-else class="favorites-grid">
                <div
                  v-for="item in favorites"
                  :key="item.id"
                  class="favorite-card"
                  @click="handleFavoriteClick(item)"
                >
                  <div class="favorite-header">
                    <div class="favorite-type">{{ item.type }}</div>
                    <div class="favorite-icon">
                      <el-icon><Star /></el-icon>
                    </div>
                  </div>
                  <h3 class="favorite-title">{{ item.title }}</h3>
                  <p class="favorite-description">{{ item.description }}</p>
                  <div class="favorite-date">{{ formatDate(item.createdAt) }}</div>
                  <div class="card-glow"></div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="关于" name="about">
            <div class="about-section">
              <div class="info-card">
                <div class="card-header">
                  <h3>个人信息</h3>
                  <div class="header-icon">
                    <el-icon><User /></el-icon>
                  </div>
                </div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-icon">
                      <el-icon><User /></el-icon>
                    </div>
                    <div class="info-content">
                      <label>用户名</label>
                      <span>{{ userInfo.username }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon">
                      <el-icon><Message /></el-icon>
                    </div>
                    <div class="info-content">
                      <label>邮箱</label>
                      <span>{{ userInfo.email || '未设置' }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon">
                      <el-icon><Calendar /></el-icon>
                    </div>
                    <div class="info-content">
                      <label>注册时间</label>
                      <span>{{ formatDate(userInfo.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon">
                      <el-icon><Clock /></el-icon>
                    </div>
                    <div class="info-content">
                      <label>最后活跃</label>
                      <span>{{ formatDate(userInfo.lastActiveAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="info-card" v-if="userInfo.bio">
                <div class="card-header">
                  <h3>个人简介</h3>
                  <div class="header-icon">
                    <el-icon><Document /></el-icon>
                  </div>
                </div>
                <p class="bio-content">{{ userInfo.bio }}</p>
              </div>
              
              <div class="info-card" v-if="userInfo.skills && userInfo.skills.length > 0">
                <div class="card-header">
                  <h3>技能标签</h3>
                  <div class="header-icon">
                    <el-icon><Trophy /></el-icon>
                  </div>
                </div>
                <div class="skills-tags">
                  <el-tag
                    v-for="skill in userInfo.skills"
                    :key="skill"
                    class="skill-tag"
                    effect="light"
                  >
                    {{ skill }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 编辑资料对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑资料"
      width="600px"
      :before-close="handleEditCancel"
      class="edit-dialog"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="个人简介" prop="bio">
          <el-input
            v-model="editForm.bio"
            type="textarea"
            :rows="4"
            placeholder="请输入个人简介"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="职业标题" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入职业标题" />
        </el-form-item>
        <el-form-item label="技能标签" prop="skills">
          <el-select
            v-model="editForm.skills"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入技能标签"
            class="skills-select"
          >
            <el-option
              v-for="skill in popularSkills"
              :key="skill"
              :label="skill"
              :value="skill"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleEditCancel">取消</el-button>
          <el-button type="primary" @click="handleEditSave" :loading="saving">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  User, Camera, Message, Edit, View, ChatDotRound, Star, Document, Calendar, Clock, Trophy, UserFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('posts')
const editDialogVisible = ref(false)
const editFormRef = ref()
const saving = ref(false)
const isFollowing = ref(false)

const userInfo = ref({
  id: '',
  username: '',
  email: '',
  avatar: '',
  title: '',
  bio: '',
  skills: [],
  postsCount: 0,
  followersCount: 0,
  followingCount: 0,
  likesCount: 0,
  createdAt: '',
  lastActiveAt: ''
})

const posts = ref([])
const favorites = ref([])

const editForm = ref({
  username: '',
  bio: '',
  title: '',
  skills: []
})

const popularSkills = ref([
  'JavaScript', 'Python', 'Vue.js', 'React', 'Node.js',
  'AI/ML', '数据分析', '产品设计', 'UI/UX', '项目管理'
])

const editRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应在2-20个字符之间', trigger: 'blur' }
  ]
}

const isOwnProfile = computed(() => {
  return !route.params.id || route.params.id === userStore.user?.id
})

const userStats = computed(() => [
  { icon: 'Document', value: userInfo.value.postsCount || 0, label: '帖子' },
  { icon: 'User', value: userInfo.value.followersCount || 0, label: '粉丝' },
  { icon: 'UserFilled', value: userInfo.value.followingCount || 0, label: '关注' },
  { icon: 'Star', value: userInfo.value.likesCount || 0, label: '获赞' }
])

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const handleAvatarEdit = () => {
  ElMessage.info('头像编辑功能开发中')
}

const handleFollow = () => {
  isFollowing.value = !isFollowing.value
  ElMessage.success(isFollowing.value ? '关注成功' : '取消关注成功')
}

const handleMessage = () => {
  ElMessage.info('私信功能开发中')
}

const handleEditProfile = () => {
  editForm.value = {
    username: userInfo.value.username,
    bio: userInfo.value.bio || '',
    title: userInfo.value.title || '',
    skills: [...(userInfo.value.skills || [])]
  }
  editDialogVisible.value = true
}

const handleEditCancel = () => {
  editDialogVisible.value = false
}

const handleEditSave = async () => {
  try {
    await editFormRef.value.validate()
    
    saving.value = true
    
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新用户信息
    Object.assign(userInfo.value, editForm.value)
    
    ElMessage.success('资料更新成功')
    editDialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    saving.value = false
  }
}

const handlePostClick = (postId) => {
  router.push(`/forum/post/${postId}`)
}

const handleFavoriteClick = (item) => {
  if (item.type === '帖子') {
    router.push(`/forum/post/${item.id}`)
  } else if (item.type === 'AI应用') {
    router.push(`/ai/${item.id}`)
  }
}

const fetchUserProfile = async () => {
  try {
    const userId = route.params.id || userStore.user?.id
    
    // 模拟获取用户信息
    await new Promise(resolve => setTimeout(resolve, 500))
    
    userInfo.value = {
      id: userId,
      username: isOwnProfile.value ? userStore.user?.username : '示例用户',
      email: isOwnProfile.value ? userStore.user?.email : 'user@example.com',
      avatar: '',
      title: 'AI开发者',
      bio: '热爱AI技术，专注于机器学习和深度学习应用开发。',
      skills: ['Python', 'TensorFlow', 'Vue.js', 'Node.js'],
      postsCount: 42,
      followersCount: 128,
      followingCount: 89,
      likesCount: 356,
      createdAt: '2023-01-15',
      lastActiveAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

const fetchUserPosts = async () => {
  try {
    // 模拟获取用户帖子
    await new Promise(resolve => setTimeout(resolve, 300))
    
    posts.value = [
      {
        id: '1',
        title: 'Vue 3 + TypeScript 最佳实践分享',
        excerpt: '在实际项目中使用Vue 3和TypeScript的一些心得体会...',
        category: '技术分享',
        views: 1234,
        replies: 23,
        likes: 45,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        title: 'AI绘画工具推荐与使用技巧',
        excerpt: '分享几个好用的AI绘画工具，以及一些实用的提示词技巧...',
        category: '工具推荐',
        views: 2156,
        replies: 67,
        likes: 89,
        createdAt: '2024-01-10'
      }
    ]
  } catch (error) {
    console.error('获取用户帖子失败:', error)
  }
}

const fetchUserFavorites = async () => {
  try {
    // 模拟获取用户收藏
    await new Promise(resolve => setTimeout(resolve, 300))
    
    favorites.value = [
      {
        id: '1',
        type: 'AI应用',
        title: 'ChatGPT Plus',
        description: '强大的对话AI助手',
        createdAt: '2024-01-12'
      },
      {
        id: '2',
        type: '帖子',
        title: '机器学习入门指南',
        description: '适合初学者的机器学习教程',
        createdAt: '2024-01-08'
      }
    ]
  } catch (error) {
    console.error('获取用户收藏失败:', error)
  }
}

onMounted(() => {
  fetchUserProfile()
  fetchUserPosts()
  fetchUserFavorites()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  overflow-x: hidden;
}

.profile-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.profile-header {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 20px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.header-background {
  height: 200px;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.8) 0%, 
    rgba(118, 75, 162, 0.8) 50%,
    rgba(240, 147, 251, 0.8) 100%);
  position: relative;
  overflow: hidden;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    transparent 50%, 
    rgba(255, 255, 255, 0.1) 100%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 40%;
  left: 70%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.header-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: flex-end;
  gap: 32px;
  transform: translateY(-60px);
  z-index: 2;
}

.avatar-section {
  position: relative;
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.user-avatar {
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 0 0 4px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.3),
    0 0 0 6px rgba(255, 255, 255, 0.2);
}

.avatar-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid transparent;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
  background-clip: border-box;
  animation: rotate 3s linear infinite;
  z-index: 1;
}

.avatar-glow {
  position: absolute;
  top: -12px;
  left: -12px;
  right: -12px;
  bottom: -12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  animation: pulse 2s ease-in-out infinite;
  z-index: 0;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.edit-avatar-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 4;
}

.edit-avatar-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 1);
}

.user-info {
  flex: 1;
  padding-bottom: 32px;
  color: white;
}

.username {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-title {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 24px 0;
  font-weight: 300;
}

.user-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 80px;
}

.stat-item:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 20px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.user-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  backdrop-filter: blur(10px);
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 1;
}

.content-tabs {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.profile-tabs :deep(.el-tabs__header) {
  margin-bottom: 32px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.profile-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.profile-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  padding: 0 24px;
  margin-right: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.profile-tabs :deep(.el-tabs__item:hover) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.profile-tabs :deep(.el-tabs__item.is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.profile-tabs :deep(.el-tabs__active-bar) {
  display: none;
}

.empty-state {
  padding: 60px 40px;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #374151;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
  color: #9ca3af;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.post-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.95);
}

.post-card:hover .card-glow {
  opacity: 1;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.post-category {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.post-date {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.post-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #1f2937;
  line-height: 1.4;
}

.post-excerpt {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #9ca3af;
  font-weight: 500;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.favorite-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.95);
}

.favorite-card:hover .card-glow {
  opacity: 1;
}

.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.favorite-type {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.favorite-icon {
  color: #fbbf24;
  font-size: 16px;
}

.favorite-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.favorite-description {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.favorite-date {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
}

.about-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.header-icon {
  color: #667eea;
  font-size: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(241, 245, 249, 0.9);
  transform: translateX(4px);
}

.info-icon {
  color: #667eea;
  font-size: 18px;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-content label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-content span {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.bio-content {
  font-size: 15px;
  line-height: 1.7;
  color: #374151;
  margin: 0;
  padding: 20px;
  background: rgba(248, 250, 252, 0.6);
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-tag {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1d4ed8;
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.skills-select {
  width: 100%;
}

.edit-dialog :deep(.el-dialog) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .profile-page {
    margin: 0;
  }
  
  .profile-header {
    margin: 10px;
    border-radius: 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    transform: translateY(-40px);
    padding: 0 20px;
  }
  
  .user-stats {
    justify-content: center;
    gap: 20px;
  }
  
  .stat-item {
    min-width: 60px;
    padding: 12px;
  }
  
  .posts-grid,
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-content {
    padding: 0 20px;
  }
  
  .content-tabs {
    padding: 20px;
    border-radius: 16px;
  }
  
  .username {
    font-size: 28px;
  }
  
  .user-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .user-stats {
    gap: 12px;
  }
  
  .stat-item {
    min-width: 50px;
    padding: 8px;
  }
  
  .stat-number {
    font-size: 18px;
  }
  
  .stat-label {
    font-size: 10px;
  }
}
</style>