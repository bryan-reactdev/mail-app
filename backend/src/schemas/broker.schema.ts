import { z } from 'zod';

// Esquema para crear broker
export const createBrokerSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la empresa es requerido')
    .max(255, 'El nombre no puede tener más de 255 caracteres')
    .trim(),
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'El email es requerido')
    .max(255, 'El email no puede tener más de 255 caracteres')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .max(50, 'El teléfono no puede tener más de 50 caracteres'),
  description: z
    .string()
    .nullable()
    .optional(),
  license: z
    .string()
    .min(1, 'La licencia es requerida')
    .max(255, 'La licencia no puede tener más de 255 caracteres'),
  city: z
    .string()
    .min(1, 'La ciudad es requerida')
    .max(100, 'La ciudad no puede tener más de 100 caracteres'),
});

// Esquema para actualizar broker (todos los campos opcionales)
export const updateBrokerSchema = createBrokerSchema.partial();

// Tipos TypeScript inferidos
export type CreateBrokerDTO = z.infer<typeof createBrokerSchema>;
export type UpdateBrokerDTO = z.infer<typeof updateBrokerSchema>;

// JSON Schemas para Fastify 5
export const createBrokerJsonSchema = {
  type: 'object',
  required: ['name', 'email', 'phone', 'license', 'city'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    email: {
      type: 'string',
      format: 'email',
      minLength: 1,
      maxLength: 255,
    },
    phone: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    description: {
      type: ['string', 'null'],
    },
    license: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    city: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
  },
} as const;

export const updateBrokerJsonSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    email: {
      type: ['string', 'null'],
      format: 'email',
      maxLength: 255,
    },
    phone: {
      type: ['string', 'null'],
      maxLength: 50,
    },
    description: {
      type: ['string', 'null'],
    },
    license: {
      type: ['string', 'null'],
      maxLength: 255,
    },
    city: {
      type: ['string', 'null'],
      maxLength: 100,
    },
  },
} as const;

