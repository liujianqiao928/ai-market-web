<template>
  <div class="create-post-page">
    <!-- AI写作助手按钮 - 移到最顶部 -->
    <div class="ai-assistant-container">
      <button 
        @click="showAIWritingDialog" 
        class="ai-assistant-btn"
        type="button"
      >
        <div class="ai-btn-content">
          <el-icon class="ai-icon"><Star /></el-icon>
          <span class="ai-text">AI 写作助手</span>
          <div class="ai-glow"></div>
        </div>
      </button>
    </div>

    <div class="form-container">

      <el-form
        ref="postFormRef"
        :model="postForm"
        :rules="formRules"
        class="post-form"
      >
        <!-- 文章内容编辑器 - 最重要的部分，放在最上方 -->
        <div class="form-section editor-section">
          <div class="section-header">
            <h3 class="section-title">
              <el-icon><Document /></el-icon>
              文章内容
            </h3>
            <div class="editor-actions">
              <el-upload
                :before-upload="handleFileUpload"
                accept=".md,.html,.htm"
                :show-file-list="false"
                class="file-upload-btn"
              >
                <el-button size="small" type="primary" plain>
                  <el-icon><Upload /></el-icon>
                  导入文件
                </el-button>
              </el-upload>
              <el-button 
                size="small" 
                @click="togglePreview"
                :type="showPreview ? 'primary' : 'default'"
              >
                <el-icon><View /></el-icon>
                {{ showPreview ? '编辑' : '预览' }}
              </el-button>
            </div>
          </div>
          
          <div class="editor-container">
            <div class="editor-toolbar">
              <el-button 
                type="primary" 
                size="small" 
                @click="togglePreview"
                :icon="previewMode ? Edit : View"
              >
                {{ previewMode ? '编辑' : '预览' }}
              </el-button>
              
              <el-divider direction="vertical" />
              
              <el-button 
                size="small" 
                @click="insertMarkdown('**粗体**')"
              >
                <strong>B</strong>
              </el-button>
              
              <el-button 
                size="small" 
                @click="insertMarkdown('*斜体*')"
              >
                <em>I</em>
              </el-button>
              
              <el-button 
                size="small" 
                @click="insertMarkdown('# 标题')"
              >
                H1
              </el-button>
              
              <el-button 
                size="small" 
                @click="insertMarkdown('- 列表项')"
              >
                列表
              </el-button>
              
              <el-button 
                size="small" 
                @click="insertMarkdown('[链接文本](URL)')"
              >
                链接
              </el-button>
              
              <el-divider direction="vertical" />
              
              <el-upload
                ref="fileUploadRef"
                :show-file-list="false"
                :before-upload="handleFileUpload"
                accept=".md,.html,.htm"
                style="display: inline-block;"
              >
                <el-button 
                  size="small" 
                  type="success"
                  :icon="Upload"
                >
                  导入文件
                </el-button>
              </el-upload>
              
              <el-button 
                size="small" 
                type="warning"
                @click="clearContent"
                :icon="Delete"
              >
                清空
              </el-button>
            </div>
            
            <!-- 实时预览模式：编辑器和预览并排显示 -->
            <div class="editor-content-container">
              <!-- 编辑器区域 -->
              <div class="editor-area" :class="{ 'full-width': showPreview === false, 'half-width': showPreview === true }">
                <!-- CodeMirror编辑器容器 -->
                <div class="code-editor-container">
                  <div class="editor-toolbar">
                    <div class="toolbar-left">
                      <el-button size="small" @click="insertMarkdown('**粗体**')" type="text">
                        <el-icon><Bold /></el-icon>
                        粗体
                      </el-button>
                      <el-button size="small" @click="insertMarkdown('*斜体*')" type="text">
                        <el-icon><Italic /></el-icon>
                        斜体
                      </el-button>
                      <el-button size="small" @click="insertMarkdown('# ')" type="text">
                        <el-icon><Heading /></el-icon>
                        标题
                      </el-button>
                      <el-button size="small" @click="insertMarkdown('\n```\n代码\n```\n')" type="text">
                        <el-icon><Code /></el-icon>
                        代码块
                      </el-button>
                      <el-button size="small" @click="insertMarkdown('[链接文字](URL)')" type="text">
                        <el-icon><Link /></el-icon>
                        链接
                      </el-button>
                      <el-button size="small" @click="insertMarkdown('- ')" type="text">
                        <el-icon><List /></el-icon>
                        列表
                      </el-button>
                    </div>
                  </div>
                  <div ref="codeEditorRef" class="code-editor"></div>
                </div>
                <div class="editor-hint">
                  支持 Markdown 和 HTML 格式，具备语法高亮和自动补全功能
                </div>
              </div>
              
              <!-- 实时预览区域 -->
              <div class="preview-area" v-if="showPreview" :class="{ 'half-width': showPreview === true }">
                <div class="preview-header">
                  <h4>实时预览</h4>
                  <el-button size="small" @click="syncScroll" type="text">
                    <el-icon><Refresh /></el-icon>
                    同步滚动
                  </el-button>
                </div>
                <div class="preview-content" v-html="realTimeRenderedContent" ref="previewContentRef"></div>
                <div class="preview-placeholder" v-if="!postForm.content">
                  开始输入内容，这里将实时显示渲染效果
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章标题 - 移到编辑器后面 -->
        <div class="form-section title-section">
          <div class="section-header">
            <h3 class="section-title">
              <el-icon><EditPen /></el-icon>
              文章标题
            </h3>
          </div>
          <el-input
            v-model="postForm.title"
            placeholder="请输入文章标题（5～100个字）"
            maxlength="100"
            show-word-limit
            clearable
            class="title-input"
            size="large"
          />
        </div>

        <!-- 创作灵感提示 -->
        <div class="inspiration-section">
          <div class="inspiration-title">#创作灵感#</div>
          <ul class="inspiration-list">
            <li>记录工作实践、项目复盘</li>
            <li>写技术笔记让知识更牢固</li>
            <li>发表职场感悟心得</li>
            <li>撰写自己的感悟文章到这</li>
          </ul>
        </div>

        <!-- 文章标签 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">文章标签</span>
            <span class="tag-count-hint">{{ postForm.tags.length }}/5</span>
          </div>
          
          <!-- 标签输入框 -->
          <div class="tag-input-container">
            <el-input
              v-model="tagInput"
              placeholder="输入标签名称或 # 标签名称 创建自定义标签"
              @keyup.enter="handleTagInput"
              @input="handleTagSearch"
              class="tag-input"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button 
              type="primary" 
              @click="handleTagInput"
              :disabled="postForm.tags.length >= 5"
              class="add-tag-btn"
            >
              添加
            </el-button>
          </div>

          <!-- 已选择的标签 -->
          <div class="selected-tags" v-if="postForm.tags.length > 0">
            <div class="tags-label">已选择的标签：</div>
            <div class="tags-list">
              <el-tag
                v-for="tag in postForm.tags"
                :key="tag"
                closable
                @close="removeTag(tag)"
                class="selected-tag"
                type="primary"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <!-- 预设标签推荐 -->
          <div class="preset-tags">
            <div class="tags-label">推荐标签：</div>
            <div class="tags-grid">
              <el-tag
                v-for="tag in filteredPresetTags"
                :key="tag"
                @click="selectPresetTag(tag)"
                :class="['preset-tag', { 'selected': postForm.tags.includes(tag), 'disabled': postForm.tags.length >= 5 && !postForm.tags.includes(tag) }]"
                :type="postForm.tags.includes(tag) ? 'success' : ''"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <!-- 标签数量限制提示 -->
          <div class="tag-limit-hint" v-if="postForm.tags.length >= 5">
            <el-icon class="warning-icon"><Warning /></el-icon>
            已达到标签数量上限（5个）
          </div>
        </div>

        <!-- 添加封面 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">添加封面</span>
          </div>
          <div class="cover-upload-area">
            <div class="upload-box" @click="handleCoverUpload">
              <el-icon class="upload-icon"><Plus /></el-icon>
              <div class="upload-text">从本地上传</div>
            </div>
            <div class="cover-preview" v-if="postForm.cover">
              <img :src="postForm.cover" alt="封面预览" />
              <div class="cover-actions">
                <el-button size="small" @click="removeCover">删除</el-button>
              </div>
            </div>
            <div class="no-cover-hint" v-else>
              暂无内容片，请在正文中添加图片
            </div>
          </div>
        </div>

        <!-- 文章摘要 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">文章摘要</span>
          </div>
          <el-input
            v-model="postForm.summary"
            type="textarea"
            :rows="3"
            placeholder="摘要：会在推荐、列表等场景外露，帮助读者快速了解内容，支持一键将正文 256 字符键入摘要文本框"
            maxlength="256"
            show-word-limit
            class="summary-input"
          />
          <div class="summary-actions">
            <el-button type="primary" link @click="generateSummaryWithAI">
              <el-icon><Star /></el-icon>
              AI提取摘要
            </el-button>
          </div>
        </div>

        <!-- 分类专栏 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">分类专栏</span>
            <el-button type="primary" link @click="addNewColumn">
              <el-icon><Plus /></el-icon>
              新建分类专栏
            </el-button>
          </div>
          <el-select v-model="postForm.column" placeholder="请选择创作活动" class="column-select">
            <el-option
              v-for="column in columns"
              :key="column.value"
              :label="column.label"
              :value="column.value"
            />
          </el-select>
        </div>

        <!-- 文章类型 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">文章类型</span>
          </div>
          <el-radio-group v-model="postForm.type" class="article-type-group">
            <el-radio value="original" class="type-radio">
              <div class="radio-content">
                <el-icon class="radio-icon"><Document /></el-icon>
                <span>原创</span>
                <el-icon class="check-icon"><Check /></el-icon>
              </div>
            </el-radio>
            <el-radio value="repost" class="type-radio">
              <div class="radio-content">
                <el-icon class="radio-icon"><Share /></el-icon>
                <span>转载</span>
              </div>
            </el-radio>
            <el-radio value="translation" class="type-radio">
              <div class="radio-content">
                <el-icon class="radio-icon"><Switch /></el-icon>
                <span>翻译</span>
              </div>
            </el-radio>
          </el-radio-group>
        </div>

        <!-- 创作声明 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">创作声明</span>
          </div>
          <el-select v-model="postForm.declaration" placeholder="无声明" class="declaration-select">
            <el-option label="无声明" value="none" />
            <el-option label="原创声明" value="original" />
            <el-option label="转载声明" value="repost" />
            <el-option label="翻译声明" value="translation" />
          </el-select>
        </div>


        <!-- 文章备份 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">文章备份</span>
          </div>
          <el-checkbox v-model="postForm.autoBackup" class="backup-checkbox">
            自动备份到云端
          </el-checkbox>
          <div class="backup-hint">
            开启后将自动保存您的创作内容，避免意外丢失
          </div>
        </div>

        <!-- 可见范围 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">可见范围</span>
          </div>
          <el-radio-group v-model="postForm.visibility" class="visibility-group">
            <el-radio value="public" class="visibility-radio">
              <div class="radio-content">
                <el-icon class="radio-icon"><Monitor /></el-icon>
                <div class="radio-text">
                  <div class="radio-title">全部可见</div>
                  <div class="radio-desc">所有人都可以看到</div>
                </div>
              </div>
            </el-radio>
            <el-radio value="followers" class="visibility-radio">
              <div class="radio-content">
                <el-icon class="radio-icon"><User /></el-icon>
                <div class="radio-text">
                  <div class="radio-title">仅粉丝可见</div>
                  <div class="radio-desc">只有关注您的用户可以看到</div>
                </div>
              </div>
            </el-radio>
            <el-radio value="vip" class="visibility-radio">
              <div class="radio-content">
                <el-icon class="radio-icon"><Star /></el-icon>
                <div class="radio-text">
                  <div class="radio-title">VIP可见</div>
                  <div class="radio-desc">仅VIP用户可见</div>
                </div>
              </div>
            </el-radio>
          </el-radio-group>
        </div>

        <!-- 参与活动 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">参与活动</span>
          </div>
          <el-select v-model="postForm.activity" placeholder="请选择创作活动" class="activity-select">
            <el-option
              v-for="activity in activities"
              :key="activity.value"
              :label="activity.label"
              :value="activity.value"
            />
          </el-select>
        </div>

        <!-- 话题 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">话题</span>
          </div>
          <el-select
            v-model="postForm.topics"
            multiple
            filterable
            allow-create
            placeholder="请选择或创建话题"
            class="topics-select"
          >
            <el-option
              v-for="topic in topics"
              :key="topic.value"
              :label="topic.label"
              :value="topic.value"
            />
          </el-select>
          <div class="topics-hint">
            最多可选择5个话题，也可以创建新话题
          </div>
        </div>

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

    <!-- AI写作助手对话框 -->
    <el-dialog
      v-model="aiWritingDialogVisible"
      title="🤖 AI写作助手"
      width="900px"
      :before-close="handleAIDialogClose"
      class="ai-dialog"
    >
      <div class="ai-writing-content">
        <!-- 功能选择区域 -->
        <div class="ai-mode-section">
          <div class="mode-header">
            <h3>🎯 选择AI写作模式</h3>
          </div>
          <el-radio-group v-model="aiMode" class="mode-group">
            <el-radio value="create" class="mode-option">
              <div class="mode-content">
                <el-icon class="mode-icon"><EditPen /></el-icon>
                <div class="mode-text">
                  <div class="mode-title">创作新内容</div>
                  <div class="mode-desc">基于提示词生成全新的文章内容</div>
                </div>
              </div>
            </el-radio>
            <el-radio value="optimize" class="mode-option" :disabled="!postForm.content.trim()">
              <div class="mode-content">
                <el-icon class="mode-icon"><Star /></el-icon>
                <div class="mode-text">
                  <div class="mode-title">优化现有内容</div>
                  <div class="mode-desc">基于编辑器中的内容进行优化和改进</div>
                </div>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
        
        <!-- 提示词输入区域 -->
        <div class="ai-prompt-section">
          <div class="prompt-header">
            <h3 v-if="aiMode === 'create'">✨ 描述您的写作需求</h3>
            <h3 v-else>🔧 描述优化要求</h3>
            <p v-if="aiMode === 'create'">详细描述您想要的内容，AI将为您生成高质量的文章</p>
            <p v-else>描述您希望如何优化现有内容，AI将基于编辑器中的内容进行改进</p>
          </div>
          
          <el-input
            v-model="aiPrompt"
            type="textarea"
            :rows="5"
            placeholder="例如：\n• 写一篇关于人工智能发展趋势的技术文章，包含当前现状、未来展望和挑战\n• 创作一个关于环保主题的故事，要求温馨感人\n• 分析区块链技术在金融领域的应用前景"
            maxlength="1000"
            show-word-limit
            class="prompt-input"
          />
          
          <!-- 快速提示词模板 -->
          <div class="prompt-templates">
            <div class="template-title">💡 快速模板</div>
            <div class="template-buttons">
              <el-button 
                size="small" 
                @click="useTemplate('技术文章')"
                class="template-btn"
              >
                📱 技术文章
              </el-button>
              <el-button 
                size="small" 
                @click="useTemplate('产品介绍')"
                class="template-btn"
              >
                🛍️ 产品介绍
              </el-button>
              <el-button 
                size="small" 
                @click="useTemplate('教程指南')"
                class="template-btn"
              >
                📚 教程指南
              </el-button>
              <el-button 
                size="small" 
                @click="useTemplate('新闻报道')"
                class="template-btn"
              >
                📰 新闻报道
              </el-button>
            </div>
          </div>
          
          <div class="action-buttons">
            <el-button @click="clearAIPrompt" :icon="Delete">清空</el-button>
            <el-button 
              type="primary" 
              @click="generateAIContent"
              :loading="aiGenerating"
              :disabled="!aiPrompt.trim()"
              class="generate-btn"
            >
              <template v-if="aiGenerating">
                <el-icon class="is-loading"><Loading /></el-icon>
                AI思考中...
              </template>
              <template v-else>
                <el-icon><Star /></el-icon>
                生成内容
              </template>
            </el-button>
          </div>
        </div>
        
        <!-- AI生成结果区域 -->
        <div v-if="aiGeneratedContent" class="ai-result-section">
          <div class="result-header">
            <div class="result-title">
              <el-icon><Check /></el-icon>
              AI生成内容
            </div>
            <div class="result-actions">
              <el-button 
                size="small" 
                type="success"
                @click="insertAIContent"
                :icon="Plus"
              >
                插入到编辑器
              </el-button>
              <el-button 
                size="small" 
                type="warning"
                @click="replaceWithAIContent"
                :icon="Refresh"
              >
                替换全部内容
              </el-button>
              <el-button 
                size="small" 
                @click="copyAIContent"
                :icon="DocumentCopy"
              >
                复制内容
              </el-button>
            </div>
          </div>
          
          <div class="content-preview-container">
            <el-tabs v-model="previewTab" class="preview-tabs">
              <el-tab-pane label="📝 编辑" name="edit">
                <el-input
                  v-model="aiGeneratedContent"
                  type="textarea"
                  :rows="12"
                  class="ai-content-preview"
                  placeholder="AI生成的内容将显示在这里..."
                />
              </el-tab-pane>
              <el-tab-pane label="👁️ 预览" name="preview">
                <div class="content-preview" v-html="aiPreviewContent"></div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        
        <!-- 空状态提示 -->
        <div v-else class="ai-empty-state">
          <div class="empty-icon">🤖</div>
          <h3>AI写作助手已就绪</h3>
          <p>输入您的写作需求，让AI为您创作精彩内容</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  EditPen, 
  Edit, 
  Document, 
  List, 
  Link, 
  Picture, 
  Upload, 
  View, 
  Star, 
  Monitor, 
  Switch, 
  Plus, 
  Delete, 
  Check,
  User,
  Share,
  Loading,
  DocumentCopy,
  Search,
  Warning
} from '@element-plus/icons-vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// CodeMirror imports
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { html } from '@codemirror/lang-html'
import { autocompletion, completionKeymap, CompletionContext, closeBrackets } from '@codemirror/autocomplete'
import { searchKeymap } from '@codemirror/search'
import { defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { keymap } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { css } from '@codemirror/lang-css'
import { html as htmlLang } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { sql } from '@codemirror/lang-sql'

const router = useRouter()
const postFormRef = ref()
const contentTextarea = ref()
const contentTextareaRef = ref()
const previewContentRef = ref()
const submitting = ref(false)

// 编辑器相关数据
const showPreview = ref(false)
const uploadedFileName = ref('')
const fileContent = ref('')

// AI写帖子相关数据
const aiWritingDialogVisible = ref(false)
const aiGenerating = ref(false)
const aiGeneratedContent = ref('')
const aiPrompt = ref('')
const previewTab = ref('edit')
const aiMode = ref('create')
const aiForm = ref({
  topic: '',
  style: 'technical',
  length: 'medium',
  keyPoints: ''
})

// AI预览内容计算属性
const aiPreviewContent = computed(() => {
  if (!aiGeneratedContent.value) return ''
  try {
    const html = marked(aiGeneratedContent.value)
    return DOMPurify.sanitize(html)
  } catch (error) {
    console.error('Markdown解析错误:', error)
    return aiGeneratedContent.value
  }
})

// 选项数据
const columns = ref([
  { label: '技术分享', value: 'tech' },
  { label: '生活随笔', value: 'life' },
  { label: '学习笔记', value: 'study' },
  { label: '项目经验', value: 'project' }
])

const activities = ref([
  { label: '春季创作活动', value: 'spring2024' },
  { label: '技术分享月', value: 'tech_month' },
  { label: '新人创作计划', value: 'newcomer' }
])

const topics = ref([
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Node.js', value: 'nodejs' },
  { label: '前端开发', value: 'frontend' },
  { label: '后端开发', value: 'backend' },
  { label: '全栈开发', value: 'fullstack' }
])

const postForm = ref({
  title: '',
  category: '',
  tags: [],
  content: '',
  cover: '',
  summary: '',
  column: '',
  type: 'original',
  declaration: 'none',
  autoBackup: true,
  visibility: 'public',
  activity: '',
  topics: []
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

// 标签相关变量
const tagInput = ref('')
const tagSearchKeyword = ref('')

// 过滤后的预设标签
const filteredPresetTags = computed(() => {
  if (!tagSearchKeyword.value) {
    return popularTags.value
  }
  return popularTags.value.filter(tag => 
    tag.toLowerCase().includes(tagSearchKeyword.value.toLowerCase())
  )
})

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

// 使用marked库渲染Markdown内容
const renderedContent = computed(() => {
  if (!postForm.value.content) return ''
  
  try {
    return marked(postForm.value.content)
  } catch (error) {
    console.error('Markdown渲染错误:', error)
    return postForm.value.content.replace(/\n/g, '<br>')
  }
})

// 实时预览渲染内容
const realTimeRenderedContent = computed(() => {
  if (!postForm.value.content) return ''
  
  try {
    // 检测内容类型：如果包含HTML标签，直接使用DOMPurify清理
    const hasHtmlTags = /<[^>]+>/.test(postForm.value.content)
    
    if (hasHtmlTags) {
      // HTML内容，直接清理并返回
      return DOMPurify.sanitize(postForm.value.content)
    } else {
      // Markdown内容，先转换再清理
      const html = marked(postForm.value.content)
      return DOMPurify.sanitize(html)
    }
  } catch (error) {
    console.error('内容渲染错误:', error)
    // 降级处理：简单的换行转换
    return DOMPurify.sanitize(postForm.value.content.replace(/\n/g, '<br>'))
  }
})

// 编辑器相关
const previewMode = ref(false)
const contentEditor = ref(null)
const fileUploadRef = ref(null)
const codeEditorRef = ref(null)
const editorView = ref(null)

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// 内容输入监听
const onContentInput = () => {
  // 实时预览会自动更新，这里可以添加其他逻辑
  // 比如自动保存草稿等
}

// CodeMirror编辑器初始化
// 自定义Markdown自动补全
const markdownCompletions = (context) => {
  const word = context.matchBefore(/\w*/)
  if (!word) return null
  
  const completions = [
    { label: '# 标题1', type: 'keyword', info: '一级标题' },
    { label: '## 标题2', type: 'keyword', info: '二级标题' },
    { label: '### 标题3', type: 'keyword', info: '三级标题' },
    { label: '**粗体**', type: 'keyword', info: '粗体文本' },
    { label: '*斜体*', type: 'keyword', info: '斜体文本' },
    { label: '`代码`', type: 'keyword', info: '行内代码' },
    { label: '```\n代码块\n```', type: 'keyword', info: '代码块' },
    { label: '```javascript\n// JavaScript代码\n```', type: 'keyword', info: 'JavaScript代码块' },
    { label: '```python\n# Python代码\n```', type: 'keyword', info: 'Python代码块' },
    { label: '```css\n/* CSS样式 */\n```', type: 'keyword', info: 'CSS代码块' },
    { label: '```html\n<!-- HTML代码 -->\n```', type: 'keyword', info: 'HTML代码块' },
    { label: '```json\n{"key": "value"}\n```', type: 'keyword', info: 'JSON代码块' },
    { label: '```sql\n-- SQL查询\n```', type: 'keyword', info: 'SQL代码块' },
    { label: '[链接文本](URL)', type: 'keyword', info: '链接' },
    { label: '![图片描述](图片URL)', type: 'keyword', info: '图片' },
    { label: '- 列表项', type: 'keyword', info: '无序列表' },
    { label: '1. 列表项', type: 'keyword', info: '有序列表' },
    { label: '> 引用', type: 'keyword', info: '引用块' },
    { label: '---', type: 'keyword', info: '分割线' },
    { label: '| 表格 | 标题 |\n|------|------|\n| 内容 | 内容 |', type: 'keyword', info: '表格' }
  ]
  
  return {
    from: word.from,
    options: completions
  }
}

// HTML标签自动补全
const htmlCompletions = (context) => {
  const word = context.matchBefore(/<\w*/)
  if (!word) return null
  
  const htmlTags = [
    { label: '<div></div>', type: 'keyword', info: '通用容器' },
    { label: '<p></p>', type: 'keyword', info: '段落' },
    { label: '<span></span>', type: 'keyword', info: '行内元素' },
    { label: '<h1></h1>', type: 'keyword', info: '一级标题' },
    { label: '<h2></h2>', type: 'keyword', info: '二级标题' },
    { label: '<h3></h3>', type: 'keyword', info: '三级标题' },
    { label: '<strong></strong>', type: 'keyword', info: '粗体' },
    { label: '<em></em>', type: 'keyword', info: '斜体' },
    { label: '<code></code>', type: 'keyword', info: '代码' },
    { label: '<pre></pre>', type: 'keyword', info: '预格式化文本' },
    { label: '<a href=""></a>', type: 'keyword', info: '链接' },
    { label: '<img src="" alt="">', type: 'keyword', info: '图片' },
    { label: '<ul></ul>', type: 'keyword', info: '无序列表' },
    { label: '<ol></ol>', type: 'keyword', info: '有序列表' },
    { label: '<li></li>', type: 'keyword', info: '列表项' },
    { label: '<blockquote></blockquote>', type: 'keyword', info: '引用块' },
    { label: '<table></table>', type: 'keyword', info: '表格' },
    { label: '<tr></tr>', type: 'keyword', info: '表格行' },
    { label: '<td></td>', type: 'keyword', info: '表格单元格' },
    { label: '<th></th>', type: 'keyword', info: '表格标题单元格' }
  ]
  
  return {
    from: word.from,
    options: htmlTags
  }
}

// 自定义语法高亮主题
const markdownHighlight = HighlightStyle.define([
  { tag: tags.heading1, fontSize: '1.6em', fontWeight: 'bold', color: '#1f2937' },
  { tag: tags.heading2, fontSize: '1.4em', fontWeight: 'bold', color: '#374151' },
  { tag: tags.heading3, fontSize: '1.2em', fontWeight: 'bold', color: '#4b5563' },
  { tag: tags.strong, fontWeight: 'bold', color: '#dc2626' },
  { tag: tags.emphasis, fontStyle: 'italic', color: '#7c3aed' },
  { tag: tags.monospace, fontFamily: 'Monaco, Menlo, monospace', background: '#f3f4f6', padding: '2px 4px', borderRadius: '3px' },
  { tag: tags.link, color: '#2563eb', textDecoration: 'underline' },
  { tag: tags.quote, color: '#6b7280', fontStyle: 'italic', borderLeft: '4px solid #d1d5db', paddingLeft: '12px' },
  { tag: tags.list, color: '#059669' }
])

const initCodeEditor = () => {
  if (!codeEditorRef.value) return
  
  // 创建编辑器状态
  const state = EditorState.create({
    doc: postForm.value.content,
    extensions: [
      basicSetup,
      markdown(),
      html(),
      syntaxHighlighting(markdownHighlight),
      autocompletion({
        override: [markdownCompletions, htmlCompletions]
      }),
      closeBrackets(),
      keymap.of([
        indentWithTab,
        ...defaultKeymap,
        ...historyKeymap,
        ...completionKeymap,
        ...searchKeymap
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          postForm.value.content = update.state.doc.toString()
          onContentInput()
        }
      }),
      EditorView.theme({
        '&': {
          height: '500px',
          fontSize: '14px',
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", "Cascadia Code", "Fira Code", monospace',
          backgroundColor: '#fafafa',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden'
        },
        '.cm-content': {
          padding: '20px',
          minHeight: '480px',
          lineHeight: '1.7',
          color: '#374151',
          caretColor: '#3b82f6'
        },
        '.cm-focused': {
          outline: 'none',
          boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
        },
        '.cm-editor': {
          borderRadius: '8px',
          border: 'none'
        },
        '.cm-scroller': {
          fontFamily: 'inherit',
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db #f9fafb'
        },
        '.cm-line': {
          padding: '3px 0',
          minHeight: '1.7em'
        },
        '.cm-activeLine': {
          backgroundColor: 'rgba(59, 130, 246, 0.05)'
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        },
        '.cm-gutters': {
          backgroundColor: '#f3f4f6',
          border: 'none',
          borderRight: '1px solid #e5e7eb'
        },
        '.cm-lineNumbers': {
          color: '#9ca3af',
          fontSize: '12px'
        },
        '.cm-cursor': {
          borderLeftColor: '#3b82f6',
          borderLeftWidth: '2px'
        },
        '.cm-selectionBackground': {
          backgroundColor: 'rgba(59, 130, 246, 0.15)'
        },
        '.cm-searchMatch': {
          backgroundColor: 'rgba(251, 191, 36, 0.3)',
          outline: '1px solid rgba(251, 191, 36, 0.5)'
        },
        '.cm-searchMatch.cm-searchMatch-selected': {
          backgroundColor: 'rgba(251, 191, 36, 0.5)'
        }
      })
    ]
  })
  
  // 创建编辑器视图
  editorView.value = new EditorView({
    state,
    parent: codeEditorRef.value
  })
}

// 更新编辑器内容
const updateEditorContent = (content) => {
  if (editorView.value) {
    const transaction = editorView.value.state.update({
      changes: {
        from: 0,
        to: editorView.value.state.doc.length,
        insert: content
      }
    })
    editorView.value.dispatch(transaction)
  }
}

// 插入Markdown语法
const insertMarkdown = (syntax) => {
  if (editorView.value) {
    const selection = editorView.value.state.selection.main
    const transaction = editorView.value.state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: syntax
      },
      selection: {
        anchor: selection.from + syntax.length
      }
    })
    editorView.value.dispatch(transaction)
    editorView.value.focus()
  }
}

