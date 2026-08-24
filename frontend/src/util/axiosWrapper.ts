import axios, { type AxiosRequestConfig } from "axios";

// Use /api in dev so Vite proxies to backend (avoids mixed content when frontend is HTTPS)
export const API_BASE_IP =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_IP || "/api";

const api = axios.create({
  baseURL: API_BASE_IP,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    // Dejar que el navegador ponga el boundary de multipart
    if (config.headers && typeof config.headers.delete === "function") {
      config.headers.delete("Content-Type");
      config.headers.delete("content-type");
    } else if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }
  return config;
});

/**
 * Simple axios wrapper that throws errors instead of returning null
 * @param url - API endpoint
 * @param config - Axios config (method, data, etc.)
 * @returns {Promise} - Returns response.data or full response for blobs
 * @throws {Error} - Throws error with response data if request fails
 */
export const axiosData = async (url: string, config: AxiosRequestConfig = {}) => {
  const res = await api.request({ url, ...config });
  if (config.responseType === "blob") {
    return res;
  }
  return res.data;
};
