import { z, ZodSchema } from 'zod';

/**
 * ⚠️ EXPERIMENTAL: Convierte un schema Zod a JSON Schema para Fastify 5
 * 
 * IMPORTANTE: Este helper accede a APIs internas de Zod que no están documentadas
 * y pueden cambiar entre versiones. Es posible que no funcione correctamente con
 * todas las características de Zod (transformaciones, refinements, etc.).
 * 
 * RECOMENDACIÓN: Se recomienda usar la solución manual de definir los JSON schemas
 * directamente (ver EXPLICACION_ZOD_TO_JSON.md y GUIDE_ENDPOINTS.md).
 * 
 * Fastify 5 requiere que los schemas JSON Schema estén definidos en la configuración
 * de la ruta para poder parsear correctamente los request bodies.
 * 
 * @param zodSchema - El schema Zod a convertir
 * @returns Un objeto JSON Schema compatible con Fastify
 * 
 * @example
 * ```typescript
 * const userSchema = z.object({
 *   email: z.string().email(),
 *   name: z.string().min(1)
 * });
 * 
 * const jsonSchema = zodToJsonSchemaForFastify(userSchema);
 * 
 * server.post('/users', {
 *   schema: { body: jsonSchema },
 *   preHandler: [createValidator({ body: userSchema })],
 * }, handler);
 * ```
 */
export function zodToJsonSchemaForFastify<T extends ZodSchema>(
  zodSchema: T
): {
  type: 'object';
  required: string[];
  properties: Record<string, any>;
} {
  if (!(zodSchema instanceof z.ZodObject)) {
    throw new Error('El schema debe ser un ZodObject');
  }

  const shape = zodSchema.shape;
  const required: string[] = [];
  const properties: Record<string, any> = {};

  for (const [key, value] of Object.entries(shape)) {
    const zodType = value as any;
    const property: any = {};

    // Determinar el tipo base
    if (zodType instanceof z.ZodString) {
      property.type = 'string';
      
      // Agregar validaciones de string
      const checks = (zodType._def as any).checks as any[] | undefined;
      if (checks) {
        for (const check of checks) {
          const checkType = check.constructor.name;
          
          // Acceder a propiedades internas usando 'as any' ya que no están tipadas
          const checkAny = check as any;
          
          if (checkType === '$ZodCheckMinLength' || checkType.includes('MinLength')) {
            property.minLength = checkAny.value ?? checkAny._def?.value;
          } else if (checkType === '$ZodCheckMaxLength' || checkType.includes('MaxLength')) {
            property.maxLength = checkAny.value ?? checkAny._def?.value;
          } else if (checkType === 'ZodEmail' || checkAny._def?.format === 'email') {
            property.format = 'email';
          } else if (checkAny._def?.format === 'uri') {
            property.format = 'uri';
          } else if (checkAny._def?.format === 'uuid') {
            property.format = 'uuid';
          }
        }
      }
    } else if (zodType instanceof z.ZodNumber) {
      property.type = 'number';
      
      const checks = (zodType._def as any).checks as any[] | undefined;
      if (checks) {
        for (const check of checks) {
          const checkType = check.constructor.name;
          const checkAny = check as any;
          
          if (checkType === '$ZodCheckMin' || checkType.includes('Min')) {
            property.minimum = checkAny.value ?? checkAny._def?.value;
          } else if (checkType === '$ZodCheckMax' || checkType.includes('Max')) {
            property.maximum = checkAny.value ?? checkAny._def?.value;
          } else if (checkType === '$ZodCheckInt' || checkType.includes('Int')) {
            property.type = 'integer';
          }
        }
      }
    } else if (zodType instanceof z.ZodBoolean) {
      property.type = 'boolean';
    } else if (zodType instanceof z.ZodArray) {
      property.type = 'array';
      // Por simplicidad, asumimos items de cualquier tipo
      // Para casos más complejos, se puede hacer recursivo
      property.items = {};
    } else if (zodType instanceof z.ZodOptional || zodType instanceof z.ZodNullable) {
      // Para optional/nullable, obtenemos el tipo interno
      const innerType = (zodType._def as any).innerType;
      if (innerType instanceof z.ZodString) {
        property.type = 'string';
        // Aplicar checks del inner type si es necesario
      } else if (innerType instanceof z.ZodNumber) {
        property.type = 'number';
      } else if (innerType instanceof z.ZodBoolean) {
        property.type = 'boolean';
      }
      // No agregar a required si es optional
    }

    properties[key] = property;

    // Determinar si es requerido (no es optional, nullable, o default)
    if (
      !(zodType instanceof z.ZodOptional) &&
      !(zodType instanceof z.ZodNullable) &&
      !zodType._def.defaultValue
    ) {
      required.push(key);
    }
  }

  return {
    type: 'object',
    required,
    properties,
  };
}

