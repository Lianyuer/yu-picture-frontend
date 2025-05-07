import ACCESS_ENUM from '@/access/AccessEnum.ts'

/**
 * 权限校验
 * @param loginUser 登录用户
 * @param needAccess 需要的权限
 * @return 是否有权限
 */
const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {

  // 获取当前登录用户的权限
  const loginUserAccess = loginUser?.userRole as string ?? ACCESS_ENUM.NOT_LOGIN
  // 如果无需登录，则直接通过
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true
  }
  // 如果需要登录,但是当前用户未登录，则无权限
  if (needAccess === ACCESS_ENUM.USER) {
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false
    }
  }
  // 如果需要管理员权限，但当前用户无管理员权限，则无权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false
    }
  }
  return true
}

export default checkAccess
