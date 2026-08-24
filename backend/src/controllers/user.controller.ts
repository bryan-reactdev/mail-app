import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service';
import { AuthenticatedRequest } from '../middlewares/auth';
import { isAdminRole } from '../middlewares/roles';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';
import { parseMultipartRequest } from '../utils/multipart';

const userService = new UserService();

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (!(request as AuthenticatedRequest).user) {
      return reply.status(401).send({ message: 'No autorizado', data: null });
    }
    const users = await userService.findAll();
    return reply.send({ message: 'Usuarios obtenidos exitosamente', data: users });
  } catch {
    return reply.status(500).send({ message: 'Error al obtener usuarios', data: null });
  }
}

export async function getUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    if (!(request as AuthenticatedRequest).user) {
      return reply.status(401).send({ message: 'No autorizado', data: null });
    }
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido', data: null });
    }
    const authUser = (request as AuthenticatedRequest).user!;
    if (!isAdminRole(authUser.role) && authUser.id !== id) {
      return reply.status(403).send({ message: 'Acceso denegado', data: null });
    }
    const user = await userService.findById(id);
    if (!user) {
      return reply.status(404).send({ message: 'Usuario no encontrado', data: null });
    }
    return reply.send({ message: 'Usuario obtenido exitosamente', data: user });
  } catch {
    return reply.status(500).send({ message: 'Error al obtener usuario', data: null });
  }
}

export async function listArchivedUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (!(request as AuthenticatedRequest).user) {
      return reply.status(401).send({ message: 'No autorizado', data: null });
    }
    const users = await userService.findArchived();
    return reply.send({ message: 'Usuarios archivados obtenidos exitosamente', data: users });
  } catch {
    return reply.status(500).send({ message: 'Error al obtener usuarios archivados', data: null });
  }
}

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (!(request as AuthenticatedRequest).user) {
      return reply.status(401).send({ message: 'No autorizado', data: null });
    }

    const { fields, photo } = await parseMultipartRequest(request);
    const parsed = createUserSchema.safeParse(fields);
    if (!parsed.success) {
      return reply.status(400).send({ message: 'Datos inválidos', data: null });
    }

    const newUser = await userService.create(parsed.data, photo);
    return reply.status(201).send({ message: 'Usuario creado exitosamente', data: newUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'El email ya está registrado') {
      return reply.status(409).send({ message, data: null });
    }
    (request as FastifyRequest & { log: { error: (e: unknown) => void } }).log?.error?.(err);
    return reply.status(500).send({ message: 'Error al crear usuario', data: null });
  }
}

export async function updateUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    if (!(request as AuthenticatedRequest).user) {
      return reply.status(401).send({ message: 'No autorizado', data: null });
    }

    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido', data: null });
    }

    const { fields, photo } = await parseMultipartRequest(request);
    const parsed = updateUserSchema.safeParse(fields);
    if (!parsed.success) {
      return reply.status(400).send({ message: 'Datos inválidos', data: null });
    }

    const updated = await userService.update(id, parsed.data, photo);
    return reply.send({ message: 'Usuario actualizado exitosamente', data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'Usuario no encontrado') {
      return reply.status(404).send({ message, data: null });
    }
    if (message === 'El email ya está registrado') {
      return reply.status(409).send({ message, data: null });
    }
    (request as FastifyRequest & { log: { error: (e: unknown) => void } }).log?.error?.(err);
    return reply.status(500).send({ message: 'Error al actualizar usuario', data: null });
  }
}

export async function archiveUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    if (!(request as AuthenticatedRequest).user) {
      return reply.status(401).send({ message: 'No autorizado', data: null });
    }
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido', data: null });
    }
    const authUser = (request as AuthenticatedRequest).user!;
    const archived = await userService.archive(id, authUser.id);
    return reply.send({ message: 'Usuario archivado exitosamente', data: archived });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'Usuario no encontrado') {
      return reply.status(404).send({ message, data: null });
    }
    if (
      message === 'No puedes archivar tu propia cuenta' ||
      message === 'No se puede archivar un administrador' ||
      message === 'El usuario ya está archivado'
    ) {
      return reply.status(400).send({ message, data: null });
    }
    (request as FastifyRequest & { log: { error: (e: unknown) => void } }).log?.error?.(err);
    return reply.status(500).send({ message: 'Error al archivar usuario', data: null });
  }
}

export async function restoreUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    if (!(request as AuthenticatedRequest).user) {
      return reply.status(401).send({ message: 'No autorizado', data: null });
    }
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido', data: null });
    }
    const restored = await userService.restore(id);
    return reply.send({ message: 'Usuario restaurado exitosamente', data: restored });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'Usuario no encontrado') {
      return reply.status(404).send({ message, data: null });
    }
    if (message === 'El usuario no está archivado') {
      return reply.status(400).send({ message, data: null });
    }
    (request as FastifyRequest & { log: { error: (e: unknown) => void } }).log?.error?.(err);
    return reply.status(500).send({ message: 'Error al restaurar usuario', data: null });
  }
}
