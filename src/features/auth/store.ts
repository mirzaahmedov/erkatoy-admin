import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface IAuthUser {
  id: number
  username: string
  fio: string
  is_admin: boolean
  is_active: boolean
  created_at: string
}

export interface IAuthStore {
  isAuthenticated: boolean
  user: IAuthUser | null
  token: string
  login: (payload: { user: IAuthUser; token: string }) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create(
  persist<IAuthStore>(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: '',
      login: async (payload) => {
        set({
          isAuthenticated: true,
          user: payload.user,
          token: payload.token
        })
      },
      logout: async () => {
        set({ isAuthenticated: false, user: null, token: '' })
      }
    }),
    {
      name: 'app-auth'
    }
  )
)
