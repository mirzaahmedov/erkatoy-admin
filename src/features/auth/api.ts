import type { IAuthUser } from './store'
import type { IApiResponse } from '@/entities/response'

import { api } from '@/lib/http/axios'

export class AuthService {
  static async login(payload: { username: string; password: string }) {
    const res = await api.post<IApiResponse<{ token: string; user: IAuthUser }>>(
      '/auth/login',
      payload
    )
    return res.data
  }
}
