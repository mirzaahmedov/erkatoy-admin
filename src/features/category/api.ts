import type { ICategory } from "@/entities/category";
import type { IApiListResponse, IApiResponse } from "@/entities/response";
import type { QueryFunctionContext } from "@tanstack/react-query";
import { api } from "@/lib/http/axios";

export class CategoryService {
  static QueryKey = {
    GetAll: "categories/all",
  };

  static async getCategories(
    ctx: QueryFunctionContext<
      [
        typeof CategoryService.QueryKey.GetAll,
        {
          page: number;
          limit: number;
        },
      ]
    >,
  ) {
    const { page, limit } = ctx.queryKey[1];
    const res = await api.get<IApiResponse<IApiListResponse<ICategory>>>(
      "/category",
      {
        params: {
          page,
          limit,
        },
      },
    );
    return res.data;
  }
}
