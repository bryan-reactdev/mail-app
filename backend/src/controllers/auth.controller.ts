import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, LoginDTO } from '../schemas/auth.schema';
import { AuthenticatedRequest } from '../middlewares/auth';
import type { ApiResponse } from '../dtos/apiResponse.dto';
import { User } from '../entities/User';

const authService = new AuthService();

export async function register(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = await authService.register(request.body as RegisterDTO);
    const response: ApiResponse<Omit<User, 'password'>> = {
      message: 'Usuario registrado exitosamente',
      data: user,
    };

    return reply.status(201).send(response);
  } catch (error: unknown) {
    if (!(error instanceof Error)) { return }

    if (error.message === 'El email ya está registrado') {
      const errorResponse: ApiResponse<null> = {
        message: error.message,
        data: null,
      };
      return reply.status(409).send(errorResponse);
    }

    return reply.status(500).send({
      message: 'Error al registrar usuario',
      data: null,
    } as ApiResponse<Error>);
  }
}

export async function login(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = await authService.login(request.body as LoginDTO);

    // Generar token JWT con expiración
    const token = (request.server as FastifyInstance).jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '7d',
      }
    );

    // Configurar cookie con el token (segura)
    reply.setCookie('token', token, {
      httpOnly: true, // Previene acceso desde JavaScript (XSS)
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'lax', // Protección CSRF
      maxAge: 7 * 24 * 60 * 60, // 7 días
      path: '/',
    });

    const { password, ...userWithoutPassword } = user;

    const response: ApiResponse<{ user: Omit<User, 'password'> }> = {
      message: 'Login exitoso',
      data: {
        user: userWithoutPassword,
      },
    };
    return reply.send(response);
  } catch (error: any) {
    // Siempre usar el mismo mensaje para no revelar información
    if (error.message === 'Credenciales inválidas') {
      const errorResponse: ApiResponse<null> = {
        message: error.message,
        data: null,
      };
      return reply.status(401).send(errorResponse);
    }
    
    // No exponer detalles del error interno
    request.log.error(error);
    const errorResponse: ApiResponse<null> = {
      message: 'Error al iniciar sesión',
      data: null,
    };
    return reply.status(500).send(errorResponse);
  }
}

export async function logout(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  // Limpiar cookie con las mismas opciones de seguridad
  reply.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  const response: ApiResponse<null> = {
    message: 'Sesión cerrada exitosamente',
    data: null,
  };
  return reply.send(response);
}

export async function getProfile(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  try {
    const userPayload = request.user;
    if (!userPayload) {
      const errorResponse: ApiResponse<null> = {
        message: 'No autorizado',
        data: null,
      };
      return reply.status(401).send(errorResponse);
    }

    const user = await authService.findById(userPayload.id);
    if (!user) {
      const errorResponse: ApiResponse<null> = {
        message: 'Usuario no encontrado',
        data: null,
      };
      return reply.status(404).send(errorResponse);
    }

    const { password, ...userWithoutPassword } = user;
    const response: ApiResponse<Omit<User, 'password'>> = {
      message: 'Perfil obtenido exitosamente',
      data: userWithoutPassword,
    };
    return reply.send(response);
  } catch (error: unknown) {
    if (!(error instanceof Error)) { return }

    return reply.status(500).send({
      message: 'Error al obtener perfil',
      data: null,
    } as ApiResponse<Error>);
  }
}