// 同步滚动功能
const syncScroll = () => {
  const textarea = contentTextareaRef.value?.$refs?.textarea
  const preview = previewContentRef.value
  
  if (!textarea || !preview) return
  
  // 计算滚动比例
  const scrollRatio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight)
  
  // 同步预览区域滚动
  const previewScrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight)
  preview.scrollTop = previewScrollTop
}

// 监听编辑器滚动，实现同步滚动
const handleEditorScroll = () => {
  if (showPreview.value) {
    syncScroll()
  }
}

// 组件挂载后绑定滚动事件和初始化编辑器
onMounted(() => {
  nextTick(() => {
    const textarea = contentTextareaRef.value?.$refs?.textarea
    if (textarea) {
      textarea.addEventListener('scroll', handleEditorScroll)
    }
    
    // 初始化CodeMirror编辑器
    initCodeEditor()
  })
})

// 组件销毁时清理编辑器
onUnmounted(() => {
  if (editorView.value) {
    editorView.value.destroy()
  }
})



// 清空内容
const clearContent = () => {
  ElMessageBox.confirm(
    '确定要清空所有内容吗？此操作不可恢复。',
    '确认清空',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    postForm.value.content = ''
    ElMessage.success('内容已清空')
  }).catch(() => {})
}

// 文件上传处理
const handleFileUpload = (file) => {
  const fileType = file.name.split('.').pop().toLowerCase()
  
  if (!['md', 'html', 'htm'].includes(fileType)) {
    ElMessage.error('只支持 .md、.html、.htm 格式的文件')
    return false
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      let content = e.target.result
      
      if (fileType === 'md') {
        // Markdown文件直接使用
        postForm.value.content = content
        ElMessage.success('Markdown文件导入成功')
      } else if (fileType === 'html' || fileType === 'htm') {
        // HTML文件转换为Markdown
        content = htmlToMarkdown(content)
        postForm.value.content = content
        ElMessage.success('HTML文件已转换为Markdown格式')
      }
    } catch (error) {
      console.error('文件解析失败:', error)
      ElMessage.error('文件解析失败，请检查文件格式')
    }
  }
  
  reader.onerror = () => {
    ElMessage.error('文件读取失败')
  }
  
  reader.readAsText(file, 'UTF-8')
  return false // 阻止自动上传
}

