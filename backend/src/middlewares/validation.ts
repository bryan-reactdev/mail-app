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
    if (options.body && request.body) {
      request.body = options.body.parse(request.body);
    }
    if (options.query && request.query) {
      request.query = options.query.parse(request.query);
    }
    if (options.params && request.params) {
      request.params = options.params.parse(request.params);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err) => ({
        field: String(err.path.join('.')),
        message: err.message,
      }));
      reply.status(400).send({
        message: 'Error de validación',
        data: null,
        details: errors,
      });
    } else {
      reply.status(400).send({ message: 'Error de validación', data: null });
    }
  }
}

export function createValidator(options: ValidationOptions) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await validateRequest(request, reply, options);
  };
}
