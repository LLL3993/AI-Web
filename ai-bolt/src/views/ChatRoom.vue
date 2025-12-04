<template>
  <div class="chat-room">
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>历史对话</h3>
      </div>
      <div class="history-list">
        <div
          v-for="session in historySessions"
          :key="session.roomId"
          :class="['history-item', { active: session.roomId === roomId }]"
          @click="loadSession(session.roomId)"
        >
          <div class="history-title">对话 {{ session.roomId }}</div>
          <div class="history-time">{{ formatTime(session.timestamp) }}</div>
        </div>
        <div v-if="historySessions.length === 0" class="empty-history">
          暂无历史对话
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="chat-header">
        <h2>AI 脑筋急转弯</h2>
        <div class="room-info">房间号: {{ roomId }}</div>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-item', msg.role === 'ai' ? 'ai-message' : 'user-message']"
        >
          <div class="avatar">
            <span>{{ msg.role === 'ai' ? '🤖' : '👤' }}</span>
          </div>
          <div class="message-bubble">
            {{ msg.content }}
          </div>
        </div>
      </div>

      <div class="chat-controls">
        <div class="control-buttons">
          <a-button
            type="primary"
            :disabled="gameStarted"
            @click="handleStart"
          >
            开始
          </a-button>
          <a-button
            danger
            :disabled="gameEnded"
            @click="handleEnd"
          >
            结束
          </a-button>
        </div>

        <div class="input-area">
          <a-input
            v-model:value="inputMessage"
            placeholder="请输入内容"
            :disabled="!gameStarted || gameEnded"
            @press-enter="sendMessage"
            size="large"
          />
          <a-button
            type="primary"
            :disabled="!gameStarted || gameEnded || !inputMessage.trim()"
            @click="sendMessage"
            :loading="sending"
            size="large"
          >
            发送
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
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
.chat-room {
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: #f5f5f5;
}

.sidebar {
  width: 280px;
  background-color: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 68px;
  display: flex;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.history-item {
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
}

.history-item:hover {
  background-color: #f0f0f0;
  transform: translateX(4px);
}

.history-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.history-title {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
}

.history-time {
  font-size: 12px;
  opacity: 0.7;
}

.empty-history {
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 14px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 68px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.chat-header h2 {
  color: white;
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
}

.room-info {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
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

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
}

.user-message .avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.message-bubble {
  max-width: 60%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  line-height: 1.6;
}

.ai-message .message-bubble {
  background-color: white;
  border: 1px solid #e8e8e8;
}

.user-message .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.chat-controls {
  background-color: white;
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.control-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.input-area {
  display: flex;
  gap: 12px;
}

.input-area :deep(.ant-input) {
  flex: 1;
  border-radius: 8px;
}

.input-area button {
  border-radius: 8px;
  min-width: 80px;
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

@media (max-width: 768px) {
  .chat-room {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
  }

  .history-list {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 8px;
  }

  .history-item {
    min-width: 150px;
    margin-right: 8px;
    margin-bottom: 0;
  }

  .chat-header h2 {
    font-size: 20px;
  }

  .message-bubble {
    max-width: 75%;
  }

  .chat-controls {
    padding: 12px 16px;
  }

  .chat-messages {
    padding: 16px;
  }
}
</style>
