import axios from 'axios'

import { useAuthStore } from '@/features/auth/store'

export const baseURL = 'http://178.209.127.90:4009'

export const api = axios.create({
  baseURL
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
