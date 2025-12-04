<template>
  <div class="chat-room-modern">
    <!-- 侧边栏 -->
    <div class="sidebar-modern">
      <div class="sidebar-header-modern">
        <div class="sidebar-title">
          <div class="title-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L9 18L21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>历史对话</h3>
        </div>
        <button class="new-chat-btn" @click="createNewChat" title="新建对话">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div class="history-list-modern">
        <div
          v-for="session in historySessions"
          :key="session.roomId"
          :class="['history-item-modern', { active: session.roomId === roomId }]"
          @click="loadSession(session.roomId)"
        >
          <div class="history-item-content">
            <div class="history-item-title">
              <span class="history-icon">💬</span>
              对话 {{ session.roomId }}
            </div>
            <div class="history-item-time">{{ formatTime(session.timestamp) }}</div>
            <div class="history-item-preview">{{ getLastMessage(session.messages) }}</div>
          </div>
          <button 
            class="delete-btn" 
            @click.stop="deleteSession(session.roomId)"
            title="删除对话"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div v-if="historySessions.length === 0" class="empty-history-modern">
          <div class="empty-icon">📝</div>
          <div class="empty-text">暂无历史对话</div>
          <div class="empty-subtext">开始一场新的脑筋急转弯吧！</div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content-modern">
      <!-- 聊天头部 -->
      <div class="chat-header-modern">
        <div class="chat-header-left">
          <div class="chat-title">
            <h2>AI 脑筋急转弯</h2>
            <div class="chat-subtitle">智能对话，挑战思维</div>
          </div>
        </div>
        <div class="chat-header-right">
          <div class="room-info-modern">
            <span class="room-label">房间号</span>
            <span class="room-id">{{ roomId }}</span>
          </div>
          <div class="status-indicator" :class="{ online: gameStarted && !gameEnded }">
            <div class="status-dot"></div>
            <span class="status-text">{{ getStatusText() }}</span>
          </div>
        </div>
      </div>

      <!-- 消息区域 -->
      <div class="chat-messages-modern" ref="messagesContainer">
        <div v-if="messages.length === 0" class="welcome-message">
          <div class="welcome-icon">🤖</div>
          <h3>欢迎来到AI脑筋急转弯！</h3>
          <p>点击"开始"按钮，让我为您准备一道有趣的脑筋急转弯题目。</p>
          <div class="welcome-tips">
            <div class="tip-item">
              <span class="tip-icon">💡</span>
              尽量用简洁的语言描述你的答案
            </div>
            <div class="tip-item">
              <span class="tip-icon">🎯</span>
              可以从不同角度思考问题
            </div>
            <div class="tip-item">
              <span class="tip-icon">⚡</span>
              我会根据你的回答给出提示
            </div>
          </div>
        </div>
        
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-item-modern', msg.role === 'ai' ? 'ai-message' : 'user-message']"
        >
          <div class="message-avatar-modern">
            <div class="avatar-icon">
              {{ msg.role === 'ai' ? '🤖' : '👤' }}
            </div>
          </div>
          <div class="message-content-modern">
            <div class="message-bubble-modern">
              <div class="message-text">{{ msg.content }}</div>
              <div class="message-time">{{ formatMessageTime(msg.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 控制区域 -->
      <div class="chat-controls-modern">
        <div class="controls-top">
          <div class="control-buttons-modern">
            <button
              class="control-btn control-btn-primary"
              :disabled="gameStarted"
              @click="handleStart"
            >
              <span class="btn-icon">🚀</span>
              开始游戏
            </button>
            <button
              class="control-btn control-btn-secondary"
              :disabled="!gameStarted || gameEnded"
              @click="handleHint"
            >
              <span class="btn-icon">💡</span>
              提示
            </button>
            <button
              class="control-btn control-btn-danger"
              :disabled="gameEnded"
              @click="handleEnd"
            >
              <span class="btn-icon">🏁</span>
              结束游戏
            </button>
          </div>
          
          <div class="game-progress" v-if="gameStarted && !gameEnded">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ progress }}%</span>
          </div>
        </div>

        <div class="input-area-modern">
          <div class="input-wrapper">
            <input
              v-model="inputMessage"
              type="text"
              placeholder="输入你的答案或想法..."
              class="message-input-modern"
              :disabled="!gameStarted || gameEnded"
              @keypress.enter="sendMessage"
            />
            <button
              class="send-button-modern"
              :disabled="!gameStarted || gameEnded || !inputMessage.trim()"
              @click="sendMessage"
              :class="{ sending: sending }"
            >
              <span class="send-icon" v-if="!sending">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="sending-spinner" v-else>
                <div class="spinner"></div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { Button as AButton, Input as AInput, message } from 'ant-design-vue'
import { chatApi, type ChatMessage } from '../api/chat'

interface HistorySession {
  roomId: string
  timestamp: number
  messages: ChatMessage[]
}

const roomId = ref('')
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const gameStarted = ref(false)
const gameEnded = ref(false)
const sending = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const historySessions = ref<HistorySession[]>([])

// 计算进度
const progress = computed(() => {
  if (!gameStarted.value) return 0
  if (gameEnded.value) return 100
  
  const aiMessages = messages.value.filter(m => m.role === 'ai').length
  const userMessages = messages.value.filter(m => m.role === 'user').length
  
  // 简单的进度计算逻辑
  return Math.min(90, (aiMessages + userMessages) * 10)
})

onMounted(() => {
  roomId.value = Math.floor(100000 + Math.random() * 900000).toString()
  loadHistorySessions()
})

const loadHistorySessions = () => {
  const stored = localStorage.getItem('chatHistory')
  if (stored) {
    historySessions.value = JSON.parse(stored)
  }
}

const saveCurrentSession = () => {
  if (messages.value.length === 0) return

  const existingIndex = historySessions.value.findIndex(
    s => s.roomId === roomId.value
  )

  const session: HistorySession = {
    roomId: roomId.value,
    timestamp: Date.now(),
    messages: messages.value
  }

  if (existingIndex >= 0) {
    historySessions.value[existingIndex] = session
  } else {
    historySessions.value.unshift(session)
  }

  localStorage.setItem('chatHistory', JSON.stringify(historySessions.value))
}

const deleteSession = (sessionRoomId: string) => {
  historySessions.value = historySessions.value.filter(s => s.roomId !== sessionRoomId)
  localStorage.setItem('chatHistory', JSON.stringify(historySessions.value))
  
  if (sessionRoomId === roomId.value) {
    createNewChat()
  }
}

const createNewChat = () => {
  roomId.value = Math.floor(100000 + Math.random() * 900000).toString()
  messages.value = []
  inputMessage.value = ''
  gameStarted.value = false
  gameEnded.value = false
  sending.value = false
}

const loadSession = (sessionRoomId: string) => {
  const session = historySessions.value.find(s => s.roomId === sessionRoomId)
  if (session) {
    roomId.value = session.roomId
    messages.value = [...session.messages]
    gameStarted.value = true
    gameEnded.value = session.messages.some(m =>
      m.role === 'ai' && m.content.includes('游戏已结束')
    )
    scrollToBottom()
  }
}

const getLastMessage = (messages: ChatMessage[]) => {
  if (messages.length === 0) return '暂无消息'
  const lastMessage = messages[messages.length - 1]
  return lastMessage.content.length > 20 
    ? lastMessage.content.substring(0, 20) + '...'
    : lastMessage.content
}

const getStatusText = () => {
  if (!gameStarted.value) return '等待开始'
  if (gameEnded.value) return '游戏结束'
  return '游戏中'
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`

  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatMessageTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const addMessage = (role: 'user' | 'ai', content: string) => {
  messages.value.push({
    role,
    content,
    timestamp: Date.now()
  })
  scrollToBottom()
  saveCurrentSession()
}

const handleStart = async () => {
  if (gameStarted.value) return

  try {
    sending.value = true
    const response = await chatApi.doChat(roomId.value, '开始')

    addMessage('user', '开始')
    addMessage('ai', response.reply)
    gameStarted.value = true

    if (response.reply.includes('游戏已结束')) {
      gameEnded.value = true
    }
  } catch (error) {
    message.error('发送失败，请重试')
    console.error('Start game error:', error)
  } finally {
    sending.value = false
  }
}

const handleEnd = async () => {
  if (gameEnded.value) return

  try {
    sending.value = true
    const response = await chatApi.doChat(roomId.value, '结束')

    addMessage('user', '结束')
    addMessage('ai', response.reply)
    gameEnded.value = true
  } catch (error) {
    message.error('发送失败，请重试')
    console.error('End game error:', error)
  } finally {
    sending.value = false
  }
}

const handleHint = async () => {
  if (!gameStarted.value || gameEnded.value) return

  try {
    sending.value = true
    const response = await chatApi.doChat(roomId.value, '提示')

    addMessage('user', '提示')
    addMessage('ai', response.reply)
  } catch (error) {
    message.error('发送失败，请重试')
    console.error('Hint error:', error)
  } finally {
    sending.value = false
  }
}

const sendMessage = async () => {
  const msgContent = inputMessage.value.trim()
  if (!msgContent || !gameStarted.value || gameEnded.value) return

  try {
    sending.value = true
    const response = await chatApi.doChat(roomId.value, msgContent)

    addMessage('user', msgContent)
    addMessage('ai', response.reply)

    if (response.reply.includes('游戏已结束')) {
      gameEnded.value = true
    }

    inputMessage.value = ''
  } catch (error) {
    message.error('发送失败，请重试')
    console.error('Send message error:', error)
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
/* ==========================================
   现代极简风格 - 聊天室样式
   ========================================== */

.chat-room-modern {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 侧边栏样式 */
.sidebar-modern {
  width: 320px;
  background: rgba(30, 41, 59, 0.8);
  border-right: 1px solid rgba(51, 65, 85, 0.5);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  position: relative;
}

.sidebar-header-modern {
  padding: 20px;
  border-bottom: 1px solid rgba(51, 65, 85, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}

.sidebar-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #f8fafc;
}

.new-chat-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.new-chat-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

.new-chat-btn svg {
  width: 16px;
  height: 16px;
}

.history-list-modern {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.history-item-modern {
  padding: 16px;
  margin-bottom: 12px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.history-item-modern:hover {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.history-item-modern.active {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.5);
}

.history-item-content {
  flex: 1;
  min-width: 0;
}

.history-item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #f8fafc;
  margin-bottom: 4px;
}

.history-icon {
  font-size: 14px;
}

.history-item-time {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.history-item-preview {
  font-size: 13px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
}

.history-item-modern:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.delete-btn svg {
  width: 14px;
  height: 14px;
}

.empty-history-modern {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #94a3b8;
}

.empty-subtext {
  font-size: 14px;
  color: #64748b;
}

/* 主内容区样式 */
.main-content-modern {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
}

.chat-header-modern {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(51, 65, 85, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 41, 59, 0.4);
}

.chat-header-left {
  flex: 1;
}

.chat-title h2 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #f8fafc;
}

.chat-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

.chat-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.room-info-modern {
  text-align: right;
}

.room-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 2px;
}

.room-id {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #f8fafc;
  font-family: 'Fira Code', monospace;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(51, 65, 85, 0.3);
  border: 1px solid rgba(51, 65, 85, 0.5);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #64748b;
  transition: all 0.3s ease;
}

.status-indicator.online .status-dot {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.status-indicator.online .status-text {
  color: #10b981;
}

/* 消息区域样式 */
.chat-messages-modern {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.welcome-message {
  text-align: center;
  padding: 60px 40px;
  max-width: 600px;
  margin: 0 auto;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 24px;
  animation: bounce 2s infinite;
}

.welcome-message h3 {
  font-size: 24px;
  font-weight: 600;
  color: #f8fafc;
  margin: 0 0 16px 0;
}

.welcome-message p {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 32px 0;
}

.welcome-tips {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(51, 65, 85, 0.3);
}

.tip-icon {
  font-size: 18px;
}

.tip-item span:last-child {
  font-size: 14px;
  color: #e2e8f0;
}

.message-item-modern {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: messageSlideIn 0.3s ease-out;
}

.ai-message {
  flex-direction: row;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar-modern {
  flex-shrink: 0;
}

.avatar-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.5);
}

.ai-message .avatar-icon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
  border-color: rgba(59, 130, 246, 0.3);
}

.user-message .avatar-icon {
  background: linear-gradient(135deg, rgba(6, 214, 160, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
  border-color: rgba(6, 214, 160, 0.3);
}

.message-content-modern {
  max-width: 70%;
}

.message-bubble-modern {
  padding: 16px 20px;
  border-radius: 16px;
  position: relative;
  word-wrap: break-word;
  line-height: 1.6;
}

.ai-message .message-bubble-modern {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.5);
  color: #f8fafc;
}

.user-message .message-bubble-modern {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
}

.message-text {
  font-size: 15px;
  line-height: 1.6;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 8px;
  text-align: right;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 控制区域样式 */
.chat-controls-modern {
  padding: 24px;
  background: rgba(30, 41, 59, 0.4);
  border-top: 1px solid rgba(51, 65, 85, 0.5);
}

.controls-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.control-buttons-modern {
  display: flex;
  gap: 12px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-icon {
  font-size: 16px;
}

.control-btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.control-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.control-btn-secondary {
  background: rgba(30, 41, 59, 0.6);
  color: #f8fafc;
  border: 1px solid rgba(51, 65, 85, 0.5);
}

.control-btn-secondary:hover:not(:disabled) {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(59, 130, 246, 0.3);
}

.control-btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.control-btn-danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.game-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  width: 120px;
  height: 6px;
  background: rgba(51, 65, 85, 0.5);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  min-width: 30px;
}

.input-area-modern {
  position: relative;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input-modern {
  flex: 1;
  padding: 16px 20px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 16px;
  color: #f8fafc;
  font-size: 15px;
  font-family: inherit;
  line-height: 1.5;
  resize: none;
  transition: all 0.2s ease;
}

.message-input-modern:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.message-input-modern::placeholder {
  color: #64748b;
}

.message-input-modern:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-button-modern {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-button-modern:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.send-button-modern:active:not(:disabled) {
  transform: translateY(0);
}

.send-button-modern:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.send-button-modern.sending {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.5);
}

.send-icon svg {
  width: 20px;
  height: 20px;
  stroke: white;
}

.sending-spinner {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-room-modern {
    flex-direction: column;
  }
  
  .sidebar-modern {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid rgba(51, 65, 85, 0.5);
  }
  
  .history-list-modern {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 12px;
  }
  
  .history-item-modern {
    min-width: 200px;
    margin-right: 12px;
    margin-bottom: 0;
  }
  
  .chat-header-modern {
    padding: 16px 20px;
  }
  
  .chat-title h2 {
    font-size: 20px;
  }
  
  .chat-messages-modern {
    padding: 16px;
  }
  
  .message-content-modern {
    max-width: 85%;
  }
  
  .chat-controls-modern {
    padding: 16px 20px;
  }
  
  .controls-top {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-buttons-modern {
    justify-content: center;
  }
  
  .game-progress {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .sidebar-modern {
    height: 160px;
  }
  
  .history-item-modern {
    min-width: 160px;
    padding: 12px;
  }
  
  .control-buttons-modern {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .control-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .btn-icon {
    font-size: 14px;
  }
}
</style>