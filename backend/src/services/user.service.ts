import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { CreateUserDTO, UpdateUserDTO } from '../schemas/user.schema';
import { isStaffRole } from '../middlewares/roles';
import { imageService } from './image.service';
import { splitFullName } from '../utils/name';
import { isAdminRole } from '../middlewares/roles';
import * as bcrypt from 'bcryptjs';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  private omitPassword(user: User): Omit<User, 'password'> {
    const { password: _, ...rest } = user;
    return rest;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find({
      where: { archived: false },
      order: { createdAt: 'DESC' },
    });
    return users.map((u) => this.omitPassword(u));
  }

  async findArchived(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find({
      where: { archived: true },
      order: { archivedAt: 'DESC' },
    });
    return users.map((u) => this.omitPassword(u));
  }

  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    return this.omitPassword(user);
  }

  private async assertEmailAvailable(email: string | null, excludeId?: number): Promise<void> {
    if (!email) return;
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing && existing.id !== excludeId) {
      throw new Error('El email ya está registrado');
    }
  }

  async create(data: CreateUserDTO, photo?: Buffer | null): Promise<Omit<User, 'password'>> {
    if (!isStaffRole(data.role)) {
      throw new Error('Rol inválido');
    }

    await this.assertEmailAvailable(data.email ?? null);

    const { firstName, lastName } = splitFullName(data.fullName);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      email: data.email ?? null,
      password: hashedPassword,
      firstName,
      lastName,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
      archived: false,
      archivedAt: null,
    });

    const saved = await this.userRepository.save(user);

    if (photo) {
      const paths = await imageService.saveProfilePhoto(saved.id, photo);
      saved.profilePhoto = paths.profilePhoto;
      saved.profilePhotoThumb = paths.profilePhotoThumb;
      await this.userRepository.save(saved);
    }

    return this.omitPassword(saved);
  }

  async update(
    id: number,
    data: UpdateUserDTO,
    photo?: Buffer | null
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error('Usuario no encontrado');
    if (user.archived) throw new Error('No se puede editar un usuario archivado');
    if (!isStaffRole(data.role)) {
      throw new Error('Rol inválido');
    }

    await this.assertEmailAvailable(data.email ?? null, id);

    const { firstName, lastName } = splitFullName(data.fullName);

    user.fullName = data.fullName;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = data.phone;
    user.email = data.email ?? null;
    user.role = data.role;

    if (data.password.trim() !== '') {
      user.password = await bcrypt.hash(data.password, 10);
    }

    if (photo) {
      const paths = await imageService.saveProfilePhoto(user.id, photo);
      user.profilePhoto = paths.profilePhoto;
      user.profilePhotoThumb = paths.profilePhotoThumb;
    }

    const saved = await this.userRepository.save(user);
    return this.omitPassword(saved);
  }

  async archive(id: number, requestingUserId?: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error('Usuario no encontrado');
    if (user.archived) throw new Error('El usuario ya está archivado');

    if (requestingUserId !== undefined && id === requestingUserId) {
      throw new Error('No puedes archivar tu propia cuenta');
    }

    if (isAdminRole(user.role)) {
      throw new Error('No se puede archivar un administrador');
    }

    user.archived = true;
    user.archivedAt = new Date();
    const saved = await this.userRepository.save(user);
    return this.omitPassword(saved);
  }

  async restore(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error('Usuario no encontrado');
    if (!user.archived) throw new Error('El usuario no está archivado');

    user.archived = false;
    user.archivedAt = null;
    const saved = await this.userRepository.save(user);
    return this.omitPassword(saved);
  }
}
