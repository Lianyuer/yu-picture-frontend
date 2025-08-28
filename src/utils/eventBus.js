import mitt from 'mitt'

// 创建事件总线实例
const eventBus = mitt()

// 导出事件常量（可选，但推荐）
export const EVENTS = {
  SPACE_CREATED: 'space-created',
  SPACE_UPDATED: 'space-updated',
  SPACE_DELETED: 'space-deleted',
  // SPACE_USER_ADD: 'space-user-add',
}

export default eventBus
