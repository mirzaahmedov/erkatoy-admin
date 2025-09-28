import { baseURL } from '@/lib/http/axios'

export const getImageUrl = (imageId: number) => {
  return `${baseURL}/storage/image/${imageId}`
}
