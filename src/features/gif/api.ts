import type { IApiResponse, IPagination } from "@/entities/response";

import type { IGif } from "@/entities/gif";
import type { QueryFunctionContext } from "@tanstack/react-query";
import { api } from "@/lib/http/axios";

export class GifService {
  static QueryKey = {
    GetAll: "gif/all",
    GetById: "gif/:id",
  };

  static async getGifs(
    ctx: QueryFunctionContext<
      [
        typeof GifService.QueryKey.GetAll,
        {
          page: number;
          limit: number;
        },
      ]
    >,
  ) {
    const { page, limit } = ctx.queryKey[1];
    const res = await api.get<IApiResponse<IGif[], IPagination>>("/gif", {
      params: {
        page,
        limit,
      },
    });
    return res.data;
  }

  static async getGifId(id: number) {
    const res = await api.get<IApiResponse<IGif>>(`/gif/${id}`);
    return res.data;
  }

  static async createGif(formData: FormData) {
    const res = await api.post<IApiResponse<IGif>>("/gif", formData);
    return res.data;
  }

  static async updateGif(id: number, formData: FormData) {
    const res = await api.put<IApiResponse<IGif>>(`/gif/${id}`, formData);
    return res.data;
  }

  static async updateGifStatus(id: number, status: boolean) {
    const res = await api.put<IApiResponse<IGif>>(`/gif/status/${id}`, {
      status
    });
    return res.data;
  }

  static async deleteGif(id: number) {
    const res = await api.delete<IApiResponse<IGif>>(`/gif/${id}`);
    return res.data;
  }
}
