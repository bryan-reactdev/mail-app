import { FastifyInstance } from 'fastify';
import { register, login, logout, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { createValidator } from '../middlewares/validation';
import { registerSchema, loginSchema, registerJsonSchema, loginJsonSchema } from '../schemas/auth.schema';

export default async function (server: FastifyInstance) {
  server.post(
    '/auth/register',
    {
      schema: {
        body: registerJsonSchema, // ✅ OBLIGATORIO para que Fastify parsee el body
      },
      preHandler: [createValidator({ body: registerSchema })], // Validación adicional con Zod
    },
    register
  );

  server.post(
    '/auth/login',
    {
      schema: {
        body: loginJsonSchema, // ✅ OBLIGATORIO para que Fastify parsee el body
      },
      preHandler: [createValidator({ body: loginSchema })], // Validación adicional con Zod
    },
    login
  );

  server.post('/auth/logout', logout);

  server.get(
    '/auth/profile',
    { preHandler: [authenticate] },
    async (req, reply) => getProfile(req as any, reply)
  );
}