// HTML转Markdown的简单实现
const htmlToMarkdown = (html) => {
  // 清理HTML
  const cleanHtml = DOMPurify.sanitize(html)
  
  // 创建临时DOM元素
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = cleanHtml
  
  let markdown = ''
  
  // 递归处理节点
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase()
      const children = Array.from(node.childNodes).map(processNode).join('')
      
      switch (tagName) {
        case 'h1': return `# ${children}\n\n`
        case 'h2': return `## ${children}\n\n`
        case 'h3': return `### ${children}\n\n`
        case 'h4': return `#### ${children}\n\n`
        case 'h5': return `##### ${children}\n\n`
        case 'h6': return `###### ${children}\n\n`
        case 'p': return `${children}\n\n`
        case 'strong': case 'b': return `**${children}**`
        case 'em': case 'i': return `*${children}*`
        case 'code': return `\`${children}\``
        case 'pre': return `\`\`\`\n${children}\n\`\`\`\n\n`
        case 'a': return `[${children}](${node.href || '#'})`
        case 'img': return `![${node.alt || ''}](${node.src || ''})`
        case 'ul': return `${children}\n`
        case 'ol': return `${children}\n`
        case 'li': return `- ${children}\n`
        case 'br': return '\n'
        case 'hr': return '---\n\n'
        case 'blockquote': return `> ${children}\n\n`
        default: return children
      }
    }
    
    return ''
  }
  
  markdown = Array.from(tempDiv.childNodes).map(processNode).join('')
  
  // 清理多余的换行
  return markdown.replace(/\n{3,}/g, '\n\n').trim()
}

