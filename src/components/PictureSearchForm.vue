<template>
  <div id="picture-search-form">
    <!--  搜索表单  -->
    <!--
        关键词：文本输入框
        标签：下拉选择框
        分类：下拉选择框
        编辑时间：日期选择器
        图片名称：文本输入框
        图片简介：文本输入框
        图片宽度：数字输入框
        图片高度：数字输入框
        图片格式：文本输入框 / 下拉选择框
      -->
    <a-form
      name="advanced_search"
      layout="inline"
      class="ant-advanced-search-form"
      :model="searchParams"
      @finish="doSearch"
    >
      <a-form-item label="关键词" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="输入关键词"
          allowClear
        ></a-input>
      </a-form-item>
      <a-form-item label="类型" name="picFormat">
        <a-auto-complete
          v-model:value="searchParams.category"
          placeholder="输入类型"
          :options="categoryOptions"
          allow-clear
          style="min-width: 130px"
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="searchParams.tags"
          mode="tags"
          placeholder="输入标签"
          :options="tagOptions"
          allow-clear
          style="min-width: 130px"
        />
      </a-form-item>
      <a-form-item label="编辑时间" name="dateTimeRange">
        <a-range-picker
          style="width: 330px"
          show-time
          v-model:value="dateTimeRange"
          :placeholder="['编辑开始日期', '编辑结束时间']"
          format="YYYY/MM/DD HH:mm:ss"
          :presets="rangePresets"
          @change="onRangeChange"
        />
      </a-form-item>
      <a-form-item label="图片名称" name="name" v-show="expand">
        <a-input v-model:value="searchParams.name" placeholder="输入图片名称" allowClear></a-input>
      </a-form-item>
      <a-form-item label="图片简介" name="introduction" v-show="expand">
        <a-input
          v-model:value="searchParams.introduction"
          placeholder="输入图片简介"
          allowClear
        ></a-input>
      </a-form-item>
      <a-form-item label="图片宽度" name="picWidth" v-show="expand">
        <a-input-number
          v-model:value="searchParams.picWidth"
          placeholder="输入图片宽度"
          allowClear
          style="min-width: 130px"
        ></a-input-number>
      </a-form-item>
      <a-form-item label="图片高度" name="picHeight" v-show="expand">
        <a-input-number
          v-model:value="searchParams.picHeight"
          placeholder="输入图片高度"
          allowClear
          style="min-width: 130px"
        ></a-input-number>
      </a-form-item>
      <a-form-item label="图片格式" name="picFormat" v-show="expand">
        <a-input
          v-model:value="searchParams.picFormat"
          placeholder="输入图片格式"
          allowClear
        ></a-input>
      </a-form-item>

      <a-form-item>
        <a-space size="middle">
          <a-button type="primary" html-type="submit">搜索</a-button>
          <a-button html-type="reset" @click="doClear">重置</a-button>
          <a style="font-size: 12px" @click="expand = !expand">
            <template v-if="expand">
              <UpOutlined />
            </template>
            <template v-else>
              <DownOutlined />
            </template>
            {{ expand == false ? '展开' : '收起' }}
          </a>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue'

import { listPictureTagCategoryUsingGet } from '@/api/tupianxiangguanjiekou.ts'
import dayjs from 'dayjs'

interface Props {
  onSearch?: (searchParams: API.PictureQueryDTO) => void
}

const props = defineProps<Props>()

const expand = ref(false)

// 数据
const dataList = ref<any>([])

const tagOptions = ref<string[]>()
const categoryOptions = ref<string[]>()

// 获取标签分类列表
const getPictureTagCategory = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    tagOptions.value = res.data.data.tagList.map((value) => {
      return {
        value: value,
        text: value,
      }
    })
    categoryOptions.value = res.data.data.categoryList.map((value) => {
      return {
        value: value,
        text: value,
      }
    })
  }
}

const rangePresets = ref([
  { label: '最近 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '最近 2 周', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '最近 1 个月', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '最近 3 个月', value: [dayjs().add(-90, 'd'), dayjs()] },
])

/**
 * 日期范围更改时触发
 * @param dates
 * @param dateStrings
 */
const onRangeChange = (dates: any[], dateStrings: string[]) => {
  if (dates?.length < 2 || dates == null) {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  } else {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
  }
}

// 搜索条件
const searchParams = reactive<API.PictureQueryDTO>({})

// 获取数据
const doSearch = () => {
  props.onSearch?.(searchParams)
}

const dateTimeRange = ref<[]>([])

// 清空搜索表单
const doClear = () => {
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = undefined
  })
  dateTimeRange.value = []
  props.onSearch?.(searchParams)
}

onMounted(() => {
  getPictureTagCategory()
})
</script>

<style scoped>
#picture-search-form .ant-form-item {
  margin-bottom: 10px;
}
</style>
