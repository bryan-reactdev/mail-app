/**
 * EJEMPLO: Cómo sería si zod-to-json-schema funcionara correctamente
 * 
 * Este archivo es solo para referencia. NO se está usando en el proyecto.
 * Muestra cómo se haría la generación automática del JSON Schema desde Zod.
 */

import { z } from 'zod';
// import { zodToJsonSchema } from 'zod-to-json-schema'; // ⚠️ Actualmente no funciona bien

// Esquema Zod (única fuente de verdad)
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

// Tipo TypeScript inferido
export type RegisterDTO = z.infer<typeof registerSchema>;

// ✅ IDEA: Generar JSON Schema automáticamente desde Zod
// const registerJsonSchema = zodToJsonSchema(registerSchema, {
//   $refStrategy: 'none', // Evita referencias, genera schema completo
//   target: 'jsonSchema7', // Formato compatible con Fastify
// });

// ❌ PROBLEMA: Actualmente zod-to-json-schema@3.25.0 con zod@4.2.1
// no está generando el schema correctamente. Solo devuelve { "$schema": "..." }
// sin las propiedades. Por eso usamos la solución manual.

// SOLUCIÓN ACTUAL (en auth.schema.ts): Definir manualmente el JSON Schema
// Esto funciona perfectamente y es más explícito.

