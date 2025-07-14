// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 空间图片分类分析接口 GET /api/space/analyze/category */
export async function getSpaceCategoryAnalyzeUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceCategoryAnalyzeUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceCategoryAnalyzeResponse_>('/api/space/analyze/category', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 空间使用排行分析接口 GET /api/space/analyze/rank */
export async function getSpaceRankAnalyzeUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceRankAnalyzeUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpace_>('/api/space/analyze/rank', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 空间图片大小分析接口 GET /api/space/analyze/size */
export async function getSpaceSizeAnalyzeUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceSizeAnalyzeUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceSizeAnalyzeResponse_>('/api/space/analyze/size', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 空间图片标签分析接口 GET /api/space/analyze/tag */
export async function getSpaceTagAnalyzeUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceTagAnalyzeUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceTagAnalyzeResponse_>('/api/space/analyze/tag', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 空间使用分析接口 GET /api/space/analyze/usage */
export async function getSpaceUsageAnalyzeUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceUsageAnalyzeUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceUsageAnalyzeResponse_>('/api/space/analyze/usage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 用户上传行为分析接口 GET /api/space/analyze/user */
export async function getSpaceUserAnalyzeUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceUserAnalyzeUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceUserAnalyzeResponse_>('/api/space/analyze/user', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
