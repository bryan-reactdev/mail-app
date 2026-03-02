import { FastifyRequest, FastifyReply } from 'fastify';

export interface UserPayload {
  id: number;
  email: string;
  role: string;
  [key: string]: any;
}

export interface AuthenticatedRequest extends Omit<FastifyRequest, 'user'> {
  user?: UserPayload;
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    // jwtVerify verifica el token desde cookies o Authorization header
    // El payload del JWT se asigna automáticamente a request.user por @fastify/jwt
    await (request as any).jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'No autorizado' });
  }
}

