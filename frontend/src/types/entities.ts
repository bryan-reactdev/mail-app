export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
    phone?: string | null;
    description?: string | null;
    license?: string | null;
    brokerId?: number | null;
}
