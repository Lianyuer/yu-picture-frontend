<template>
  <div class="picture-upload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="handleUpload"
      :before-upload="beforeUpload"
    >
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或者拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { uploadPictureUsingPost } from '@/api/tupianxiangguanjiekou.ts'

interface Props {
  picture: API.PictureVO
  onSuccess: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

const loading = ref<boolean>(false)

/**
 * 上传图片
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params = props.picture ? { id: props.picture.id } : {}
    const res = await uploadPictureUsingPost(params, {}, file)
    if (res.data.code === 0 && res.data.data) {
      message.success('上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
    } else {
      message.error('上传失败，' + res.data.message)
    }
  } catch (e: any) {
    console.log('图片上传失败，', e)
    message.error('图片上传失败，', e.message)
  }
  loading.value = false
}

/**
 * 上传前校验
 * @param file
 */
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 jpg/png 格式的图片！')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('不能上传超过 2MB 的图片!')
  }
  return isJpgOrPng && isLt2M
}
</script>
<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  min-width: 200px;
  min-height: 300px;
  margin: 0 auto;
}

.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.picture-upload img {
  max-height: 300px;
}
</style>
