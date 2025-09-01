<template>
  <div id="my-space-page">正在跳转，请稍后...</div>
</template>

<script setup lang="ts">
/*
  我的空间页面是一个 “中间页”，作用是根据用户是否已有空间，重定向到对应的页面。
  先梳理业务流程，跳转到该页面时：
  1、用户未登录，则直接跳转到登录页面
  2、如果用户已登录，会获取该用户已创建的空间
  3、如果有，则进入第一个空间
  4、如果没有，则跳转到创建空间页面
*/
import { useLoginUserStore } from '@/stores/loginUserStore.ts'
import { useRouter } from 'vue-router'
import { listSpaceVoByPageUsingPost } from '@/api/kongjianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { onMounted } from 'vue'
import { SPACE_TYPE_ENUM } from '@/constant/space.ts'

const router = useRouter()
const loginUserStore = useLoginUserStore()

// 检查用户是否有个人空间
const checkUserSpace = async () => {
  const loginUser = loginUserStore.loginUser
  if (!loginUser?.id) {
    router.replace('/user/login')
    return
  }
  // 获取用户空间信息
  const res = await listSpaceVoByPageUsingPost({
    userId: loginUser.id,
    current: 1,
    size: 10, // 返回的空间数量，目前每种类型(私有/团队)的空间最多创建一个
  })
  if (res.data.code == 0) {
    const spaceList = res.data.data?.records
    if (spaceList.length > 0) {
      // const space = res.data.data.records[0]
      // 查询空间列表返回的数据根据创建时间降序排列
      // 找到创建的私有空间，直接筛选私有空间，找到第一个。暂不考虑其他创建多个私有空间的情况
      const mySpaceList = spaceList.filter((item) => item.spaceType == SPACE_TYPE_ENUM.PRIVATE)
      const mySpace = mySpaceList[0]
      const mySpaceId = BigInt(mySpace.id)
      router.replace(`/space/${mySpaceId}`)
    } else {
      router.replace('/addSpace')
      message.warn('请先创建空间')
    }
  } else {
    message.error('加载我的空间失败' + res.data.message)
  }
}

onMounted(() => {
  checkUserSpace()
})
</script>
