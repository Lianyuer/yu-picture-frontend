<template>
  <div id="picture-batch-edit-modal">
    <a-modal v-model:visible="visible" title="批量编辑图片" @cancel="handleCancel" :footer="null">
      <a-typography-paragraph type="secondary">
        * 图片编辑仅对当前列表图片生效
      </a-typography-paragraph>
      <!--  图片信息表单  -->
      <a-form :model="formData" name="basic" autocomplete="off" @finish="handleSubmit">
        <a-form-item name="category" label="分类">
          <a-auto-complete
            v-model:value="formData.category"
            placeholder="请输入分类"
            :options="categoryOptions"
            allow-clear
          />
        </a-form-item>
        <a-form-item name="tags" label="标签">
          <a-select
            v-model:value="formData.tags"
            mode="tags"
            placeholder="请输入标签"
            :options="tagOptions"
            allow-clear
          />
        </a-form-item>
        <a-form-item name="nameRule" label="命名规则">
          <a-input
            v-model:value="formData.nameRule"
            placeholder="请输入命名规则，示例：自定义图片名称_{序号}"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button block type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  editPictureByBatchUsingPost,
  listPictureTagCategoryUsingGet,
} from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'

interface Props {
  pictureList: API.PictureVO[]
  spaceId: number | string
  onSuccess: () => void
}

const props = withDefaults(defineProps<Props>(), {})

const visible = ref<boolean>(false)
let formData = reactive({
  category: '',
  tags: [],
  nameRule: '',
})

const showModal = () => {
  visible.value = true
}

const handleCancel = () => {
  visible.value = false
}

const resetData = () => {
  formData = reactive({})
}

const handleSubmit = async () => {
  console.log(formData)
  if (!props.pictureList) {
    return
  }
  const res = await editPictureByBatchUsingPost({
    pictureIdList: props.pictureList.map((picture) => picture.id),
    spaceId: props.spaceId,
    ...formData,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功')
    handleCancel()
    props.onSuccess?.()
    resetData()
  } else {
    message.error('操作失败', res.data.message)
  }
}

defineExpose({
  showModal,
})

const tagOptions = ref<string[]>()
const categoryOptions = ref<string[]>()

// 获取标签分类列表
const getPictureTagCategory = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    tagOptions.value = res.data.data.tagList.map((value) => {
      return {
        value: value,
        text: value,
      }
    })
    categoryOptions.value = res.data.data.categoryList.map((value) => {
      return {
        value: value,
        text: value,
      }
    })
  }
}

onMounted(() => {
  getPictureTagCategory()
})
</script>

<style scoped></style>
