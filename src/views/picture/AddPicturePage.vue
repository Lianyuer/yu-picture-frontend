<template>
  <div id="add-picture-page">
    <h2 style="margin-bottom: 22px">创建图片</h2>
    <!--  图片上传组件  -->
    <PictureUpload :picture="picture" :onSuccess="onSuccess" />
    <!--  图片信息表单  -->
    <a-form :model="pictureForm" name="basic" autocomplete="off" @finish="handleSubmit">
      <a-form-item name="name">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item name="introduction">
        <a-textarea
          v-model:value="pictureForm.introduction"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入简介"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="category">
        <a-auto-complete
          v-model:value="pictureForm.category"
          placeholder="请输入分类"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="tags">
        <a-select
          v-model:value="pictureForm.tags"
          mode="tags"
          placeholder="请输入标签"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button block type="primary" html-type="submit">创建</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { reactive, ref } from 'vue'
import { editPictureUsingPost } from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictureUpdateDTO>({})

/**
 * 图片上传成功
 * @param newPicture
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

/**
 * 表单提交
 */
const handleSubmit = async (values) => {
  console.log(values)
  const pictureId = picture.value.id
  const res = await editPictureUsingPost({
    id: pictureId,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('创建成功')
    router.push(`/picture/${pictureId}`)
  } else {
    message.error('创建失败，' + res.data.message)
  }
}
</script>

<style scoped>
#add-picture-page {
  width: 720px;
  margin: 0 auto;
}
</style>
