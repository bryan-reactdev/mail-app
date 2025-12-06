import { create } from "zustand"
import { axiosData } from "../util/axiosWrapper"
import type { UserStore } from "../types/stores"
import type { User } from "../types/entities"
import { toast } from "sonner"

const initialState = {
    currentUser: null,
    isAuthenticating: true,
    isLogging: false,

    user: null,
    isFetchingUser: false,

    users: [] as User[],
    isFetchingUsers: false,
    isUpdatingUser: false,
    isRegisteringUser: false,
    isTogglingBlockUser: false,
}

export const useUserStore = create<UserStore>()((set, get) => ({
    ...initialState,

    authenticate: async () => {
        set({ isAuthenticating: true })

        try {
            const res = await axiosData('/auth/authenticate', { method: "POST" })
            set({ currentUser: res?.data.data ?? null, isAuthenticating: false })
        } catch (error) {
            // On authentication error, clear user and stop authenticating
            set({ currentUser: null, isAuthenticating: false })
        }
    },

    login: async (data) => {
        set({ isLogging: true })

        try {
            const res = await axiosData('/auth/login', { method: "POST", data: data })

            set({ currentUser: res?.data.data ?? null, isLogging: false })

            return res != null;
        } catch (error: any) {
            // Reset loading state
            set({ isLogging: false })

            // Extract error message from axios error
            const errorMessage = error?.response?.data?.message || error?.message || "Error al iniciar sesión. Por favor, verifica tus credenciales."
            
            // Show toast with error message
            toast.error(errorMessage)

            return false;
        }
    },

    logout: async () => {
        set({ isLogging: true })
        toast.loading("Logging out...", { id: "logout" })

        await axiosData('/auth/logout', { method: "POST" })

        toast.dismiss("logout")

        set({ currentUser: null, isLogging: false })
    },

    getUsers: async (includeProjects = false) => {
        set({ isFetchingUsers: true })

        const query = includeProjects ? "?includeProjects=true" : "";
        const res = await axiosData(`/users/list${query}`, { method: "GET" });

        set({ users: res?.data.data ?? [], isFetchingUsers: false })
    },

    getUser: async (id, includeProjects = false) => {
        set({ isFetchingUser: true })

        const query = includeProjects ? "?includeProjects=true" : "";
        const res = await axiosData(`/users/get/${id}${query}`, { method: "GET" });

        const userData = res?.data.data ?? null;
        console.log(`[useUserStore.getUser] includeProjects=${includeProjects}, userData:`, userData);
        if (userData && includeProjects) {
            console.log(`[useUserStore.getUser] projectUsers:`, userData.projectUsers);
        }

        set({ user: userData, isFetchingUser: false })
        return userData;
    },

    updateUser: async (id, data) => {
        set({ isUpdatingUser: true })

        const res = await axiosData(`/users/edit/${id}`, { method: "PUT", data });

        set({ isUpdatingUser: false })

        if (res != null) {
            // Refresh users list after successful update
            await get().getUsers();
            return true;
        }

        return false;
    },

    registerUser: async (data) => {
        set({ isRegisteringUser: true })

        const res = await axiosData('/auth/register', { method: "POST", data });

        set({ isRegisteringUser: false })

        if (res != null) {
            await get().getUsers();
            return true;
        }

        return false;
    },

    toggleBlockUser: async (id) => {
        set({ isTogglingBlockUser: true })

        const res = await axiosData(`/users/toggle-block/${id}`, { method: "PATCH" });

        set({ isTogglingBlockUser: false })

        if (res != null && res.data?.data) {
            const updatedUser = res.data.data;
            set((state) => ({
                users: state.users.map((u) => u.id === id ? updatedUser : u)
            }));
            return true;
        }

        return false;
    }
}))