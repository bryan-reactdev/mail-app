import { FastifyRequest, FastifyReply } from 'fastify';

export interface UserPayload {
  id: number;
  email: string;
  role: string;
  [key: string]: unknown;
}

export interface AuthenticatedRequest extends Omit<FastifyRequest, 'user'> {
  user?: UserPayload;
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await (request as AuthenticatedRequest & { jwtVerify: () => Promise<void> }).jwtVerify();
  } catch {
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) {
      try {
        const decoded = await (request.server as { jwt: { verify: (t: string) => Promise<UserPayload> } }).jwt.verify(token);
        (request as AuthenticatedRequest).user = decoded;
        return;
      } catch {
        // fall through to 401
      }
    }
    reply.status(401).send({ message: 'No autorizado', data: null });
  }
}
