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
      <div style="margin-bottom: 40px" />
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
      <div style="margin-bottom: 40px" />
      <a-form-item>
        <a-button block type="primary" html-type="submit"
          >{{ route.query?.id ? '保存' : '创建' }}
        </a-button>
      </a-form-item>
    </a-form>
    <a-card title="空间级别介绍">
      <a-typography-paragraph>
        * 目前仅支持开通普通版，如需升级空间，请联系
        <a href="https://github.com/Lianyuer?tab=projects" target="_blank">管理员</a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
        {{ spaceLevel.text }}：大小 {{ formatSize(spaceLevel.maxSize) }}，数量
        {{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import {
  addSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet,
  updateSpaceUsingPost,
} from '@/api/kongjianxiangguanjiekou.ts'
import { SPACE_LEVEL_OPTIONS } from '@/constant/space.ts'
import { formatSize } from '../../utils'

const oldSpace = ref<API.SpaceVO>()
const spaceForm = reactive<API.SpaceAddDTO | API.SpaceEditDTO>({})
const spaceLevelList = ref<API.SpaceLevel[]>()

const router = useRouter()

/**
 * 表单提交
 */
const handleSubmit = async (values) => {
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

// 获取空间级别列表
const getSpaceLevel = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code == 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('获取空间级别列表失败' + res.data.message)
  }
}

onMounted(() => {
  getOldSpace()
  getSpaceLevel()
})
</script>

<style scoped>
#add-space-page {
  width: 720px;
  margin: 0 auto;
}
</style>
