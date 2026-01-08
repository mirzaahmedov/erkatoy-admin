import type { DisallowedWordFormValues } from './schema'
import type { IDisallowedWord } from '@/entities/DisallowedWord'
import type { IApiListResponse, IApiResponse } from '@/entities/response'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { api } from '@/lib/http/axios'

export class DisallowedWordService {
  static QueryKey = {
    GetAll: 'disallowed-words/all'
  }

  static async getWords(
    ctx: QueryFunctionContext<
      [
        typeof DisallowedWordService.QueryKey.GetAll,
        {
          page: number
          limit: number
        }
      ]
    >
  ) {
    const { page, limit } = ctx.queryKey[1]
    const res = await api.get<IApiResponse<IApiListResponse<IDisallowedWord>>>('/swear-words', {
      params: {
        page,
        limit
      }
    })
    return res.data
  }

  static async createWord(values: DisallowedWordFormValues) {
    const res = await api.post<IApiResponse<IDisallowedWord>>('/swear-words', values)
    return res.data
  }

  static async deleteWord(id: number) {
    const res = await api.delete<IApiResponse<null>>(`/swear-words/${id}`)
    return res.data
  }
}
