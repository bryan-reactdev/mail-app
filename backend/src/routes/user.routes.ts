import { FastifyInstance } from 'fastify';
import {
  listUsers,
  listArchivedUsers,
  getUser,
  createUser,
  updateUser,
  archiveUser,
  restoreUser,
} from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/roles';

export default async function (server: FastifyInstance) {
  server.post(
    '/users/create',
    { preHandler: [authenticate, requireAdmin] },
    async (req, reply) => createUser(req as never, reply)
  );

  server.put(
    '/users/edit/:id',
    { preHandler: [authenticate, requireAdmin] },
    async (req, reply) => updateUser(req as never, reply)
  );

  server.get('/users/list', { preHandler: [authenticate, requireAdmin] }, listUsers);

  server.get('/users/archived', { preHandler: [authenticate, requireAdmin] }, listArchivedUsers);

  server.get('/users/get/:id', { preHandler: [authenticate] }, async (req, reply) =>
    getUser(req as never, reply)
  );

  server.post(
    '/users/archive/:id',
    { preHandler: [authenticate, requireAdmin] },
    async (req, reply) => archiveUser(req as never, reply)
  );

  server.delete(
    '/users/delete/:id',
    { preHandler: [authenticate, requireAdmin] },
    async (req, reply) => archiveUser(req as never, reply)
  );

  server.post(
    '/users/restore/:id',
    { preHandler: [authenticate, requireAdmin] },
    async (req, reply) => restoreUser(req as never, reply)
  );
}
