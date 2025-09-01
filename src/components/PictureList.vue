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
              <share-alt-outlined @click="(e: any) => doShare(picture, e)" />
              <search-outlined @click="(e: any) => doSearch(picture, e)" />
              <edit-outlined @click="(e: any) => doEdit(picture, e)" v-if="canEdit" />
              <delete-outlined @click="(e: any) => doDelete(picture, e)" v-if="canDelete" />
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <ShareModal ref="shareModalRef" :link="shareLink" :icon="shareIcon" :name="picName" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { deletePictureUsingPost } from '@/api/tupianxiangguanjiekou.ts'
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import ShareModal from '@/components/ShareModal.vue'
import { ref } from 'vue'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
  canEdit?: boolean
  canDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  onReload: () => {},
  canEdit: false,
  canDelete: false,
})

const router = useRouter()
// 跳转图片详情页
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

// 分享弹窗引用
const shareModalRef = ref()
// 分享链接
const shareLink = ref<string>()
// 分享图 icon
const shareIcon = ref<string>()
// 图片名称
const picName = ref<string>()

// 分享
const doShare = (picture: API.PictureVO, e: any) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  shareIcon.value = picture.thumbnailUrl
  picName.value = picture.name
  if (shareModalRef.value) {
    shareModalRef.value.showModal()
  }
}

// 搜索
const doSearch = (picture, e) => {
  e.stopPropagation()
  window.open('/pictureSearch?id=' + picture.id)
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
