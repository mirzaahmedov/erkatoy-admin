import { baseURL } from "@/lib/http/axios";

export const getImageUrl = (url: string) => {
  return url.replace("http://localhost:4001", baseURL);
};
