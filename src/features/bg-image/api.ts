import type { IBgImage } from '@/entities/BgImage'
import type { IApiListResponse, IApiResponse } from '@/entities/response'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { api } from '@/lib/http/axios'

export class BgImageService {
  static QueryKey = {
    GetAll: 'bg-image/all',
    GetById: 'bg-image/:id'
  }

  static async findImages(
    ctx: QueryFunctionContext<
      [
        typeof BgImageService.QueryKey.GetAll,
        {
          page: number
          limit: number
        }
      ]
    >
  ) {
    const { page, limit } = ctx.queryKey[1]
    const res = await api.get<IApiResponse<IApiListResponse<IBgImage>>>('/background-color', {
      params: {
        page,
        limit
      }
    })
    return res.data
  }

  static async findImageById(id: number) {
    const res = await api.get<IApiResponse<IBgImage>>(`/background-color/${id}`)
    return res.data
  }

  static async createImage(formData: FormData) {
    const res = await api.post<IApiResponse<IBgImage>>('/background-color', formData)
    return res.data
  }

  static async updateImage(id: number, formData: FormData) {
    const res = await api.put<IApiResponse<IBgImage>>(`/background-color/${id}`, formData)
    return res.data
  }

  static async updateImageActive(id: number, active: boolean) {
    const res = await api.put<IApiResponse<IBgImage>>(`/background-color/${id}/active`, {
      active
    })
    return res.data
  }

  static async deleteImage(id: number) {
    const res = await api.delete<IApiResponse<IBgImage>>(`/background-color/${id}`)
    return res.data
  }
}
