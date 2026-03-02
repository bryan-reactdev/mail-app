import { create } from "zustand"
import { axiosData } from "../util/axiosWrapper"
import type { UserStore } from "../types/stores"
import type { User } from "../types/entities"
import type { ApiResponse } from "../types/api"
import { withErrorHandling } from "../util/storeUtils"

// --- Helpers --- //
const createEmptyUsers = (): User[] => [];

// --- Definición de Store --- //
export const useUserStore = create<UserStore>()((set) => ({
    currentUser: null,
    isAuthenticating: true,
    isLogging: false,

    user: null,
    isFetchingUser: false,

    users: createEmptyUsers(),
    isFetchingUsers: false,
    isUpdatingUser: false,
    isRegisteringUser: false,
    isCreatingUser: false,

    authenticate: withErrorHandling(
        set,
        'isAuthenticating',
        async () => {
            const res = await axiosData("/auth/profile", { method: "GET" }) as ApiResponse<User>;
            const user = res?.data;
            
            if (user) {
                set({ currentUser: user });
            } else {
                set({ currentUser: null });
            }
        },
        {
            showSuccessToast: false,
            showErrorToast: false, // Don't show error toast for auth check
            successMessage: "",
            errorMessage: "",
            retries: 0,
            retryDelay: 0,
            onError: () => set({ currentUser: null }),
        }
    ),

    login: withErrorHandling(
        set,
        'isLogging',
        async (data) => {
            const res = await axiosData("/auth/login", {
                method: "POST",
                data: data,
            }) as ApiResponse<{ user: User; token: string }>;

            const user = res?.data?.user;
            const token = res?.data?.token;
            if (user && token) {
                set({ currentUser: user });
                // Store token in localStorage for WebSocket authentication
                localStorage.setItem('auth_token', token);
                return true;
            }
            return false;
        },
        {
            showSuccessToast: true,
            errorMessage: "Error al iniciar sesión",
            successMessage: "Inicio de sesión exitoso",
            retries: 0,
            onError: () => set({ currentUser: null }),
        }
    ),

    register: withErrorHandling(
        set,
        'isRegisteringUser',
        async (data) => {
            const res = await axiosData("/auth/register", {
                method: "POST",
                data: data,
            }) as ApiResponse<User>;

            return !!res?.data;
        },
        {
            showSuccessToast: true,
            errorMessage: "Error al registrar",
            successMessage: "Registro exitoso",
            retries: 0,
            onError: () => {},
        }
    ),

    logout: withErrorHandling(
        set,
        'isLogging',
        async () => {
            await axiosData("/auth/logout", { method: "POST" });
            set({ currentUser: null });
            // Remove token from localStorage
            localStorage.removeItem('auth_token');
        },
        {
            showSuccessToast: true,
            showErrorToast: true,
            successMessage: "",
            errorMessage: "",
            retries: 0,
            retryDelay: 0
        }
    ),

    getUsers: withErrorHandling(
        set,
        'isFetchingUsers',
        async () => {
            set({ users: createEmptyUsers() });
            const res = await axiosData(`/users/list`, { method: "GET" }) as ApiResponse<User[]>;
            set({ users: res?.data ?? createEmptyUsers() });
        },
        {
            successMessage: "Usuarios cargados exitosamente",
            errorMessage: "Error al cargar usuarios",
            retries: 3,
            retryDelay: 1000,
            onError: () => set({ users: createEmptyUsers() }),
        }
    ),

    getUser: withErrorHandling(
        set,
        'isFetchingUser',
        async (id) => {
            set({ user: null });
            const res = await axiosData(`/users/get/${id}`, { method: "GET" }) as ApiResponse<User>;
            const userData = res?.data ?? null;
            set({ user: userData });
            return userData;
        },
        {
            successMessage: "Usuario cargado exitosamente",
            errorMessage: "Error al cargar usuario",
            retries: 3,
            retryDelay: 1000,
            onError: () => set({ user: null }),
        }
    ),

    updateUser: withErrorHandling(
        set,
        'isUpdatingUser',
        async (id, data) => {
            const res = await axiosData(`/users/edit/${id}`, { 
                method: "PUT", 
                data 
            }) as ApiResponse<User>;

            if (res?.data) {
                const updatedUser = res.data;
                // Optimistically update the user in the users array
                set((state) => ({
                    users: state.users.map((user) =>
                        user.id === id ? updatedUser : user
                    ),
                }));
                return true;
            }
            return false;
        },
        {
            showSuccessToast: true,
            successMessage: "Usuario actualizado exitosamente",
            errorMessage: "Error al actualizar usuario",
            retries: 3,
            retryDelay: 1000,
            onError: () => null,
        }
    ),

    registerUser: withErrorHandling(
        set,
        'isRegisteringUser',
        async (data) => {
            const res = await axiosData('/auth/register', { 
                method: "POST", 
                data 
            }) as ApiResponse<User>;

            if (res?.data) {
                return true;
            }
            return false;
        },
        {
            showSuccessToast: true,
            successMessage: "Usuario registrado exitosamente",
            errorMessage: "Error al registrar usuario",
            retries: 0,
            retryDelay: 1000,
            onError: () => null,
        }
    ),

    createUser: withErrorHandling(
        set,
        'isCreatingUser',
        async (data) => {
            const res = await axiosData('/users/create', { 
                method: "POST", 
                data 
            }) as ApiResponse<User>;

            if (res?.data) {
                const newUser = res.data;
                // Add the new user to the users array
                set((state) => ({
                    users: [newUser, ...state.users],
                }));
                return true;
            }
            return false;
        },
        {
            showSuccessToast: true,
            successMessage: "Usuario creado exitosamente",
            errorMessage: "Error al crear usuario",
            retries: 0,
            retryDelay: 1000,
            onError: () => null,
        }
    ),
}))