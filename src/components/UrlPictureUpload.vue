<template>
  <div class="url-picture-upload">
    <a-input-group compact>
      <a-input v-model:value="fileUrl" style="width: calc(100% - 120px)" />
      <a-button type="primary" style="width: 120px;" @click="handleUpload">提交</a-button>
    </a-input-group>
    <div class="img-wrapper">
      <img v-if="picture?.url" :src="picture?.url" alt="img" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadPictureByUrlUsingPost } from '@/api/tupianxiangguanjiekou.ts'


interface Props {
  picture: API.PictureVO
  onSuccess: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()
const fileUrl = ref<string>('')
const loading = ref<boolean>(false)

/**
 * 上传图片
 */
const handleUpload = async () => {
  loading.value = true
  try {
    const params: API.PictureUploadDTO = { fileUrl: fileUrl.value }
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await uploadPictureByUrlUsingPost(params)
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

</script>
<style scoped>
.url-picture-upload .img-wrapper {
  text-align: center;
  margin: 22px 0;
}

.url-picture-upload .img-wrapper img {
  width: 100%;
}
</style>
