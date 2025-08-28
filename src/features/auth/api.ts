import type { ApiResponse } from "@/entities/response";
import { api } from "@/lib/http/axios";
import type { IAuthUser } from "./store";

export class AuthService {
  static async login(payload: { username: string; password: string }) {
    const res = await api.post<ApiResponse<{ token: string; user: IAuthUser }>>(
      "/auth/login",
      payload,
    );
    return res.data;
  }
}
