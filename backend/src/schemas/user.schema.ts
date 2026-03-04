import { z } from 'zod';

// Esquema para crear usuario
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .trim(),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .max(100, 'El apellido no puede tener más de 100 caracteres')
    .trim(),
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'El email no puede tener más de 255 caracteres')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .max(100, 'La contraseña no puede tener más de 100 caracteres'),
  role: z
    .enum(['admin', 'usuario'])
    .optional(),
  phone: z
    .string()
    .max(50, 'El teléfono no puede tener más de 50 caracteres')
    .nullable()
    .optional(),
});

// Tipo TypeScript inferido
export type CreateUserDTO = z.infer<typeof createUserSchema>;

// JSON Schema para Fastify 5
export const createUserJsonSchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'password'],
  properties: {
    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    lastName: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 255,
    },
    password: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    role: {
      type: 'string',
      enum: ['admin', 'usuario'],
    },
    phone: {
      type: ['string', 'null'],
      maxLength: 50,
    },
  },
} as const;

// Esquema para actualizar usuario
export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .trim(),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .max(100, 'El apellido no puede tener más de 100 caracteres')
    .trim(),
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'El email no puede tener más de 255 caracteres')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .max(100, 'La contraseña no puede tener más de 100 caracteres')
    .optional(),
  role: z
    .enum(['admin', 'usuario'])
    .optional(),
  phone: z
    .string()
    .max(50, 'El teléfono no puede tener más de 50 caracteres')
    .nullable()
    .optional(),
});

// Tipo TypeScript inferido
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

// JSON Schema para Fastify 5
export const updateUserJsonSchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email'],
  properties: {
    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    lastName: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 255,
    },
    password: {
      type: 'string',
      maxLength: 100,
    },
    role: {
      type: 'string',
      enum: ['admin', 'usuario'],
    },
    phone: {
      type: ['string', 'null'],
      maxLength: 50,
    },
  },
} as const;

