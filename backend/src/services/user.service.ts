import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { CreateUserDTO, UpdateUserDTO } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Obtiene todos los usuarios sin la contraseña
   */
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });

    // Remover la contraseña de todos los usuarios
    return users.map(({ password, ...userWithoutPassword }: User) => userWithoutPassword);
  }

  /**
   * Obtiene un usuario por ID sin la contraseña
   */
  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Crea un nuevo usuario
   */
  async create(data: CreateUserDTO): Promise<Omit<User, 'password'>> {
    // Verificar si el email ya está en uso
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear nuevo usuario
    const newUser = this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'usuario',
      phone: data.phone || null,
    });

    const savedUser = await this.userRepository.save(newUser);

    // Retornar usuario sin la contraseña
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  /**
   * Actualiza un usuario por ID
   */
  async update(id: number, data: UpdateUserDTO): Promise<Omit<User, 'password'>> {
    // Verificar si el usuario existe
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si el email ya está en uso por otro usuario
    if (data.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error('El email ya está registrado');
      }
    }

    // Hash de la contraseña si se proporciona
    const updateData: Partial<User> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };

    if (data.password && data.password.trim() !== '') {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    if (data.role !== undefined) {
      updateData.role = data.role;
    }

    if (data.phone !== undefined) {
      updateData.phone = data.phone;
    }

    // Actualizar usuario
    await this.userRepository.update(id, updateData);

    // Obtener el usuario actualizado
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    
    if (!updatedUser) {
      throw new Error('Error al actualizar usuario');
    }

    // Retornar usuario sin la contraseña
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}

