import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticatedRequest } from './auth';

export const ADMIN_ROLE = 'admin';
export const CLIENT_ROLE = 'user';
export const STAFF_ROLES = ['admin', 'supervisor', 'staff'] as const;

export function isAdminRole(role: string | undefined): boolean {
  return role === ADMIN_ROLE;
}

export function isStaffRole(role: string | undefined): boolean {
  return !!role && (STAFF_ROLES as readonly string[]).includes(role);
}

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = (request as AuthenticatedRequest).user;
    if (!user?.role || !roles.includes(user.role)) {
      reply.status(403).send({ message: 'Acceso denegado', data: null });
    }
  };
}

export const requireAdmin = requireRole(ADMIN_ROLE);
