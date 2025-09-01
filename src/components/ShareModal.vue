<template>
  <div>
    <a-modal v-model:open="open" :title="title" @cancel="handleCancel" :footer="null">
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

const open = ref<boolean>(false)

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
  open.value = true
}

const handleCancel = () => {
  open.value = false
}

defineExpose({
  showModal
})

</script>

