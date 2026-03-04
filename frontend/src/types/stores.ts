import type { User } from "./entities";
import type { LoginForm, RegisterForm, RegisterPageForm, RegisterUserForm, EditUserForm, CreateUserForm } from "./form";

export interface UserStore {
    currentUser: User | null;
    isAuthenticating: boolean;
    isLogging: boolean;

    user: User | null;
    isFetchingUser: boolean;

    users: User[];
    isFetchingUsers: boolean;
    isUpdatingUser: boolean;
    isRegisteringUser: boolean;
    isCreatingUser: boolean;

    authenticate: () => Promise<void>;
    login: (data: LoginForm) => Promise<boolean>;
    register: (data: RegisterForm | RegisterPageForm | FormData) => Promise<boolean>;
    logout: () => Promise<void>;

    getUser: (id: number) => Promise<User | null>;
    getUsers: () => Promise<void>;
    updateUser: (id: number, data: EditUserForm) => Promise<boolean>;
    registerUser: (data: RegisterUserForm) => Promise<boolean>;
    createUser: (data: CreateUserForm) => Promise<boolean>;
}
