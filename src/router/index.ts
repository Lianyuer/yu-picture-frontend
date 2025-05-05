import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: () => import('../views/user/UserLoginPage.vue'),
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: () => import('../views/user/UserRegisterPage.vue'),
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: () => import('../views/admin/UserManagePage.vue'),
    },
  ],
})

export default router
