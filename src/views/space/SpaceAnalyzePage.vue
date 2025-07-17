<template>
  <div id="space-analyze-page">
    <h2>空间分析</h2>
    <SpaceUsageAnalyze :spaceId="spaceId" :queryPublic="queryPublic" :queryAll="queryAll" />
    <SpaceCategoryAnalyze :spaceId="spaceId" :queryPublic="queryPublic" :queryAll="queryAll" />
    <SpaceTagAnalyze :spaceId="spaceId" :queryPublic="queryPublic" :queryAll="queryAll" />
    <SpaceSizeAnalyze :spaceId="spaceId" :queryPublic="queryPublic" :queryAll="queryAll" />
    <SpaceUserAnalyze :spaceId="spaceId" :queryPublic="queryPublic" :queryAll="queryAll" />
    <SpaceRankAnalyze :spaceId="spaceId" :queryPublic="queryPublic" :queryAll="queryAll" />
  </div>
</template>

<script setup lang="ts">
import SpaceUsageAnalyze from '@/components/spaceAnalyze/SpaceUsageAnalyze.vue'
import SpaceCategoryAnalyze from '@/components/spaceAnalyze/SpaceCategoryAnalyze.vue'
import SpaceTagAnalyze from '@/components/spaceAnalyze/SpaceTagAnalyze.vue'
import SpaceSizeAnalyze from '@/components/spaceAnalyze/SpaceSizeAnalyze.vue'
import SpaceUserAnalyze from '@/components/spaceAnalyze/SpaceUserAnalyze.vue'
import SpaceRankAnalyze from '@/components/spaceAnalyze/SpaceRankAnalyze.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const spaceId = route.query.spaceId
const queryPublic = route.query.queryPublic
const queryAll = route.query.queryAll
</script>

<style scoped></style>
