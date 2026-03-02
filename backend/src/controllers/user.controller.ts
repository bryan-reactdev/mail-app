import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service';
import { AuthenticatedRequest } from '../middlewares/auth';
import type { ApiResponse } from '../dtos/apiResponse.dto';
import { createUserSchema, CreateUserDTO, updateUserSchema, UpdateUserDTO } from '../schemas/user.schema';

const userService = new UserService();

/**
 * Crear un nuevo usuario
 */
export async function createUser(
  request: FastifyRequest<{ Body: CreateUserDTO }>,
  reply: FastifyReply
) {
  try {
    const userPayload = (request as AuthenticatedRequest).user;
    if (!userPayload) {
      const errorResponse: ApiResponse<null> = {
        message: 'No autorizado',
        data: null,
      };
      return reply.status(401).send(errorResponse);
    }

    // Validar datos con Zod
    const validatedData = createUserSchema.parse(request.body);

    // Crear usuario
    const newUser = await userService.create(validatedData);

    const response: ApiResponse<typeof newUser> = {
      message: 'Usuario creado exitosamente',
      data: newUser,
    };

    return reply.status(201).send(response);
  } catch (error: any) {
    request.log.error(error);
    
    // Manejo de errores específicos
    if (error.message === 'El email ya está registrado') {
      const errorResponse: ApiResponse<null> = {
        message: error.message,
        data: null,
      };
      return reply.status(409).send(errorResponse);
    }

    // Errores de validación de Zod
    if (error.name === 'ZodError') {
      const errorResponse: ApiResponse<null> = {
        message: 'Datos inválidos',
        data: null,
      };
      return reply.status(400).send(errorResponse);
    }

    const errorResponse: ApiResponse<null> = {
      message: 'Error al crear usuario',
      data: null,
    };
    return reply.status(500).send(errorResponse);
  }
}

/**
 * Listar todos los usuarios
 */
export async function listUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userPayload = (request as AuthenticatedRequest).user;
    if (!userPayload) {
      const errorResponse: ApiResponse<null> = {
        message: 'No autorizado',
        data: null,
      };
      return reply.status(401).send(errorResponse);
    }

    const users = await userService.findAll();

    const response: ApiResponse<typeof users> = {
      message: 'Usuarios obtenidos exitosamente',
      data: users,
    };

    return reply.send(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      message: 'Error al obtener usuarios',
      data: null,
    };
    return reply.status(500).send(errorResponse);
  }
}

/**
 * Obtener un usuario por ID
 */
export async function getUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const userPayload = (request as AuthenticatedRequest).user;
    if (!userPayload) {
      const errorResponse: ApiResponse<null> = {
        message: 'No autorizado',
        data: null,
      };
      return reply.status(401).send(errorResponse);
    }

    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      const errorResponse: ApiResponse<null> = {
        message: 'ID inválido',
        data: null,
      };
      return reply.status(400).send(errorResponse);
    }

    const user = await userService.findById(id);

    if (!user) {
      const errorResponse: ApiResponse<null> = {
        message: 'Usuario no encontrado',
        data: null,
      };
      return reply.status(404).send(errorResponse);
    }

    const response: ApiResponse<typeof user> = {
      message: 'Usuario obtenido exitosamente',
      data: user,
    };

    return reply.send(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      message: 'Error al obtener usuario',
      data: null,
    };
    return reply.status(500).send(errorResponse);
  }
}

/**
 * Actualizar un usuario por ID
 */
export async function updateUser(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserDTO }>,
  reply: FastifyReply
) {
  try {
    const userPayload = (request as AuthenticatedRequest).user;
    if (!userPayload) {
      const errorResponse: ApiResponse<null> = {
        message: 'No autorizado',
        data: null,
      };
      return reply.status(401).send(errorResponse);
    }

    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      const errorResponse: ApiResponse<null> = {
        message: 'ID inválido',
        data: null,
      };
      return reply.status(400).send(errorResponse);
    }

    // Validar datos con Zod
    const validatedData = updateUserSchema.parse(request.body);

    // Actualizar usuario
    const updatedUser = await userService.update(id, validatedData);

    const response: ApiResponse<typeof updatedUser> = {
      message: 'Usuario actualizado exitosamente',
      data: updatedUser,
    };

    return reply.send(response);
  } catch (error: any) {
    request.log.error(error);
    
    // Manejo de errores específicos
    if (error.message === 'Usuario no encontrado') {
      const errorResponse: ApiResponse<null> = {
        message: error.message,
        data: null,
      };
      return reply.status(404).send(errorResponse);
    }

    if (error.message === 'El email ya está registrado') {
      const errorResponse: ApiResponse<null> = {
        message: error.message,
        data: null,
      };
      return reply.status(409).send(errorResponse);
    }

    // Errores de validación de Zod
    if (error.name === 'ZodError') {
      const errorResponse: ApiResponse<null> = {
        message: 'Datos inválidos',
        data: null,
      };
      return reply.status(400).send(errorResponse);
    }

    const errorResponse: ApiResponse<null> = {
      message: 'Error al actualizar usuario',
      data: null,
    };
    return reply.status(500).send(errorResponse);
  }
}