// 预览内容计算属性
const previewContent = computed(() => {
  if (!postForm.value.content) return ''
  
  try {
    // 配置marked选项
    marked.setOptions({
      breaks: true,
      gfm: true,
      sanitize: false
    })
    
    // 将Markdown转换为HTML
    const html = marked(postForm.value.content)
    
    // 使用DOMPurify清理HTML
    return DOMPurify.sanitize(html)
  } catch (error) {
    console.error('Markdown解析失败:', error)
    return '<p style="color: red;">内容解析失败，请检查Markdown格式</p>'
  }
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

// 切换预览模式已在上方定义

// 处理文件上传已在上方定义

// 处理图片上传
const handleImageUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const imageUrl = e.target.result
    const markdownImage = `![${file.name}](${imageUrl})`
    
    // 在当前光标位置插入图片
    const textarea = document.querySelector('.content-editor textarea')
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const beforeText = postForm.value.content.substring(0, start)
      const afterText = postForm.value.content.substring(end)
      
      postForm.value.content = beforeText + markdownImage + afterText
      
      nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + markdownImage.length, start + markdownImage.length)
      })
    }
    
    ElMessage.success('图片已插入到编辑器')
  }
  reader.readAsDataURL(file)
  return false // 阻止默认上传行为
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

// AI写作功能
const showAIWritingDialog = () => {
  aiWritingDialogVisible.value = true
}

