import Mock from 'mockjs'

// 配置Mock
Mock.setup({
  timeout: '200-600' // 模拟网络延迟
})

// 用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@aimarket.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: 'admin',
    nickname: '管理员',
    bio: 'AI超市管理员',
    followers: 1250,
    following: 89,
    posts: 156,
    joinedAt: '2023-01-15',
    isActive: true
  },
  {
    id: 2,
    username: 'researcher',
    email: 'researcher@aimarket.com',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    role: 'user',
    nickname: 'AI研究员',
    bio: '专注于深度学习和自然语言处理研究',
    followers: 892,
    following: 234,
    posts: 89,
    joinedAt: '2023-03-20',
    isActive: true
  },
  {
    id: 3,
    username: 'developer',
    email: 'developer@aimarket.com',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    role: 'user',
    nickname: 'AI开发者',
    bio: '全栈AI应用开发工程师',
    followers: 567,
    following: 123,
    posts: 45,
    joinedAt: '2023-06-10',
    isActive: true
  }
]

// AI应用数据
const aiApps = [
  {
    id: 1,
    name: 'ChatGPT',
    description: '强大的对话式AI助手，能够回答问题、协助写作、编程等多种任务',
    category: 'nlp',
    icon: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=ChatGPT%20logo%20modern%20AI%20assistant%20icon&image_size=square',
    rating: 4.8,
    downloads: 125000,
    tags: ['对话', 'AI助手', '写作', '编程'],
    featured: true,
    price: 'freemium',
    developer: 'OpenAI',
    version: '4.0',
    updatedAt: '2024-01-15',
    screenshots: [],
    features: ['多轮对话', '代码生成', '文本创作', '问题解答']
  },
  {
    id: 2,
    name: 'Midjourney',
    description: '顶级AI图像生成工具，通过文本描述创造惊艳的艺术作品',
    category: 'cv',
    icon: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Midjourney%20logo%20AI%20art%20generation%20icon&image_size=square',
    rating: 4.9,
    downloads: 89000,
    tags: ['图像生成', 'AI艺术', '创意设计'],
    featured: true,
    price: 'paid',
    developer: 'Midjourney Inc.',
    version: '6.0',
    updatedAt: '2024-01-10',
    screenshots: [],
    features: ['文本生图', '风格控制', '高清输出', '批量生成']
  },
  {
    id: 3,
    name: 'GitHub Copilot',
    description: 'AI编程助手，提供智能代码补全和生成建议',
    category: 'ml',
    icon: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=GitHub%20Copilot%20logo%20AI%20coding%20assistant%20icon&image_size=square',
    rating: 4.7,
    downloads: 156000,
    tags: ['编程', '代码生成', '开发工具'],
    featured: false,
    price: 'paid',
    developer: 'GitHub',
    version: '1.5',
    updatedAt: '2024-01-08',
    screenshots: [],
    features: ['代码补全', '函数生成', '注释生成', '多语言支持']
  },
  {
    id: 4,
    name: 'Stable Diffusion',
    description: '开源AI图像生成模型，支持本地部署和自定义训练',
    category: 'cv',
    icon: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Stable%20Diffusion%20logo%20open%20source%20AI%20icon&image_size=square',
    rating: 4.6,
    downloads: 78000,
    tags: ['开源', '图像生成', '本地部署'],
    featured: false,
    price: 'free',
    developer: 'Stability AI',
    version: '2.1',
    updatedAt: '2024-01-05',
    screenshots: [],
    features: ['开源免费', '本地运行', '模型微调', '插件扩展']
  },
  {
    id: 5,
    name: 'Claude',
    description: 'Anthropic开发的AI助手，擅长分析、写作和对话',
    category: 'nlp',
    icon: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Claude%20AI%20assistant%20logo%20Anthropic%20icon&image_size=square',
    rating: 4.7,
    downloads: 67000,
    tags: ['AI助手', '分析', '写作'],
    featured: true,
    price: 'freemium',
    developer: 'Anthropic',
    version: '3.0',
    updatedAt: '2024-01-12',
    screenshots: [],
    features: ['长文本处理', '逻辑推理', '安全对话', '多语言支持']
  }
]

