export interface IApiResponse<T, M = unknown> {
  data: T
  message: string
  success: boolean
  meta: M
}

export interface IPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface IApiListResponse<T> {
  data: T[]
  pagination: IPagination
}
