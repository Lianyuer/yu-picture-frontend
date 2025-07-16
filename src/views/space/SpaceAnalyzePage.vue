<template>
  <div id="space-analyze-page">
    <h2>空间分析</h2>
    <SpaceUsageAnalyze />
    <SpaceCategoryAnalyze />
    <SpaceTagAnalyze />
    <SpaceSizeAnalyze />
  </div>
</template>

<script setup lang="ts">
import SpaceUsageAnalyze from '@/components/spaceAnalyze/SpaceUsageAnalyze.vue'
import SpaceCategoryAnalyze from '@/components/spaceAnalyze/SpaceCategoryAnalyze.vue'
import SpaceTagAnalyze from '@/components/spaceAnalyze/SpaceTagAnalyze.vue'
import SpaceSizeAnalyze from '@/components/spaceAnalyze/SpaceSizeAnalyze.vue'
</script>

<style scoped></style>