const handleAIDialogClose = () => {
  aiWritingDialogVisible.value = false
}

// 使用提示词模板
const useTemplate = (type) => {
  const templates = {
    '技术文章': '写一篇关于[技术主题]的深度技术文章，包含：\n• 技术背景和现状分析\n• 核心技术原理解释\n• 实际应用案例\n• 未来发展趋势\n• 对开发者的建议',
    '产品介绍': '为[产品名称]写一篇吸引人的产品介绍文章，包含：\n• 产品核心功能和特色\n• 用户痛点解决方案\n• 使用场景和案例\n• 竞争优势分析\n• 用户评价和反馈',
    '教程指南': '创建一个关于[主题]的详细教程指南，包含：\n• 前置知识和准备工作\n• 分步骤操作说明\n• 常见问题和解决方案\n• 最佳实践建议\n• 进阶学习资源',
    '新闻报道': '撰写一篇关于[事件/话题]的新闻报道，包含：\n• 事件背景和重要性\n• 关键信息和数据\n• 相关人士观点\n• 影响分析\n• 后续发展预测'
  }
  aiPrompt.value = templates[type] || ''
}

// 清空AI提示词
const clearAIPrompt = () => {
  aiPrompt.value = ''
}

// 生成AI内容
const generateAIContent = async () => {
  if (!aiPrompt.value.trim()) {
    ElMessage.warning('请输入写作需求')
    return
  }
  
  if (aiMode.value === 'optimize' && !postForm.value.content.trim()) {
    ElMessage.warning('请先在编辑器中输入内容再进行优化')
    return
  }
  
  aiGenerating.value = true
  
  try {
    // 模拟AI生成内容
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    let mockContent = ''
    
    if (aiMode.value === 'create') {
      mockContent = `# AI生成的内容

根据您的需求："${aiPrompt.value}"

## 概述

这是基于您的提示词生成的高质量内容。AI已经理解了您的需求，并创建了结构化的文章内容。

## 主要内容

### 1. 背景介绍

在当前的发展环境下，这个主题具有重要的现实意义和研究价值。

### 2. 核心观点

通过深入分析，我们可以得出以下几个关键观点：

- **观点一**：详细阐述第一个重要观点
- **观点二**：深入分析第二个关键要素
- **观点三**：综合考虑第三个重要因素

### 3. 实际应用

这些理论和观点在实际应用中具有以下价值：

1. 提供了新的思路和方法
2. 解决了现有的问题和挑战
3. 为未来发展指明了方向

## 结论

综合以上分析，我们可以看出这个主题的重要性和发展潜力。希望这些内容能够为您提供有价值的参考和启发。

---

*本内容由AI助手生成，您可以根据需要进行编辑和完善。*`
    } else {
      // 优化模式：基于现有内容进行优化
      const currentContent = postForm.value.content
      mockContent = `# 优化后的内容

基于您的要求"${aiPrompt.value}"，对原有内容进行了以下优化：

## 原始内容分析

${currentContent.substring(0, 200)}${currentContent.length > 200 ? '...' : ''}

## 优化建议

1. **结构优化**：重新组织内容结构，使逻辑更清晰
2. **语言润色**：改进表达方式，提升可读性
3. **内容补充**：根据您的要求补充相关内容

## 优化后的内容

${currentContent}

### 新增优化内容

根据您的优化要求，我们添加了以下内容来增强文章的价值和可读性：

- **深度分析**：对核心观点进行更深入的阐述
- **实例补充**：添加具体的案例和示例
- **结构完善**：优化段落结构和逻辑关系

---

*此内容已根据您的要求进行优化处理*`
    }
    
    aiGeneratedContent.value = mockContent
    previewTab.value = 'edit'
    ElMessage.success('🎉 AI内容生成成功！')
  } catch (error) {
    console.error('AI生成失败:', error)
    ElMessage.error('AI生成失败，请重试')
  } finally {
    aiGenerating.value = false
  }
}

// 插入AI内容到编辑器
const insertAIContent = () => {
  if (postForm.value.content) {
    postForm.value.content += '\n\n' + aiGeneratedContent.value
  } else {
    postForm.value.content = aiGeneratedContent.value
  }
  aiWritingDialogVisible.value = false
  ElMessage.success('✅ AI内容已插入到编辑器')
}

// 替换全部内容
const replaceWithAIContent = () => {
  ElMessageBox.confirm(
    '确定要用AI生成的内容替换当前编辑器中的所有内容吗？',
    '确认替换',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    postForm.value.content = aiGeneratedContent.value
    aiWritingDialogVisible.value = false
    ElMessage.success('✅ 内容已替换')
  }).catch(() => {
    // 用户取消
  })
}

// 复制AI内容
const copyAIContent = async () => {
  try {
    await navigator.clipboard.writeText(aiGeneratedContent.value)
    ElMessage.success('📋 内容已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败，请手动复制')
  }
}

const generateSummaryWithAI = async () => {
  if (!postForm.value.content.trim()) {
    ElMessage.error('请先输入文章内容')
    return
  }

  try {
    // 模拟AI提取摘要
    await new Promise(resolve => setTimeout(resolve, 1000))
    const content = postForm.value.content.substring(0, 200)
    postForm.value.summary = content + '...'
    ElMessage.success('AI摘要生成成功！')
  } catch (error) {
    ElMessage.error('摘要生成失败，请重试')
  }
}

