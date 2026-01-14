import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/other',
    name: 'Other',
    component: () => import('@/views/Other.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
