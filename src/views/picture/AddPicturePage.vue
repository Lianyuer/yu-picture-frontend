<template>
  <div id="add-picture-page">
    <h2 style="margin-bottom: 22px">{{ route.query?.id ? '修改图片' : '创建图片' }}</h2>
    <!--  图片上传组件  -->
    <PictureUpload :picture="picture" :onSuccess="onSuccess" />
    <!--  图片信息表单  -->
    <a-form
      v-if="picture"
      :model="pictureForm"
      name="basic"
      autocomplete="off"
      @finish="handleSubmit"
    >
      <a-form-item name="name" label="名称">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item name="introduction" label="简介">
        <a-textarea
          v-model:value="pictureForm.introduction"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入简介"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="category" label="分类">
        <a-auto-complete
          v-model:value="pictureForm.category"
          placeholder="请输入分类"
          :options="categoryOptions"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="tags" label="标签">
        <a-select
          v-model:value="pictureForm.tags"
          mode="tags"
          placeholder="请输入标签"
          :options="tagOptions"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button block type="primary" html-type="submit">{{
          route.query?.id ? '保存' : '创建'
        }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { onMounted, reactive, ref } from 'vue'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
} from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

const picture = ref<API.PictureVO>()
let pictureForm = reactive<API.PictureUpdateDTO>({})

/**
 * 图片上传成功
 * @param newPicture
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

const tagOptions = ref<String[]>()
const categoryOptions = ref<String[]>()

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

/**
 * 表单提交
 */
const handleSubmit = async (values) => {
  const pictureId = picture.value?.id
  if (!pictureId) {
    return
  }
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

const route = useRoute()
const getOldPicture = async () => {
  const id = route.query?.id
  console.log(route)
  if (id) {
    const res = await getPictureVoByIdUsingGet({ id })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}

onMounted(() => {
  getPictureTagCategory()
  getOldPicture()
})
</script>

<style scoped>
#add-picture-page {
  width: 720px;
  margin: 0 auto;
}
</style>
