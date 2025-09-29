<template>
  <div class="paper-detail">
    <!-- 面包屑导航 -->
    <el-breadcrumb class="breadcrumb" separator=">">
      <el-breadcrumb-item :to="{ path: '/papers' }">学术论文</el-breadcrumb-item>
      <el-breadcrumb-item>论文详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 论文详情 -->
    <div v-else-if="paper" class="paper-content">
      <!-- 论文头部信息 -->
      <div class="paper-header">
        <h1 class="paper-title">{{ paper.title }}</h1>
        
        <!-- 论文元信息 -->
        <div class="paper-meta">
          <div class="authors">
            <el-icon><User /></el-icon>
            <span>{{ paper.authors.join(', ') }}</span>
          </div>
          <div class="publication">
            <el-icon><Document /></el-icon>
            <span>{{ paper.journal }} · {{ paper.year }}</span>
          </div>
          <div class="date">
            <el-icon><Calendar /></el-icon>
            <span>发表于 {{ formatDate(paper.publishedAt) }}</span>
          </div>
        </div>

        <!-- 标签 -->
        <div class="tags">
          <el-tag v-for="tag in paper.tags" :key="tag" type="primary" size="small">
            {{ tag }}
          </el-tag>
        </div>

        <!-- 统计信息 -->
        <div class="stats">
          <div class="stat-item">
            <el-icon><View /></el-icon>
            <span>{{ paper.views.toLocaleString() }} 浏览</span>
          </div>
          <div class="stat-item">
            <el-icon><Download /></el-icon>
            <span>{{ paper.downloads.toLocaleString() }} 下载</span>
          </div>
          <div class="stat-item">
            <el-icon><Star /></el-icon>
            <span>{{ paper.citations.toLocaleString() }} 引用</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <el-button type="primary" @click="handleDownload">
            <el-icon><Download /></el-icon>
            下载论文
          </el-button>
          <el-button @click="handleCite">
            <el-icon><Document /></el-icon>
            引用
          </el-button>
          <el-button @click="handleBookmark">
            <el-icon><Star /></el-icon>
            {{ isBookmarked ? '已收藏' : '收藏' }}
          </el-button>
          <el-button @click="handleShare">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
        </div>
      </div>

      <!-- 主要内容区域 - 左右分栏布局 -->
      <div class="main-content">
        <!-- 左侧：论文原文 -->
        <div class="content-left">
          <div class="paper-original">
            <div class="original-header">
              <h2>论文原文</h2>
              <div class="zoom-controls">
                <el-button size="small" @click="zoomOut">
                  <el-icon><ZoomOut /></el-icon>
                </el-button>
                <span class="zoom-level">{{ zoomLevel }}%</span>
                <el-button size="small" @click="zoomIn">
                  <el-icon><ZoomIn /></el-icon>
                </el-button>
                <el-button size="small" @click="resetZoom">
                  <el-icon><Refresh /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="original-content" :style="{ fontSize: zoomLevel + '%' }">
              <div 
                v-for="section in paper.fullContent" 
                :key="section.id" 
                class="content-section"
              >
                <h3>{{ section.title }}</h3>
                <div class="section-content" v-html="section.content"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：标签页内容 -->
        <div class="content-right">
          <div class="tabs-container">
            <el-tabs v-model="activeTab" class="paper-tabs">
              <!-- 论文总结 -->
              <el-tab-pane label="论文总结" name="summary">
                <div class="summary-content">
                  <div class="summary-section">
                    <h3>主要贡献</h3>
                    <ul>
                      <li v-for="contribution in paper.summary.contributions" :key="contribution">
                        {{ contribution }}
                      </li>
                    </ul>
                  </div>
                  <div class="summary-section">
                    <h3>研究方法</h3>
                    <p>{{ paper.summary.methodology }}</p>
                  </div>
                  <div class="summary-section">
                    <h3>实验结果</h3>
                    <p>{{ paper.summary.results }}</p>
                  </div>
                  <div class="summary-section">
                    <h3>结论</h3>
                    <p>{{ paper.summary.conclusion }}</p>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 原文翻译 -->
              <el-tab-pane label="原文翻译" name="translation">
                <div class="translation-content">
                  <div 
                    v-for="section in paper.translation" 
                    :key="section.id" 
                    class="translation-section"
                  >
                    <h3>{{ section.title }}</h3>
                    <p>{{ section.content }}</p>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 思维导图 -->
              <el-tab-pane label="思维导图" name="mindmap">
                <div class="mindmap-content">
                  <div class="mindmap-controls">
                    <el-button size="small" @click="expandAll">展开全部</el-button>
                    <el-button size="small" @click="collapseAll">收起全部</el-button>
                    <el-button size="small" @click="centerMindmap">居中显示</el-button>
                  </div>
                  <div class="mindmap-container" ref="mindmapContainer">
                    <div v-html="renderSimpleMindmap()"></div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  User, Document, Calendar, View, Download, Star, Share,
  InfoFilled, ZoomIn, ZoomOut, Refresh
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
const activeTab = ref('summary')
const zoomLevel = ref(14)
let mindmapInstance = null

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

