<template>
  <div id="space-user-analyze">
    <h3 style="color: gray">用户上传行为分析</h3>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24">
        <a-card hoverable title="用户上传行为分析">
          <v-chart
            :option="options"
            style="height: 320px; max-width: 100%"
            :loading="loading"
          ></v-chart>
          <template #extra>
            <a-space>
              <a-segmented v-model:value="timeDimension" :options="timeDimensionOptions" />
              <a-input-search
                placeholder="请输入用户 id"
                enter-button="搜索"
                @search="onSearch"
                allowClear
              />
            </a-space>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import { computed, ref, watchEffect } from 'vue'
import { getSpaceUserAnalyzeUsingGet } from '@/api/kongjianfenxixiangguanjiekou.ts'
import { message } from 'ant-design-vue'

const loading = ref<boolean>(false)
const dataList = ref<API.SpaceUserAnalyzeResponse[]>()
const timeDimensionOptions = [
  {
    label: '日',
    value: 'day',
  },
  {
    label: '周',
    value: 'week',
  },
  {
    label: '月',
    value: 'month',
  },
]
const timeDimension = ref<string>('day')
const userId = ref<string>()

interface Props {
  queryPublic?: boolean
  queryAll?: boolean
  spaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryPublic: false,
  queryAll: true,
  spaceId: '',
})

// 获取图片数据
const fetchData = async () => {
  loading.value = true

  const res = await getSpaceUserAnalyzeUsingGet({
    queryPublic: props.queryPublic,
    queryAll: props.queryAll,
    spaceId: props.spaceId,
    timeDimension: timeDimension.value,
    userId: userId.value,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('数据获取失败,' + res.data.message)
  }
  loading.value = false
}

const options = computed(() => {
  const periodList = dataList.value?.map((item) => item.period)
  const countList = dataList.value?.map((item) => item.count)

  return {
    // 提示框配置
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const date = params[0].axisValue
        const value = params[0].data
        return `${date}<br/>上传数量: ${value}`
      },
    },
    // 工具箱
    toolbox: {
      feature: {
        saveAsImage: {}, // 保存为图片
      },
    },
    // 网格配置
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    // x轴配置（时间轴）
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: periodList, // 这里填入你的时间数据，例如: ['2023-01-01', '2023-01-02', ...]
      axisLabel: {
        rotate: 45, // 如果时间标签太长可以旋转
        formatter: function (value) {
          // 可以根据需要格式化日期显示
          return value
        },
      },
      name: '日期',
      nameLocation: 'middle',
      nameGap: 30,
    },
    // y轴配置
    yAxis: {
      type: 'value',
      name: '上传数量',
      axisLine: {
        show: true,
      },
      axisLabel: {
        formatter: '{value}',
      },
    },
    // 数据系列配置
    series: [
      {
        name: '图片上传数量',
        type: 'line',
        data: countList, // 这里填入对应的数量数据，例如: [10, 20, 15, ...]
        smooth: true, // 是否平滑曲线
        symbol: 'circle', // 数据点形状
        symbolSize: 8, // 数据点大小
        itemStyle: {
          color: '#1890ff', // 线条颜色
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(24, 144, 255, 0.5)', // 渐变起始颜色
              },
              {
                offset: 1,
                color: 'rgba(24, 144, 255, 0.1)', // 渐变结束颜色
              },
            ],
          },
        },
      },
    ],
  }
})

// onMounted(() => {
//   fetchData()
// })

const onSearch = (value) => {
  if (/^\d*$/.test(value)) {
    userId.value = value
  } else {
    // 处理非数字输入的情况，例如显示错误信息或阻止赋值
    message.warn('用户 id 必须为数字')
  }
}

watchEffect(() => {
  fetchData()
})
</script>

<style scoped>
#space-user-analyze {
  margin-bottom: 16px;
}

#space-user-analyze .ant-card-body div {
  text-align: center;
}
</style>
