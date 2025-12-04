<template>
  <div class="home-page-modern">
    <div class="background-animation">
      <div class="gradient-bg"></div>
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>
    
    <div class="content-container">
      <div class="logo-section animate-fade-in">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div class="text-content animate-slide-up">
        <h1 class="main-title">
          <span class="title-text">AI 脑筋急转弯</span>
          <span class="title-glow"></span>
        </h1>
        
        <p class="subtitle">
          挑战你的思维极限，体验AI带来的智慧乐趣
        </p>
        
        <div class="feature-pills">
          <div class="pill">
            <span class="pill-icon">🧠</span>
            智能对话
          </div>
          <div class="pill">
            <span class="pill-icon">🎯</span>
            精准推理
          </div>
          <div class="pill">
            <span class="pill-icon">⚡</span>
            实时响应
          </div>
        </div>
      </div>
      
      <div class="action-section animate-fade-in">
        <button class="start-button-modern" @click="startGame">
          <span class="button-text">开始游戏</span>
          <span class="button-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div class="button-glow"></div>
        </button>
        
        <div class="stats-bar">
          <div class="stat-item">
            <div class="stat-number">10K+</div>
            <div class="stat-label">活跃用户</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50K+</div>
            <div class="stat-label">题目数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">4.9</div>
            <div class="stat-label">用户评分</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="scroll-indicator">
      <div class="scroll-text">向下滚动</div>
      <div class="scroll-arrow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startGame = () => {
  router.push('/chat')
}
</script>

<style scoped>
/* ==========================================
   现代极简风格 - 主页样式
   ========================================== */

.home-page-modern {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
}

/* 背景动画 */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(16, 185, 129, 0.1) 25%,
    rgba(6, 214, 160, 0.1) 50%,
    rgba(59, 130, 246, 0.1) 75%,
    rgba(16, 185, 129, 0.1) 100%
  );
  background-size: 400% 400%;
  animation: backgroundShift 20s ease infinite;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%);
  filter: blur(40px);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 250px;
  height: 250px;
  top: 30%;
  right: 30%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 内容容器 */
.content-container {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 0 24px;
}

/* Logo区域 */
.logo-section {
  margin-bottom: 32px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
  animation: glow 3s ease-in-out infinite;
}

.logo-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}

/* 标题区域 */
.main-title {
  position: relative;
  margin-bottom: 16px;
}

.title-text {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  line-height: 1.1;
  position: relative;
  z-index: 2;
}

.title-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
}

.subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  font-weight: 400;
  line-height: 1.6;
}

/* 功能标签 */
.feature-pills {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  font-size: 14px;
  color: var(--text-secondary);
  backdrop-filter: var(--glass-backdrop);
  transition: all var(--transition-normal);
}

.pill:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.pill-icon {
  font-size: 16px;
}

/* 按钮区域 */
.action-section {
  margin-bottom: 48px;
}

.start-button-modern {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: var(--radius-lg);
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
  overflow: hidden;
  margin-bottom: 32px;
}

.start-button-modern:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.6);
}

.start-button-modern:active {
  transform: translateY(-1px);
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-icon {
  position: relative;
  z-index: 2;
  width: 20px;
  height: 20px;
}

.button-icon svg {
  width: 100%;
  height: 100%;
  stroke: white;
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.start-button-modern:hover .button-glow {
  left: 100%;
}

/* 统计栏 */
.stats-bar {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 32px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 400;
}

/* 滚动指示器 */
.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.6;
  animation: pulse 2s infinite;
}

.scroll-text {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.scroll-arrow {
  width: 20px;
  height: 20px;
  border-right: 2px solid var(--text-muted);
  border-bottom: 2px solid var(--text-muted);
  transform: rotate(45deg);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) rotate(45deg);
  }
  40% {
    transform: translateY(-10px) rotate(45deg);
  }
  60% {
    transform: translateY(-5px) rotate(45deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-container {
    padding: 0 16px;
  }
  
  .logo-icon {
    width: 60px;
    height: 60px;
  }
  
  .logo-icon svg {
    width: 30px;
    height: 30px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .feature-pills {
    gap: 12px;
  }
  
  .pill {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .start-button-modern {
    padding: 14px 28px;
    font-size: 16px;
  }
  
  .stats-bar {
    gap: 32px;
  }
  
  .stat-number {
    font-size: 20px;
  }
  
  .stat-label {
    font-size: 12px;
  }
  
  .scroll-indicator {
    bottom: 16px;
  }
}

@media (max-width: 480px) {
  .feature-pills {
    flex-direction: column;
    align-items: center;
  }
  
  .stats-bar {
    flex-direction: column;
    gap: 24px;
  }
}
</style>