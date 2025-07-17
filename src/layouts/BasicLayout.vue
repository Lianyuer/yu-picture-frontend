<template>
  <div id="basic-layout">
    <a-layout class="layout" style="min-height: 100vh">
      <a-layout-header class="header" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <GlobalHeader />
      </a-layout-header>
      <a-layout>
        <a-layout-sider
          v-if="loginUserStore.loginUser?.id"
          class="sider"
          breakpoint="lg"
          collapsed-width="0"
        >
          <GlobalSide />
        </a-layout-sider>
        <a-layout-content class="content" :style="loginUserStore.loginUser?.id ?? 'margin-left:0'">
          <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
            <router-view />
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="footer"> 智能协同云图库 ©2025 Created by lian</a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSide from '@/components/GlobalSide.vue'
import { useLoginUserStore } from '@/stores/loginUserStore.ts'
import { onMounted } from 'vue'

const loginUserStore = useLoginUserStore()

onMounted(() => {})
</script>

<style scoped>
#basic-layout .header {
  background-color: #fff;
  margin-bottom: 1px;
  padding-inline: 25px;
}

#basic-layout .sider {
  background-color: #fff;
  border-right: 1px solid #eee;
  margin-top: 65px;
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

#basic-layout .content {
  padding: 0 50px;
  background: linear-gradient(to right, #fefefe, #fff);
  margin-top: 65px;
  margin-left: 180px;
}

#basic-layout .footer {
  text-align: center;
  background-color: #efefef;
}

#basic-layout :deep(.ant-menu-root) {
  border: none;
}

@media (max-width: 991px) {
  #basic-layout .content {
    margin-left: 0;
  }
}
</style>
