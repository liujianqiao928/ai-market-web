<template>
  <div class="ai-app-card card-hover" @click="handleClick">
    <!-- 应用图标 -->
    <div class="app-image">
      <div class="app-icon-container">
        <img 
          :src="app.image" 
          :alt="app.name" 
          class="app-icon" 
          @error="handleImageError"
          v-show="!imageError"
        />
        <div v-show="imageError" class="app-icon-fallback">
          <el-icon size="32" color="#409eff">
            <Monitor />
          </el-icon>
        </div>
      </div>
      <div class="app-tags">
        <el-tag 
          v-for="tag in app.tags" 
          :key="tag" 
          :type="getTagType(tag)"
          size="small"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>
    
    <!-- 应用信息 -->
    <div class="app-info">
      <h3 class="app-name">{{ app.name }}</h3>
      <p class="app-description">{{ app.description }}</p>
      
      <!-- 应用元数据 -->
      <div class="app-meta">
        <div class="app-category">
          <el-icon size="14"><Folder /></el-icon>
          <span>{{ app.category }}</span>
        </div>
        
        <div class="app-rating">
          <el-rate 
            v-model="app.rating" 
            disabled 
            show-score 
            text-color="#ff9900"
            score-template="{value}"
            size="small"
          />
        </div>
      </div>
      
      <!-- 下载量和操作 -->
      <div class="app-footer">
        <div class="app-downloads">
          <el-icon size="14"><Download /></el-icon>
          <span>{{ app.downloads }}</span>
        </div>
        
        <div class="app-actions">
          <el-button 
            type="primary" 
            size="small" 
            @click.stop="handleTry"
          >
            <el-icon><CaretRight /></el-icon>
            试用
          </el-button>
          <el-button 
            size="small" 
            @click.stop="handleFavorite"
            :class="{ 'is-favorited': isFavorited }"
          >
            <el-icon>
              <Star v-if="!isFavorited" />
              <StarFilled v-else />
            </el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Folder, 
  Download, 
  CaretRight, 
  Star, 
  StarFilled,
  Monitor 
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  app: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['click', 'try', 'favorite'])

// 响应式数据
const isFavorited = ref(false)
const imageError = ref(false)

// 计算属性
const getTagType = (tag) => {
  const tagTypes = {
    '免费': 'success',
    '付费': 'warning',
    '热门': 'danger',
    '新品': 'info',
    '专业': 'primary',
    '免费增值': 'success',
    '开发': 'info',
    '生产力': 'primary'
  }
  return tagTypes[tag] || 'info'
}

// 方法
const handleClick = () => {
  emit('click', props.app)
}

const handleTry = () => {
  emit('try', props.app)
  ElMessage.success(`正在启动 ${props.app.name}...`)
}

const handleFavorite = () => {
  isFavorited.value = !isFavorited.value
  emit('favorite', props.app, isFavorited.value)
  
  if (isFavorited.value) {
    ElMessage.success(`已收藏 ${props.app.name}`)
  } else {
    ElMessage.info(`已取消收藏 ${props.app.name}`)
  }
}

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.ai-app-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-image {
  position: relative;
  margin-bottom: 16px;
}

.app-icon-container {
  width: 64px;
  height: 64px;
  position: relative;
}

.app-icon {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.app-icon-fallback {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.app-tags {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.3;
}

.app-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.app-meta {
  margin-bottom: 16px;
}

.app-category {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.app-rating {
  display: flex;
  align-items: center;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.app-downloads {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.app-actions {
  display: flex;
  gap: 8px;
}

.is-favorited {
  color: #f56c6c;
}

/* 悬停效果 */
.ai-app-card:hover .app-icon-container {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.ai-app-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .ai-app-card {
    padding: 16px;
  }
  
  .app-icon-container {
    width: 56px;
    height: 56px;
  }
  
  .app-name {
    font-size: 16px;
  }
  
  .app-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .app-actions {
    justify-content: center;
  }
}
</style>