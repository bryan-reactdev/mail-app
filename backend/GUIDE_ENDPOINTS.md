# Guía para Crear Endpoints con Body en Fastify 5

## ⚠️ IMPORTANTE: Fastify 5 Requiere Schema JSON Schema para Parsear Bodies

En Fastify 5, **ES OBLIGATORIO** definir el schema JSON Schema en la configuración de la ruta para que Fastify pueda parsear correctamente los request bodies. Sin esto, los endpoints NO aceptarán bodies y fallarán en Swagger, Postman y cualquier cliente.

## Patrón Correcto para Endpoints con Body

### 1. Definir el Schema Zod

En tu archivo de schemas (ej: `src/schemas/[nombre].schema.ts`):

```typescript
import { z } from 'zod';

// Schema Zod con validaciones y transformaciones
export const createUserSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'El email no puede tener más de 255 caracteres')
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .trim(),
});

// Tipo TypeScript inferido
export type CreateUserDTO = z.infer<typeof createUserSchema>;
```

### 2. Definir el JSON Schema para Fastify

**IMPORTANTE:** Debes definir manualmente el JSON Schema. Fastify 5 necesita que el schema tenga la estructura exacta:

```typescript
// JSON Schema para Fastify (requerido para que Fastify 5 parse el body correctamente)
export const createUserJsonSchema = {
  type: 'object',
  required: ['email', 'name'], // Campos obligatorios (sin .optional())
  properties: {
    email: {
      type: 'string',
      format: 'email', // Para .email()
      maxLength: 255,  // Para .max(255)
    },
    name: {
      type: 'string',
      minLength: 1,    // Para .min(1)
      maxLength: 100,  // Para .max(100)
    },
  },
} as const;
```

### 3. Usar Ambos Schemas en la Ruta

En tu archivo de rutas (ej: `src/routes/[nombre].routes.ts`):

```typescript
import { FastifyInstance } from 'fastify';
import { createValidator } from '../middlewares/validation';
import { 
  createUserSchema,           // Schema Zod para validación
  createUserJsonSchema        // JSON Schema para Fastify
} from '../schemas/[nombre].schema';

export default async function (server: FastifyInstance) {
  server.post(
    '/users',
    {
      // ✅ OBLIGATORIO: Definir schema.body para que Fastify parsee el body
      schema: {
        body: createUserJsonSchema,
      },
      // ✅ Zod validator para validación adicional y transformaciones
      preHandler: [createValidator({ body: createUserSchema })],
    },
    handler
  );
}
```

## Estructura Completa de Ejemplo

### `src/schemas/user.schema.ts`

```typescript
import { z } from 'zod';

// Schema Zod
export const createUserSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  name: z.string().min(1).max(100).trim(),
  age: z.number().int().min(18).optional(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

// JSON Schema para Fastify
export const createUserJsonSchema = {
  type: 'object',
  required: ['email', 'name'], // age es optional, no va aquí
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    age: {
      type: 'integer',
      minimum: 18,
    },
  },
} as const;
```

### `src/routes/user.routes.ts`

```typescript
import { FastifyInstance } from 'fastify';
import { createUser } from '../controllers/user.controller';
import { createValidator } from '../middlewares/validation';
import { createUserSchema, createUserJsonSchema } from '../schemas/user.schema';

export default async function (server: FastifyInstance) {
  server.post(
    '/users',
    {
      schema: {
        body: createUserJsonSchema, // ✅ OBLIGATORIO
      },
      preHandler: [createValidator({ body: createUserSchema })],
    },
    createUser
  );
}
```

## Mapeo de Validaciones Zod → JSON Schema

| Zod Validation | JSON Schema Property |
|----------------|---------------------|
| `.string()` | `type: 'string'` |
| `.string().email()` | `type: 'string', format: 'email'` |
| `.string().min(n)` | `type: 'string', minLength: n` |
| `.string().max(n)` | `type: 'string', maxLength: n` |
| `.number()` | `type: 'number'` |
| `.number().int()` | `type: 'integer'` |
| `.number().min(n)` | `type: 'number', minimum: n` |
| `.number().max(n)` | `type: 'number', maximum: n` |
| `.boolean()` | `type: 'boolean'` |
| `.optional()` | No incluir en `required` |
| `.nullable()` | No incluir en `required` |

## Checklist para Nuevos Endpoints con Body

- [ ] ✅ Definir schema Zod con validaciones
- [ ] ✅ Exportar tipo TypeScript con `z.infer<>`
- [ ] ✅ Definir JSON Schema manualmente con `type: 'object'`, `required`, y `properties`
- [ ] ✅ Incluir el JSON Schema en `schema.body` de la configuración de la ruta
- [ ] ✅ Incluir el schema Zod en `preHandler` con `createValidator({ body: ... })`
- [ ] ✅ Probar en Swagger UI que el body se muestra correctamente
- [ ] ✅ Probar en Postman que el body se envía correctamente

## Errores Comunes a Evitar

❌ **NO hacer esto:**
```typescript
server.post('/users', {
  preHandler: [createValidator({ body: createUserSchema })],
  // ❌ Falta schema.body - Fastify no parseará el body
}, handler);
```

✅ **Hacer esto:**
```typescript
server.post('/users', {
  schema: {
    body: createUserJsonSchema, // ✅ OBLIGATORIO
  },
  preHandler: [createValidator({ body: createUserSchema })],
}, handler);
```

## Notas Importantes

1. **Fastify usa el JSON Schema para parsear el body** - sin él, `request.body` será `undefined`
2. **Zod se usa para validación adicional y transformaciones** - después de que Fastify parsea el body
3. **Los schemas deben mantenerse sincronizados** - si cambias el schema Zod, actualiza también el JSON Schema
4. **Endpoints sin body no necesitan schema.body** - solo los POST/PUT/PATCH que aceptan body

