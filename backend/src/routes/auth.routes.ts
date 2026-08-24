import { FastifyInstance } from 'fastify';
import { register, login, logout, getProfile, ssoLogin } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { createValidator } from '../middlewares/validation';
import { registerSchema, loginSchema, ssoLoginSchema, registerJsonSchema, loginJsonSchema, ssoLoginJsonSchema } from '../schemas/auth.schema';
import { AuthenticatedRequest } from '../middlewares/auth';

export default async function (server: FastifyInstance) {
  server.post('/auth/register', {
    schema: { body: registerJsonSchema },
    preHandler: [createValidator({ body: registerSchema })],
  }, (req, reply) => register(req as Parameters<typeof register>[0], reply));

  server.post('/auth/login', {
    schema: { body: loginJsonSchema },
    preHandler: [createValidator({ body: loginSchema })],
  }, (req, reply) => login(req as Parameters<typeof login>[0], reply));

  server.post('/auth/sso/login', {
    schema: { body: ssoLoginJsonSchema },
    preHandler: [createValidator({ body: ssoLoginSchema })],
  }, (req, reply) => ssoLogin(req as Parameters<typeof ssoLogin>[0], reply));

  server.post('/auth/logout', logout);

  server.get('/auth/profile', { preHandler: [authenticate] }, async (req, reply) =>
    getProfile(req as AuthenticatedRequest, reply)
  );
}
