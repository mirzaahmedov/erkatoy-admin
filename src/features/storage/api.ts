import type { IStorageImage } from '@/entities/StorageImage'
import type { IApiListResponse, IApiResponse } from '@/entities/response'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { api } from '@/lib/http/axios'

export class StorageService {
  static QueryKey = {
    GetAll: 'storage/image',
    GetById: 'storage/image/:id'
  }

  static async getImages(
    ctx: QueryFunctionContext<
      [
        typeof StorageService.QueryKey.GetAll,
        {
          page: number
          limit: number
        }
      ]
    >
  ) {
    const { page, limit } = ctx.queryKey[1]
    const res = await api.get<IApiResponse<IApiListResponse<IStorageImage>>>('/storage/image', {
      params: {
        page,
        limit
      }
    })
    return res.data
  }

  static async getImageById(id: number) {
    const res = await api.get<IApiResponse<IStorageImage>>(`/storage/image/${id}`)
    return res.data
  }

  static async uploadImage(formData: FormData) {
    const res = await api.post<IApiResponse<[IStorageImage]>>('/storage/image', formData)
    return res.data
  }

  static async updateImage(id: number, formData: FormData) {
    const res = await api.patch<IApiResponse<IStorageImage>>(`/storage/image/${id}`, formData)
    return res.data
  }

  static async deleteImage(id: number) {
    const res = await api.delete<IApiResponse<IStorageImage>>(`/storage/image/${id}`)
    return res.data
  }
}
