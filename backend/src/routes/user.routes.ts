import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createUser, listUsers, getUser, updateUser } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth';
import { createValidator } from '../middlewares/validation';
import {
  createUserSchema,
  createUserJsonSchema,
  updateUserSchema,
  updateUserJsonSchema,
} from '../schemas/user.schema';

export default async function (server: FastifyInstance) {
  // Crear nuevo usuario (requiere autenticación)
  server.post(
    '/users/create',
    {
      schema: {
        body: createUserJsonSchema,
      },
      preHandler: [
        authenticate,
        createValidator({ body: createUserSchema }),
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => createUser(request, reply)
  );

  // Listar todos los usuarios (requiere autenticación)
  server.get(
    '/users/list',
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => listUsers(request, reply)
  );

  // Obtener usuario por ID (requiere autenticación)
  server.get('/users/:id', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => getUser(request, reply));

  // Actualizar usuario por ID (requiere autenticación)
  server.put(
    '/users/edit/:id',
    {
      schema: {
        body: updateUserJsonSchema,
      },
      preHandler: [
        authenticate,
        createValidator({ body: updateUserSchema }),
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => updateUser(request, reply)
  );
}

