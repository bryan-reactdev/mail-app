import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

export interface UserPayload {
  id: number;
  email: string;
  role: string;
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
    await (request as FastifyInstance).jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'No autorizado' });
  }
}

