import type { User } from "./entities";
import type { LoginForm } from "./form";

export interface UserStore {
    currentUser: User | null,
    isAuthenticating: boolean,
    isLogging: boolean,

    user: User | null,
    isFetchingUser: boolean,

    users: User[],
    isFetchingUsers: boolean,
    isUpdatingUser: boolean,
    isRegisteringUser: boolean,
    isTogglingBlockUser: boolean,

    authenticate: () => Promise<void>,
    login: (data: LoginForm) => Promise<boolean>,
    logout: () => Promise<void>,


    getUser: (id: number, includeProjects?: boolean) => Promise<User | null>,
    getUsers: (includeProjects?: boolean) => Promise<void>,
    updateUser: (id: number, data: { email?: string; name?: string; password?: string; role?: string }) => Promise<boolean>,
    registerUser: (data: { email: string; name: string; password: string; role: string }) => Promise<boolean>,
    toggleBlockUser: (id: number) => Promise<boolean>,
}