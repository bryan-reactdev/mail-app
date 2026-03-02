import axios, { type AxiosRequestConfig } from "axios";

export const API_BASE_IP = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_IP || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_IP,
    withCredentials: true,
});

/**
 * Simple axios wrapper that throws errors instead of returning null
 * @param url - API endpoint
 * @param config - Axios config (method, data, etc.)
 * @returns {Promise} - Returns response.data or full response for blobs
 * @throws {Error} - Throws error with response data if request fails
 */
export const axiosData = async (url: string, config: AxiosRequestConfig = {}) => {
  try {
    const res = await api.request({ url, ...config });
    // For blobs, return full response
    if (config.responseType === 'blob') {
      return res;
    }
    // For JSON, return just the data
    return res.data;
  } catch (err) {
    // Re-throw the error so stores can handle it
    throw err;
  }
};