<template>
  <div id="global-side">
    <a-layout-sider width="200" breakpoint="lg" collapsed-width="0">
      <a-menu
        mode="inline"
        v-model:selectedKeys="current"
        :items="sideMenus"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue'
import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 侧边栏菜单
const sideMenus = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
  },
  {
    key: '/mySpace',
    icon: () => h(UserOutlined),
    label: '我的空间',
  },
]

// 当前要高亮的菜单项
const current = ref<string[]>([])
// 路由后置守卫，每次跳转到新页面时都会执行
// 监听路由变化，更新高亮菜单项
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }: any) => {
  router.push({ path: key })
}
</script>