// 论坛帖子数据
const forumPosts = [
  {
    id: 1,
    title: 'ChatGPT 4.0 使用体验分享',
    content: '最近体验了ChatGPT 4.0，感觉在逻辑推理和代码生成方面有了显著提升...',
    author: users[1],
    category: 'experience',
    tags: ['ChatGPT', '体验分享', 'GPT-4'],
    views: 1250,
    replies: 89,
    likes: 156,
    isPinned: true,
    isFeatured: false,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 2,
    title: 'AI绘画工具对比：Midjourney vs Stable Diffusion',
    content: '作为一名设计师，我对比测试了目前主流的AI绘画工具...',
    author: users[2],
    category: 'discussion',
    tags: ['AI绘画', 'Midjourney', 'Stable Diffusion', '对比'],
    views: 892,
    replies: 67,
    likes: 123,
    isPinned: false,
    isFeatured: true,
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T18:30:00Z'
  },
  {
    id: 3,
    title: '如何训练自己的AI模型？新手指南',
    content: '很多朋友问我如何开始训练自己的AI模型，今天分享一个详细的新手指南...',
    author: users[0],
    category: 'tutorial',
    tags: ['机器学习', '模型训练', '新手指南'],
    views: 2340,
    replies: 145,
    likes: 289,
    isPinned: true,
    isFeatured: true,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T11:45:00Z'
  },
  {
    id: 4,
    title: 'AI在医疗领域的最新应用',
    content: '分享一些AI在医疗诊断、药物发现等领域的最新进展...',
    author: users[1],
    category: 'news',
    tags: ['AI医疗', '医疗诊断', '药物发现'],
    views: 567,
    replies: 34,
    likes: 78,
    isPinned: false,
    isFeatured: false,
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T15:10:00Z'
  },
  {
    id: 5,
    title: '开源AI项目推荐',
    content: '整理了一些优秀的开源AI项目，包括模型、工具和框架...',
    author: users[2],
    category: 'resources',
    tags: ['开源', 'AI项目', '推荐'],
    views: 1890,
    replies: 112,
    likes: 234,
    isPinned: false,
    isFeatured: false,
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-11T13:15:00Z'
  }
]

