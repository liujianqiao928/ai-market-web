<template>
  <div class="create-post-page">
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/forum' }">论坛</el-breadcrumb-item>
        <el-breadcrumb-item>发布帖子</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="page-title">发布新帖子</h1>
      <p class="page-subtitle">分享你的想法和经验</p>
    </div>

    <div class="form-container">
      <el-form
        ref="postFormRef"
        :model="postForm"
        :rules="formRules"
        label-width="100px"
        class="post-form"
      >
        <el-form-item label="帖子标题" prop="title">
          <el-input
            v-model="postForm.title"
            placeholder="请输入帖子标题"
            maxlength="100"
            show-word-limit
            clearable
          />
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-select v-model="postForm.category" placeholder="请选择分类">
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="postForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入标签"
            class="tag-select"
          >
            <el-option
              v-for="tag in popularTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
          <div class="tag-hint">最多选择5个标签，可以输入自定义标签</div>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <div class="editor-container">
            <div class="editor-toolbar">
              <el-button-group>
                <el-button size="small" @click="insertFormat('**', '**')">
                  <el-icon><Bold /></el-icon>
                  粗体
                </el-button>
                <el-button size="small" @click="insertFormat('*', '*')">
                  <el-icon><Italic /></el-icon>
                  斜体
                </el-button>
                <el-button size="small" @click="insertFormat('`', '`')">
                  <el-icon><Code /></el-icon>
                  代码
                </el-button>
                <el-button size="small" @click="insertFormat('\n```\n', '\n```\n')">
                  <el-icon><Document /></el-icon>
                  代码块
                </el-button>
              </el-button-group>
              <el-button-group>
                <el-button size="small" @click="insertFormat('\n# ', '')">
                  H1
                </el-button>
                <el-button size="small" @click="insertFormat('\n## ', '')">
                  H2
                </el-button>
                <el-button size="small" @click="insertFormat('\n### ', '')">
                  H3
                </el-button>
              </el-button-group>
              <el-button-group>
                <el-button size="small" @click="insertFormat('\n- ', '')">
                  <el-icon><List /></el-icon>
                  列表
                </el-button>
                <el-button size="small" @click="insertFormat('[', '](url)')">
                  <el-icon><Link /></el-icon>
                  链接
                </el-button>
                <el-button size="small" @click="handleImageUpload">
                  <el-icon><Picture /></el-icon>
                  图片
                </el-button>
              </el-button-group>
            </div>
            <el-input
              ref="contentTextarea"
              v-model="postForm.content"
              type="textarea"
              :rows="15"
              placeholder="请输入帖子内容，支持Markdown格式"
              maxlength="10000"
              show-word-limit
              class="content-editor"
            />
          </div>
          <div class="editor-hint">
            支持Markdown语法，可以使用上方工具栏快速插入格式
          </div>
        </el-form-item>

        <el-form-item label="预览">
          <div class="content-preview" v-if="postForm.content">
            <div class="preview-content" v-html="renderedContent"></div>
          </div>
          <div v-else class="preview-placeholder">
            输入内容后可在此预览效果
          </div>
        </el-form-item>

        <el-form-item>
          <div class="form-actions">
            <el-button @click="handleCancel">取消</el-button>
            <el-button @click="handleSaveDraft">保存草稿</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="submitting">
              发布帖子
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Bold, Italic, Code, Document, List, Link, Picture } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const postFormRef = ref()
const contentTextarea = ref()
const submitting = ref(false)

const postForm = ref({
  title: '',
  category: '',
  tags: [],
  content: ''
})

const categories = ref([
  { label: '技术讨论', value: '技术讨论' },
  { label: '经验分享', value: '经验分享' },
  { label: '问题求助', value: '问题求助' },
  { label: '资源分享', value: '资源分享' },
  { label: '行业动态', value: '行业动态' },
  { label: '工具推荐', value: '工具推荐' }
])

const popularTags = ref([
  'ChatGPT', 'AI绘画', '机器学习', '深度学习', 'Python', 'JavaScript',
  'Vue.js', 'React', 'Node.js', 'TensorFlow', 'PyTorch', '自然语言处理',
  '计算机视觉', '数据科学', '算法', '开源项目'
])