const addCustomTag = () => {
  ElMessageBox.prompt('请输入自定义标签', '添加标签', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(({ value }) => {
    if (value && !postForm.value.tags.includes(value)) {
      postForm.value.tags.push(value)
      ElMessage.success('标签添加成功！')
    }
  }).catch(() => {})
}

const removeTag = (tag) => {
  const index = postForm.value.tags.indexOf(tag)
  if (index > -1) {
    postForm.value.tags.splice(index, 1)
  }
}

// 新的标签处理函数
const handleTagInput = () => {
  const input = tagInput.value.trim()
  if (!input) return

  let tagName = input
  
  // 检查是否是自定义标签格式 (# 标签名称)
  if (input.startsWith('#')) {
    tagName = input.substring(1).trim()
    if (!tagName) {
      ElMessage.warning('请输入标签名称')
      return
    }
  }

  // 检查标签数量限制
  if (postForm.value.tags.length >= 5) {
    ElMessage.warning('最多只能添加5个标签')
    return
  }

  // 检查标签是否已存在
  if (postForm.value.tags.includes(tagName)) {
    ElMessage.warning('标签已存在')
    return
  }

  // 添加标签
  postForm.value.tags.push(tagName)
  tagInput.value = ''
  ElMessage.success('标签添加成功！')
}

const handleTagSearch = (value) => {
  tagSearchKeyword.value = value
}

const selectPresetTag = (tag) => {
  // 检查标签数量限制
  if (postForm.value.tags.length >= 5 && !postForm.value.tags.includes(tag)) {
    ElMessage.warning('最多只能添加5个标签')
    return
  }

  // 如果标签已选择，则取消选择
  if (postForm.value.tags.includes(tag)) {
    removeTag(tag)
    return
  }

  // 添加标签
  postForm.value.tags.push(tag)
  ElMessage.success('标签添加成功！')
}

const handleCoverUpload = () => {
  ElMessage.info('封面上传功能开发中')
}

const removeCover = () => {
  postForm.value.cover = ''
}

const addNewColumn = () => {
  ElMessageBox.prompt('请输入新分类专栏名称', '新建分类专栏', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(({ value }) => {
    if (value) {
      const newColumn = {
        label: value,
        value: value.toLowerCase().replace(/\s+/g, '_')
      }
      columns.value.push(newColumn)
      postForm.value.column = newColumn.value
      ElMessage.success('分类专栏创建成功！')
    }
  }).catch(() => {})
}





// 页面加载时尝试加载草稿
loadDraft()
</script>

<style scoped>
.create-post-page {
  padding: 24px;
  width: 100%;
  margin: 0;
  min-height: 100vh;
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

.word-count {
  color: #6b7280;
  font-size: 14px;
  margin-top: 8px;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: none;
}

.post-form {
  width: 100%;
  max-width: none;
}

/* AI写作助手按钮样式 - 未来感设计 */
.ai-assistant-container {
  display: flex;
  justify-content: center;
  margin: 20px 0 40px 0;
  padding: 20px;
}

.ai-assistant-btn {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border: none;
  border-radius: 25px;
  padding: 18px 36px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.ai-assistant-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 25px;
}

.ai-assistant-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 15px 45px rgba(102, 126, 234, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.ai-assistant-btn:hover::before {
  opacity: 1;
}

.ai-assistant-btn:active {
  transform: translateY(-1px) scale(0.98);
}

.ai-btn-content {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 2;
}

.ai-icon {
  font-size: 22px;
  animation: sparkle 3s infinite ease-in-out;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
}

.ai-text {
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.ai-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.8s ease;
  border-radius: 25px;
}

.ai-assistant-btn:hover .ai-glow {
  transform: translateX(100%);
}

@keyframes sparkle {
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
  }
  25% { 
    transform: scale(1.1) rotate(90deg);
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  }
  50% { 
    transform: scale(1.2) rotate(180deg);
    filter: drop-shadow(0 0 16px rgba(255, 255, 255, 1));
  }
  75% { 
    transform: scale(1.1) rotate(270deg);
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  }
}

/* 表单区块样式 */
.form-section {
  margin-bottom: 32px;
  padding: 24px;
  background: #fafbfc;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 创作灵感样式 */
.inspiration-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 32px;
}

.inspiration-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.inspiration-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.inspiration-list li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
}

.inspiration-list li::before {
  content: '✨';
  position: absolute;
  left: 0;
}

/* 标签样式 */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.article-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* 封面上传样式 */
.cover-upload-area {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.upload-box {
  border: 2px dashed #c0c4cc;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-width: 200px;
}

.upload-box:hover {
  border-color: #409eff;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.upload-icon {
  font-size: 32px;
  color: #c0c4cc;
  margin-bottom: 8px;
}

.upload-text {
  color: #606266;
  font-size: 14px;
}

.cover-preview {
  position: relative;
}

.cover-preview img {
  max-width: 200px;
  max-height: 120px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cover-actions {
  margin-top: 8px;
  text-align: center;
}

.no-cover-hint {
  color: #909399;
  font-size: 12px;
  font-style: italic;
  padding: 20px;
  text-align: center;
  background: #f5f7fa;
  border-radius: 8px;
  flex: 1;
}

/* 摘要样式 */
.summary-input {
  margin-bottom: 12px;
}

.summary-actions {
  display: flex;
  justify-content: flex-end;
}

/* 分类专栏样式 */
.column-select {
  width: 100%;
}

/* 文章类型样式 */
.article-type-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.type-radio {
  flex: 1;
  min-width: 120px;
}

.type-radio :deep(.el-radio__input) {
  display: none;
}

.type-radio :deep(.el-radio__label) {
  padding: 0;
}

.radio-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.type-radio.is-checked .radio-content {
  border-color: #409eff;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.radio-icon {
  font-size: 18px;
  color: #909399;
}

.type-radio.is-checked .radio-icon {
  color: #409eff;
}

.check-icon {
  margin-left: auto;
  color: #409eff;
  display: none;
}

.type-radio.is-checked .check-icon {
  display: block;
}

/* 创作声明样式 */
.declaration-select {
  width: 100%;
}

/* AI写帖子样式 */
.ai-writing-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.ai-writing-section .section-title {
  color: white;
}

.ai-hint {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 8px;
}

/* 文章备份样式 */
.backup-checkbox {
  margin-bottom: 8px;
}

.backup-hint {
  font-size: 12px;
  color: #909399;
}

/* 可见范围样式 - 水平排列并美化 */
.visibility-group {
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.visibility-radio {
  flex: 1;
  min-width: 200px;
  margin: 0 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .visibility-group {
    flex-direction: column;
  }
  
  .visibility-radio {
    width: 100%;
    min-width: auto;
  }
}

.visibility-radio :deep(.el-radio__input) {
  display: none;
}

.visibility-radio :deep(.el-radio__label) {
  padding: 0;
  width: 100%;
  margin: 0;
}

.visibility-radio .radio-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e4e7ed;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.visibility-radio .radio-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.visibility-radio:hover .radio-content {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.15);
}

.visibility-radio:hover .radio-content::before {
  left: 100%;
}

.visibility-radio.is-checked .radio-content {
  border-color: #409eff;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #e1f5fe 100%);
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.2), 0 8px 25px rgba(64, 158, 255, 0.15);
}

.radio-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.radio-title {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
  margin: 0;
  line-height: 1.4;
}

.visibility-radio.is-checked .radio-title {
  color: #409eff;
}

.radio-desc {
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
  margin: 0;
}

.visibility-radio.is-checked .radio-desc {
  color: #606266;
}

/* 参与活动样式 */
.activity-select {
  width: 100%;
}

/* 话题样式 */
.topics-select {
  width: 100%;
}

.topics-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

/* 编辑器区域样式 */
.editor-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 2px solid #e2e8f0;
  margin-bottom: 40px;
}

.editor-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.file-upload-btn {
  display: inline-block;
}

/* 编辑器样式 - 现代化设计 */
.editor-container {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.editor-container:hover {
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.15);
  border-color: #d1d5db;
}

.editor-toolbar {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  backdrop-filter: blur(10px);
}

.editor-content {
  position: relative;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
}

.content-editor {
  border: none;
}

.content-editor :deep(.el-textarea__inner) {
  border: none;
  border-radius: 0;
  resize: vertical;
  font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 15px;
  line-height: 1.7;
  padding: 24px;
  background: transparent;
  color: #1f2937;
  transition: all 0.3s ease;
}

.content-editor :deep(.el-textarea__inner):focus {
  box-shadow: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.content-editor :deep(.el-textarea__inner)::placeholder {
  color: #9ca3af;
  font-style: italic;
}

.editor-hint {
  font-size: 13px;
  color: #6b7280;
  margin: 16px 24px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 10px;
  border-left: 4px solid #0ea5e9;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
  font-weight: 500;
}

/* 文件上传区域样式 */
.file-upload-section {
  margin-top: 16px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
}

.upload-area:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.upload-area.dragover {
  border-color: #1d4ed8;
  background: rgba(29, 78, 216, 0.1);
  transform: scale(1.02);
}

.upload-icon {
  font-size: 32px;
  color: #6b7280;
  margin-bottom: 12px;
}

.upload-text {
  color: #374151;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.upload-hint {
  color: #6b7280;
  font-size: 14px;
}

/* AI对话框样式 */
/* AI弹窗 - 未来科技风格 */
.ai-dialog {
  --ai-primary: #00d4ff;
  --ai-secondary: #7c3aed;
  --ai-accent: #06ffa5;
  --ai-dark: #0f0f23;
  --ai-glass: rgba(255, 255, 255, 0.1);
  --ai-glow: 0 0 30px rgba(0, 212, 255, 0.3);
}

.ai-dialog :deep(.el-dialog) {
  background: linear-gradient(145deg, 
    rgba(15, 15, 35, 0.95) 0%, 
    rgba(30, 30, 60, 0.95) 50%, 
    rgba(15, 15, 35, 0.95) 100%);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  overflow: hidden;
}

.ai-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, 
    rgba(0, 212, 255, 0.2) 0%, 
    rgba(124, 58, 237, 0.2) 50%,
    rgba(6, 255, 165, 0.2) 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 24px 24px 0 0;
  padding: 24px 32px;
  position: relative;
  overflow: hidden;
}

.ai-dialog :deep(.el-dialog__header::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.1), 
    transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { 
    left: -100%; 
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% { 
    left: 100%; 
    background-position: 0% 50%;
  }
}

.ai-dialog :deep(.el-dialog__title) {
  color: #ffffff;
  font-weight: 700;
  font-size: 20px;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-dialog :deep(.el-dialog__headerbtn) {
  top: 24px;
  right: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.ai-dialog :deep(.el-dialog__headerbtn:hover) {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
  transform: scale(1.1);
}

.ai-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #ffffff;
  font-size: 18px;
}

.ai-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: transparent;
}

.ai-writing-content {
  padding: 32px;
  background: linear-gradient(145deg, 
    rgba(15, 15, 35, 0.8) 0%, 
    rgba(30, 30, 60, 0.8) 50%, 
    rgba(15, 15, 35, 0.8) 100%);
  min-height: 600px;
  position: relative;
}

.ai-writing-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(6, 255, 165, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.ai-mode-section {
  margin-bottom: 32px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.ai-mode-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(0, 212, 255, 0.5), 
    transparent);
}

.mode-header h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
}

.mode-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 模式选择按钮 - 未来科技风格 */
.mode-option {
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.mode-option :deep(.el-radio__input) {
  display: none;
}

.mode-option :deep(.el-radio__label) {
  padding: 0;
  margin: 0;
  width: 100%;
}

.mode-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  min-height: 80px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.mode-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.1), 
    transparent);
  transition: left 0.6s ease;
}

