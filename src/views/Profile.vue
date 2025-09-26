<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="avatar-section">
          <el-avatar :size="120" :src="userInfo.avatar" class="user-avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <el-button v-if="isOwnProfile" size="small" class="edit-avatar-btn" @click="handleAvatarEdit">
            <el-icon><Camera /></el-icon>
          </el-button>
        </div>
        <div class="user-info">
          <h1 class="username">{{ userInfo.username }}</h1>
          <p class="user-title">{{ userInfo.title || '暂无简介' }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-number">{{ userInfo.postsCount || 0 }}</span>
              <span class="stat-label">帖子</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ userInfo.followersCount || 0 }}</span>
              <span class="stat-label">粉丝</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ userInfo.followingCount || 0 }}</span>
              <span class="stat-label">关注</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ userInfo.likesCount || 0 }}</span>
              <span class="stat-label">获赞</span>
            </div>
          </div>
          <div class="user-actions" v-if="!isOwnProfile">
            <el-button type="primary" @click="handleFollow">
              {{ isFollowing ? '取消关注' : '关注' }}
            </el-button>
            <el-button @click="handleMessage">
              <el-icon><Message /></el-icon>
              私信
            </el-button>
          </div>
          <div class="user-actions" v-else>
            <el-button @click="handleEditProfile">
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
                <el-empty description="暂无动态" />
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
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="收藏" name="favorites">
            <div class="favorites-section">
              <div v-if="favorites.length === 0" class="empty-state">
                <el-empty description="暂无收藏" />
              </div>
              <div v-else class="favorites-grid">
                <div
                  v-for="item in favorites"
                  :key="item.id"
                  class="favorite-card"
                  @click="handleFavoriteClick(item)"
                >
                  <div class="favorite-type">{{ item.type }}</div>
                  <h3 class="favorite-title">{{ item.title }}</h3>
                  <p class="favorite-description">{{ item.description }}</p>
                  <div class="favorite-date">{{ formatDate(item.createdAt) }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="关于" name="about">
            <div class="about-section">
              <div class="info-card">
                <h3>个人信息</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <label>用户名</label>
                    <span>{{ userInfo.username }}</span>
                  </div>
                  <div class="info-item">
                    <label>邮箱</label>
                    <span>{{ userInfo.email || '未设置' }}</span>
                  </div>
                  <div class="info-item">
                    <label>注册时间</label>
                    <span>{{ formatDate(userInfo.createdAt) }}</span>
                  </div>
                  <div class="info-item">
                    <label>最后活跃</label>
                    <span>{{ formatDate(userInfo.lastActiveAt) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="info-card" v-if="userInfo.bio">
                <h3>个人简介</h3>
                <p class="bio-content">{{ userInfo.bio }}</p>
              </div>
              
              <div class="info-card" v-if="userInfo.skills && userInfo.skills.length > 0">
                <h3>技能标签</h3>
                <div class="skills-tags">
                  <el-tag
                    v-for="skill in userInfo.skills"
                    :key="skill"
                    class="skill-tag"
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
  User, Camera, Message, Edit, View, ChatDotRound, Star
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
  background: #f5f7fa;
}

.profile-header {
  position: relative;
  background: white;
  margin-bottom: 24px;
}

.header-background {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  transform: translateY(-60px);
}

.avatar-section {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding: 0;
  background: white;
  border: 2px solid #e5e7eb;
}

.user-info {
  flex: 1;
  padding-bottom: 24px;
}

.username {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.user-title {
  font-size: 18px;
  color: #6b7280;
  margin: 0 0 16px 0;
}

.user-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.user-actions {
  display: flex;
  gap: 12px;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.content-tabs {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-tabs :deep(.el-tabs__header) {
  margin-bottom: 24px;
}

.empty-state {
  padding: 40px;
  text-align: center;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.post-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.post-category {
  background: #3b82f6;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.post-date {
  font-size: 12px;
  color: #6b7280;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
  line-height: 1.4;
}

.post-excerpt {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.favorite-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
}

.favorite-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.favorite-type {
  background: #10b981;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  display: inline-block;
  margin-bottom: 8px;
}

.favorite-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #1f2937;
}

.favorite-description {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.favorite-date {
  font-size: 11px;
  color: #9ca3af;
}

.about-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.info-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1f2937;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.info-item span {
  font-size: 14px;
  color: #1f2937;
}

.bio-content {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  margin: 0;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.skills-select {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    transform: translateY(-40px);
  }
  
  .user-stats {
    justify-content: center;
  }
  
  .posts-grid,
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-content {
    padding: 0 16px;
  }
}
</style>