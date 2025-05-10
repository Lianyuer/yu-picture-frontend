import { createRouter, createWebHistory } from 'vue-router'
import ACCESS_ENUM from '@/access/AccessEnum.ts'

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
      path: '/addPicture',
      name: '创建图片',
      component: () => import('../views/picture/AddPicturePage.vue'),
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: () => import('../views/admin/UserManagePage.vue'),
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/noAuth',
      name: '无权限',
      component: () => import('../views/NoAuthView.vue'),
    },
  ],
})

export default router
