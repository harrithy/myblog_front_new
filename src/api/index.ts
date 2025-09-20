// 统一导出所有API模块
export * from './user'
export * from './blog'
export * from './category'
export * from './comment'
export * from './upload'
export * from './visit'

// 默认导出所有API的集合
import userApi from './user'
import blogApi from './blog'
import categoryApi from './category'
import commentApi from './comment'
import uploadApi from './upload'
import visitApi from './visit'

export default {
  userApi,
  blogApi,
  categoryApi,
  commentApi,
  uploadApi,
  visitApi,
}
