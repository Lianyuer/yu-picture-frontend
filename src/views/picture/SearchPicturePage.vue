<template>
  <div id="searchPicturePage">
    <h2>以图搜图</h2>
    <h3>原图</h3>
    <a-image :src="picture.thumbnailUrl" height="249px"></a-image>
    <h2 style="margin-top: 16px">识图结果</h2>
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <a :href="picture.fromUrl" target="_blank">
            <a-card hoverable>
              <template #cover>
                <img
                  :src="picture.thumbUrl"
                  style="height: 180px; border-radius: 10px; object-fit: cover"
                />
              </template>
            </a-card>
          </a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
// 获取图片数据
import {
  getPictureVoByIdUsingGet,
  searchPictureByPictureUsingPost,
} from '@/api/tupianxiangguanjiekou.ts'
import { computed, onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const loading = ref(true)
const picture = ref<API.PictureVO>({})
const pictureId = computed(() => {
  return route.query?.id
})
const dataList = ref<API.ImageSearchResult[]>([])

// 获取原图片
const getOldPicture = async () => {
  const res = await getPictureVoByIdUsingGet({
    id: pictureId.value,
  })
  if (res.data.code === 0 && res.data.data) {
    picture.value = res.data.data
  } else {
    message.error('数据获取失败,' + res.data.message)
  }
}

// 获取以图搜图结果
const fetchData = async () => {
  loading.value = true
  const res = await searchPictureByPictureUsingPost({
    pictureId: pictureId.value,
  })
  console.log('res', res)
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data
  } else {
    message.error('图片搜索失败')
  }
  loading.value = false
}

onMounted(() => {
  getOldPicture()
  fetchData()
})
</script>

<style scoped>
#searchPicturePage {
}
</style>
