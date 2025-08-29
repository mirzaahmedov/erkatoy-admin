import type { TagFormValues } from "./schema";
import type { ITag } from "@/entities/tag";
import type { IApiListResponse, IApiResponse } from "@/entities/response";
import type { QueryFunctionContext } from "@tanstack/react-query";

import { api } from "@/lib/http/axios";

export class TagService {
  static QueryKey = {
    GetAll: "tags/all",
  };

  static async getTags(
    ctx: QueryFunctionContext<
      [
        typeof TagService.QueryKey.GetAll,
        {
          page: number;
          limit: number;
        },
      ]
    >,
  ) {
    const { page, limit } = ctx.queryKey[1];
    const res = await api.get<IApiResponse<IApiListResponse<ITag>>>("/teg", {
      params: {
        page,
        limit,
      },
    });
    return res.data;
  }

  static async createTag(values: TagFormValues) {
    const res = await api.post<IApiResponse<ITag>>("/teg", values);
    return res.data;
  }

  static async updateTag(id: number, values: TagFormValues) {
    const res = await api.put<IApiResponse<ITag>>(`/teg/${id}`, values);
    return res.data;
  }

  static async deleteTag(id: number) {
    const res = await api.delete<IApiResponse<ITag>>(`/teg/${id}`);
    return res.data;
  }
}
