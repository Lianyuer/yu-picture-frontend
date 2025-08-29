<template>
  <div id="space-detail-page">
    <!--  搜索表单组件  -->
    <PictureSearchForm :onSearch="onSearch" />
    <div style="margin: 10px 0">
      按颜色搜索：
      <color-picker format="hex" @pureColorChange="onColorChange" />
    </div>
    <!-- 空间信息 -->
    <a-flex justify="space-between" align="center" style="margin-bottom: 22px">
      <h2 style="margin-bottom: 0">
        {{ space.spaceName }}（{{ SPACE_TYPE_MAP[space.spaceType] }}）
      </h2>
      <a-space size="middle">
        <a-button type="primary" @click="handleClickCreatePic" v-if="canUploadPicture"
          >+ 创建图片</a-button
        >
        <a-button
          v-if="space.spaceType == 1 && canManageSpaceUser"
          type="primary"
          ghost
          :icon="h(TeamOutlined)"
          @click="router.replace(`/spaceUserManage/${id}`)"
        >
          成员管理
        </a-button>
        <a-button
          v-if="canManageSpaceUser"
          :icon="h(BarChartOutlined)"
          type="primary"
          ghost
          :href="`/spaceAnalyze?spaceId=${props.id}`"
          target="_blank"
          >空间分析
        </a-button>
        <a-button :icon="h(EditOutlined)" @click="doBatchEdit" v-if="canEditPicture"
          >批量编辑</a-button
        >
        <a-tooltip :title="`${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`">
          <a-progress
            type="circle"
            :percent="((space.totalSize / space.maxSize) * 100).toFixed(1)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>
    <!--  图片列表  -->
    <PictureList
      :dataList="dataList"
      :loading="loading"
      :showOp="true"
      :onReload="onReload"
      :canEdit="canEditPicture"
      :canDelete="canDeletePicture"
    />
    <div style="display: flex; justify-content: end; align-items: center">
      <div style="text-align: right">图片总数 {{ space.totalCount }} / {{ space.maxCount }}</div>
      <a-pagination
        style="text-align: right"
        v-model:current="searchParams.current"
        v-model:pageSize="searchParams.size"
        :total="total"
        @change="onPageChange"
      />
    </div>
    <PictureBatchEditModal
      ref="pictureBatchEditModalRef"
      :spaceId="space.id"
      :pictureList="dataList"
      :onSuccess="onBatchEditPicturesSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  listPictureVoByPageUsingPost,
  searchPictureByColorUsingPost,
} from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { getSpaceVoByIdUsingGet } from '@/api/kongjianxiangguanjiekou.ts'
import PictureList from '@/components/PictureList.vue'
import { formatSize } from '@/utils'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import { EditOutlined, BarChartOutlined, TeamOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import PictureBatchEditModal from '@/components/PictureBatchEditModal.vue'
import { SPACE_PERMISSION_ENUM, SPACE_TYPE_MAP } from '../../constant/space.ts'
import router from '@/router'

// 定义数据
const loading = ref(true)
const space = ref<API.SpaceVO>({})

// 通用权限检查函数
const createPermissionChecker = (permission: string) => {
  return computed(() => {
    return (space.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

interface Props {
  id: string | number
}

const props = defineProps<Props>()

const handleClickCreatePic = () => {
  router.push(`/addPicture?spaceId=${props.id}`)
}

// 获取空间详情
const fetchSpaceDetail = async () => {
  loading.value = true
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败,' + res.data.message)
    }
  } catch (e) {
    message.error('获取空间详情失败：' + e.message)
  }
  loading.value = false
}

// 定义数据
const dataList = ref<API.PictureVO[]>([])
const total = ref()

// 搜索条件
const searchParams = ref<API.PictureQueryDTO>({
  current: 1,
  size: 12,
  sortField: 'create_time',
  sortOrder: 'descend',
})

// 分页事件
const onPageChange = (page: number, pageSize: number) => {
  searchParams.value.current = page
  searchParams.value.size = pageSize
  fetchData()
}

// 搜索
const onSearch = (newSearchParams: API.PictureUpdateDTO) => {
  searchParams.value = {
    ...searchParams.value,
    ...newSearchParams,
    current: 1,
  }
  fetchData()
}

// 获取图片数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams.value,
  }

  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.code === 0 && res.data.data.records) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取图片数据失败,' + res.data.message)
  }
  loading.value = false
}

const onReload = () => {
  fetchData()
  fetchSpaceDetail()
}

// 按颜色搜索
const onColorChange = async (color: string) => {
  const res = await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: props.id,
  })
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data ?? []
    dataList.value = data
    total.value = data.length
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

const pictureBatchEditModalRef = ref()

// 弹出批量编辑图片弹框
const doBatchEdit = () => {
  if (pictureBatchEditModalRef.value) {
    pictureBatchEditModalRef.value.showModal()
  }
}

// 批量编辑成功后刷新数据
const onBatchEditPicturesSuccess = () => {
  fetchData()
}

onMounted(() => {
  fetchSpaceDetail()
  fetchData()
  console.log('canManageSpaceUser', canManageSpaceUser)
})

//  watch 监听空间 id 变量
watch(
  () => props.id,
  (newSpaceId) => {
    fetchSpaceDetail()
    fetchData()
  },
)
</script>

<style scoped>
/*

#space-detail-page {
  height: 800px;
}

#space-detail-page .picture-list {
  height: 710px;
}

*/
</style>
