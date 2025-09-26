<template>
  <div class="paper-detail-page">
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/papers' }">学术论文</el-breadcrumb-item>
        <el-breadcrumb-item>论文详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="paper" class="paper-content">
      <div class="paper-header">
        <h1 class="paper-title">{{ paper.title }}</h1>
        <div class="paper-meta">
          <div class="authors">
            <el-icon><User /></el-icon>
            <span>{{ paper.authors.join(', ') }}</span>
          </div>
          <div class="publication">
            <el-icon><Document /></el-icon>
            <span>{{ paper.journal }} • {{ paper.year }}</span>
          </div>
          <div class="date">
            <el-icon><Calendar /></el-icon>
            <span>发布于 {{ formatDate(paper.publishedAt) }}</span>
          </div>
        </div>
        
        <div class="paper-tags">
          <el-tag
            v-for="tag in paper.tags"
            :key="tag"
            class="paper-tag"
          >
            {{ tag }}
          </el-tag>
        </div>
        
        <div class="paper-stats">
          <div class="stat-item">
            <el-icon><View /></el-icon>
            <span>{{ paper.views }} 次查看</span>
          </div>
          <div class="stat-item">
            <el-icon><Download /></el-icon>
            <span>{{ paper.downloads }} 次下载</span>
          </div>
          <div class="stat-item">
            <el-icon><Star /></el-icon>
            <span>{{ paper.citations }} 次引用</span>
          </div>
        </div>
        
        <div class="paper-actions">
          <el-button type="primary" @click="handleDownload">
            <el-icon><Download /></el-icon>
            下载PDF
          </el-button>
          <el-button @click="handleCite">
            <el-icon><Document /></el-icon>
            引用
          </el-button>
          <el-button @click="handleBookmark">
            <el-icon><Star /></el-icon>
            {{ isBookmarked ? '取消收藏' : '收藏' }}
          </el-button>
          <el-button @click="handleShare">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
        </div>
      </div>

      <div class="paper-body">
        <div class="main-content">
          <div class="section">
            <h2>摘要</h2>
            <p class="abstract">{{ paper.abstract }}</p>
          </div>
          
          <div class="section" v-if="paper.keywords && paper.keywords.length > 0">
            <h2>关键词</h2>
            <div class="keywords">
              <el-tag
                v-for="keyword in paper.keywords"
                :key="keyword"
                type="info"
                class="keyword-tag"
              >
                {{ keyword }}
              </el-tag>
            </div>
          </div>
          
          <div class="section" v-if="paper.sections && paper.sections.length > 0">
            <h2>目录</h2>
            <div class="table-of-contents">
              <div
                v-for="(section, index) in paper.sections"
                :key="index"
                class="toc-item"
                @click="scrollToSection(section.id)"
              >
                <span class="section-number">{{ index + 1 }}.</span>
                <span class="section-title">{{ section.title }}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>论文内容</h2>
            <div class="content-preview">
              <p class="preview-note">
                <el-icon><InfoFilled /></el-icon>
                这是论文内容的预览。完整内容请下载PDF文件查看。
              </p>
              <div class="preview-content">
                <div v-for="(section, index) in paper.sections" :key="index" class="content-section">
                  <h3 :id="section.id">{{ section.title }}</h3>
                  <p>{{ section.preview }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section" v-if="paper.references && paper.references.length > 0">
            <h2>参考文献</h2>
            <div class="references">
              <div
                v-for="(ref, index) in paper.references"
                :key="index"
                class="reference-item"
              >
                <span class="ref-number">[{{ index + 1 }}]</span>
                <span class="ref-content">{{ ref }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sidebar">
          <div class="info-card">
            <h3>论文信息</h3>
            <div class="info-list">
              <div class="info-item">
                <label>DOI</label>
                <span>{{ paper.doi || '暂无' }}</span>
              </div>
              <div class="info-item">
                <label>ISSN</label>
                <span>{{ paper.issn || '暂无' }}</span>
              </div>
              <div class="info-item">
                <label>页数</label>
                <span>{{ paper.pages || '暂无' }}</span>
              </div>
              <div class="info-item">
                <label>语言</label>
                <span>{{ paper.language || '英文' }}</span>
              </div>
              <div class="info-item">
                <label>文件大小</label>
                <span>{{ paper.fileSize || '未知' }}</span>
              </div>
            </div>
          </div>
          
          <div class="info-card">
            <h3>相关论文</h3>
            <div class="related-papers">
              <div
                v-for="relatedPaper in relatedPapers"
                :key="relatedPaper.id"
                class="related-paper"
                @click="goToPaper(relatedPaper.id)"
              >
                <h4>{{ relatedPaper.title }}</h4>
                <p>{{ relatedPaper.authors.join(', ') }}</p>
                <span class="paper-year">{{ relatedPaper.year }}</span>
              </div>
            </div>
          </div>
          
          <div class="info-card">
            <h3>下载统计</h3>
            <div class="download-stats">
              <div class="stat-row">
                <span>今日下载</span>
                <span class="stat-value">{{ paper.todayDownloads || 0 }}</span>
              </div>
              <div class="stat-row">
                <span>本周下载</span>
                <span class="stat-value">{{ paper.weekDownloads || 0 }}</span>
              </div>
              <div class="stat-row">
                <span>本月下载</span>
                <span class="stat-value">{{ paper.monthDownloads || 0 }}</span>
              </div>
              <div class="stat-row">
                <span>总下载量</span>
                <span class="stat-value">{{ paper.downloads || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <el-empty description="论文不存在或已被删除" />
      <el-button type="primary" @click="$router.push('/papers')">
        返回论文列表
      </el-button>
    </div>

    <!-- 引用对话框 -->
    <el-dialog
      v-model="citeDialogVisible"
      title="引用格式"
      width="600px"
    >
      <div class="citation-formats">
        <el-tabs v-model="citationFormat">
          <el-tab-pane label="APA" name="apa">
            <div class="citation-text">{{ generateCitation('apa') }}</div>
          </el-tab-pane>
          <el-tab-pane label="MLA" name="mla">
            <div class="citation-text">{{ generateCitation('mla') }}</div>
          </el-tab-pane>
          <el-tab-pane label="Chicago" name="chicago">
            <div class="citation-text">{{ generateCitation('chicago') }}</div>
          </el-tab-pane>
          <el-tab-pane label="BibTeX" name="bibtex">
            <div class="citation-text">{{ generateCitation('bibtex') }}</div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="copyCitation">复制</el-button>
          <el-button type="primary" @click="citeDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  User, Document, Calendar, View, Download, Star, Share,
  InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const paper = ref(null)
const relatedPapers = ref([])
const isBookmarked = ref(false)
const citeDialogVisible = ref(false)
const citationFormat = ref('apa')

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const handleDownload = () => {
  ElMessage.success('开始下载PDF文件')
  // 这里应该实现实际的下载逻辑
}

const handleCite = () => {
  citeDialogVisible.value = true
}

const handleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
  ElMessage.success(isBookmarked.value ? '收藏成功' : '取消收藏成功')
}

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: paper.value.title,
      text: paper.value.abstract,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    ElMessage.success('链接已复制到剪贴板')
  }
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToPaper = (paperId) => {
  router.push(`/papers/detail/${paperId}`)
}

const generateCitation = (format) => {
  if (!paper.value) return ''
  
  const authors = paper.value.authors.join(', ')
  const title = paper.value.title
  const journal = paper.value.journal
  const year = paper.value.year
  
  switch (format) {
    case 'apa':
      return `${authors} (${year}). ${title}. ${journal}.`
    case 'mla':
      return `${authors}. "${title}." ${journal}, ${year}.`
    case 'chicago':
      return `${authors}. "${title}." ${journal} (${year}).`
    case 'bibtex':
      return `@article{paper${paper.value.id},\n  title={${title}},\n  author={${authors}},\n  journal={${journal}},\n  year={${year}}\n}`
    default:
      return ''
  }
}

const copyCitation = () => {
  const citation = generateCitation(citationFormat.value)
  navigator.clipboard.writeText(citation)
  ElMessage.success('引用格式已复制到剪贴板')
}

const fetchPaperDetail = async () => {
  try {
    loading.value = true
    const paperId = route.params.id
    
    // 模拟获取论文详情
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    paper.value = {
      id: paperId,
      title: 'Attention Is All You Need: Transformer架构在自然语言处理中的革命性应用',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit'],
      journal: 'Advances in Neural Information Processing Systems',
      year: 2017,
      publishedAt: '2017-06-12',
      abstract: '本文提出了Transformer模型，这是一种完全基于注意力机制的新型神经网络架构。与传统的循环神经网络和卷积神经网络不同，Transformer完全依赖于自注意力机制来计算输入和输出的表示。我们在机器翻译任务上验证了该模型的有效性，结果表明Transformer在翻译质量上超越了现有的最佳模型，同时具有更好的并行化能力和更快的训练速度。',
      keywords: ['Transformer', '注意力机制', '神经网络', '机器翻译', '自然语言处理'],
      tags: ['深度学习', 'NLP', '机器翻译', 'Attention'],
      views: 15420,
      downloads: 3240,
      citations: 89567,
      todayDownloads: 45,
      weekDownloads: 312,
      monthDownloads: 1456,
      doi: '10.48550/arXiv.1706.03762',
      issn: '1049-5258',
      pages: '11',
      language: '英文',
      fileSize: '2.3 MB',
      sections: [
        {
          id: 'introduction',
          title: '引言',
          preview: '循环神经网络，特别是长短期记忆网络（LSTM）和门控循环单元（GRU），已经被确立为序列建模和转换问题的最先进方法...'
        },
        {
          id: 'background',
          title: '背景',
          preview: '减少序列计算的目标也构成了扩展神经GPU、ByteNet和ConvS2S的基础，它们都使用卷积神经网络作为基本构建块...'
        },
        {
          id: 'model-architecture',
          title: '模型架构',
          preview: 'Transformer遵循这种整体架构，使用堆叠的自注意力和逐点、完全连接的层用于编码器和解码器...'
        }
      ],
      references: [
        'Bahdanau, D., Cho, K., & Bengio, Y. (2014). Neural machine translation by jointly learning to align and translate.',
        'Sutskever, I., Vinyals, O., & Le, Q. V. (2014). Sequence to sequence learning with neural networks.',
        'Cho, K., Van Merriënboer, B., Gulcehre, C., Bahdanau, D., Bougares, F., Schwenk, H., & Bengio, Y. (2014). Learning phrase representations using RNN encoder-decoder for statistical machine translation.'
      ]
    }
    
    // 模拟获取相关论文
    relatedPapers.value = [
      {
        id: '2',
        title: 'BERT: Pre-training of Deep Bidirectional Transformers',
        authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee'],
        year: 2018
      },
      {
        id: '3',
        title: 'GPT-3: Language Models are Few-Shot Learners',
        authors: ['Tom B. Brown', 'Benjamin Mann', 'Nick Ryder'],
        year: 2020
      }
    ]
  } catch (error) {
    console.error('获取论文详情失败:', error)
    ElMessage.error('获取论文详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPaperDetail()
})
</script>

<style scoped>
.paper-detail-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.loading-container {
  padding: 40px;
}

.paper-header {
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.paper-title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.paper-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.paper-meta > div {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.paper-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.paper-tag {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.paper-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
}

.paper-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.paper-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

.main-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 32px;
}

.section:last-child {
  margin-bottom: 0;
}

.section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.abstract {
  font-size: 16px;
  line-height: 1.7;
  color: #374151;
  text-align: justify;
  margin: 0;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.table-of-contents {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.toc-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.toc-item:hover {
  background: #e5e7eb;
}

.section-number {
  font-weight: 600;
  color: #6b7280;
  min-width: 24px;
}

.section-title {
  color: #374151;
}

.content-preview {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.preview-note {
  background: #fef3c7;
  color: #92400e;
  padding: 12px 16px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.preview-content {
  padding: 20px;
}

.content-section {
  margin-bottom: 24px;
}

.content-section:last-child {
  margin-bottom: 0;
}

.content-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.content-section p {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.references {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reference-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.ref-number {
  color: #6b7280;
  font-weight: 600;
  min-width: 32px;
}

.ref-content {
  color: #374151;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.info-item span {
  font-size: 14px;
  color: #1f2937;
  text-align: right;
}

.related-papers {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.related-paper {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.related-paper:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.related-paper h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.related-paper p {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.paper-year {
  font-size: 12px;
  color: #9ca3af;
}

.download-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.stat-row span:first-child {
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
}

.error-state {
  text-align: center;
  padding: 60px 20px;
}

.citation-formats {
  margin-bottom: 20px;
}

.citation-text {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-all;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .paper-detail-page {
    padding: 16px;
  }
  
  .paper-header {
    padding: 20px;
  }
  
  .paper-title {
    font-size: 22px;
  }
  
  .paper-meta {
    gap: 12px;
  }
  
  .paper-stats {
    flex-direction: column;
    gap: 12px;
  }
  
  .paper-actions {
    flex-direction: column;
  }
  
  .paper-actions .el-button {
    width: 100%;
  }
  
  .paper-body {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding: 20px;
  }
}
</style>