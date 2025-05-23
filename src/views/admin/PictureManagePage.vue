<template>
  <div id="Picture-manage-page">
    <a-flex justify="space-between">
      <h2>图片管理</h2>
      <a-space>
        <a-button type="primary" href="/addPicture" target="_blank">+ 创建图片</a-button>
        <a-button type="primary" ghost href="/addPicture/batch" target="_blank">+ 批量创建图片</a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px"></div>
    <!--  搜索表单  -->
    <a-form
      name="advanced_search"
      class="ant-advanced-search-form"
      :model="searchParams"
      @finish="doSearch"
    >
      <a-row wrap="wrap" gutter="24">
        <a-col flex="1 1 200px">
          <a-form-item label="关键词">
            <a-input
              v-model:value="searchParams.searchText"
              placeholder="输入关键词"
              allowClear
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col flex="1 1 200px">
          <a-form-item label="类型">
            <a-auto-complete
              v-model:value="searchParams.category"
              placeholder="输入类型"
              :options="categoryOptions"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col flex="1 1 200px">
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
        <a-col flex="1 1 200px">
          <a-form-item label="审核状态" name="reviewStatus">
            <a-select
              v-model:value="searchParams.reviewStatus"
              :options="PIC_REVIEW_STATUS_OPTIONS"
              placeholder="请输入审核状态"
              style="min-width: 180px"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col flex="1 1 300px">
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
        <!--    图片信息    -->
        <template v-if="column.key === 'pictureInfo'">
          <div>格式：{{ record.picFormat }}</div>
          <div>宽度：{{ record.picWidth }}</div>
          <div>高度：{{ record.picHeight }}</div>
          <div>宽高比：{{ record.picScale }}</div>
          <div>大小：{{ formatSize(record.picSize) }}</div>
        </template>
        <!--    审核信息    -->
        <template v-if="column.key === 'reviewMessage'">
          <div>审核状态：{{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
          <div>审核信息：{{ record.reviewMessage }}</div>
          <div>审核人：{{ record.reviewerId }}</div>
        </template>
        <template v-else-if="column.key === 'createTime'">
          <span>
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <span v-if="record.reviewStatus != PIC_REVIEW_STATUS_ENUM.PASS">
              <a @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)">通过</a>
              <a-divider type="vertical" />
            </span>

            <span v-if="record.reviewStatus != PIC_REVIEW_STATUS_ENUM.REJECT">
              <a @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)">拒绝</a>
              <a-divider type="vertical" />
            </span>

            <span>
              <a @click="edit(record.id)">编辑</a>
              <a-divider type="vertical" />
            </span>
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
import { computed, onMounted, reactive, ref, watch } from 'vue'

import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  deletePictureUsingPost,
  listPictureByPageUsingPost,
  listPictureTagCategoryUsingGet,
  pictureReviewUsingPost
} from '@/api/tupianxiangguanjiekou.ts'
import { useRouter } from 'vue-router'
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS
} from '../../constant/picture.ts'
import { formatSize } from '../../utils'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '图片',
    key: 'url'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '简介',
    key: 'introduction',
    dataIndex: 'introduction'
  },
  {
    title: '类型',
    key: 'category',
    dataIndex: 'category'
  },
  {
    title: '标签',
    key: 'tags'
  },
  {
    title: '图片信息',
    key: 'pictureInfo'
  },
  {
    title: '用户id',
    dataIndex: 'userId',
    key: 'userId'
  },
  {
    title: '审核信息',
    key: 'reviewMessage'
  },
  {
    title: '创建时间',
    key: 'createTime'
  },
  {
    title: '操作',
    key: 'action'
  }
]

// 数据
const dataList = ref<any>([])
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
  tags: []
})

// 监听搜索条件数据变化
watch(searchParams, (newParams) => {
  if (newParams.searchText === '' || newParams.category === '' || newParams.tags.length === 0) {
    fetchData()
  }
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
        text: value
      }
    })
    categoryOptions.value = res.data.data.categoryList.map((value) => {
      return {
        value: value,
        text: value
      }
    })
  }
}

const onConfirm = (id: number) => {
  doDelete(id)
  fetchData()
}

// 图片审核
const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : '管理员操作拒绝'
  const res = await pictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('审核操作成功')
    // 重新获取数据列表
    fetchData()
  } else {
    message.error('审核操作失败，' + res.data.message)
  }
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
  showTotal: (total: number) => `共${total}条`
}))

// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.size = page.pageSize
  fetchData()
}

// 获取数据
const fetchData = async () => {
  const res = await listPictureByPageUsingPost({
    ...searchParams
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
