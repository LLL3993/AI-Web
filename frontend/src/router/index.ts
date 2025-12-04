import { createRouter, createWebHistory } from 'vue-router'
import HomePageModern from '../views/HomePageModern.vue'
import ChatRoomModern from '../views/ChatRoomModern.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePageModern
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatRoomModern
    }
  ]
})

export default router