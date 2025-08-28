import { useAuthStore } from "@/features/auth/store";
import axios from "axios";

export const api = axios.create({
  baseURL: "https://5l2q09wq-4001.euw.devtunnels.ms",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
