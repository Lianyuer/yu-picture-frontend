<template>
  <div id="space-category-analyze">
    <h3 style="color: gray">空间图片分类分析</h3>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24">
        <a-card hoverable title="图库分类占用">
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
import { getSpaceCategoryAnalyzeUsingGet } from '@/api/kongjianfenxixiangguanjiekou.ts'
import { message } from 'ant-design-vue'

const loading = ref<boolean>(false)
const dataList = ref<API.SpaceCategoryAnalyzeResponse[]>()

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

  const res = await getSpaceCategoryAnalyzeUsingGet({
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
  const categories = dataList.value?.map((item) => item.category)
  const countData = dataList.value?.map((item) => item.count)
  const sizeData = dataList.value?.map((item) => (item.totalSize / (1024 * 1024)).toFixed(2)) // 转为 MB

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['图片数量', '图片总大小'], top: 'bottom' },
    xAxis: { type: 'category', data: categories },
    yAxis: [
      {
        type: 'value',
        name: '图片数量',
        axisLine: { show: true, lineStyle: { color: '#5470C6' } }, // 左轴颜色
      },
      {
        type: 'value',
        name: '图片总大小 (MB)',
        position: 'right',
        axisLine: { show: true, lineStyle: { color: '#91CC75' } }, // 右轴颜色
        splitLine: {
          lineStyle: {
            color: '#91CC75', // 调整网格线颜色
            type: 'dashed', // 线条样式：可选 'solid', 'dashed', 'dotted'
          },
        },
      },
    ],
    series: [
      { name: '图片数量', type: 'bar', data: countData, yAxisIndex: 0 },
      { name: '图片总大小', type: 'bar', data: sizeData, yAxisIndex: 1 },
    ],
  }
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#space-category-analyze {
  margin-bottom: 16px;
}

#space-category-analyze .ant-card-body div {
  text-align: center;
}
</style>
