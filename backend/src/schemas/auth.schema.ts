import { z } from 'zod';

// Esquema de registro
export const registerSchema = z.object({
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
});

// Esquema de login
export const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'El email no puede tener más de 255 caracteres')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .max(100, 'La contraseña no puede tener más de 100 caracteres')
    .min(1, 'La contraseña es requerida'),
});

// Tipos TypeScript inferidos de los esquemas
export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

// ⚠️ IMPORTANTE: Esquemas JSON Schema para Fastify 5
// Fastify 5 REQUIERE que definas el schema JSON Schema en la configuración de la ruta
// (schema.body) para poder parsear correctamente los request bodies.
// Sin esto, los endpoints NO aceptarán bodies y fallarán en Swagger, Postman, etc.
//
// NOTA SOBRE DUPLICACIÓN:
// Estamos duplicando el schema manualmente (Zod + JSON Schema) en lugar de generar
// automáticamente el JSON Schema desde Zod usando zod-to-json-schema porque:
// 1. La versión actual de zod-to-json-schema@3.25.0 tiene problemas con zod@4.2.1
// 2. La solución manual funciona perfectamente y es más explícita
// 3. Ver EXPLICACION_ZOD_TO_JSON.md para más detalles
//
// Si en el futuro zod-to-json-schema funciona correctamente, podríamos hacer:
//   import { zodToJsonSchema } from 'zod-to-json-schema';
//   export const registerJsonSchema = zodToJsonSchema(registerSchema, { $refStrategy: 'none' });
//
// Ver GUIDE_ENDPOINTS.md para más información sobre cómo crear nuevos endpoints con body.
export const registerJsonSchema = {
  type: 'object',
  required: ['email', 'password', 'firstName', 'lastName'],
  properties: {
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
  },
} as const;

export const loginJsonSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
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
  },
} as const;

