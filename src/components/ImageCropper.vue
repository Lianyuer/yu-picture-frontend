<template>
  <a-modal :open="open" title="编辑图片" class="image-cropper" @cancel="closeModal"
    ><template #footer>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleConfirm"
        :disabled="!canEdit"
        >确定</a-button
      >
    </template>
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
    <!-- 协同编辑操作 -->
    <div class="image-edit-actions">
      <a-space>
        <a-button v-if="editingUser" disabled> {{ editingUser.userName }}正在编辑</a-button>
        <a-button v-if="canEnterEdit" type="primary" ghost @click="enterEdit">进入编辑</a-button>
        <a-button v-if="canExitEdit" danger ghost @click="exitEdit">退出编辑</a-button>
      </a-space>
    </div>
    <div class="btn-actions">
      <a-space>
        <a-button @click="changeScale(1)" class="btn" :disabled="!canEdit">放大</a-button>
        <a-button @click="changeScale(-1)" class="btn" :disabled="!canEdit">缩小</a-button>
        <a-button @click="rotateLeft" class="btn" :disabled="!canEdit">向左旋转</a-button>
        <a-button @click="rotateRight" class="btn" :disabled="!canEdit">向右旋转</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { uploadPictureUsingPost } from '@/api/tupianxiangguanjiekou.ts'
import { useLoginUserStore } from '@/stores/loginUserStore.ts'
import PictureEditWebSocket from '@/utils/PictureEditWebSocket.ts'
import {
  PICTURE_EDIT_ACTION_ENUM,
  PICTURE_EDIT_ACTION_MAP,
  PICTURE_EDIT_MESSAGE_TYPE_ENUM,
} from '@/constant/picture.ts'

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

// const closeModal = () => {
//   open.value = false
// }

defineExpose({
  openModal,
})

// const changeScale = (num: number) => {
//   num = num || 1
//   cropperRef.value.changeScale(num)
// }
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)
}
const rotateRight = () => {
  cropperRef.value.rotateRight()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)
}
// 缩放
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
  if (num > 0) {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  } else {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
  }
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
      websocket?.sendMessage({
        type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT,
      })
    } else {
      message.error('上传失败，' + res.data.message)
    }
  } catch (e: any) {
    console.log('图片上传失败，', e)
    message.error('图片上传失败，' + e.message)
  }
  loading.value = false
}

// ================ 实时编辑 ================
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

// 正在编辑的用户
const editingUser = ref<API.UserVO>()
// 是否可以进入编辑: 没有正在编辑的用户就可以进入编辑
const canEnterEdit = computed(() => {
  return !editingUser.value
})
// 是否可以退出编辑
const canExitEdit = computed(() => {
  return editingUser.value?.id === loginUser.id
})
// 是否可以编辑
const canEdit = computed(() => {
  return editingUser.value?.id === loginUser.id
})

let websocket: PictureEditWebSocket | null

// 初始化 WebSocket 连接，绑定事件
const initWebSocket = () => {
  const pictureId = props.picture?.id
  if (!pictureId || !open.value) {
    return
  }
  // 防止之前的连接未释放
  if (websocket) {
    websocket.disconnect()
  }
  // 创建 WebSocket 实例
  websocket = new PictureEditWebSocket(pictureId)
  // 建立 WebSocket 连接
  websocket.connect()
  // 监听通知消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (msg) => {
    console.log('收到通知消息', msg)
    message.info(msg.message)
  })
  // 监听错误消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (msg) => {
    console.log('收到错误消息', msg)
    message.error(msg.message)
  })
  // 监听进入编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (msg) => {
    console.log('收到进入编辑状态消息', msg)
    message.info(msg.message)
    editingUser.value = msg.userVO
  })
  // 监听编辑操作消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (msg) => {
    console.log('收到编辑操作消息', msg)
    message.info(msg.message)
    switch (msg.editAction) {
      case PICTURE_EDIT_ACTION_MAP.ZOOM_IN:
        cropperRef.value.changeScale(1)
        break
      case PICTURE_EDIT_ACTION_MAP.ZOOM_OUT:
        cropperRef.value.changeScale(-1)
        break
      case PICTURE_EDIT_ACTION_MAP.ROTATE_LEFT:
        cropperRef.value.rotateLeft()
        break
      case PICTURE_EDIT_ACTION_MAP.ROTATE_RIGHT:
        cropperRef.value.rotateRight()
        break
    }
  })
  // 监听退出编辑消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (msg) => {
    console.log('收到退出编辑状态消息', msg)
    message.info(msg.message)
    editingUser.value = undefined
  })
}

watchEffect(() => {
  initWebSocket()
})

onUnmounted(() => {
  // 断开连接
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
})

// 关闭弹窗
const closeModal = () => {
  open.value = false
  // 断开连接
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
}

// 进入编辑
const enterEdit = () => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT,
    })
  }
}

// 退出编辑
const exitEdit = () => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT,
    })
  }
}

// 編輯操作
const editAction = (action: string) => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION,
      editAction: action,
    })
  }
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
.image-edit-actions {
  margin-top: 20px;
  text-align: center;
}
</style>
