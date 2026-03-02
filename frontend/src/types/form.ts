import * as z from "zod";

export const loginSchema = z.object({
    email: z
        .email("Email inválido")
        .min(1, "El email es requerido")
        .max(255, "El email no puede tener más de 255 caracteres")
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, "La contraseña es requerida")
        .max(100, "La contraseña no puede tener más de 100 caracteres"),
})

export const editUserSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100, "First name cannot exceed 100 characters").trim(),
    lastName: z.string().min(1, "Last name is required").max(100, "Last name cannot exceed 100 characters").trim(),
    email: z.email("Invalid email address").min(1, "Email is required").max(255, "Email cannot exceed 255 characters").toLowerCase().trim(),
    password: z.string().optional(),
    role: z.enum(["admin", "agente", "usuario"]).optional(),
    // Agent-specific fields (nullable, only used for users with role 'agente')
    phone: z.string().max(50, "Phone cannot exceed 50 characters").nullable().optional(),
    description: z.string().nullable().optional(),
    license: z.string().max(255, "License cannot exceed 255 characters").nullable().optional(), // Agent's personal license
    brokerId: z.number().int("Broker ID must be an integer").positive("Broker ID must be positive").nullable().optional(), // Broker the agent works for
})

export const registerSchema = z.object({
    email: z
        .email("Email inválido")
        .min(1, "El email es requerido")
        .max(255, "El email no puede tener más de 255 caracteres")
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, "La contraseña es requerida")
        .max(100, "La contraseña no puede tener más de 100 caracteres"),
    firstName: z
        .string()
        .min(1, "El nombre es requerido")
        .max(100, "El nombre no puede tener más de 100 caracteres")
        .trim(),
    lastName: z
        .string()
        .min(1, "El apellido es requerido")
        .max(100, "El apellido no puede tener más de 100 caracteres")
        .trim(),
    document: z
        .custom<FileList>((val) => val instanceof FileList, {
            message: "El documento (CV/Resumen) es requerido",
        })
        .refine((files) => files.length > 0, {
            message: "El documento (CV/Resumen) es requerido",
        })
        .refine((files) => files.length === 1, {
            message: "Solo se permite un archivo",
        })
        .refine((files) => {
            if (!files || files.length === 0) return true; // Skip if no files
            const file = files[0];
            if (!file) return true; // Skip if no file
            const maxSize = 5 * 1024 * 1024; // 5MB
            return file.size <= maxSize;
        }, {
            message: "El archivo no puede ser mayor a 5MB",
        })
        .refine((files) => {
            if (!files || files.length === 0) return true; // Skip if no files
            const file = files[0];
            if (!file) return true; // Skip if no file
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            return allowedTypes.includes(file.type);
        }, {
            message: "Solo se permiten archivos PDF o Word (.pdf, .doc, .docx)",
        }),
})

export const registerUserSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100, "First name cannot exceed 100 characters").trim(),
    lastName: z.string().min(1, "Last name is required").max(100, "Last name cannot exceed 100 characters").trim(),
    email: z.email("Invalid email address").min(1, "Email is required").max(255, "Email cannot exceed 255 characters").toLowerCase().trim(),
    password: z.string().min(1, "Password is required").max(100, "Password cannot exceed 100 characters"),
    role: z.string().min(1, "Role is required").optional(),
})

export const createUserSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100, "First name cannot exceed 100 characters").trim(),
    lastName: z.string().min(1, "Last name is required").max(100, "Last name cannot exceed 100 characters").trim(),
    email: z.email("Invalid email address").min(1, "Email is required").max(255, "Email cannot exceed 255 characters").toLowerCase().trim(),
    password: z.string().min(1, "Password is required").max(100, "Password cannot exceed 100 characters"),
    role: z.enum(["admin", "agente", "usuario"]).optional(),
    // Agent-specific fields (nullable, only used for users with role 'agente')
    phone: z.string().max(50, "Phone cannot exceed 50 characters").nullable().optional(),
    description: z.string().nullable().optional(),
    license: z.string().max(255, "License cannot exceed 255 characters").nullable().optional(), // Agent's personal license
    brokerId: z.number().int("Broker ID must be an integer").positive("Broker ID must be positive").nullable().optional(), // Broker the agent works for
})

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type EditUserForm = z.infer<typeof editUserSchema>;
export type RegisterUserForm = z.infer<typeof registerUserSchema>;
export type CreateUserForm = z.infer<typeof createUserSchema>;