// 缩放控制
const zoomIn = () => {
  if (zoomLevel.value < 24) {
    zoomLevel.value += 2
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 10) {
    zoomLevel.value -= 2
  }
}

const resetZoom = () => {
  zoomLevel.value = 14
}

// 思维导图控制
const expandAll = () => {
  ElMessage.info('展开全部节点')
}

const collapseAll = () => {
  ElMessage.info('收起全部节点')
}

const centerMindmap = () => {
  ElMessage.info('居中显示思维导图')
}

// 初始化思维导图
const initMindmap = () => {
  nextTick(() => {
    const container = document.getElementById('mindmap')
    if (container && paper.value) {
      // 创建简单的思维导图结构
      const mindmapData = {
        name: paper.value.title,
        children: [
          {
            name: '研究背景',
            children: [
              { name: '问题定义' },
              { name: '现有方法局限' },
              { name: '研究动机' }
            ]
          },
          {
            name: '核心贡献',
            children: paper.value.summary?.contributions?.map(c => ({ name: c })) || []
          },
          {
            name: '方法论',
            children: [
              { name: '模型架构' },
              { name: '训练策略' },
              { name: '优化方法' }
            ]
          },
          {
            name: '实验验证',
            children: [
              { name: '数据集' },
              { name: '评估指标' },
              { name: '对比实验' }
            ]
          },
          {
            name: '结论与展望',
            children: [
              { name: '主要发现' },
              { name: '应用价值' },
              { name: '未来工作' }
            ]
          }
        ]
      }
      
      // 渲染简单的思维导图
      renderSimpleMindmap(container, mindmapData)
    }
  })
}

