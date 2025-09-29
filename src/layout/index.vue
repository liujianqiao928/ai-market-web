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
      <div class="footer-background">
        <div class="container">
          <div class="footer-content">
            <div class="footer-info">
              <div class="brand-section">
                <h3 class="brand-title">AI超市</h3>
                <div class="brand-icon">🤖</div>
              </div>
              <p class="brand-description">发现最优质的AI应用，探索人工智能的无限可能</p>
              <div class="social-links">
                <a href="#" class="social-link" title="微信">
                  <i class="social-icon">💬</i>
                </a>
                <a href="#" class="social-link" title="微博">
                  <i class="social-icon">📱</i>
                </a>
                <a href="#" class="social-link" title="GitHub">
                  <i class="social-icon">🔗</i>
                </a>
              </div>
            </div>
            <div class="footer-links">
              <div class="link-group">
                <h4 class="link-title">产品服务</h4>
                <ul class="link-list">
                  <li><a href="#" class="footer-link">精选应用</a></li>
                  <li><a href="#" class="footer-link">AI域</a></li>
                  <li><a href="#" class="footer-link">技术论坛</a></li>
                  <li><a href="#" class="footer-link">开发者工具</a></li>
                </ul>
              </div>
              <div class="link-group">
                <h4 class="link-title">学习资源</h4>
                <ul class="link-list">
                  <li><a href="#" class="footer-link">学术论文</a></li>
                  <li><a href="#" class="footer-link">开发文档</a></li>
                  <li><a href="#" class="footer-link">API接口</a></li>
                  <li><a href="#" class="footer-link">教程指南</a></li>
                </ul>
              </div>
              <div class="link-group">
                <h4 class="link-title">帮助支持</h4>
                <ul class="link-list">
                  <li><a href="#" class="footer-link">帮助中心</a></li>
                  <li><a href="#" class="footer-link">联系我们</a></li>
                  <li><a href="#" class="footer-link">意见反馈</a></li>
                  <li><a href="#" class="footer-link">服务条款</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <div class="footer-bottom-content">
              <p class="copyright">
                © 2024 AI超市. All rights reserved.
              </p>
              <div class="footer-meta">
                <span class="meta-item">ICP备案号：京ICP备2024000001号</span>
                <span class="meta-divider">|</span>
                <span class="meta-item">版本 v1.0.0</span>
              </div>
            </div>
          </div>
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
  position: relative;
  overflow: hidden;
}

.footer-background {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  position: relative;
  overflow: hidden;
}

.footer-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.footer-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  padding: 60px 0 40px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 20px;
  position: relative;
  overflow: hidden;
}

.footer-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  pointer-events: none;
}

.footer-info {
  color: #333;
  position: relative;
  z-index: 1;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.footer-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.brand-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: none;
  position: relative;
}

.brand-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 1px;
  opacity: 0.6;
}

.brand-icon {
  font-size: 32px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.brand-description {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 24px;
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
  border-radius: 12px;
  color: #667eea;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.social-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.social-link:hover::before {
  left: 100%;
}

.social-link:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.social-icon {
  font-size: 20px;
  font-style: normal;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  position: relative;
  z-index: 1;
}

.link-group {
  color: #333;
  padding: 24px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.link-group::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.link-group:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}

.link-group:hover::before {
  opacity: 1;
}

.link-title {
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 8px;
  z-index: 1;
}

.link-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-list li {
  margin-bottom: 12px;
}

.footer-link {
  color: rgba(55, 65, 81, 0.8);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  z-index: 1;
}

.footer-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 6px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  z-index: -1;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 8px;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 1px;
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: #667eea;
  transform: translateX(4px);
}

.footer-link:hover::before {
  opacity: 1;
  transform: scale(1);
}

.footer-link:hover::after {
  width: calc(100% - 16px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 24px 0;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  margin: 0 20px;
  border-radius: 0 0 20px 20px;
  position: relative;
}

.footer-bottom::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.copyright {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  margin: 0;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
}

.meta-item {
  transition: color 0.3s ease;
}

.meta-item:hover {
  color: rgba(0, 0, 0, 0.8);
}

.meta-divider {
  color: rgba(0, 0, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .footer-content {
    gap: 40px;
    padding: 50px 30px 30px;
    margin: 16px;
  }
  
  .footer-links {
    gap: 24px;
  }
  
  .link-group {
    padding: 20px;
  }
  
  .footer-bottom {
    margin: 0 16px;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 24px 30px;
    margin: 12px;
    border-radius: 20px;
  }
  
  .footer-info {
    padding: 16px;
    border-radius: 16px;
  }
  
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .link-group {
    padding: 16px;
    border-radius: 12px;
  }
  
  .brand-section {
    justify-content: center;
    text-align: center;
  }
  
  .brand-description {
    text-align: center;
    max-width: none;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-bottom {
    margin: 0 12px;
    border-radius: 0 0 16px 16px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }
  
  .footer-content {
    padding: 24px 16px 20px;
    margin: 8px;
    gap: 24px;
    border-radius: 16px;
  }
  
  .footer-info {
    padding: 12px;
    border-radius: 12px;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .link-group {
    padding: 12px;
    border-radius: 10px;
  }
  
  .brand-title {
    font-size: 24px;
  }
  
  .brand-icon {
    font-size: 28px;
  }
  
  .social-links {
    gap: 12px;
  }
  
  .social-link {
    width: 40px;
    height: 40px;
  }
  
  .footer-bottom {
    margin: 0 8px;
    border-radius: 0 0 12px 12px;
    padding: 16px 0;
  }
}
</style>