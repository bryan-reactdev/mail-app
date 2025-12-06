import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, getUsers, getUserById, updateUser, deleteUser, toggleBlockStatus } from "../services/user.service";
import ApiResponse from "../dtos/apiResponse";
import UserResponse, { mapUserToResponse } from "../dtos/user";
import { logAction, ActionType, EntityType } from "../services/audit.service";
import { User } from "../entities/User";

// validar id
const validateId = (id: any, name: string) => {
  const num = Number(id);
  if (isNaN(num)) throw new Error(`${name} inválido`);
  return num;
};

// crear
export const addUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const currentUser = req.user as User;
    const { email, password, name, role } = req.body as any;

    const user = await createUser({ email, password, name, role });

    // Log de auditoría
    await logAction(
      currentUser.id,
      ActionType.CREATE_USER,
      EntityType.USER,
      user.id,
      `Usuario {userName} creó el usuario ${user.name} (${user.email})`
    );

    const apiResponse: ApiResponse<UserResponse> = {
      message: "User created successfully",
      data: mapUserToResponse(user, false),
    };

    reply.send(apiResponse);
  } catch (error: any) {
    console.error(error);
    reply.status(400).send({ message: error.message });
  }
};

// listar
export const listUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  const includeProjects = (req.query as any).includeProjects === "true";
  const users = await getUsers(includeProjects);
  console.log(`[listUsers] includeProjects=${includeProjects}, found ${users.length} users`);
  const mapped = users.map(u => {
    const mappedUser = mapUserToResponse(u, includeProjects);
    if (includeProjects) {
      console.log(`[listUsers] User ${u.id}: mapped with ${mappedUser.projectUsers?.length || 0} projectUsers`);
    }
    return mappedUser;
  });

  const apiResponse: ApiResponse<UserResponse[]> = {
    message: "Users retrieved successfully",
    data: mapped,
  };

  reply.send(apiResponse);
};

// obtener por id
export const getUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const id = validateId((req.params as any).id, "userId");
    const includeProjects = (req.query as any).includeProjects === "true";

    console.log(`[getUser controller] User ${id}, includeProjects=${includeProjects}`);

    const user = await getUserById(id, includeProjects);

    const mappedUser = mapUserToResponse(user, includeProjects);
    console.log(`[getUser controller] Mapped user ${id}: projectUsers=${mappedUser.projectUsers?.length || 0}`);

    const apiResponse: ApiResponse<UserResponse> = {
      message: "User retrieved successfully",
      data: mappedUser,
    };

    reply.send(apiResponse);
  } catch (error: any) {
    console.error(`[getUser controller] Error:`, error);
    reply.status(404).send({ message: error.message });
  }
};

// actualizar
export const editUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const currentUser = req.user as User;
    const id = validateId((req.params as any).id, "userId");

    const { email, name, password, role } = req.body as any;

    const user = await updateUser(id, { email, name, password, role });

    // Log de auditoría
    await logAction(
      currentUser.id,
      ActionType.UPDATE_USER,
      EntityType.USER,
      user.id,
      `Usuario {userName} actualizó el usuario ${user.name} (${user.email})`
    );

    const apiResponse: ApiResponse<UserResponse> = {
      message: "User updated successfully",
      data: mapUserToResponse(user, false),
    };

    reply.send(apiResponse);
  } catch (error: any) {
    reply.status(400).send({ message: error.message });
  }
};

// eliminar
export const removeUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const currentUser = req.user as User;
    const id = validateId((req.params as any).id, "userId");

    // Obtener el usuario antes de eliminarlo
    const userToDelete = await getUserById(id);

    await deleteUser(id);

    // Log de auditoría
    await logAction(
      currentUser.id,
      ActionType.DELETE_USER,
      EntityType.USER,
      id,
      `Usuario {userName} eliminó el usuario ${userToDelete.name} (${userToDelete.email})`
    );

    const apiResponse: ApiResponse<null> = {
      message: "User deleted successfully",
      data: null,
    };

    reply.send(apiResponse);
  } catch (error: any) {
    reply.status(400).send({ message: error.message });
  }
};

// bloquear / desbloquear
export const toggleBlock = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const currentUser = req.user as User;
    const id = validateId((req.params as any).id, "userId");

    const user = await toggleBlockStatus(id);

    // Log de auditoría
    await logAction(
      currentUser.id,
      user.isBlocked ? ActionType.BLOCK_USER : ActionType.UNBLOCK_USER,
      EntityType.USER,
      user.id,
      `Usuario {userName} ${user.isBlocked ? "bloqueó" : "desbloqueó"} al usuario ${user.name} (${user.email})`
    );

    const apiResponse: ApiResponse<UserResponse> = {
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      data: mapUserToResponse(user, false),
    };

    reply.send(apiResponse);
  } catch (error: any) {
    reply.status(400).send({ message: error.message });
  }
};
