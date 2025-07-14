<template>
  <div id="space-usage-analyze">
    <h3 style="color: gray">空间资源使用分析</h3>
    <a-card title="空间大小使用占比">
      <a-progress type="dashboard" :percent="75" />
    </a-card>
    <a-card title="图片数量使用占比">
      <a-progress type="dashboard" :percent="75" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getSpaceUsageAnalyzeUsingGet } from '@/api/kongjianfenxixiangguanjiekou.ts'
import { message } from 'ant-design-vue'

const loading = ref<boolean>(false)
const data = ref<API.SpaceUsageAnalyzeResponse>()

interface Props {
  queryPublic?: boolean
  queryAll?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryPublic: false,
  queryAll: false,
  spaceId: '1928091473354952706',
})

// 获取图片数据
const fetchData = async () => {
  loading.value = true

  const res = await getSpaceUsageAnalyzeUsingGet({
    queryPublic: props.queryPublic,
    queryAll: props.queryAll,
    spaceId: props.spaceId,
  })
  if (res.data.code === 0 && res.data.data) {
    data.value = res.data.data ?? {}
  } else {
    message.error('数据获取失败,' + res.data.message)
  }
  loading.value = false
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
