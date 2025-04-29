import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * 存储登录用户信息的状态
 */
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<any>({
    userName: '未登录'
  })

  /**
   * 获取用户登录信息
   */
  async function fetchLoginUser() {
    // todo 由于后端还没有提供接口，暂时注释
    // const res = await getCurrentUser()
    // if (res.data.code === 0 && res.data.data) {
    //   setLoginUser(res.data.data)
    // }
    // 测试: 3秒后自动登录
    setTimeout(() => {
      setLoginUser({
        id: 1,
        userName: '测试'
      })
    }, 3000)
  }

  /**
   * 设置登录用户
   * @param newLoginUser
   */
  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }

  return { loginUser, fetchLoginUser, setLoginUser }
})
