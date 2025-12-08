import type { IApiResponse, IPagination } from "@/entities/response";

import type { IAds } from "@/entities/ads";
import type { QueryFunctionContext } from "@tanstack/react-query";
import { api } from "@/lib/http/axios";

export class AdsService {
  static QueryKey = {
    GetAll: "ads/all",
    GetById: "ads/:id",
  };

  static async getAds(
    ctx: QueryFunctionContext<
      [
        typeof AdsService.QueryKey.GetAll,
        {
          page: number;
          limit: number;
        },
      ]
    >,
  ) {
    const { page, limit } = ctx.queryKey[1];
    const res = await api.get<IApiResponse<IAds[], IPagination>>("/ads", {
      params: {
        page,
        limit,
      },
    });
    return res.data;
  }

  static async getAdsByID(id: number) {
    const res = await api.get<IApiResponse<IAds>>(`/ads/${id}`);
    return res.data;
  }

  static async createAds(formData: FormData) {
    const res = await api.post<IApiResponse<IAds>>("/ads", formData);
    return res.data;
  }

  static async updateAds(id: number, formData: FormData) {
    const res = await api.put<IApiResponse<IAds>>(`/ads/${id}`, formData);
    return res.data;
  }

  static async deleteAds(id: number) {
    const res = await api.delete<IApiResponse<IAds>>(`/ads/${id}`);
    return res.data;
  }
}
