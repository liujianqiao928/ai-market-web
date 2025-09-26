<template>
  <el-container class="layout-container">
    <!-- 顶部导航栏 -->
    <el-header class="layout-header">
      <Navbar />
    </el-header>
    
    <!-- 主要内容区域 -->
    <el-main class="layout-main">
      <router-view />
    </el-main>
    
    <!-- 底部 -->
    <el-footer class="layout-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">AI超市</h3>
            <p class="text-gray-600 text-sm">发现最优质的AI应用，探索人工智能的无限可能</p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4 class="text-sm font-medium text-gray-800 mb-2">产品</h4>
              <ul class="space-y-1">
                <li><a href="#" class="text-gray-600 text-sm hover:text-blue-600">精选应用</a></li>
                <li><a href="#" class="text-gray-600 text-sm hover:text-blue-600">AI域</a></li>
                <li><a href="#" class="text-gray-600 text-sm hover:text-blue-600">论坛</a></li>
              </ul>
            </div>
            <div class="link-group">
              <h4 class="text-sm font-medium text-gray-800 mb-2">资源</h4>
              <ul class="space-y-1">
                <li><a href="#" class="text-gray-600 text-sm hover:text-blue-600">学术论文</a></li>
                <li><a href="#" class="text-gray-600 text-sm hover:text-blue-600">开发文档</a></li>
                <li><a href="#" class="text-gray-600 text-sm hover:text-blue-600">API接口</a></li>
              </ul>
            </div>
            <div class="link-group">
              <h4 class="text-sm font-medium text-gray-800 mb-2">支持</h4>
              <ul class="space-y-1">
                <li><a href="#" class="text-gray-600 text-sm hover:text-blue-600">帮助中心</a></li>
                <li><a href="#" class="text-gray-600 text-sm hover:text-blue-600">联系我们</a></li>
                <li><a href="#" class="text-gray-600 text-sm hover:text-blue-600">意见反馈</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="text-gray-500 text-sm text-center">
            © 2024 AI超市. All rights reserved.
          </p>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.layout-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.layout-main {
  background: #f9fafb;
  min-height: calc(100vh - 120px);
}

.layout-footer {
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 40px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  margin-bottom: 30px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.footer-bottom {
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .footer-links {
    grid-template-columns: 1fr;
  }
}
</style>