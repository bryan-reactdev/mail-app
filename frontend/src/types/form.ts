import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email or name is required"),
    password: z
        .string()
        .min(3, "Password must be at least 3 characters"),
})

export const registerUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().min(1, "Role is required"),
})

export const editUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().optional(),
    role: z.string().optional(),
})

export type LoginForm = z.infer<typeof loginSchema>;
export type EditUserForm = z.infer<typeof editUserSchema>;
export type RegisterUserForm = z.infer<typeof registerUserSchema>;