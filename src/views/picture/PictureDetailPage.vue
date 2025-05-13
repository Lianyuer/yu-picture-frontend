<template>
  <div id="picture-detail-page">
    <a-spin :spinning="loading">
      <a-row :gutter="[16, 16]">
        <!--   图片预览   -->
        <a-col :sm="24" :md="16" :xl="12">
          <a-card title="图片预览">
            <a-image style="max-height: 400px; object-fit: cover" :src="picture.url"></a-image>
          </a-card>
        </a-col>
        <!--   图片编辑   -->
        <a-col :sm="24" :md="8" :xl="12">
          <a-card title="图片信息">
            <a-descriptions :column="1">
              <a-descriptions-item label="名称">{{ picture.name ?? '未命名' }}</a-descriptions-item>
              <a-descriptions-item label="简介">
                {{ picture.introduction ?? '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="分类"
                >{{ picture.category ?? '默认' }}
              </a-descriptions-item>
              <a-descriptions-item label="标签">
                <a-tag v-for="tag in picture.tags">{{ tag }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="格式">
                {{ picture.picFormat ?? '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="宽度">
                {{ picture.picWidth ?? '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="高度">
                {{ picture.picHeight ?? '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="宽高比">
                {{ picture.picScale ?? '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="大小">
                {{ formatSize(picture.picSize) ?? '-' }}
              </a-descriptions-item>
            </a-descriptions>
            <a-space v-if="canEdit">
              <a-button @click="doEdit">编辑</a-button>
              <a-button danger @click="doDelete">删除</a-button>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { deletePictureUsingPost, getPictureVoByIdUsingGet } from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { formatSize } from '@/utils'
import { useLoginUserStore } from '@/stores/loginUserStore.ts'

// 定义数据
const loading = ref(true)
const picture = ref<API.PictureVO>({})

interface Props {
  id: string | number
}

const props = defineProps<Props>()

// 获取图片数据
const fetchData = async () => {
  loading.value = true
  const res = await getPictureVoByIdUsingGet({
    id: props.id,
  })
  if (res.data.code === 0 && res.data.data) {
    picture.value = res.data.data
  } else {
    message.error('数据获取失败,' + res.data.message)
  }
  loading.value = false
}

const loginUserStore = useLoginUserStore()
// 是否具有编辑权限
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser
  // 未登录不可编辑
  if (!loginUser.id) {
    return false
  }
  // 仅本人或管理员可编辑
  const user = picture.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})

const router = useRouter()

// 跳转编辑
const doEdit = () => {
  router.push(`/addPicture?id=${picture.value.id}`)
}

// 删除图片
const doDelete = async () => {
  const res = await deletePictureUsingPost({
    id: picture.value.id,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('删除成功')
    router.back()
  } else {
    message.error('删除失败，' + res.data.message)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#picture-detail-page :deep(.ant-card-body) {
  height: 430px;
}
</style>
