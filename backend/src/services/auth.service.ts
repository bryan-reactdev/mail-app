import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { RegisterDTO, LoginDTO } from '../schemas/auth.schema';
import * as bcrypt from 'bcryptjs';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(data: RegisterDTO): Promise<Omit<User, 'password'>> {
    const existing = await this.userRepository.findOne({ where: { email: data.email } });
    if (existing) throw new Error('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'user',
    });
    const saved = await this.userRepository.save(user);
    const { password: _, ...rest } = saved;
    return rest;
  }

  async login(data: LoginDTO): Promise<User> {
    const email = data.email.trim().toLowerCase();
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new Error('Credenciales inválidas');
    if (user.archived) throw new Error('Cuenta suspendida');
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new Error('Credenciales inválidas');
    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email: email.trim().toLowerCase() } });
  }
}
