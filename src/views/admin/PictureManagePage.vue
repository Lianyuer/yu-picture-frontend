<template>
  <div id="Picture-manage-page">
    <a-form
      name="advanced_search"
      class="ant-advanced-search-form"
      :model="searchParams"
      @finish="doSearch"
    >
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="关键词">
            <a-input
              v-model:value="searchParams.searchText"
              placeholder="输入关键词"
              allowClear
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="类型">
            <a-auto-complete
              v-model:value="searchParams.category"
              placeholder="输入类型"
              :options="categoryOptions"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="标签">
            <a-select
              v-model:value="searchParams.tags"
              mode="tags"
              placeholder="输入标签"
              :options="tagOptions"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" justify="end">
        <a-col>
          <a-form-item>
            <a-button type="primary" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          {{ record.name }}
        </template>
        <template v-if="column.key === 'url'">
          <div class="img-wrapper" style="width: 160px">
            <a-image :src="record.url" height="80px" />
          </div>
        </template>
        <template v-if="column.key === 'tags'">
          <a-space wrap>
            <a-tag color="default" v-for="tag in record.tags">{{ tag }}</a-tag>
          </a-space>
        </template>
        <template v-else-if="column.key === 'createTime'">
          <span>
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <span>
              <a @click="edit(record.id)">编辑</a>
            </span>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确认删除该图片吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onConfirm(record.id)"
            >
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, type UnwrapRef } from 'vue'

import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  deletePictureUsingPost,
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
  updatePictureUsingPost,
} from '@/api/tupianxiangguanjiekou.ts'
import { useRouter } from 'vue-router'
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '图片',
    key: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '简介',
    key: 'introduction',
    dataIndex: 'introduction',
  },
  {
    title: '类型',
    key: 'category',
    dataIndex: 'category',
  },
  {
    title: '标签',
    key: 'tags',
  },
  {
    title: '创建时间',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
let dataList = ref<any>([])
const total = ref<number>(0)

const router = useRouter()

const edit = (key: string) => {
  router.push('/addPicture?id=' + key)
}

// 搜索条件
const searchParams = reactive<API.PictureQueryDTO>({
  current: 1,
  size: 10,
  searchText: '',
  category: '',
  tags: [],
})

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

const onConfirm = (id: number) => {
  doDelete(id)
  fetchData()
}

// 删除操作
const doDelete = async (id: number) => {
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    if (dataList.value.length == 1) {
      searchParams.current--
    }
  } else {
    message.error('删除失败，' + res.data.message)
  }
}

const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

const pagination = computed(() => ({
  total: Number(total.value),
  current: searchParams.current ?? 1,
  pageSize: searchParams.size ?? 10,
  showSizeChanger: true,
  showTotal: (total: number) => `共${total}条`,
}))

// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.size = page.pageSize
  fetchData()
}

// 获取数据
const fetchData = async () => {
  const res = await listPictureVoByPageUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

onMounted(() => {
  fetchData()
  getPictureTagCategory()
})
</script>
