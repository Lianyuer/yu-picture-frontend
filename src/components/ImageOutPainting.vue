<template>
  <a-modal
    :open="open"
    title="AI 扩图"
    class="image-out-painting"
    :footer="null"
    @cancel="closeModal"
  >
    <a-row :gutter="16">
      <a-col :span="resultImageUrl ? 12 : 24">
        <div style="text-align: center">原图</div>
        <img :src="picture?.url" :alt="picture?.name" width="100%" />
      </a-col>
      <a-col span="12" v-if="resultImageUrl">
        <div style="text-align: center">扩图结果</div>
        <img :src="resultImageUrl" :alt="picture?.name" width="100%" />
      </a-col>
    </a-row>
    <div style="margin-bottom: 16px" />
    <a-flex gap="16" justify="center">
      <a-button type="primary" ghost :loading="!!taskId" @click="doCreateTask">创建任务</a-button>
      <a-button type="primary" @click="handleUpload">保存结果</a-button>
    </a-flex>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  createPictureOutPaintingTaskUsingPost,
  getPictureOutPaintingTaskUsingGet,
  uploadPictureByUrlUsingPost,
} from '@/api/tupianxiangguanjiekou.ts'

interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (picture: API.PictureVO) => void
}

const props = withDefaults(defineProps<Props>(), {})

const loading = ref<boolean>(false)
const open = ref<boolean>(false)

const openModal = () => {
  open.value = true
}

const closeModal = () => {
  open.value = false
}

defineExpose({
  openModal,
})

const taskId = ref<string>('')

// 创建 AI 扩图任务
const doCreateTask = async () => {
  if (!props.picture?.id) {
    return
  }
  try {
    const res = await createPictureOutPaintingTaskUsingPost({
      pictureId: props.picture?.id,
      parameters: {
        xScale: 2,
        yScale: 2,
      },
    })
    if (res.data.code === 0 && res.data.data) {
      message.success('任务创建成功，请耐心等待，不要关闭当前界面')
      taskId.value = res.data.data?.output.taskId
      startPolling()
    } else {
      message.error('任务创建失败')
    }
  } catch (e) {
    console.error('任务创建失败', e)
    message.error('任务创建失败')
  }
}

let pollingTimer: NodeJS.Timeout = null
const resultImageUrl = ref<string>('')

// 开始轮询
const startPolling = () => {
  if (!taskId.value) {
    return
  }
  try {
    pollingTimer = setInterval(async () => {
      const res = await getPictureOutPaintingTaskUsingGet({
        taskId: taskId.value,
      })
      const taskResult = res.data.data.output
      if (res.data.code === 0 && taskResult.taskStatus === 'SUCCEEDED') {
        message.success('任务执行成功')
        resultImageUrl.value = taskResult.outputImageUrl
        clearPolling()
      }
      if (res.data.code === 0 && taskResult.taskStatus === 'FAILED') {
        message.error('任务执行失败')
        clearPolling()
      }
    }, 3000) // 每隔 3 秒轮询一次
  } catch (e) {
    console.error('轮询任务状态失败', e)
    message.error('轮询任务状态失败，请稍后再试')
    clearPolling()
  }
}

// 清除轮询
const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = null
  }
}

/**
 * 上传图片
 */
const handleUpload = async () => {
  loading.value = true
  try {
    const params: API.PictureUploadDTO = { fileUrl: resultImageUrl.value }
    params.spaceId = props.spaceId
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
      closeModal()
    } else {
      message.error('上传失败，' + res.data.message)
    }
  } catch (e: any) {
    console.log('图片上传失败，', e)
    message.error('图片上传失败，', e.message)
  }
  loading.value = false
}
</script>

<style scoped>
.image-out-painting {
  width: 60%;
  margin: 0 auto;
}
</style>
