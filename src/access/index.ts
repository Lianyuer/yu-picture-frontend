import router from '@/router'
import ACCESS_ENUM from '@/access/AccessEnum.ts'
import { useLoginUserStore } from '@/stores/loginUserStore.ts'

let firstFetchLoginUser = true

router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser

  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false
  }

  // 从路由原信息中获取对应路由所需权限
  const needAccess = to.meta?.access ?? ACCESS_ENUM.NOT_LOGIN
  // 要跳转的页面必须登录
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果没有登录，则跳转到登录页
    if (!loginUser || !loginUser.userRole || loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
    // 如果已经登录但是权限不足，则跳转无权限页面
    if (loginUser.userRole !== needAccess) {
      next('/noAuth')
      return
    }
  }
  // 要跳转的页面不需要登录，直接放行即可
  next()
})
