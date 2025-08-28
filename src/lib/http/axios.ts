import { useAuthStore } from "@/features/auth/store";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.102.68:4001",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