// 学术论文数据
const papers = [
  {
    id: 1,
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
    abstract: '本文提出了Transformer模型，完全基于注意力机制，摒弃了循环和卷积结构...',
    field: 'nlp',
    keywords: ['Transformer', '注意力机制', '神经网络'],
    venue: 'NeurIPS',
    year: 2017,
    citations: 45672,
    impactFactor: 9.2,
    publishedAt: '2017-06-12T00:00:00Z',
    pdfUrl: 'https://arxiv.org/pdf/1706.03762.pdf',
    relevanceScore: 98.5,
    bookmarked: false
  },
  {
    id: 2,
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee'],
    abstract: 'BERT通过在大规模无标注文本上进行双向预训练，在多个NLP任务上取得了突破性进展...',
    field: 'nlp',
    keywords: ['BERT', '预训练', '双向编码'],
    venue: 'NAACL',
    year: 2019,
    citations: 38945,
    impactFactor: 8.7,
    publishedAt: '2018-10-11T00:00:00Z',
    pdfUrl: 'https://arxiv.org/pdf/1810.04805.pdf',
    relevanceScore: 96.8,
    bookmarked: true
  },
  {
    id: 3,
    title: 'ResNet: Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren'],
    abstract: '本文提出了残差学习框架，解决了深度神经网络训练中的退化问题...',
    field: 'cv',
    keywords: ['ResNet', '残差学习', '深度网络'],
    venue: 'CVPR',
    year: 2016,
    citations: 89234,
    impactFactor: 11.5,
    publishedAt: '2015-12-10T00:00:00Z',
    pdfUrl: 'https://arxiv.org/pdf/1512.03385.pdf',
    relevanceScore: 95.2,
    bookmarked: false
  },
  {
    id: 4,
    title: 'Generative Adversarial Networks',
    authors: ['Ian Goodfellow', 'Jean Pouget-Abadie', 'Mehdi Mirza'],
    abstract: 'GAN通过对抗训练的方式，让生成器和判别器相互博弈，生成高质量的数据...',
    field: 'ml',
    keywords: ['GAN', '生成对抗网络', '生成模型'],
    venue: 'NeurIPS',
    year: 2014,
    citations: 67891,
    impactFactor: 9.2,
    publishedAt: '2014-06-10T00:00:00Z',
    pdfUrl: 'https://arxiv.org/pdf/1406.2661.pdf',
    relevanceScore: 94.7,
    bookmarked: true
  },
  {
    id: 5,
    title: 'Deep Q-Network for Reinforcement Learning',
    authors: ['Volodymyr Mnih', 'Koray Kavukcuoglu', 'David Silver'],
    abstract: 'DQN结合了深度学习和Q学习，在Atari游戏中达到了人类水平的表现...',
    field: 'rl',
    keywords: ['DQN', '强化学习', 'Q学习'],
    venue: 'Nature',
    year: 2015,
    citations: 23456,
    impactFactor: 49.9,
    publishedAt: '2015-02-26T00:00:00Z',
    pdfUrl: 'https://www.nature.com/articles/nature14236.pdf',
    relevanceScore: 92.3,
    bookmarked: false
  }
]

// 用户认证相关API
Mock.mock('/api/auth/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  
  // 简单的用户验证
  const user = users.find(u => u.username === username)
  
  if (user && password === '123456') {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: Mock.Random.string('upper', 32),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          nickname: user.nickname
        }
      }
    }
  } else {
    return {
      code: 401,
      message: '用户名或密码错误',
      data: null
    }
  }
})

Mock.mock('/api/auth/register', 'post', (options) => {
  const { username, email, password } = JSON.parse(options.body)
  
  // 检查用户是否已存在
  const existingUser = users.find(u => u.username === username || u.email === email)
  
  if (existingUser) {
    return {
      code: 400,
      message: '用户名或邮箱已存在',
      data: null
    }
  }
  
  // 创建新用户
  const newUser = {
    id: users.length + 1,
    username,
    email,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: 'user',
    nickname: username,
    bio: '',
    followers: 0,
    following: 0,
    posts: 0,
    joinedAt: new Date().toISOString().split('T')[0],
    isActive: true
  }
  
  users.push(newUser)
  
  return {
    code: 200,
    message: '注册成功',
    data: {
      token: Mock.Random.string('upper', 32),
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
        nickname: newUser.nickname
      }
    }
  }
})

Mock.mock('/api/auth/logout', 'post', () => {
  return {
    code: 200,
    message: '退出成功',
    data: null
  }
})

// 用户信息API
Mock.mock('/api/user/profile', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: users[0] // 返回当前登录用户信息
  }
})

// AI应用相关API
Mock.mock(/\/api\/apps(\?.*)?/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const category = url.searchParams.get('category')
  const search = url.searchParams.get('search')
  const page = parseInt(url.searchParams.get('page')) || 1
  const pageSize = parseInt(url.searchParams.get('pageSize')) || 12
  
  let filteredApps = [...aiApps]
  
  // 分类过滤
  if (category && category !== 'all') {
    filteredApps = filteredApps.filter(app => app.category === category)
  }
  
  // 搜索过滤
  if (search) {
    const searchLower = search.toLowerCase()
    filteredApps = filteredApps.filter(app => 
      app.name.toLowerCase().includes(searchLower) ||
      app.description.toLowerCase().includes(searchLower) ||
      app.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }
  
  // 分页
  const total = filteredApps.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const apps = filteredApps.slice(start, end)
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      apps,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }
})

