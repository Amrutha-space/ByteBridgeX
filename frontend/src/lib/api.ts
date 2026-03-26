import axios from "axios";

import { readAuthStorage } from "@/lib/storage";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  const auth = readAuthStorage();
  if (auth?.access) {
    config.headers.Authorization = `Bearer ${auth.access}`;
  }
  return config;
});