// 渲染简单思维导图
const renderSimpleMindmap = (container, data) => {
  container.innerHTML = ''
  
  const mindmapHtml = `
    <div class="mindmap-node root-node">
      <div class="node-content">${data.name}</div>
      <div class="children-container">
        ${data.children.map(child => `
          <div class="mindmap-branch">
            <div class="mindmap-node branch-node">
              <div class="node-content">${child.name}</div>
              ${child.children ? `
                <div class="sub-children">
                  ${child.children.map(subChild => `
                    <div class="mindmap-node leaf-node">
                      <div class="node-content">${subChild.name}</div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
  
  container.innerHTML = mindmapHtml
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
      // 论文原文内容
      fullContent: [
        {
          id: 'abstract',
          title: 'Abstract',
          content: `<p>The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.</p>
          <p>Experiments on two machine translation tasks show that these models are superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU.</p>`
        },
        {
          id: 'introduction',
          title: '1. Introduction',
          content: `<p>Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation.</p>
          <p>Numerous efforts have since continued to push the boundaries of recurrent language models and encoder-decoder architectures. Recurrent models typically factor computation along the symbol positions of the input and output sequences.</p>
          <p>Aligning the positions to steps in computation time, they generate a sequence of hidden states ht, as a function of the previous hidden state ht−1 and the input for position t. This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples.</p>`
        },
        {
          id: 'model-architecture',
          title: '3. Model Architecture',
          content: `<p>Most competitive neural sequence transduction models have an encoder-decoder structure. Here, the encoder maps an input sequence of symbol representations (x1, ..., xn) to a sequence of continuous representations z = (z1, ..., zn). Given z, the decoder then generates an output sequence (y1, ..., ym) of symbols one element at a time.</p>
          <p>At each step the model is auto-regressive, consuming the previously generated symbols as additional input when generating the next. The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder, shown in the left and right halves of Figure 1, respectively.</p>`
        }
      ],
      // 论文总结
      summary: {
        contributions: [
          '提出了完全基于注意力机制的Transformer架构',
          '摒弃了传统的循环和卷积结构，实现更好的并行化',
          '在机器翻译任务上达到了当时最佳性能',
          '为后续的BERT、GPT等模型奠定了基础'
        ],
        methodology: 'Transformer采用编码器-解码器架构，完全基于自注意力机制。编码器由6个相同的层组成，每层包含多头自注意力机制和位置前馈网络。解码器同样由6个层组成，但增加了编码器-解码器注意力层。模型使用位置编码来处理序列信息，并采用残差连接和层归一化。',
        results: '在WMT 2014英德翻译任务上达到28.4 BLEU分数，比之前最佳结果提升超过2个BLEU点。在英法翻译任务上达到41.8 BLEU分数，创造新的单模型最佳记录。训练时间显著减少，仅需3.5天即可达到最佳性能。',
        conclusion: 'Transformer证明了纯注意力机制在序列转换任务中的有效性，为自然语言处理领域带来了革命性变化。该架构的并行化能力和优异性能使其成为后续大型语言模型的基础，深刻影响了整个NLP领域的发展方向。'
      },
      // 中文翻译
      translation: [
        {
          id: 'abstract-zh',
          title: '摘要',
          content: '主流的序列转换模型基于复杂的循环或卷积神经网络，包括编码器和解码器。性能最佳的模型还通过注意力机制连接编码器和解码器。我们提出了一种新的简单网络架构——Transformer，完全基于注意力机制，完全摒弃了循环和卷积。在两个机器翻译任务上的实验表明，这些模型在质量上更优越，同时具有更好的并行性，训练时间显著减少。我们的模型在WMT 2014英德翻译任务上达到28.4 BLEU，比现有最佳结果（包括集成模型）提高了2个BLEU以上。'
        },
        {
          id: 'introduction-zh',
          title: '1. 引言',
          content: '循环神经网络，特别是长短期记忆网络和门控循环神经网络，已经被确立为序列建模和转换问题（如语言建模和机器翻译）的最先进方法。众多努力持续推动循环语言模型和编码器-解码器架构的边界。循环模型通常沿着输入和输出序列的符号位置进行计算分解。将位置与计算时间步骤对齐，它们生成隐藏状态序列ht，作为前一个隐藏状态ht-1和位置t输入的函数。这种固有的顺序性质阻碍了训练样本内的并行化，这在较长序列长度时变得至关重要，因为内存约束限制了样本间的批处理。'
        },
        {
          id: 'model-architecture-zh',
          title: '3. 模型架构',
          content: '大多数竞争性神经序列转换模型都具有编码器-解码器结构。在这里，编码器将符号表示的输入序列(x1, ..., xn)映射到连续表示序列z = (z1, ..., zn)。给定z，解码器然后一次生成一个元素的输出序列(y1, ..., ym)。在每个步骤中，模型都是自回归的，在生成下一个符号时将先前生成的符号作为附加输入。Transformer遵循这种整体架构，对编码器和解码器都使用堆叠的自注意力和逐点全连接层，分别如图1的左半部分和右半部分所示。'
        }
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
.paper-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
  color: white;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: white;
}

.breadcrumb :deep(.el-breadcrumb__separator) {
  color: rgba(255, 255, 255, 0.7);
}

.loading-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.paper-content {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.paper-header {
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-bottom: 1px solid #e0e6ed;
}

.paper-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.4;
}

.paper-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.paper-meta > div {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5a6c7d;
  font-size: 14px;
}

.paper-meta .el-icon {
  color: #667eea;
}

.tags {
  margin-bottom: 20px;
}

.tags .el-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #5a6c7d;
  font-size: 14px;
}

.stat-item .el-icon {
  color: #667eea;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.main-content {
  display: flex;
  height: calc(100vh - 350px);
  min-height: 600px;
}

.content-left {
  flex: 1;
  border-right: 1px solid #e0e6ed;
  display: flex;
  flex-direction: column;
}

.paper-original {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.original-header {
  padding: 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e0e6ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.original-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-level {
  font-size: 14px;
  color: #5a6c7d;
  min-width: 40px;
  text-align: center;
}

.original-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: white;
}

.content-section {
  margin-bottom: 30px;
}

.content-section h3 {
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #667eea;
}

.section-content {
  line-height: 1.8;
  color: #4a5568;
  font-size: 16px;
}

.section-content p {
  margin-bottom: 15px;
}

.content-right {
  width: 400px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.tabs-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.paper-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.paper-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
}

.summary-content,
.translation-content,
.mindmap-content {
  padding: 20px;
  height: 100%;
}

.summary-section {
  margin-bottom: 25px;
}

.summary-section h3 {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 3px solid #667eea;
}

.summary-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.summary-section li {
  padding: 8px 0;
  color: #4a5568;
  line-height: 1.6;
  position: relative;
  padding-left: 20px;
}

.summary-section li::before {
  content: '•';
  color: #667eea;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.summary-section p {
  color: #4a5568;
  line-height: 1.7;
  margin: 0;
}

.translation-section {
  margin-bottom: 25px;
}

.translation-section h3 {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 3px solid #667eea;
}

.translation-section p {
  color: #4a5568;
  line-height: 1.7;
  background: white;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin: 0;
}

.mindmap-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mindmap-controls {
  padding: 15px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.mindmap-container {
  flex: 1;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  overflow: auto;
}

/* 思维导图样式 */
.mindmap-container :deep(.mindmap-root) {
  text-align: center;
  margin-bottom: 20px;
}

.mindmap-container :deep(.mindmap-node) {
  display: inline-block;
  padding: 8px 16px;
  margin: 5px;
  border-radius: 20px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.mindmap-container :deep(.mindmap-branch) {
  margin: 10px 0;
  padding-left: 20px;
}

.mindmap-container :deep(.mindmap-branch-node) {
  display: inline-block;
  padding: 6px 12px;
  margin: 3px;
  border-radius: 15px;
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
  font-weight: 500;
}

.mindmap-container :deep(.mindmap-leaf) {
  margin: 5px 0;
  padding-left: 40px;
}

.mindmap-container :deep(.mindmap-leaf-node) {
  display: inline-block;
  padding: 4px 8px;
  margin: 2px;
  border-radius: 10px;
  background: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid #e1bee7;
  font-size: 14px;
}

.paper-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
    height: auto;
  }
  
  .content-left {
    border-right: none;
    border-bottom: 1px solid #e0e6ed;
  }
  
  .content-right {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .paper-detail {
    padding: 10px;
  }
  
  .paper-header {
    padding: 20px;
  }
  
  .paper-title {
    font-size: 24px;
  }
  
  .paper-meta {
    flex-direction: column;
    gap: 10px;
  }
  
  .original-content {
    padding: 15px;
  }
  
  .summary-content,
  .translation-content,
  .mindmap-content {
    padding: 15px;
  }
  
  .paper-body {
    grid-template-columns: 1fr;
  }
}
</style>