<template>
  <div id="space-usage-analyze">
    <h3 style="color: gray">空间资源使用分析</h3>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :md="12">
        <a-card hoverable title="存储空间">
          <h3 style="text-align: center">
            {{ formatSize(data?.usedSize) }} /
            {{ data?.maxSize ? formatSize(data?.maxSize) : '无限制' }}
          </h3>
          <div>
            <a-progress type="dashboard" :percent="data?.sizeUsageRatio" />
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-card hoverable title="图片数量">
          <h3 style="text-align: center">
            {{ data?.usedCount }} / {{ data?.maxCount ? data?.maxCount : '无限制' }}
          </h3>
          <div>
            <a-progress type="dashboard" :percent="data?.countUsageRatio" />
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getSpaceUsageAnalyzeUsingGet } from '@/api/kongjianfenxixiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { formatSize } from '../../utils'

const loading = ref<boolean>(false)
const data = ref<API.SpaceUsageAnalyzeResponse>()

interface Props {
  queryPublic?: boolean
  queryAll?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryPublic: true,
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

<style scoped>
#space-usage-analyze {
  margin-bottom: 16px;
}

#space-usage-analyze .ant-card-body div {
  text-align: center;
}
</style>
