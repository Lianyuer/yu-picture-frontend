<template>
  <div id="add-space-page">
    <h2 style="margin-bottom: 22px">{{ route.query?.id ? '修改空间' : '创建空间' }}</h2>
    <!--  空间信息表单  -->
    <a-form :model="spaceForm" name="basic" autocomplete="off" @finish="handleSubmit">
      <a-form-item
        name="spaceName"
        label="空间名称"
        :rules="[{ required: true, message: '请输入空间名称' }]"
      >
        <a-input v-model:value="spaceForm.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item
        label="空间级别"
        name="spaceLevel"
        :rules="[{ required: true, message: '请选择空间级别' }]"
      >
        <a-select
          v-model:value="spaceForm.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请选择空间级别"
          style="min-width: 180px"
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
import { onMounted, reactive, ref } from 'vue'

import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import {
  addSpaceUsingPost,
  editSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  updateSpaceUsingPost,
} from '@/api/kongjianxiangguanjiekou.ts'
import { SPACE_LEVEL_OPTIONS } from '@/constant/space.ts'

const oldSpace = ref<API.SpaceVO>()
const spaceForm = reactive<API.SpaceAddDTO | API.SpaceEditDTO>({})

const router = useRouter()

/**
 * 表单提交
 */
const handleSubmit = async (values) => {
  console.log('values', values)
  const spaceId = oldSpace.value?.id
  let res
  // 新增
  if (!spaceId) {
    res = await addSpaceUsingPost({
      ...spaceForm,
    })
  } else {
    // 编辑
    res = await updateSpaceUsingPost({
      id: spaceId,
      ...spaceForm,
    })
  }
  if (res.data.code === 0 && res.data.data) {
    if (route.query?.id) {
      message.success('修改成功')
      router.back()
    } else {
      message.success('创建成功')
      router.push(`/space/${spaceId}`)
    }
  } else {
    message.error('创建失败，' + res.data.message)
  }
}

const route = useRoute()
const getOldSpace = async () => {
  const id = route.query?.id
  if (id) {
    const res = await getSpaceVoByIdUsingGet({ id })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      oldSpace.value = data
      spaceForm.spaceName = data.spaceName
      spaceForm.spaceLevel = data.spaceLevel
    }
  }
}

onMounted(() => {
  getOldSpace()
})
</script>

<style scoped>
#add-space-page {
  width: 720px;
  margin: 0 auto;
}
</style>
