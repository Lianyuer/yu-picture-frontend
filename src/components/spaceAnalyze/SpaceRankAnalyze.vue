<template>
  <div id="space-rank-analyze" v-if="loginUser.userRole == 'admin'">
    <h3 style="color: gray">空间使用排行分析</h3>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24">
        <a-card hoverable title="空间使用排行分析">
          <v-chart
            :option="options"
            style="height: 320px; max-width: 100%"
            :loading="loading"
          ></v-chart>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import { computed, onMounted, ref } from 'vue'
import { getSpaceRankAnalyzeUsingGet } from '@/api/kongjianfenxixiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/loginUserStore.ts'

const loading = ref<boolean>(false)
const dataList = ref<API.SpaceRankAnalyzeResponse[]>()
const loginUserStore = useLoginUserStore()
let loginUser = loginUserStore.loginUser

interface Props {
  queryPublic?: boolean
  queryAll?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryPublic: true,
  queryAll: false,
  spaceId: '1930841865823748098',
})

// 获取图片数据
const fetchData = async () => {
  loading.value = true

  const res = await getSpaceRankAnalyzeUsingGet({
    queryPublic: props.queryPublic,
    queryAll: props.queryAll,
    spaceId: props.spaceId,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('数据获取失败,' + res.data.message)
  }
  loading.value = false
}

const options = computed(() => {
  const spaceNames = dataList.value?.map((item) => item.spaceName)
  const sizeData = dataList.value?.map((item) => (item.totalSize / (1024 * 1024)).toFixed(2)) // 转为 MB

  return {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: { type: 'category', data: spaceNames },
    yAxis: [
      {
        type: 'value',
        name: '空间使用量',
        axisLine: { show: true, lineStyle: { color: '#5470C6' } }, // 左轴颜色
      },
    ],
    series: [{ name: '空间使用量', type: 'bar', data: sizeData }],
  }
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#space-rank-analyze {
  margin-bottom: 16px;
}

#space-rank-analyze .ant-card-body div {
  text-align: center;
}
</style>
