import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', hideInMenu: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/featured',
    children: [
      {
        path: 'featured',
        name: 'Featured',
        component: () => import('@/views/Featured.vue'),
        meta: { title: '精选', icon: 'Star' }
      },
      {
        path: 'ai-domain',
        name: 'AiDomain',
        component: () => import('@/views/AiDomain.vue'),
        meta: { title: 'AI域', icon: 'Cpu' },
        children: [
          {
            path: 'category/:id',
            name: 'AiCategory',
            component: () => import('@/views/AiCategory.vue'),
            meta: { title: 'AI分类', hideInMenu: true }
          },
          {
            path: 'app/:id',
            name: 'AiAppDetail',
            component: () => import('@/views/AiAppDetail.vue'),
            meta: { title: 'AI应用详情', hideInMenu: true }
          }
        ]
      },
      {
        path: 'forum',
        name: 'Forum',
        component: () => import('@/views/Forum.vue'),
        meta: { title: '论坛', icon: 'ChatDotRound' },
        children: [
          {
            path: 'post/:id',
            name: 'PostDetail',
            component: () => import('@/views/PostDetail.vue'),
            meta: { title: '帖子详情', hideInMenu: true }
          },
          {
            path: 'create',
            name: 'CreatePost',
            component: () => import('@/views/CreatePost.vue'),
            meta: { title: '发布帖子', requiresAuth: true, hideInMenu: true }
          }
        ]
      },
      {
        path: 'papers',
        name: 'Papers',
        component: () => import('@/views/Papers.vue'),
        meta: { title: '论文', icon: 'Document' },
        children: [
          {
            path: 'detail/:id',
            name: 'PaperDetail',
            component: () => import('@/views/PaperDetail.vue'),
            meta: { title: '论文详情', hideInMenu: true }
          }
        ]
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: { title: '个人中心', requiresAuth: true, hideInMenu: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { title: '页面不存在', hideInMenu: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - AI超市` : 'AI超市'
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/login')
      return
    }
  }
  
  // 如果已登录用户访问登录页，重定向到首页
  if (to.name === 'Login' && localStorage.getItem('token')) {
    next('/')
    return
  }
  
  next()
})

export default router