.mode-option:hover .mode-content {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(0, 212, 255, 0.4);
  box-shadow: 
    0 8px 32px rgba(0, 212, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.mode-option:hover .mode-content::before {
  left: 100%;
}

.mode-option.is-checked .mode-content {
  background: linear-gradient(135deg, 
    rgba(0, 212, 255, 0.2) 0%, 
    rgba(124, 58, 237, 0.2) 100%);
  border-color: rgba(0, 212, 255, 0.6);
  box-shadow: 
    0 0 30px rgba(0, 212, 255, 0.3),
    0 8px 32px rgba(0, 212, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.mode-option.is-checked .mode-icon {
  color: var(--ai-primary);
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.6));
}

.mode-option.is-checked .mode-title {
  color: #ffffff;
  text-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
}

.mode-option.is-disabled .mode-content {
  opacity: 0.4;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.05);
}

.mode-option.is-disabled:hover .mode-content {
  transform: none;
  box-shadow: none;
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.05);
}

.mode-icon {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.mode-text {
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.mode-title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.mode-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0;
}

/* 提示词输入区域 - 未来科技风格 */
.ai-prompt-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(10px);
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}

.ai-prompt-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(6, 255, 165, 0.5), 
    transparent);
}

.prompt-header {
  margin-bottom: 24px;
}

.prompt-header h3 {
  margin: 0 0 12px 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(6, 255, 165, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
}

.prompt-header p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.6;
}

/* 输入框样式 */
.prompt-input :deep(.el-textarea__inner) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  resize: vertical;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.prompt-input :deep(.el-textarea__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

.prompt-input :deep(.el-textarea__inner:focus) {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(0, 212, 255, 0.6);
  box-shadow: 
    0 0 0 3px rgba(0, 212, 255, 0.2),
    0 0 20px rgba(0, 212, 255, 0.3);
  outline: none;
}

.prompt-input :deep(.el-input__count) {
  color: rgba(255, 255, 255, 0.6);
  background: transparent;
}

/* 模板按钮区域 */
.prompt-templates {
  margin: 24px 0;
}

.template-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.template-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.template-btn {
  border-radius: 24px;
  font-size: 12px;
  padding: 8px 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.template-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.1), 
    transparent);
  transition: left 0.5s ease;
}

.template-btn:hover {
  border-color: rgba(0, 212, 255, 0.5);
  color: rgba(255, 255, 255, 1);
  background: rgba(0, 212, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
  transform: translateY(-2px);
}

.template-btn:hover::before {
  left: 100%;
}

/* 操作按钮区域 */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 28px;
}

.action-buttons .el-button {
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.action-buttons .el-button:not(.generate-btn) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
}

.action-buttons .el-button:not(.generate-btn):hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
}

.generate-btn {
  background: linear-gradient(135deg, 
    var(--ai-primary) 0%, 
    var(--ai-secondary) 50%,
    var(--ai-accent) 100%);
  border: none;
  color: #ffffff;
  font-weight: 700;
  position: relative;
  overflow: hidden;
}

.generate-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.2), 
    transparent);
  transition: left 0.6s ease;
}

.generate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 0 30px rgba(0, 212, 255, 0.4),
    0 15px 35px rgba(0, 212, 255, 0.3);
}

.generate-btn:hover::before {
  left: 100%;
}

.generate-btn:disabled {
  opacity: 0.5;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

.generate-btn:disabled::before {
  display: none;
}

.ai-result-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.result-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1a202c;
  font-size: 16px;
}

.result-title .el-icon {
  color: #10b981;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.result-actions .el-button {
  border-radius: 8px;
  font-size: 12px;
  padding: 6px 12px;
}

.content-preview-container .preview-tabs :deep(.el-tabs__header) {
  margin-bottom: 16px;
}

.content-preview-container .preview-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.content-preview-container .preview-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  color: #64748b;
}

.content-preview-container .preview-tabs :deep(.el-tabs__item.is-active) {
  color: #667eea;
}

.content-preview-container .preview-tabs :deep(.el-tabs__active-bar) {
  background-color: #667eea;
}

.ai-content-preview :deep(.el-textarea__inner) {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  background: #f8fafc;
}

.ai-content-preview :deep(.el-textarea__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.content-preview {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  min-height: 300px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.7;
  color: #374151;
}

.content-preview h1,
.content-preview h2,
.content-preview h3,
.content-preview h4,
.content-preview h5,
.content-preview h6 {
  color: #1a202c;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}

.content-preview h1 { font-size: 24px; }
.content-preview h2 { font-size: 20px; }
.content-preview h3 { font-size: 18px; }

.content-preview p {
  margin-bottom: 16px;
}

.content-preview ul,
.content-preview ol {
  margin-bottom: 16px;
  padding-left: 24px;
}

.content-preview li {
  margin-bottom: 4px;
}

.content-preview code {
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', 'Monaco', monospace;
  font-size: 12px;
}

.content-preview pre {
  background: #1a202c;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.content-preview blockquote {
  border-left: 4px solid #667eea;
  padding-left: 16px;
  margin: 16px 0;
  color: #64748b;
  font-style: italic;
}

/* 空状态样式 */
.ai-empty-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
  position: relative;
}

.ai-empty-state::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, 
    rgba(0, 212, 255, 0.1) 0%, 
    transparent 70%);
  border-radius: 50%;
  z-index: -1;
  animation: pulse 3s ease-in-out infinite;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
  color: rgba(0, 212, 255, 0.6);
  animation: float 3s ease-in-out infinite;
}

