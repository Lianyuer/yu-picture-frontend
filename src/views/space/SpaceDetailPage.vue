<template>
  <div id="space-detail-page">
    <!-- 空间信息 -->
    <a-flex justify="space-between" align="center" style="margin-bottom: 22px">
      <h2 style="margin-bottom: 0">{{ space.spaceName }}（私有空间）</h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/addPicture?spaceId=${props.id}`">+ 创建图片</a-button>
        <a-tooltip :title="`${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`">
          <a-progress
            type="circle"
            :percent="(space.totalSize / space.maxSize).toFixed(1)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>
    <!--  图片列表  -->
    <PictureList :dataList="dataList" :loading="loading" :showOp="true" :onReload="onReload" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { listPictureVoByPageUsingPost } from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { getSpaceVoByIdUsingGet } from '@/api/kongjianxiangguanjiekou.ts'
import PictureList from '@/components/PictureList.vue'
import { formatSize } from '@/utils'

// 定义数据
const loading = ref(true)
const space = ref<API.SpaceVO>({})

interface Props {
  id: string | number
}

const props = defineProps<Props>()

// 获取空间详情
const fetchSpaceDetail = async () => {
  loading.value = true
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败,' + res.data.message)
    }
  } catch (e) {
    message.error('获取空间详情失败：' + e.message)
  }
  loading.value = false
}

// 定义数据
const dataList = ref<API.PictureVO[]>([])
const total = ref()

// 搜索条件
const searchParams = reactive<API.PictureQueryDTO>({
  current: 1,
  size: 12,
  sortField: 'create_time',
  sortOrder: 'descend',
})

// 分页事件
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.size = pageSize
  fetchData()
}

// 获取图片数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams,
  }

  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.code === 0 && res.data.data.records) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取图片数据失败,' + res.data.message)
  }
  loading.value = false
}

const onReload = () => {
  fetchData()
  fetchSpaceDetail()
}

onMounted(() => {
  fetchSpaceDetail()
  fetchData()
})
</script>

<style scoped>
#picture-detail-page :deep(.ant-card-body) {
  height: 430px;
}
</style>
