import type { User } from "./entities";
import type { LoginForm, RegisterForm } from "./form";

export interface UserStore {
  currentUser: User | null;
  isAuthenticating: boolean;
  isLogging: boolean;

  users: User[];
  archivedUsers: User[];
  isFetchingUsers: boolean;
  isFetchingArchivedUsers: boolean;
  isUpdatingUser: boolean;
  isRegisteringUser: boolean;
  isCreatingUser: boolean;
  isArchivingUser: boolean;
  isRestoringUser: boolean;

  authenticate: () => Promise<void>;
  login: (data: LoginForm) => Promise<boolean>;
  ssoLogin: (token: string) => Promise<boolean>;
  register: (data: RegisterForm | FormData) => Promise<boolean>;
  logout: () => Promise<void>;

  getUsers: () => Promise<void>;
  getArchivedUsers: () => Promise<void>;
  createUser: (data: FormData) => Promise<boolean>;
  updateUser: (id: number, data: FormData) => Promise<boolean>;
  archiveUser: (id: number) => Promise<boolean>;
  restoreUser: (id: number) => Promise<boolean>;
}
