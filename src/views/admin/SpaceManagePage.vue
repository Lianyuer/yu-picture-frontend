<template>
  <div id="Picture-manage-page">
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space>
        <a-button type="primary" href="/addSpace" target="_blank">+ 创建空间</a-button>
        <a-button type="primary" ghost href="/spaceAnalyze?queryPublic=1" target="_blank"
          >分析公共图库</a-button
        >
        <a-button type="primary" ghost href="/spaceAnalyze?queryAll=1" target="_blank"
          >分析全空间</a-button
        >
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
      <a-row wrap="wrap" :gutter="30">
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-form-item label="空间名称">
            <a-input
              v-model:value="searchParams.spaceName"
              placeholder="输入空间名称"
              allow-clear
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-form-item label="空间级别" name="spaceLevel">
            <a-select
              v-model:value="searchParams.spaceLevel"
              :options="SPACE_LEVEL_OPTIONS"
              placeholder="请选择空间级别"
              style="min-width: 180px"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-form-item label="用户 id">
            <a-auto-complete
              v-model:value="searchParams.userId"
              placeholder="输入用户 id"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-form-item>
          <a-button type="primary" html-type="submit">搜索</a-button>
        </a-form-item>
      </a-row>
    </a-form>
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <!--    空间级别    -->
        <template v-if="column.key === 'spaceLevel'">
          <a-tag
            :color="record.spaceLevel == 2 ? '#108ee9' : record.spaceLevel == 1 ? '#2db7f5' : ''"
            >{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</a-tag
          >
        </template>
        <!--    空间类型    -->
        <template v-if="column.key === 'spaceType'">
          <a-tag :color="record.spaceType == 0 ? '#108ee9' : '#2db7f5'">{{
            SPACE_TYPE_MAP[record.spaceType]
          }}</a-tag>
        </template>
        <!--    使用情况    -->
        <template v-if="column.key === 'spaceUseInfo'">
          <div>数量：{{ record.totalCount }} / {{ record.maxCount }}</div>
          <div>大小：{{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
        </template>
        <!--    创建时间    -->
        <template v-else-if="column.key === 'createTime'">
          <span>
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
        <!--    编辑时间    -->
        <template v-else-if="column.key === 'editTime'">
          <span>
            {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <span>
              <a type="link" :href="`/spaceAnalyze?spaceId=${record.id}`" target="_blank">分析</a>
              <a-divider type="vertical" />
              <a @click="edit(record.id)">编辑</a>
              <a-divider type="vertical" />
            </span>
            <a-popconfirm
              title="确认删除该空间吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onConfirm(record.id)"
            >
              <a-button style="padding: 0" danger type="link">删除</a-button>
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
import { useRouter } from 'vue-router'
import { formatSize } from '../../utils'
import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/kongjianxiangguanjiekou.ts'
import { SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS, SPACE_TYPE_MAP } from '../../constant/space.ts'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '空间名称',
    key: 'spaceName',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
    key: 'spaceLevel',
  },
  {
    title: '空间类型',
    dataIndex: 'spaceType',
    key: 'spaceType',
  },
  {
    title: '使用情况',
    key: 'spaceUseInfo',
  },
  {
    title: '用户 id',
    key: 'userId',
    dataIndex: 'userId',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    key: 'editTime',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
const dataList = ref<any>([])
const total = ref<number>(0)

const router = useRouter()

const edit = (key: string) => {
  router.push('/addSpace?id=' + key)
}

// 搜索条件
const searchParams = reactive<API.SpaceQueryDTO>({
  current: 1,
  size: 10,
  spaceName: '',
  spaceLevel: null,
})

// 监听搜索条件数据变化
watch(searchParams, (newParams) => {
  if (newParams.spaceName === '' || newParams.spaceLevel === '' || newParams.userId === 0) {
    fetchData()
  }
})

const onConfirm = (id: number) => {
  doDelete(id)
  fetchData()
}

// 删除操作
const doDelete = async (id: number) => {
  const res = await deleteSpaceUsingPost({ id })
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
  const res = await listSpaceByPageUsingPost({
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
})
</script>
