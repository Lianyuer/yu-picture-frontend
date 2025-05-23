<template>
  <div id="add-picture-batch-page">
    <h2 style="margin-bottom: 25px">批量创建</h2>
    <!--  图片信息表单  -->
    <a-form
      :model="formData"
      name="basic"
      autocomplete="off"
      @finish="handleSubmit"
    >
      <a-form-item name="searchText" label="关键词"
                   :rules="{ required: true, message: '请输入关键词', trigger: ['change','blur'] }">
        <a-input v-model:value="formData.searchText" placeholder="请输入关键词" allow-clear />
      </a-form-item>
      <a-form-item name="introduction" label="抓取数量">
        <a-input-number
          v-model:value="formData.count"
          :min="1"
          :max="30"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="namePrefix" label="名称前缀">
        <a-input
          v-model:value="formData.namePrefix"
          placeholder="请输入名称前缀，会自动补充序号"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button block type="primary" html-type="submit" :loading="loading">执行任务</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { uploadPictureByBatchUsingPost } from '@/api/tupianxiangguanjiekou.ts'

const formData = reactive<API.PictureUploadByBatchDTO>({
  count: 10
})
const router = useRouter()
const loading = ref(false)

/**
 * 表单提交
 */
const handleSubmit = async () => {
  loading.value = true
  const res = await uploadPictureByBatchUsingPost({
    ...formData
  })
  if (res.data.code === 0 && res.data.data) {
    message.success(`图片创建成功，共${res.data.data}张`)
    router.push(`/`)
  } else {
    message.error('创建失败，' + res.data.message)
  }
  loading.value = false
}

onMounted(() => {

})
</script>

<style scoped>
#add-picture-batch-page {
  width: 720px;
  margin: 0 auto;
}
</style>
