import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/Projects.vue')
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetail.vue')
  },
  {
    path: '/skills',
    name: 'Skills',
    component: () => import('@/views/Skills.vue')
  },
  {
    path: '/experiences',
    name: 'Experiences',
    component: () => import('@/views/Experiences.vue')
  },
  {
    path: '/learnings',
    name: 'Learnings',
    component: () => import('@/views/Learnings.vue')
  },
  {
    path: '/life',
    name: 'Life',
    component: () => import('@/views/Life.vue')
  },
  {
    path: '/experience/:id',
    name: 'ExperienceDetail',
    component: () => import('@/views/ExperienceDetail.vue')
  },
  {
    path: '/learning/:id',
    name: 'LearningDetail',
    component: () => import('@/views/LearningDetail.vue')
  },
  {
    path: '/life/:id',
    name: 'LifeDetail',
    component: () => import('@/views/LifeDetail.vue')
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/Admin/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/admin',
    component: () => import('@/views/Admin/Dashboard.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/Admin/DashboardContent.vue')
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('@/views/Admin/ProfileManage.vue')
      },
      {
        path: 'skills',
        name: 'AdminSkills',
        component: () => import('@/views/Admin/SkillsManage.vue')
      },
      {
        path: 'projects',
        name: 'AdminProjects',
        component: () => import('@/views/Admin/ProjectsManage.vue')
      },
      {
        path: 'experiences',
        name: 'AdminExperiences',
        component: () => import('@/views/Admin/ExperiencesManage.vue')
      },
      {
        path: 'learnings',
        name: 'AdminLearnings',
        component: () => import('@/views/Admin/LearningsManage.vue')
      },
      {
        path: 'life',
        name: 'AdminLife',
        component: () => import('@/views/Admin/LifeManage.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由切换后，强制重置滚动位置
router.afterEach(() => {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.scrollTop = 0;
    }
  }, 0);
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth();

  // 需要认证的路由
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'AdminLogin', query: { redirect: to.fullPath } });
    return;
  }

  // 已登录用户访问登录页，重定向到仪表盘
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next({ name: 'AdminDashboard' });
    return;
  }

  next();
});


export default router;
