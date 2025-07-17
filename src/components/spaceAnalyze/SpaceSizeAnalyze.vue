<template>
  <div id="space-size-analyze">
    <h3 style="color: gray">空间图片大小分析</h3>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24">
        <a-card hoverable title="图片大小分析">
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
import { getSpaceSizeAnalyzeUsingGet } from '@/api/kongjianfenxixiangguanjiekou.ts'
import { message } from 'ant-design-vue'

const loading = ref<boolean>(false)
const dataList = ref<API.SpaceSizeAnalyzeResponse[]>()

interface Props {
  queryPublic?: boolean
  queryAll?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryPublic: false,
  queryAll: false,
  spaceId: '',
})

// 获取图片数据
const fetchData = async () => {
  loading.value = true

  const res = await getSpaceSizeAnalyzeUsingGet({
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
  // 动态数据示例
  const pieData = dataList.value?.map((item) => ({
    name: item.sizeRange,
    value: item.count,
  }))

  return {
    // 提示框配置
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        // 计算百分比
        const percent = params.percent
        // 自定义悬浮提示内容
        return `
        ${params.name}<br/>
        占比: ${percent}%
      `
      },
    },

    // 图例配置
    legend: {
      orient: 'vertical',
      left: 'left',
    },

    // 系列配置
    series: [
      {
        name: '图片大小分布',
        type: 'pie',
        radius: '50%',
        data: pieData, // 使用动态数据
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        // 标签配置
        label: {
          formatter: '{b}: {c} ({d}%)', // 显示名称、值和百分比
        },
        // 动画效果
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200
        },
      },
    ],
  }
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#space-size-analyze {
  margin-bottom: 16px;
}

#space-size-analyze .ant-card-body div {
  text-align: center;
}
</style>
