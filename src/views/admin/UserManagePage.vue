<template>
  <div id="user-manage-page">
    <a-form
      name="advanced_search"
      class="ant-advanced-search-form"
      :model="searchParams"
      @finish="doSearch"
    >
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="账号">
            <a-input
              v-model:value="searchParams.userAccount"
              placeholder="输入账号"
              allowClear
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="用户名">
            <a-input
              v-model:value="searchParams.userName"
              placeholder="输入用户名"
              allowClear
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="角色">
            <a-select v-model:value="searchParams.userRole" allowClear placeholder="选择角色">
              <a-select-option value="admin">管理员</a-select-option>
              <a-select-option value="user">普通用户</a-select-option>
            </a-select>
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
      <template #headerCell="{ column }">
        <template v-if="column.key === 'id'">
          <span> id </span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'userAccount'">
          {{ record.userAccount }}
        </template>
        <template v-else-if="column.key === 'userName'">
          <span>
            {{ record.userName }}
          </span>
        </template>
        <template v-else-if="column.key === 'userAvatar'">
          <span>
            <a-image :src="record.userAvatar" width="50px"></a-image>
          </span>
        </template>
        <template v-else-if="column.key === 'userProfile'">
          <span>
            {{ record.userProfile }}
          </span>
        </template>
        <template v-else-if="column.key === 'userRole'">
          <span>
            <a-tag :color="record.userRole == 'admin' ? 'success' : 'processing'">
              {{ record.userRole == 'admin' ? '管理员' : '普通用户' }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'createTime'">
          <span>
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a>编辑</a>
            <a-divider type="vertical" />
            <a>删除</a>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { listUserVoByPageUsingPost } from '@/api/yonghuxiangguanjiekou.ts'
import { type FormInstance, message } from 'ant-design-vue'
import dayjs from 'dayjs'
const columns = [
  {
    name: 'id',
    width: '180px',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    key: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '头像',
    key: 'userAvatar',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    key: 'userProfile',
    dataIndex: 'userProfile',
  },
  {
    title: '角色',
    key: 'userRole',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
let dataList = ref<any>([])
const total = ref<number>(0)

// 搜索条件
const searchParams = reactive<API.UserQueryDTO>({
  current: 1,
  size: 10,
})

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
  const res = await listUserVoByPageUsingPost({
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
