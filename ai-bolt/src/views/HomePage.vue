<template>
  <div class="home-page">
    <div class="content-wrapper">
      <h1 class="title">AI 脑筋急转弯</h1>
      <a-button type="primary" size="large" class="start-button" @click="startGame">
        开始游戏
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button as AButton } from 'ant-design-vue'

const router = useRouter()

const startGame = () => {
  router.push('/chat')
}
</script>

<style scoped>
.home-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content-wrapper {
  text-align: center;
  animation: fadeIn 0.8s ease-in;
}

.title {
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin-bottom: 60px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 4px;
}

.start-button {
  padding: 0 60px;
  height: 56px;
  font-size: 20px;
  border-radius: 28px;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 36px;
    margin-bottom: 40px;
  }

  .start-button {
    padding: 0 40px;
    height: 48px;
    font-size: 18px;
  }
}
</style>
