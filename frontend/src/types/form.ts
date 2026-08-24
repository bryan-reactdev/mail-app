import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "El email es requerido")
    .max(255, "Máximo 255 caracteres")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .max(100, "La contraseña no puede tener más de 100 caracteres"),
});

export const registerSchema = z.object({
  email: z
    .string()
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
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
