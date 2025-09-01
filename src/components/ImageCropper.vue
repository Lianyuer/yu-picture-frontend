<template>
  <a-modal
    :open="open"
    title="编辑图片"
    class="image-cropper"
    @ok="handleConfirm"
    @cancel="closeModal"
  >
    <vue-cropper
      ref="cropperRef"
      :img="imageUrl"
      output-type="png"
      :full="true"
      :canMoveBox="true"
      :fixedBox="false"
      :autoCrop="true"
      :autoCropWidth="330"
      :autoCropHeight="330"
      :centerBox="true"
    />
    <div class="btn-actions">
      <a-space>
        <a-button @click="changeScale(1)" class="btn">放大</a-button>
        <a-button @click="changeScale(-1)" class="btn">缩小</a-button>
        <a-button @click="rotateLeft" class="btn">向左旋转</a-button>
        <a-button @click="rotateRight" class="btn">向右旋转</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadPictureUsingPost } from '@/api/tupianxiangguanjiekou.ts'

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  spaceId?: number | string
  onSuccess?: (picture: API.PictureVO) => void
}

const props = withDefaults(defineProps<Props>(), {})

const cropperRef = ref()
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

const changeScale = (num: number) => {
  num = num || 1
  cropperRef.value.changeScale(num)
}
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
}
const rotateRight = () => {
  cropperRef.value.rotateRight()
}

// 确认裁剪
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    console.log(blob)
    const fileName = (props.picture?.name || 'image') + '.png'
    const file = new File([blob], fileName, { type: 'blob' })
    handleUpload({ file })
  })
}

/**
 * 上传图片
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params: API.PictureUploadDTO = props.picture ? { id: props.picture.id } : {}
    params.spaceId = props.spaceId
    const res = await uploadPictureUsingPost(params, {}, file)
    if (res.data.code === 0 && res.data.data) {
      message.success('上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
      open.value = false
    } else {
      message.error('上传失败，' + res.data.message)
    }
  } catch (e: any) {
    console.log('图片上传失败，', e)
    message.error('图片上传失败，' + e.message)
  }
  loading.value = false
}
</script>

<style scoped>
.image-cropper {
  width: 60%;
  margin: 0 auto;
}

.image-cropper .vue-cropper {
  height: 300px;
  margin: 0 auto;
}

.image-cropper .btn-actions {
  margin: 16px 0;
  text-align: center;
}
</style>
