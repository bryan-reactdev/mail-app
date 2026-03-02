import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, ZodError } from 'zod';

export interface ValidationOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export async function validateRequest(
  request: FastifyRequest,
  reply: FastifyReply,
  options: ValidationOptions
): Promise<void> {
  try {
    // Validar body
    if (options.body && request.body) {
      request.body = options.body.parse(request.body);
    }

    // Validar query params
    if (options.query && request.query) {
      request.query = options.query.parse(request.query);
    }

    // Validar route params
    if (options.params && request.params) {
      request.params = options.params.parse(request.params);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return reply.status(400).send({
        error: 'Error de validación',
        details: errors,
      });
    }

    return reply.status(400).send({
      error: 'Error de validación',
    });
  }
}

// Helper para crear un preHandler de validación
export function createValidator(options: ValidationOptions) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await validateRequest(request, reply, options);
  };
}

