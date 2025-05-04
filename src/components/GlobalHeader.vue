<template>
  <div id="global-header">
    <a-row :wrap="false">
      <a-col flex="220px">
        <router-link to="/">
          <div class="title-bar">
            <img src="../assets/logo.png" alt="logo" class="logo" />
            <div class="title">鱼籽云图库</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>
      <a-col flex="150px">
        <a-dropdown v-if="loginUserStore.loginUser.id">
          <a class="ant-dropdown-link" @click.prevent>
            <div class="user-login-status">
              <a-avatar class="avatar" size="large" :src="loginUserStore.loginUser.userAvatar">
              </a-avatar>
              <div class="userAccount">
                {{ loginUserStore.loginUser.userAccount }}
                <DownOutlined />
              </div>
            </div>
          </a>
          <template #overlay>
            <a-menu @click="doDropMenuClick">
              <a-menu-item key="logout">
                <a target="_self" rel="noopener noreferrer" href="javascript:void(0)">
                  <LogoutOutlined />
                  注销登录
                </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <div v-else>
          <RouterLink to="/user/login">
            <a-button type="primary">登录</a-button>
          </RouterLink>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue'
import { HomeOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/loginUserStore.ts'
import { userLogoutUsingPost } from '@/api/yonghuxiangguanjiekou.ts'

const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/about',
    label: '关于',
    title: '关于',
  },
  {
    key: 'others',
    label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
    title: '编程导航',
  },
])

const router = useRouter()
const loginUserStore = useLoginUserStore()

// 当前要高亮的菜单项
const current = ref<string[]>([])
// 路由后置守卫，每次跳转到新页面时都会执行
// 监听路由变化，更新高亮菜单项
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }) => {
  router.push({ path: key })
}

// 下拉菜单点击事件
const doDropMenuClick = async (item) => {
  if (item.key === 'logout') {
    const res = await userLogoutUsingPost()
    if (res.data.code === 0) {
      loginUserStore.setLoginUser({
        userName: '未登录',
      })
      message.success('退出登录成功')
      await router.replace('/user/login')
    } else {
      message.error('退出登录失败，' + res.data.message)
    }
  }
}
</script>

<style scoped>
#global-header .title-bar {
  display: flex;
  align-items: center;
}

#global-header .title-bar .logo {
  width: 45px;
  height: 45px;
  margin-right: 10px;
}

#global-header .title {
  font-size: 24px;
}

#global-header .user-login-status {
  display: flex;
  align-items: center;
}

#global-header .user-login-status .userAccount {
  color: #000;
}

#global-header .avatar {
  margin-right: 10px;
}
</style>