const formRules = {
  title: [
    { required: true, message: '请输入帖子标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度应在5-100个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入帖子内容', trigger: 'blur' },
    { min: 10, message: '内容至少需要10个字符', trigger: 'blur' }
  ],
  tags: [
    { type: 'array', max: 5, message: '最多选择5个标签', trigger: 'change' }
  ]
}

// 简单的Markdown渲染（实际项目中建议使用专业的Markdown库）
const renderedContent = computed(() => {
  let content = postForm.value.content
  
  // 基本的Markdown转换
  content = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n/g, '<br>')
  
  // 处理列表
  content = content.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
  
  return content
})

const insertFormat = (before, after) => {
  const textarea = contentTextarea.value.textarea
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = postForm.value.content.substring(start, end)
  
  const newText = before + selectedText + after
  const beforeText = postForm.value.content.substring(0, start)
  const afterText = postForm.value.content.substring(end)
  
  postForm.value.content = beforeText + newText + afterText
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(
      start + before.length,
      start + before.length + selectedText.length
    )
  })
}

const handleImageUpload = () => {
  ElMessage.info('图片上传功能开发中')
}

const handleCancel = async () => {
  if (postForm.value.title || postForm.value.content) {
    try {
      await ElMessageBox.confirm(
        '确定要取消吗？未保存的内容将丢失。',
        '确认取消',
        {
          confirmButtonText: '确定',
          cancelButtonText: '继续编辑',
          type: 'warning'
        }
      )
      router.back()
    } catch {
      // 用户取消
    }
  } else {
    router.back()
  }
}

const handleSaveDraft = () => {
  localStorage.setItem('post_draft', JSON.stringify(postForm.value))
  ElMessage.success('草稿已保存')
}

const handleSubmit = async () => {
  try {
    await postFormRef.value.validate()
    
    submitting.value = true
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 清除草稿
    localStorage.removeItem('post_draft')
    
    ElMessage.success('帖子发布成功！')
    router.push('/forum')
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    submitting.value = false
  }
}

// 加载草稿
const loadDraft = () => {
  const draft = localStorage.getItem('post_draft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      Object.assign(postForm.value, draftData)
      ElMessage.info('已加载上次保存的草稿')
    } catch (error) {
      console.error('加载草稿失败:', error)
    }
  }
}

// 页面加载时尝试加载草稿
loadDraft()
</script>

<style scoped>
.create-post-page {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin: 16px 0 8px 0;
  color: #1f2937;
}

.page-subtitle {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-form {
  max-width: 800px;
}

.tag-select {
  width: 100%;
}

.tag-hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  background: #f5f7fa;
  padding: 8px 12px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.content-editor {
  border: none;
}

.content-editor :deep(.el-textarea__inner) {
  border: none;
  border-radius: 0;
  resize: vertical;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.editor-hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.content-preview {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #f9fafb;
  max-height: 400px;
  overflow-y: auto;
}

.preview-content {
  line-height: 1.6;
  color: #374151;
}

.preview-content :deep(h1) {
  font-size: 24px;
  font-weight: 600;
  margin: 16px 0 12px 0;
  color: #1f2937;
}

.preview-content :deep(h2) {
  font-size: 20px;
  font-weight: 600;
  margin: 16px 0 12px 0;
  color: #1f2937;
}

.preview-content :deep(h3) {
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 12px 0;
  color: #1f2937;
}

.preview-content :deep(ul) {
  margin: 12px 0;
  padding-left: 20px;
}

.preview-content :deep(li) {
  margin-bottom: 4px;
}

.preview-content :deep(code) {
  background: #f3f4f6;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
}

.preview-content :deep(strong) {
  font-weight: 600;
}

.preview-content :deep(em) {
  font-style: italic;
}

.preview-content :deep(a) {
  color: #3b82f6;
  text-decoration: none;
}

.preview-content :deep(a:hover) {
  text-decoration: underline;
}

.preview-placeholder {
  color: #9ca3af;
  font-style: italic;
  text-align: center;
  padding: 40px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .create-post-page {
    padding: 16px;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .editor-toolbar {
    flex-direction: column;
    gap: 8px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .el-button {
    width: 100%;
  }
}
</style>