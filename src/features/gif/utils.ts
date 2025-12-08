import type { IGif } from "@/entities/gif";
import { baseURL } from "@/lib/http/axios";

export const getGifURL = (gif: IGif) => {
  return `${baseURL}/gif/${gif.id}`
}