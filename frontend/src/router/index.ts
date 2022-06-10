import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import PlaceHistory from '@/views/PlaceHistory.vue';
import UserHistory from '@/views/UserHistory.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PlaceHistory
  },
  {
    path: '/user',
    component: UserHistory
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
