import { create } from "zustand";
import { axiosData } from "@/util/axiosWrapper";
import type { UserStore } from "@/types/stores";
import type { User } from "@/types/entities";
import type { ApiResponse } from "@/types/api";
import { withErrorHandling } from "@/util/storeUtils";

const createEmptyUsers = (): User[] => [];

export const useUserStore = create<UserStore>()((set) => ({
  currentUser: null,
  isAuthenticating: true,
  isLogging: false,

  users: createEmptyUsers(),
  archivedUsers: createEmptyUsers(),
  isFetchingUsers: false,
  isFetchingArchivedUsers: false,
  isUpdatingUser: false,
  isRegisteringUser: false,
  isCreatingUser: false,
  isArchivingUser: false,
  isRestoringUser: false,

  authenticate: withErrorHandling(
    set,
    "isAuthenticating",
    async () => {
      const res = (await axiosData("/auth/profile", { method: "GET" })) as ApiResponse<User>;
      const user = res?.data;

      if (user) {
        set({ currentUser: user });
      } else {
        set({ currentUser: null });
      }
    },
    {
      showSuccessToast: false,
      showErrorToast: false,
      successMessage: "",
      errorMessage: "",
      retries: 0,
      retryDelay: 0,
      onError: () => set({ currentUser: null }),
    }
  ),

  login: withErrorHandling(
    set,
    "isLogging",
    async (data) => {
      const res = (await axiosData("/auth/login", {
        method: "POST",
        data: data,
      })) as ApiResponse<{ user: User; token: string }>;

      const user = res?.data?.user;
      const token = res?.data?.token;
      if (user && token) {
        set({ currentUser: user });
        localStorage.setItem("auth_token", token);
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

  ssoLogin: withErrorHandling(
    set,
    "isLogging",
    async (token) => {
      const res = (await axiosData("/auth/sso/login", {
        method: "POST",
        data: { token },
      })) as ApiResponse<{ user: User; token: string }>;

      const user = res?.data?.user;
      const appToken = res?.data?.token;
      if (user && appToken) {
        set({ currentUser: user });
        localStorage.setItem("auth_token", appToken);
        return true;
      }
      return false;
    },
    {
      showSuccessToast: false,
      errorMessage: "Error al iniciar sesión desde el portal",
      retries: 0,
      onError: () => set({ currentUser: null }),
    }
  ),

  register: withErrorHandling(
    set,
    "isRegisteringUser",
    async (data) => {
      const res = (await axiosData("/auth/register", {
        method: "POST",
        data: data,
      })) as ApiResponse<unknown>;

      return !!res?.data;
    },
    {
      showSuccessToast: true,
      errorMessage: "Error al registrar usuario",
      successMessage: "Usuario registrado exitosamente",
      retries: 0,
      onError: () => {},
    }
  ),

  logout: withErrorHandling(
    set,
    "isLogging",
    async () => {
      await axiosData("/auth/logout", { method: "POST" });
      set({ currentUser: null });
      localStorage.removeItem("auth_token");
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: "",
      errorMessage: "",
      retries: 0,
      retryDelay: 0,
    }
  ),

  getUsers: withErrorHandling(
    set,
    "isFetchingUsers",
    async () => {
      set({ users: createEmptyUsers() });
      const res = (await axiosData("/users/list", { method: "GET" })) as ApiResponse<User[]>;
      set({ users: res?.data ?? createEmptyUsers() });
    },
    {
      showSuccessToast: false,
      successMessage: "Usuarios cargados exitosamente",
      errorMessage: "Error al cargar usuarios",
      retries: 3,
      retryDelay: 1000,
      onError: () => set({ users: createEmptyUsers() }),
    }
  ),

  getArchivedUsers: withErrorHandling(
    set,
    "isFetchingArchivedUsers",
    async () => {
      set({ archivedUsers: createEmptyUsers() });
      const res = (await axiosData("/users/archived", { method: "GET" })) as ApiResponse<User[]>;
      set({ archivedUsers: res?.data ?? createEmptyUsers() });
    },
    {
      showSuccessToast: false,
      successMessage: "Usuarios archivados cargados exitosamente",
      errorMessage: "Error al cargar usuarios archivados",
      retries: 3,
      retryDelay: 1000,
      onError: () => set({ archivedUsers: createEmptyUsers() }),
    }
  ),

  createUser: withErrorHandling(
    set,
    "isCreatingUser",
    async (data) => {
      const res = (await axiosData("/users/create", {
        method: "POST",
        data,
      })) as ApiResponse<User>;

      if (res?.data) {
        set((state) => ({
          users: [res.data!, ...state.users],
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

  updateUser: withErrorHandling(
    set,
    "isUpdatingUser",
    async (id, data) => {
      const res = (await axiosData(`/users/edit/${id}`, {
        method: "PUT",
        data,
      })) as ApiResponse<User>;

      if (res?.data) {
        const updatedUser = res.data;
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? updatedUser : u)),
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

  archiveUser: withErrorHandling(
    set,
    "isArchivingUser",
    async (id) => {
      const res = (await axiosData(`/users/delete/${id}`, { method: "DELETE" })) as ApiResponse<User>;
      const archived = res?.data;
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        archivedUsers: archived ? [archived, ...state.archivedUsers] : state.archivedUsers,
      }));
      return true;
    },
    {
      showSuccessToast: true,
      successMessage: "Usuario eliminado exitosamente",
      errorMessage: "Error al eliminar usuario",
      retries: 0,
      retryDelay: 1000,
      onError: () => null,
    }
  ),

  restoreUser: withErrorHandling(
    set,
    "isRestoringUser",
    async (id) => {
      const res = (await axiosData(`/users/restore/${id}`, { method: "POST" })) as ApiResponse<User>;
      if (res?.data) {
        set((state) => ({
          archivedUsers: state.archivedUsers.filter((u) => u.id !== id),
          users: [res.data!, ...state.users],
        }));
        return true;
      }
      return false;
    },
    {
      showSuccessToast: true,
      successMessage: "Usuario restaurado exitosamente",
      errorMessage: "Error al restaurar usuario",
      retries: 0,
      retryDelay: 1000,
      onError: () => null,
    }
  ),
}));
