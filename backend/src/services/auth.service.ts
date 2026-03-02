import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { LoginLog } from '../entities/LoginLog';
import { RegisterDTO } from '../schemas/auth.schema';
import { LoginDTO } from '../schemas/auth.schema';
import * as bcrypt from 'bcryptjs';

export class AuthService {
  private userRepository: Repository<User>;
  private loginLogRepository: Repository<LoginLog>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.loginLogRepository = AppDataSource.getRepository(LoginLog);
  }

  async register(data: RegisterDTO): Promise<Omit<User, 'password'>> {
    // Los datos ya vienen validados y sanitizados por Zod
    // (email en lowercase y trim, firstName y lastName con trim)

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hash de la contraseña con bcrypt (10 rounds es seguro)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear nuevo usuario
    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const savedUser = await this.userRepository.save(user);

    // Retornar usuario sin la contraseña
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async login(data: LoginDTO): Promise<User> {
    // El email ya viene normalizado por Zod (lowercase y trim)

    // Buscar usuario por email
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    // Siempre usar el mismo mensaje de error para no revelar si el email existe
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña con bcrypt.compare (timing-safe)
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Record login for stats (logins in the app)
    await this.loginLogRepository.save(
      this.loginLogRepository.create({ userId: user.id })
    );

    return user;
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }
}

