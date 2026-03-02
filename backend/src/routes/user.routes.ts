import { FastifyInstance } from 'fastify';
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
    async (req, reply) => createUser(req as any, reply)
  );

  // Listar todos los usuarios (requiere autenticación)
  server.get(
    '/users/list',
    { preHandler: [authenticate] },
    listUsers
  );

  // Obtener usuario por ID (requiere autenticación)
  server.get('/users/get/:id', { preHandler: [authenticate] }, (req, reply) => getUser(req as any, reply));
  server.get('/users/:id', { preHandler: [authenticate] }, (req, reply) => getUser(req as any, reply));

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
    async (req, reply) => updateUser(req as any, reply)
  );
}

