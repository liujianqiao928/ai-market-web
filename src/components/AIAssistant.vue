<template>
  <div class="ai-assistant">
    <!-- 遮罩层 (仅在放大模式下显示) -->
    <transition name="overlay-fade">
      <div v-if="showChat && isExpanded" class="chat-overlay" @click="shrinkChat"></div>
    </transition>

    <!-- 浮动助手图标 -->
    <div 
      v-if="!isMinimized"
      class="assistant-icon" 
      @click="toggleChat"
      :class="{ 'active': showChat }"
    >
      <div class="icon-wrapper">
        <div class="icon-bg"></div>
        <div class="icon-content">
          <span class="icon-text">A</span>
        </div>
        <div class="pulse-ring"></div>
        <div class="pulse-ring-2"></div>
      </div>
      <div class="tooltip" v-if="!showChat">点击与小A助手对话</div>
    </div>

    <!-- 最小化状态的小图标 -->
    <div 
      v-if="isMinimized"
      class="minimized-icon"
      @click="restoreChat"
    >
      <span class="mini-text">A</span>
    </div>

    <!-- 对话框 -->
    <transition name="chat-slide">
      <div v-if="showChat" class="chat-dialog" :class="{ 'expanded': isExpanded }">
        <div class="chat-header">
          <div class="header-info">
            <div class="assistant-avatar">
              <span>A</span>
            </div>
            <div class="assistant-info">
              <h4>小A助手</h4>
              <span class="status">在线</span>
            </div>
          </div>
          <div class="header-actions">
            <button 
              @click="toggleExpand" 
              class="action-btn expand-btn" 
              :title="isExpanded ? '缩小' : '放大'"
            >
              <svg v-if="!isExpanded" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,3 21,3 21,9"></polyline>
                <polyline points="9,21 3,21 3,15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="4,14 10,14 10,20"></polyline>
                <polyline points="20,10 14,10 14,4"></polyline>
                <line x1="14" y1="10" x2="21" y2="3"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
            <button @click="minimizeChat" class="action-btn minimize-btn" title="最小化">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button @click="closeChat" class="action-btn close-btn" title="关闭">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="chat-body">
          <div class="messages-container" ref="messagesContainer">
            <div 
              v-for="message in messages" 
              :key="message.id"
              class="message"
              :class="{ 'user-message': message.type === 'user', 'assistant-message': message.type === 'assistant' }"
            >
              <div class="message-avatar" v-if="message.type === 'assistant'">
                <span>A</span>
              </div>
              <div class="message-content">
                <div class="message-bubble">
                  {{ message.content }}
                </div>
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
              </div>
              <div class="message-avatar user-avatar" v-if="message.type === 'user'">
                <span>我</span>
              </div>
            </div>
            <div v-if="isTyping" class="message assistant-message typing-message">
              <div class="message-avatar">
                <span>A</span>
              </div>
              <div class="message-content">
                <div class="message-bubble typing-bubble">
                  <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-footer">
          <div class="input-container">
            <input 
              v-model="inputMessage"
              @keyup.enter="sendMessage"
              @input="handleInput"
              type="text" 
              placeholder="输入您的问题..."
              class="message-input"
              :disabled="isTyping"
            />
            <button 
              @click="sendMessage" 
              class="send-btn"
              :disabled="!inputMessage.trim() || isTyping"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9"></polygon>
              </svg>
            </button>
          </div>
          <div class="quick-actions">
            <button @click="addQuickMessage('你好')" class="quick-btn">👋 你好</button>
            <button @click="addQuickMessage('帮助')" class="quick-btn">❓ 帮助</button>
            <button @click="addQuickMessage('功能介绍')" class="quick-btn">📋 功能介绍</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

// 响应式数据
const showChat = ref(false)
const isMinimized = ref(false)
const isExpanded = ref(false)
const inputMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)

// 消息列表
const messages = ref([
  {
    id: 1,
    type: 'assistant',
    content: '你好！我是小A助手，很高兴为您服务！有什么可以帮助您的吗？',
    timestamp: new Date()
  }
])

// 切换聊天窗口
const toggleChat = () => {
  showChat.value = !showChat.value
  if (showChat.value) {
    isMinimized.value = false
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 关闭聊天
const closeChat = () => {
  showChat.value = false
  isMinimized.value = false
  isExpanded.value = false
}

// 最小化聊天
const minimizeChat = () => {
  showChat.value = false
  isMinimized.value = true
  isExpanded.value = false
}

// 恢复聊天
const restoreChat = () => {
  showChat.value = true
  isMinimized.value = false
  nextTick(() => {
    scrollToBottom()
  })
}

// 切换放大/缩小
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  nextTick(() => {
    scrollToBottom()
  })
}

// 缩小对话框
const shrinkChat = () => {
  isExpanded.value = false
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return

  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: inputMessage.value.trim(),
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  inputMessage.value = ''
  
  nextTick(() => {
    scrollToBottom()
  })

  // 模拟AI回复
  isTyping.value = true
  
  setTimeout(() => {
    const responses = [
      '我理解您的问题，让我为您详细解答...',
      '这是一个很好的问题！根据我的了解...',
      '感谢您的提问，我来帮您分析一下...',
      '基于您的描述，我建议...',
      '这个问题很有意思，让我为您详细说明...'
    ]
    
    const assistantMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date()
    }

    messages.value.push(assistantMessage)
    isTyping.value = false
    
    nextTick(() => {
      scrollToBottom()
    })
  }, 1500)
}