.ai-empty-state h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  background: linear-gradient(135deg, 
    var(--ai-primary), 
    var(--ai-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 18px;
  font-weight: 600;
}

.ai-empty-state p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 弹窗进入动画 */
.ai-dialog {
  animation: fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-dialog-content {
  animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

/* 编辑器内容容器 */
.editor-content-container {
  display: flex;
  gap: 20px;
  min-height: 500px;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

/* 编辑器区域 */
.editor-area {
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.editor-area.full-width {
  width: 100%;
  flex: 1;
}

.editor-area.half-width {
  width: 50%;
  flex: 1;
  min-width: 400px;
}

/* 预览区域 */
.preview-area {
  transition: all 0.3s ease;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.preview-area.half-width {
  width: 50%;
  flex: 1;
  min-width: 400px;
}

/* 预览头部 */
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
  border-radius: 10px 10px 0 0;
}

.preview-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* 预览内容区域 */
.preview-area .preview-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  max-height: 480px;
  line-height: 1.6;
}

/* 预览样式 - 美化设计 */
.content-preview {
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  padding: 28px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%);
  max-height: 500px;
  overflow-y: auto;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.content-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

.content-preview:hover {
  border-color: #cbd5e1;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.12),
    0 8px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.content-preview::-webkit-scrollbar {
  width: 8px;
}

.content-preview::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.content-preview::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.content-preview::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
}

.preview-content {
  line-height: 1.8;
  color: #374151;
  font-size: 15px;
}

.preview-content :deep(h1) {
  font-size: 28px;
  font-weight: 700;
  margin: 24px 0 16px 0;
  color: #1f2937;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
}

.preview-content :deep(h2) {
  font-size: 24px;
  font-weight: 600;
  margin: 20px 0 14px 0;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.preview-content :deep(h3) {
  font-size: 20px;
  font-weight: 600;
  margin: 18px 0 12px 0;
  color: #4b5563;
}

.preview-content :deep(p) {
  margin: 16px 0;
  line-height: 1.8;
}

.preview-content :deep(ul) {
  margin: 16px 0;
  padding-left: 24px;
}

.preview-content :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.preview-content :deep(li) {
  margin-bottom: 8px;
  line-height: 1.7;
}

.preview-content :deep(code) {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  padding: 4px 8px;
  border-radius: 6px;
  font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #dc2626;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.preview-content :deep(pre) {
  background: linear-gradient(135deg, #1f2937, #374151);
  color: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid #4b5563;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-content :deep(blockquote) {
  border-left: 4px solid #667eea;
  padding: 16px 20px;
  margin: 20px 0;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 0 12px 12px 0;
  color: #4b5563;
  font-style: italic;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.preview-content :deep(strong) {
  font-weight: 700;
  color: #1f2937;
}

.preview-content :deep(em) {
  font-style: italic;
  color: #6b7280;
}

.preview-content :deep(a) {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.preview-content :deep(a:hover) {
  color: #5a67d8;
  border-bottom-color: #5a67d8;
}

.preview-placeholder {
  color: #9ca3af;
  font-style: italic;
  text-align: center;
  padding: 60px 40px;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  border-radius: 16px;
  border: 2px dashed #d1d5db;
  margin: 20px;
  font-size: 16px;
  line-height: 1.6;
}

/* 提交部分样式 - 美化设计 */
.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 40px;
  padding: 32px 0;
  border-top: 2px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 
    0 -4px 20px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;
}

.form-actions::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

.form-actions .el-button {
  border-radius: 16px;
  padding: 14px 32px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-width: 120px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-actions .el-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.form-actions .el-button:hover::before {
  left: 100%;
}

/* 草稿按钮样式 */
.form-actions .el-button--default {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e5e7eb;
  color: #6b7280;
}

.form-actions .el-button--default:hover {
  border-color: #cbd5e1;
  color: #374151;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* 发布按钮样式 */
.form-actions .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #ffffff;
  font-weight: 700;
  box-shadow: 
    0 8px 20px rgba(102, 126, 234, 0.3),
    0 4px 12px rgba(118, 75, 162, 0.2);
}

.form-actions .el-button--primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-3px);
  box-shadow: 
    0 12px 30px rgba(102, 126, 234, 0.4),
    0 8px 20px rgba(118, 75, 162, 0.3);
}

.form-actions .el-button--primary:active {
  transform: translateY(-1px);
  box-shadow: 
    0 6px 15px rgba(102, 126, 234, 0.3),
    0 3px 8px rgba(118, 75, 162, 0.2);
}

/* 按钮加载状态 */
.form-actions .el-button.is-loading {
  transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 按钮禁用状态 */
.form-actions .el-button.is-disabled {
  opacity: 0.5;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

.form-actions .el-button.is-disabled::before {
  display: none;
}

/* AI弹窗响应式设计 */
@media (max-width: 768px) {
  .ai-dialog {
    margin: 20px;
    max-width: calc(100vw - 40px);
  }
  
  .ai-dialog-content {
    padding: 24px;
  }
  
  .mode-options {
    flex-direction: column;
  }
  
  .mode-option {
    width: 100%;
  }
  
  .template-buttons {
    justify-content: center;
  }
  
  .action-buttons {
    flex-direction: column-reverse;
    gap: 12px;
  }
  
  .action-buttons .el-button {
    width: 100%;
  }
}

/* 页面响应式设计 */
@media (max-width: 1200px) {
  .editor-content-container {
    gap: 16px;
  }
  
  .editor-area.half-width,
  .preview-area.half-width {
    min-width: 300px;
  }
}

@media (max-width: 768px) {
  .create-post-page {
    padding: 12px;
    margin: 0;
  }
  
  .form-container {
    padding: 16px;
    margin: 0;
    width: 100%;
    max-width: none;
  }
  
  .form-section {
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .article-type-group {
    flex-direction: column;
  }
  
  .type-radio {
    min-width: auto;
  }
  
  .editor-toolbar {
    flex-direction: column;
    gap: 8px;
  }
  
  .form-actions {
    flex-direction: column;
    padding: 20px;
  }
  
  .form-actions .el-button {
    width: 100%;
  }
  
  /* 编辑器响应式设计 */
  .editor-content-container {
    flex-direction: column;
    gap: 12px;
    padding: 0;
    margin: 0;
  }
  
  .editor-area.half-width,
  .preview-area.half-width {
    width: 100%;
    min-width: auto;
    flex: none;
  }
  
  .preview-area {
    margin-top: 16px;
  }
  
  .preview-area .preview-content {
    max-height: 300px;
  }
}

/* CodeMirror编辑器样式 */
.code-editor-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e5e7eb;
}

.toolbar-left {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.editor-toolbar .el-button {
  padding: 4px 8px;
  font-size: 12px;
  border: none;
  background: transparent;
  color: #6b7280;
  transition: all 0.2s ease;
}

.editor-toolbar .el-button:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  transform: translateY(-1px);
}

.code-editor {
  min-height: 500px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* CodeMirror主题定制 */
.code-editor .cm-editor {
  border: none;
  border-radius: 0;
}

.code-editor .cm-focused {
  outline: none;
}

.code-editor .cm-content {
  padding: 16px;
  min-height: 500px;
  line-height: 1.6;
  font-size: 14px;
}

.code-editor .cm-scroller {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* Markdown语法高亮样式 */
.code-editor .cm-line {
  padding: 2px 0;
}

/* 自动补全样式 */
.cm-tooltip-autocomplete {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

.cm-tooltip-autocomplete ul li {
  padding: 6px 12px;
  border-radius: 4px;
  margin: 2px;
}

.cm-tooltip-autocomplete ul li[aria-selected] {
  background: #6366f1;
  color: #ffffff;
}

/* 超宽屏幕优化 */
@media (min-width: 1920px) {
  .editor-content-container {
    gap: 32px;
    max-width: none;
  }
  
  .editor-area.half-width,
  .preview-area.half-width {
    min-width: 600px;
  }
  
  .content-preview {
    padding: 32px;
  }
  
  .preview-area .preview-content {
    max-height: 600px;
  }
  
  .code-editor {
    min-height: 600px;
  }
  
  .code-editor .cm-content {
    min-height: 600px;
  }
}

/* 标签相关样式 */
.tag-count-hint {
  font-size: 14px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.tag-input-container {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.tag-input {
  flex: 1;
}

.add-tag-btn {
  min-width: 80px;
}

.selected-tags {
  margin-bottom: 20px;
}

.tags-label {
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
  font-weight: 500;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.selected-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.preset-tags {
  margin-bottom: 16px;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-tag {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #6b7280;
}

.preset-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #6366f1;
  color: #6366f1;
}

.preset-tag.selected {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
  color: white;
}

.preset-tag.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.tag-limit-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #f59e0b;
  border-radius: 8px;
  color: #92400e;
  font-size: 14px;
  margin-top: 12px;
}

.warning-icon {
  color: #f59e0b;
  font-size: 16px;
}

/* 标签响应式设计 */
@media (max-width: 768px) {
  .tag-input-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .add-tag-btn {
    width: 100%;
  }
  
  .tags-grid {
    gap: 6px;
  }
  
  .preset-tag,
  .selected-tag {
    font-size: 12px;
    padding: 4px 8px;
  }
}
</style>