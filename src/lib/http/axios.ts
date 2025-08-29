import axios from "axios";

import { useAuthStore } from "@/features/auth/store";

export const baseURL = "http://192.168.102.68:4001";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
