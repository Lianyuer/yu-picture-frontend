<template>
  <div id="basic-layout">
    <a-layout class="layout" style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer class="footer"> 智能协同云图库 ©2025 Created by lian </a-layout-footer>
    </a-layout>
  </div>
</template>
<script lang="ts" setup>
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>
<style scoped>
#basic-layout .header {
  background-color: #fff;
  margin-bottom: 20px;
  padding-inline: 25px;
}
#basic-layout .content {
  padding: 0 50px;
  background: linear-gradient(to right, #fefefe, #fff);
}
#basic-layout .footer {
  text-align: center;
  background-color: #efefef;
}
</style>
