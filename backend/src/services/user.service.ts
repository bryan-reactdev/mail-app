// servicios de usuarios
import { AppDataSource } from "../app";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcryptjs";

// crear usuario
export const createUser = async (data: {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}) => {
  const repo = AppDataSource.getRepository(User);

  const exists = await repo.findOne({ where: { email: data.email } });
  if (exists) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(data.password, 10);

  const user = repo.create({
    email: data.email,
    password: hashed,
    name: data.name,
    role: data.role || UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return repo.save(user);
};

// listar
export const getUsers = async () => {
  return AppDataSource.getRepository(User).find();
};

// obtener por id
export const getUserById = async (id: number) => {
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { id } });
  if (!user) throw new Error("User not found");
  return user;
};

// actualizar
export const updateUser = async (
  id: number,
  data: { email?: string; name?: string; password?: string; role?: UserRole }
) => {
  const repo = AppDataSource.getRepository(User);

  const user = await repo.findOne({ where: { id } });
  if (!user) throw new Error("User not found");

  if (data.email) user.email = data.email;
  if (data.name) user.name = data.name;
  if (data.role) user.role = data.role;
  if (data.password) user.password = await bcrypt.hash(data.password, 10);

  user.updatedAt = new Date();

  return repo.save(user);
};

// eliminar
export const deleteUser = async (id: number) => {
  const repo = AppDataSource.getRepository(User);

  const user = await repo.findOne({ where: { id } });
  if (!user) throw new Error("User not found");

  await repo.remove(user);
  return true;
};

