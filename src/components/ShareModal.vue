<template>
  <div>
    <a-modal v-model:visible="visible" :title="title" @cancel="handleCancel" :footer="null">
      <a-flex align="center" vertical>
        <a-qrcode
          error-level="H"
          :value="link"
          :icon="icon"
        />
        <h3 style="margin-top: 10px">{{ name }}</h3>
        <a-typography-paragraph copyable keyboard>{{ link}}</a-typography-paragraph>
      </a-flex>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const visible = ref<boolean>(false)

interface Props {
  title?: string
  link?: string
  icon?: string
  name?: string
}

withDefaults(defineProps<Props>(), {
  title: () => '分享链接'
})

const showModal = () => {
  visible.value = true
}

const handleCancel = () => {
  visible.value = false
}

defineExpose({
  showModal
})

</script>

