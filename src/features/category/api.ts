import type { CategoryFormValues } from './schema'
import type { ICategory } from '@/entities/category'
import type { IApiListResponse, IApiResponse } from '@/entities/response'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { api } from '@/lib/http/axios'

export class CategoryService {
  static QueryKey = {
    GetAll: 'categories/all'
  }

  static async getCategories(
    ctx: QueryFunctionContext<
      [
        typeof CategoryService.QueryKey.GetAll,
        {
          page: number
          limit: number
        }
      ]
    >
  ) {
    const { page, limit } = ctx.queryKey[1]
    const res = await api.get<IApiResponse<IApiListResponse<ICategory>>>('/category', {
      params: {
        page,
        limit
      }
    })
    return res.data
  }

  static async createCategory(values: CategoryFormValues) {
    const res = await api.post<IApiResponse<ICategory>>('/category', values)
    return res.data
  }

  static async updateCategory(id: number, values: CategoryFormValues) {
    const res = await api.put<IApiResponse<ICategory>>(`/category/${id}`, values)
    return res.data
  }

  static async deleteCategory(id: number) {
    const res = await api.delete<IApiResponse<ICategory>>(`/category/${id}`)
    return res.data
  }
}
