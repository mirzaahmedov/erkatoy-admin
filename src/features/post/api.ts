import type { IPost } from '@/entities/post'
import type { IApiListResponse, IApiResponse } from '@/entities/response'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { api } from '@/lib/http/axios'

export class PostService {
  static QueryKey = {
    GetAll: 'posts/all',
    GetById: 'posts/:id'
  }

  static async getPosts(
    ctx: QueryFunctionContext<
      [
        typeof PostService.QueryKey.GetAll,
        {
          page: number
          limit: number
          categoryId?: number
        }
      ]
    >
  ) {
    const { page, limit, categoryId } = ctx.queryKey[1]
    const res = await api.get<IApiResponse<IApiListResponse<IPost>>>('/post', {
      params: {
        page,
        limit,
        category_id: categoryId
      }
    })
    return res.data
  }

  static async getPostId(id: number) {
    const res = await api.get<IApiResponse<IPost>>(`/post/${id}`)
    return res.data
  }

  static async createPost(formData: FormData) {
    const res = await api.post<IApiResponse<IPost>>('/post', formData)
    return res.data
  }

  static async updatePost(id: number, formData: FormData) {
    const res = await api.patch<IApiResponse<IPost>>(`/post/${id}`, formData)
    return res.data
  }

  static async deletePost(id: number) {
    const res = await api.delete<IApiResponse<IPost>>(`/post/${id}`)
    return res.data
  }
}