// 快速消息
const addQuickMessage = (message) => {
  inputMessage.value = message
  sendMessage()
}

// 处理输入
const handleInput = () => {
  // 可以在这里添加输入处理逻辑
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}

/* 遮罩层样式 */
.chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9998;
}

/* 助手图标样式 */
.assistant-icon {
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.assistant-icon:hover {
  transform: translateY(-2px);
}

.icon-wrapper {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.4),
    0 4px 16px rgba(118, 75, 162, 0.3);
  transition: all 0.3s ease;
}

.assistant-icon:hover .icon-bg {
  transform: scale(1.1);
  box-shadow: 
    0 12px 40px rgba(102, 126, 234, 0.5),
    0 6px 20px rgba(118, 75, 162, 0.4);
}

.icon-content {
  position: relative;
  z-index: 2;
  color: white;
  font-weight: bold;
  font-size: 24px;
  animation: float 3s ease-in-out infinite;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(102, 126, 234, 0.6);
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.pulse-ring-2 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(118, 75, 162, 0.4);
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(4px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.assistant-icon:hover .tooltip {
  opacity: 1;
  transform: translateY(0);
}

/* 最小化图标 */
.minimized-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  animation: bounce 2s infinite;
}

.minimized-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 对话框样式 */
.chat-dialog {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  height: 500px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 9999;
}

/* 放大模式样式 */
.chat-dialog.expanded {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(90vw, 800px);
  height: min(85vh, 700px);
  bottom: auto;
  right: auto;
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.chat-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.assistant-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}

.assistant-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.status {
  font-size: 12px;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.expand-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.chat-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 放大模式下的消息容器 */
.chat-dialog.expanded .messages-container {
  padding: 24px;
  gap: 16px;
}

.message {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

/* 放大模式下的头像 */
.chat-dialog.expanded .message-avatar {
  width: 36px;
  height: 36px;
  font-size: 14px;
}

.assistant-message .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.message-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 放大模式下的消息内容 */
.chat-dialog.expanded .message-content {
  max-width: 75%;
}

.user-message .message-content {
  align-items: flex-end;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

/* 放大模式下的消息气泡 */
.chat-dialog.expanded .message-bubble {
  padding: 14px 18px;
  font-size: 15px;
  line-height: 1.5;
}

.assistant-message .message-bubble {
  background: #f1f5f9;
  color: #334155;
  border-bottom-left-radius: 6px;
}

.user-message .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 6px;
}

.message-time {
  font-size: 11px;
  color: #64748b;
  padding: 0 4px;
}

.typing-bubble {
  background: #f1f5f9 !important;
  padding: 16px !important;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #64748b;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.chat-footer {
  padding: 16px;
  background: rgba(248, 250, 252, 0.8);
  border-top: 1px solid rgba(226, 232, 240, 0.5);
}

/* 放大模式下的底部 */
.chat-dialog.expanded .chat-footer {
  padding: 20px 24px;
}

.input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  background: white;
  transition: all 0.2s ease;
}

/* 放大模式下的输入框 */
.chat-dialog.expanded .message-input {
  padding: 14px 18px;
  font-size: 15px;
}

.message-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.send-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

/* 放大模式下的发送按钮 */
.chat-dialog.expanded .send-btn {
  width: 48px;
  height: 48px;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 6px 12px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  font-size: 12px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 放大模式下的快捷按钮 */
.chat-dialog.expanded .quick-btn {
  padding: 8px 14px;
  font-size: 13px;
}

.quick-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
}

/* 动画 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-4px); }
  60% { transform: translateY(-2px); }
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
}

/* 过渡动画 */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* 放大模式的进入动画 */
.chat-dialog.expanded.chat-slide-enter-from {
  transform: translate(-50%, -50%) scale(0.8);
}

.chat-dialog.expanded.chat-slide-leave-to {
  transform: translate(-50%, -50%) scale(0.8);
}

/* 遮罩层动画 */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: all 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-assistant {
    bottom: 16px;
    right: 16px;
  }
  
  .chat-dialog {
    width: calc(100vw - 32px);
    max-width: 360px;
    height: 450px;
    bottom: 70px;
    right: -8px;
  }
  
  .chat-dialog.expanded {
    width: calc(100vw - 24px);
    height: calc(100vh - 24px);
    top: 12px;
    left: 12px;
    transform: none;
    border-radius: 20px;
  }
  
  .assistant-icon .icon-wrapper {
    width: 56px;
    height: 56px;
  }
  
  .icon-content {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .chat-dialog {
    height: 400px;
  }
  
  .chat-dialog.expanded {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    border-radius: 0;
  }
  
  .messages-container {
    padding: 12px;
  }
  
  .chat-footer {
    padding: 12px;
  }
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}
</style>