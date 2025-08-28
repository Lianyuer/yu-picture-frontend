<template>
  <a-modal v-model:open="open" title="添加/删除成员" @ok="handleClickModal" @cancel="closeModal">
    <a-transfer
      v-model:target-keys="targetKeys"
      v-model:selected-keys="selectedKeys"
      :data-source="dataList"
      :list-style="{
        width: '300px',
        height: '300px',
      }"
      show-search
      :render="(item) => item.title"
      @change="handleChange"
      @selectChange="handleSelectChange"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { listUserVoByPageUsingPost } from '@/api/yonghuxiangguanjiekou.ts'
import { message, Modal } from 'ant-design-vue'
import { batchAddSpaceUserUsingPost } from '@/api/kongjianchengyuanxiangguanjiekou.ts'
import eventBus, { EVENTS } from '@/utils/eventBus'

interface MockData {
  key: string
  title: string
  description: string
  disabled: boolean
}

interface Props {
  spaceId: string
  selectedList: []
  onSuccess: () => void
}

const props = defineProps<Props>()

const userList = ref([])
const dataList = ref([])
const open = ref<boolean>(false)

const showModal = () => {
  open.value = true
}

const closeModal = () => {
  open.value = false
  reset()
}

const reset = () => {
  targetKeys.value = []
  selectedKeys.value = []
}

const mockData = []

const oriTargetKeys = mockData.filter((item) => +item.key % 3 > 1).map((item) => item.key)

const targetKeys = ref<string[]>(oriTargetKeys)

const selectedKeys = ref<string[]>([])

const handleChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
  // console.log('targetKeys: ', nextTargetKeys)
  // console.log('moveKeys: ', moveKeys)
  selectedKeys.value = targetKeys.value
  // console.log('selectedKeys: ', selectedKeys.value)
}
const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
  // console.log('sourceSelectedKeys: ', sourceSelectedKeys)
  // console.log('targetSelectedKeys: ', targetSelectedKeys)
}

// 搜索条件
const searchParams = ref<API.UserQueryDTO>({
  current: 1,
  size: 6,
  sortField: 'create_time',
  sortOrder: 'descend',
})

// 获取用户列表数据
const fetchUserListData = async () => {
  const res = await listUserVoByPageUsingPost({ ...searchParams })
  if (res.data.code == 0 && res.data.data) {
    userList.value = res.data.data.records
    dataList.value = userList.value.map((item) => {
      return {
        key: item.id,
        title: item.userName,
      }
    })
    const selectedList = props.selectedList
    targetKeys.value = selectedList.map((item) => item.userId)
  } else {
    message.error('用户数据获取失败' + res.data.message)
  }
}

const handleClickModal = () => {
  console.log('selectedKeys.value', selectedKeys.value)
  if (selectedKeys.value.length == 0) {
    Modal.confirm({
      title: '未选择任何成员，将全部移除，确认吗',
      onOk: handleSubmit,
    })
  } else {
    handleSubmit()
  }
}

const handleSubmit = async () => {
  const spaceId = props.spaceId
  const res = await batchAddSpaceUserUsingPost({
    spaceId,
    spaceRole: 'viewer',
    userIds: selectedKeys.value,
  })
  if (res.data.code == 0 && res.data.data) {
    message.success('添加成功')
    closeModal()
    // // 通知父组件更新数据
    // eventBus.emit(EVENTS.SPACE_USER_ADD)
    // 或者使用 props 子组件调用触发父组件的刷新
    props.onSuccess?.()
  } else {
    message.error('添加失败' + res.data.message)
  }
}

watch(
  () => open.value,
  () => {
    fetchUserListData()
  },
)

defineExpose({
  showModal,
})
</script>

<style scoped></style>
