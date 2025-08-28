<template>
  <div id="Picture-manage-page">
    <a-flex justify="space-between">
      <h2>空间成员管理</h2>
    </a-flex>
    <div style="margin-bottom: 20px" />
    <a-form layout="inline" :model="formData" @finish="handleSubmit">
      <a-form-item label="用户 id" name="userId">
        <a-input v-model:value="formData.userId" placeholder="请输入用户 id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">添加成员</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px"></div>
    <a-table :columns="columns" :data-source="processedDataList">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userInfo'">
          <a-space>
            <a-avatar
              v-if="!record.userVO.userAvatar"
              size="large"
              :style="{ backgroundColor: '#1890ff', verticalAlign: 'middle' }"
            >
              {{ record?.userVO?.avatarName }}
            </a-avatar>
            <a-avatar v-else size="large" :src="record.userVO.userAvatar"></a-avatar>
            {{ record?.userVO?.userName }}
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'spaceRole'">
          <a-select
            ref="select"
            v-model:value="record.spaceRole"
            style="width: 120px"
            :options="SPACE_ROLE_OPTIONS"
            @change="handleEdit(record.id, record.spaceRole)"
          >
          </a-select>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.key === 'action'">
          <a-popconfirm
            title="确认删除该成员吗"
            ok-text="确认"
            cancel-text="取消"
            @confirm="handleDel(record.id)"
          >
            <a-button class="delBtn" danger type="link">删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'

import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  getSpaceUserListUsingPost,
} from '@/api/kongjianchengyuanxiangguanjiekou.ts'
import { SPACE_ROLE_OPTIONS } from '@/constant/space.ts'

const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
  },
  {
    title: '角色',
    dataIndex: 'spaceRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

interface Props {
  id?: string
}

const props = defineProps<Props>()

// 数据
const dataList = ref<API.SpaceUserVO[]>([])
const formData = reactive<API.SpaceUserAddRequest>({
  spaceRole: 'viewer',
})

// 获取数据
const fetchData = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await getSpaceUserListUsingPost({
    spaceId,
  })
  if (res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 添加空间成员
const handleSubmit = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await addSpaceUserUsingPost({
    spaceId,
    ...formData,
  })
  if (res.data.code == 0 && res.data.data) {
    message.success('添加成功')
    formData.userId = ''
    await fetchData()
  } else {
    message.error('添加失败，' + res.data.message)
  }
}

// 删除操作
const handleDel = async (id: string) => {
  const res = await deleteSpaceUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    await fetchData()
  } else {
    message.error('删除失败，' + res.data.message)
  }
}

// 编辑操作
const handleEdit = async (id: number, spaceRole: string) => {
  const res = await editSpaceUserUsingPost({ id, spaceRole })
  if (res.data.code === 0) {
    message.success('修改成功')
    await fetchData()
  } else {
    message.error('修改失败，' + res.data.message)
  }
}

// 使用计算属性来处理数据转换
const processedDataList = computed(() => {
  return dataList.value.map((item: any) => {
    if (item?.userVO?.userName != null) {
      return {
        ...item,
        userVO: {
          ...item.userVO,
          avatarName: item.userVO.userName.slice(-2),
        },
      }
    }
    return item
  })
})

onMounted(async () => {
  await fetchData()
})
</script>

<style scoped>
.delBtn {
  padding-left: 0;
}
</style>
