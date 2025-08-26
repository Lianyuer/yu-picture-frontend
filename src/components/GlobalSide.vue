<template>
  <div id="global-side">
    <a-layout-sider breakpoint="lg" collapsed-width="0">
      <a-menu
        mode="inline"
        v-model:selectedKeys="current"
        :items="menuItems"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { computed, h, onMounted, ref, watchEffect } from 'vue'
import { PictureOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { SPACE_TYPE_ENUM } from '@/constant/space.ts'
import { listMyTeamSpaceUsingPost } from '@/api/kongjianchengyuanxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/loginUserStore.ts'
import eventBus, { EVENTS } from '@/utils/eventBus'

const router = useRouter()
const loginUser = useLoginUserStore().loginUser

// 侧边栏菜单
const fixedMenuItems = [
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
  {
    key: '/addSpace?type=' + SPACE_TYPE_ENUM.TEAM,
    icon: () => h(TeamOutlined),
    label: '创建团队',
  },
]

const teamSpaceList = ref<API.SpaceUserVO[]>([])
const menuItems = computed(() => {
  if (teamSpaceList.value.length < 1) {
    // 没有团队空间，只展示固定菜单，创建空间按钮启用
    const lastItem = fixedMenuItems[fixedMenuItems.length - 1]
    lastItem.disabled = false
    return fixedMenuItems
  }
  // 有团队空间，创建空间按钮禁用
  const lastItem = fixedMenuItems[fixedMenuItems.length - 1]
  lastItem.disabled = true

  // 展示团队空间分组
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const spaceVO = spaceUser.spaceVO
    return {
      key: '/space/' + spaceUser.spaceId,
      icon: () => h(TeamOutlined),
      label: spaceVO?.spaceName,
    }
  })

  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    key: 'teamSpace',
    children: teamSpaceSubMenus,
  }
  return [...fixedMenuItems, teamSpaceMenuGroup]
})

// 获取团队空间
const fetchTeamSpaceList = async () => {
  const res = await listMyTeamSpaceUsingPost()
  if (res.data.code == 0 && res.data.data) {
    teamSpaceList.value = res.data.data
  } else {
    message.error('获取团队空间信息失败' + res.data.message)
  }
}

onMounted(() => {
  eventBus.on(EVENTS.SPACE_CREATED, () => {
    fetchTeamSpaceList()
  })
})

/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  // 登录才加载
  if (loginUser.id) {
    fetchTeamSpaceList()
  }
})

// 当前要高亮的菜单项
const current = ref<string[]>([])
// 路由后置守卫，每次跳转到新页面时都会执行
// 监听路由变化，更新高亮菜单项
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }: any) => {
  router.push(key)
}
</script>