Mock.mock(/\/api\/apps\/featured/, 'get', () => {
  const featuredApps = aiApps.filter(app => app.featured)
  return {
    code: 200,
    message: '获取成功',
    data: featuredApps
  }
})

Mock.mock(/\/api\/apps\/(\d+)/, 'get', (options) => {
  const id = parseInt(options.url.match(/\/api\/apps\/(\d+)/)[1])
  const app = aiApps.find(a => a.id === id)
  
  if (app) {
    return {
      code: 200,
      message: '获取成功',
      data: app
    }
  } else {
    return {
      code: 404,
      message: '应用不存在',
      data: null
    }
  }
})

// 论坛相关API
Mock.mock(/\/api\/forum\/posts(\?.*)?/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const category = url.searchParams.get('category')
  const search = url.searchParams.get('search')
  const page = parseInt(url.searchParams.get('page')) || 1
  const pageSize = parseInt(url.searchParams.get('pageSize')) || 10
  
  let filteredPosts = [...forumPosts]
  
  // 分类过滤
  if (category && category !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.category === category)
  }
  
  // 搜索过滤
  if (search) {
    const searchLower = search.toLowerCase()
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }
  
  // 排序：置顶帖子在前
  filteredPosts.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
  
  // 分页
  const total = filteredPosts.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const posts = filteredPosts.slice(start, end)
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      posts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }
})

Mock.mock(/\/api\/forum\/posts\/(\d+)/, 'get', (options) => {
  const id = parseInt(options.url.match(/\/api\/forum\/posts\/(\d+)/)[1])
  const post = forumPosts.find(p => p.id === id)
  
  if (post) {
    return {
      code: 200,
      message: '获取成功',
      data: post
    }
  } else {
    return {
      code: 404,
      message: '帖子不存在',
      data: null
    }
  }
})

// 论文相关API
Mock.mock(/\/api\/papers(\?.*)?/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const field = url.searchParams.get('field')
  const search = url.searchParams.get('search')
  const year = url.searchParams.get('year')
  const page = parseInt(url.searchParams.get('page')) || 1
  const pageSize = parseInt(url.searchParams.get('pageSize')) || 10
  
  let filteredPapers = [...papers]
  
  // 领域过滤
  if (field) {
    filteredPapers = filteredPapers.filter(paper => paper.field === field)
  }
  
  // 年份过滤
  if (year) {
    filteredPapers = filteredPapers.filter(paper => paper.year === parseInt(year))
  }
  
  // 搜索过滤
  if (search) {
    const searchLower = search.toLowerCase()
    filteredPapers = filteredPapers.filter(paper => 
      paper.title.toLowerCase().includes(searchLower) ||
      paper.authors.some(author => author.toLowerCase().includes(searchLower)) ||
      paper.abstract.toLowerCase().includes(searchLower) ||
      paper.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
    )
  }
  
  // 分页
  const total = filteredPapers.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paperList = filteredPapers.slice(start, end)
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      papers: paperList,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }
})

Mock.mock(/\/api\/papers\/(\d+)/, 'get', (options) => {
  const id = parseInt(options.url.match(/\/api\/papers\/(\d+)/)[1])
  const paper = papers.find(p => p.id === id)
  
  if (paper) {
    return {
      code: 200,
      message: '获取成功',
      data: paper
    }
  } else {
    return {
      code: 404,
      message: '论文不存在',
      data: null
    }
  }
})

// 统计数据API
Mock.mock('/api/stats/overview', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      totalApps: aiApps.length,
      totalUsers: users.length,
      totalPosts: forumPosts.length,
      totalPapers: papers.length,
      monthlyActiveUsers: 12450,
      dailyDownloads: 3280
    }
  }
})

console.log('Mock.js 数据模拟服务已启动')

export default Mock