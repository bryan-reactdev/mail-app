import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, LoginDTO, SsoLoginDTO } from '../schemas/auth.schema';
import { AuthenticatedRequest } from '../middlewares/auth';
import type { ApiResponse } from '../dtos/apiResponse.dto';
import { User } from '../entities/User';

const authService = new AuthService();

function issueSession(request: FastifyRequest, reply: FastifyReply, user: User): string {
  const token = (request.server as { jwt: { sign: (p: object, o?: { expiresIn?: string }) => string } }).jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  reply.setCookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  return token;
}

export async function register(
  request: FastifyRequest<{ Body: RegisterDTO }>,
  reply: FastifyReply
) {
  try {
    const user = await authService.register(request.body);
    const response: ApiResponse<typeof user> = {
      message: 'Usuario registrado exitosamente',
      data: user,
    };
    return reply.status(201).send(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'El email ya está registrado') {
      return reply.status(409).send({ message, data: null });
    }
    (request as FastifyRequest & { log: { error: (e: unknown) => void } }).log?.error?.(err);
    return reply.status(500).send({ message: 'Error al registrar usuario', data: null });
  }
}

export async function login(
  request: FastifyRequest<{ Body: LoginDTO }>,
  reply: FastifyReply
) {
  try {
    const user = await authService.login(request.body);
    const token = issueSession(request, reply, user);
    const { password: _, ...userWithoutPassword } = user;
    const response: ApiResponse<{ user: Omit<User, 'password'>; token: string }> = {
      message: 'Login exitoso',
      data: { user: userWithoutPassword, token },
    };
    return reply.send(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'Credenciales inválidas') {
      return reply.status(401).send({ message, data: null });
    }
    if (message === 'Cuenta suspendida') {
      return reply.status(403).send({ message, data: null });
    }
    (request as FastifyRequest & { log: { error: (e: unknown) => void } }).log?.error?.(err);
    return reply.status(500).send({ message: 'Error al iniciar sesión', data: null });
  }
}

export async function ssoLogin(
  request: FastifyRequest<{ Body: SsoLoginDTO }>,
  reply: FastifyReply
) {
  try {
    const { token } = request.body;
    const ssoSecret = process.env.SSO_SHARED_SECRET;
    const appId = process.env.SSO_APP_ID || 'mail-app';
    const ssoIssuer = process.env.SSO_ISSUER || 'hub-app';
    if (!ssoSecret) {
      return reply.status(500).send({ message: 'SSO no está configurado', data: null });
    }

    let payload: { email?: string; targetApp?: string };
    try {
      payload = (request.server as { jwt: { verify: (t: string, o?: object) => unknown } }).jwt.verify(token, {
        key: ssoSecret,
        allowedIss: ssoIssuer,
        allowedAud: appId,
      }) as { email?: string; targetApp?: string };
    } catch {
      return reply.status(401).send({ message: 'Token SSO inválido o expirado', data: null });
    }

    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    if (!email) {
      return reply.status(400).send({ message: 'El SSO requiere correo electrónico', data: null });
    }
    if (payload.targetApp && payload.targetApp !== appId) {
      return reply.status(401).send({ message: 'Token SSO inválido para esta aplicación', data: null });
    }

    const user = await authService.findByEmail(email);
    if (!user) {
      return reply.status(404).send({ message: 'El correo no está registrado en esta aplicación', data: null });
    }
    if (user.archived) {
      return reply.status(403).send({ message: 'Cuenta suspendida', data: null });
    }

    const appToken = issueSession(request, reply, user);
    const { password: _, ...userWithoutPassword } = user;
    const response: ApiResponse<{ user: Omit<User, 'password'>; token: string }> = {
      message: 'Sesión SSO iniciada correctamente',
      data: { user: userWithoutPassword, token: appToken },
    };
    return reply.send(response);
  } catch (err: unknown) {
    (request as FastifyRequest & { log: { error: (e: unknown) => void } }).log?.error?.(err);
    return reply.status(500).send({ message: 'Error al iniciar sesión SSO', data: null });
  }
}

export async function logout(_request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return reply.send({ message: 'Sesión cerrada exitosamente', data: null });
}

export async function getProfile(request: AuthenticatedRequest, reply: FastifyReply) {
  try {
    const payload = request.user;
    if (!payload) {
      return reply.status(401).send({ message: 'No autorizado', data: null });
    }
    const user = await authService.findById(payload.id);
    if (!user) {
      return reply.status(404).send({ message: 'Usuario no encontrado', data: null });
    }
    if (user.archived) {
      return reply.status(403).send({ message: 'Cuenta suspendida', data: null });
    }
    const { password: _, ...rest } = user;
    return reply.send({ message: 'Perfil obtenido exitosamente', data: rest });
  } catch {
    return reply.status(500).send({ message: 'Error al obtener perfil', data: null });
  }
}
