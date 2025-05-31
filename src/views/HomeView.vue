<template>
  <div id="home-page">
    <!--  图片搜索框  -->
    <div class="search-wrapper">
      <a-input-search
        v-model:value="searchParams.searchText"
        placeholder="从海量图片中搜索"
        enter-button="搜索"
        size="large"
        allow-clear
        @search="onSearch"
      />
    </div>
    <!--  分类 tabs  -->
    <a-tabs v-model:activeKey="selectedCategory" @change="onSearch">
      <a-tab-pane tab="全部" key="all"></a-tab-pane>
      <a-tab-pane v-for="category in categoryList" :tab="category" :key="category"></a-tab-pane>
    </a-tabs>
    <!--  标签 tags  -->
    <div class="pic-tags">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTags[index]"
          @change="onSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
    <!--  图片列表  -->
    <PictureList :dataList="dataList" :loading="loading" />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.size"
      :total="total"
      @change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import PictureList from '@/components/PictureList.vue'

// 定义数据
const dataList = ref<API.PictureVO[]>([])
const total = ref()
const loading = ref(true)
const categoryList = ref<string[]>([])
const tagList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const selectedTags = ref<string[]>([])

// 搜索
const onSearch = () => {
  // 搜索时页数重置为 1，否则可能搜索不到图片
  searchParams.current = 1
  fetchData()
}

// 搜索条件
const searchParams = reactive<API.PictureQueryDTO>({
  current: 1,
  size: 12,
  sortField: 'create_time',
  sortOrder: 'descend',
})

// 监听搜索条件
watch(searchParams, (newParams) => {
  // 当关键词条件为空时就触发搜索
  if (!newParams.searchText) {
    fetchData()
  }
})

// 分页事件
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.size = pageSize
  fetchData()
}

// 获取图片数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    tags: [] as string,
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTags.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.code === 0 && res.data.data.records) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('数据获取失败,' + res.data.message)
  }
  loading.value = false
}

// 获取标签分类列表
const getPictureTagCategory = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    tagList.value = res.data.data.tagList
    categoryList.value = res.data.data.categoryList
  } else {
    message.error('获取标签分类列表失败', res.data.message)
  }
}

const router = useRouter()
// 跳转图片详情页
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

onMounted(() => {
  fetchData()
  getPictureTagCategory()
})
</script>

<style scoped>
#home-page .search-wrapper {
  margin-bottom: 22px;
}

#home-page .pic-tags {
  margin-bottom: 20px;
}

#home-page :deep(.ant-card-body) {
  height: 130px;
}
</style>
