<template>
  <div class="picture-list">
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 6 }"
      :data-source="props.dataList"
      :loading="props.loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0" @click="doClickPicture(picture)">
          <a-card hoverable>
            <template #cover>
              <img
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                style="height: 180px; object-fit: cover"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex wrap="wrap">
                  <a-tag color="green">
                    {{ picture.category ?? '默认' }}
                  </a-tag>
                  <a-tag v-for="tag in picture.tags"> {{ tag }}</a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template v-if="showOp" #actions>
              <a-space @click="(e: any) => doEdit(picture, e)">
                <edit-outlined />
                编辑
              </a-space>
              <a-space @click="(e: any) => doDelete(picture, e)">
                <delete-outlined />
                删除
              </a-space>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { deletePictureUsingPost } from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload: () => {}
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  onReload: () => {},
})

const router = useRouter()
// 跳转图片详情页
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

// 编辑图片
const doEdit = (picture, e) => {
  e.stopPropagation()
  router.push({
    path: '/addPicture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

// 删除图片
const doDelete = async (picture, e) => {
  e.stopPropagation()
  const res = await deletePictureUsingPost({
    id: picture.id,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('删除成功')
    // 让外层刷新
    props?.onReload()
  } else {
    message.error('删除失败，' + res.data.message)
  }
}
</script>
