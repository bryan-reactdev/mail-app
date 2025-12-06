import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import type { ApiResponse } from "../types/api";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

api.interceptors.response.use(
    response => {
        // No mostrar toasts automáticamente
        // Los toasts solo se mostrarán cuando se llamen manualmente en las acciones del usuario
        return response;
    }
)

export const axiosData = async(url: string, config: AxiosRequestConfig = {}) =>{
    try {
        // If data is FormData, remove Content-Type header so browser can set it with boundary
        if (config.data instanceof FormData) {
            const { headers, ...restConfig } = config;
            return await api.request({
                url,
                ...restConfig,
                data: config.data,
                headers: {
                    ...headers,
                    'Content-Type': undefined, // Let browser set it
                }
            });
        }
        
        return await api.request({url, ...config});
    } catch (err) {
        // Log the full error object and stack trace
        if (err instanceof Error && err.stack) {
            console.error("Stack Trace:", err.stack);
        }

        const axiosErr = err as AxiosError<ApiResponse>;
        if (config.responseType === "blob"){
            throw err;
        } else {
            // No mostrar toast de error en login o authenticate (401/403) ya que se maneja en el store
            const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/authenticate');
            const isUnauthorized = axiosErr?.response?.status === 401 || axiosErr?.response?.status === 403;
            
            if (isAuthRequest && isUnauthorized) {
                // Para auth requests, solo lanzar la excepción sin mostrar toast (se maneja en el store)
                throw err;
            }
            
            // Para otros errores, mostrar toast y luego lanzar la excepción
            const fallbackMessage = "An unexpected error occurred";
            const message = axiosErr?.response?.data?.message ?? axiosErr.message ?? fallbackMessage;
            toast.error(message);
            throw err;
        }
    }
}