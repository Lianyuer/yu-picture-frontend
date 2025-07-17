<template>
  <div id="space-tag-analyze">
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
import 'echarts-wordcloud'
import { computed, onMounted, ref } from 'vue'
import { getSpaceTagAnalyzeUsingGet } from '@/api/kongjianfenxixiangguanjiekou.ts'
import { message } from 'ant-design-vue'

const loading = ref<boolean>(false)
const dataList = ref<API.SpaceTagAnalyzeResponse[]>()

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

  const res = await getSpaceTagAnalyzeUsingGet({
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
  const wordCloudData =
    dataList.value?.map((item) => ({
      name: item.tag,
      value: item.count,
    })) || []
  return {
    // title: {
    //   text: '词云标签统计',
    //   subtext: '标签使用频率可视化',
    //   left: 'center',
    // },
    tooltip: {
      show: true,
      formatter: function (params) {
        return params.name + ': ' + params.value + ' 次'
      },
    },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle', // 词云形状，可选：'circle', 'cardioid', 'diamond', 'triangle-forward', 'triangle', 'pentagon', 'star'
        left: 'center',
        top: 'center',
        width: '90%',
        height: '90%',
        right: null,
        bottom: null,
        sizeRange: [12, 60], // 字体大小范围
        rotationRange: [-45, 45], // 旋转角度范围
        rotationStep: 15,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
            // 随机颜色
            return (
              'rgb(' +
              Math.round(Math.random() * 155 + 100) +
              ', ' +
              Math.round(Math.random() * 155 + 100) +
              ', ' +
              Math.round(Math.random() * 155 + 100) +
              ')'
            )
          },
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333',
          },
        },
        data: wordCloudData,
      },
    ],
  }
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#space-tag-analyze {
  margin-bottom: 16px;
}

#space-tag-analyze .ant-card-body div {
  text-align: center;
}
</style>
