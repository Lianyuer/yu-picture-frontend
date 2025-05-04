import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '@/api/yonghuxiangguanjiekou.ts'

/**
 * 存储登录用户信息的状态
 */
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: '未登录',
  })

  /**
   * 获取用户登录信息
   */
  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet()
    if (res.data.code === 0 && res.data.data) {
      setLoginUser(res.data.data)
    }
    // // 测试: 3秒后自动登录
    // setTimeout(() => {
    //   setLoginUser({
    //     id: 1,
    //     userName: '测试'
    //   })
    // }, 3000)
  }

  /**
   * 设置登录用户
   * @param newLoginUser
   */
  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }

  /**
   * 删除登录用户
   */
  function removeLoginUser() {
    loginUser.value = {}
  }

  return { loginUser, fetchLoginUser, setLoginUser, removeLoginUser }
})
