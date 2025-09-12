<template>
  <div id="add-picture-page">
    <h2 style="margin-bottom: 22px">{{ route.query?.id ? '修改图片' : '创建图片' }}</h2>
    <a-typography-paragraph v-if="spaceId" type="secondary">
      图片保存至空间：<a :href="`/space/${spaceId}`">{{ spaceId }}</a>
    </a-typography-paragraph>
    <!--  上传图片方式选择  -->
    <a-tabs v-model:activeKey="uploadType">
      <a-tab-pane key="file" tab="文件上传">
        <!--  图片上传组件  -->
        <PictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传">
        <!--  图片 URL 上传组件  -->
        <UrlPictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
    </a-tabs>
    <div style="margin-bottom: 16px" />
    <!--  图片裁剪  -->
    <a-flex justify="center" gap="16" v-if="picture">
      <a-button type="primary" ghost @click="doCrop">编辑图片</a-button>
      <a-button type="primary" @click="doOutPainting" v-if="loginUser.userRole == 'admin'"
        >AI 扩图</a-button
      >
    </a-flex>
    <div style="margin-bottom: 24px" />
    <ImageCropper
      ref="imageCropRef"
      :imageUrl="picture?.url"
      :picture="picture"
      :spaceId="spaceId"
      :space="space"
      :onSuccess="onCropSuccess"
    />
    <ImageOutPainting ref="imageOutPaintingRef" :picture="picture" :onSuccess="onSuccess" />
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
        <a-button block type="primary" html-type="submit"
          >{{ route.query?.id ? '保存' : '创建' }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { computed, onMounted, reactive, ref, watchEffect } from 'vue'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
} from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
import ImageCropper from '@/components/ImageCropper.vue'
import ImageOutPainting from '@/components/ImageOutPainting.vue'
import { useLoginUserStore } from '@/stores/loginUserStore.ts'
import { getSpaceVoByIdUsingGet } from '@/api/kongjianxiangguanjiekou.ts'

const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictureUpdateDTO>({})
const uploadType = ref<'file' | 'url'>('file')
// 空间 id
const spaceId = computed(() => {
  return route.query?.spaceId
})

/**
 * 图片上传成功
 * @param newPicture
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

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

const imageCropRef = ref()

const doCrop = () => {
  imageCropRef.value.openModal()
}

const onCropSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

const imageOutPaintingRef = ref()

const doOutPainting = () => {
  imageOutPaintingRef.value.openModal()
}

const onOutPaintingSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

const router = useRouter()

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
    spaceId: spaceId.value,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    if (route.query?.id) {
      message.success('修改成功')
      // router.back()
    } else {
      message.success('创建成功')
      // router.push(`/picture/${pictureId}`)
    }
    router.back()
  } else {
    message.error('创建失败，' + res.data.message)
  }
}

const route = useRoute()
const getOldPicture = async () => {
  const id = route.query?.id
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

const space = ref<API.SpaceVO>()

const fetchData = async () => {
  const res = await getSpaceVoByIdUsingGet({ id: spaceId.value })
  if (res.data.code == 0 && res.data.data) {
    space.value = res.data.data
  } else {
    message.error('空间数据获取失败', res.data.message)
  }
}

watchEffect(() => {
  fetchData()
})
</script>

<style scoped>
#add-picture-page {
  width: 720px;
  margin: 0 auto;
}
</style>
