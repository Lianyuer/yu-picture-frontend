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
          <a-input
            v-if="editableData[record.id]"
            v-model:value="editableData[record.id][column.dataIndex]"
            style="margin: -5px 0"
          />
          <template v-else>
            {{ record.userName }}
          </template>
        </template>
        <template v-else-if="column.key === 'userAvatar'">
          <span>
            <a-image :src="record.userAvatar" width="50px"></a-image>
          </span>
        </template>
        <template v-else-if="column.key === 'userProfile'">
          <a-textarea
            v-if="editableData[record.id]"
            v-model:value="editableData[record.id][column.dataIndex]"
            style="margin: -5px 0"
          />
          <template v-else>
            {{ record.userProfile }}
          </template>
        </template>
        <template v-else-if="column.key === 'userRole'">
          <a-select
            v-if="editableData[record.id]"
            v-model:value="editableData[record.id][column.dataIndex]"
            style="margin: -5px 0; width: 100px"
          >
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
          </a-select>
          <template v-else>
            <a-tag :color="record.userRole == 'admin' ? 'success' : 'processing'">
              {{ record.userRole == 'admin' ? '管理员' : '普通用户' }}
            </a-tag>
          </template>
        </template>
        <template v-else-if="column.key === 'createTime'">
          <span>
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <span v-if="editableData[record.id]">
              <a-typography-link @click="save(record.id)">保存 </a-typography-link>
              <a-popconfirm title="确认取消吗?" @confirm="cancel(record.id)">
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="edit(record.id)">编辑</a>
            </span>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确认删除该用户吗?"
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
import { cloneDeep } from 'lodash-es'
import { computed, onMounted, reactive, ref, type UnwrapRef } from 'vue'
import {
  deleteUserUsingPost,
  listUserVoByPageUsingPost,
  updateUserUsingPost,
} from '@/api/yonghuxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
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

interface DataItem {
  id: string
  userName: string
  userProfile: string
}

// 行内编辑
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({})

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataList.value.filter((item) => key === item.id)[0])
}
const save = async (key: string) => {
  Object.assign(dataList.value.filter((item) => key === item.id)[0], editableData[key])
  console.log(',editableData[key]', editableData[key])
  const res = await updateUserUsingPost(editableData[key])
  if (res.data.code === 0) {
    message.success('修改成功')
  } else {
    message.warning('修改失败' + res.data.message)
  }
  delete editableData[key]
}
const cancel = (key: string) => {
  delete editableData[key]
}

// 搜索条件
const searchParams = reactive<API.UserQueryDTO>({
  current: 1,
  size: 10,
})

const onConfirm = (id: number) => {
  doDelete(id)
  fetchData()
}

// 删除操作
const doDelete = async (id: number) => {
  const res = await deleteUserUsingPost({ id })
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
