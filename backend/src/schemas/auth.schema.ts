import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido').max(255).toLowerCase().trim(),
  password: z.string().min(1, 'La contraseña es requerida').max(100),
  firstName: z.string().min(1, 'El nombre es requerido').max(100).trim(),
  lastName: z.string().min(1, 'El apellido es requerido').max(100).trim(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido').max(255).toLowerCase().trim(),
  password: z.string().min(1, 'La contraseña es requerida').max(100),
});

export const ssoLoginSchema = z.object({
  token: z.string().min(1, 'El token SSO es requerido'),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type SsoLoginDTO = z.infer<typeof ssoLoginSchema>;

export const registerJsonSchema = {
  type: 'object',
  required: ['email', 'password', 'firstName', 'lastName'],
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string', minLength: 1, maxLength: 100 },
    firstName: { type: 'string', minLength: 1, maxLength: 100 },
    lastName: { type: 'string', minLength: 1, maxLength: 100 },
  },
} as const;

export const loginJsonSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string', minLength: 1, maxLength: 100 },
  },
} as const;

export const ssoLoginJsonSchema = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string', minLength: 1 },
  },
} as const;
