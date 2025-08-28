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
      path: '/admin/pictureManage',
      name: '图片管理',
      component: () => import('../views/admin/PictureManagePage.vue'),
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/addPicture',
      name: '创建图片',
      component: () => import('../views/picture/AddPicturePage.vue'),
    },
    {
      path: '/addPicture/batch',
      name: '批量创建图片',
      component: () => import('../views/picture/AddPictureBatchPage.vue'),
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: () => import('../views/picture/PictureDetailPage.vue'),
      props: true,
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: () => import('../views/admin/SpaceManagePage.vue'),
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/spaceUserManage/:id',
      name: '空间成员管理',
      component: () => import('../views/admin/SpaceUserManagePage.vue'),
      props: true,
    },
    {
      path: '/addSpace',
      name: '创建空间',
      component: () => import('../views/space/AddSpacePage.vue'),
    },
    {
      path: '/mySpace',
      name: '我的空间',
      component: () => import('../views/space/MySpacePage.vue'),
    },
    {
      path: '/space/:id',
      name: '空间详情',
      component: () => import('../views/space/SpaceDetailPage.vue'),
      props: true,
    },
    {
      path: '/pictureSearch',
      name: '图片搜索',
      component: () => import('../views/picture/SearchPicturePage.vue'),
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
      path: '/spaceAnalyze',
      name: '空间分析',
      component: () => import('../views/space/SpaceAnalyzePage.vue'),
    },
    {
      path: '/noAuth',
      name: '无权限',
      component: () => import('../views/NoAuthView.vue'),
    },
  ],
})

export default router
