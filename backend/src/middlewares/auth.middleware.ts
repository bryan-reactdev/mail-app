// src/middlewares/auth.middleware.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { findUserById } from "../services/auth.service";
import { UserRole } from "../entities/User";

export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        await req.jwtVerify();
    } catch (err) {
        // Clear the invalid token cookie
        reply.clearCookie('token', {
            path: "/",
            sameSite: "lax"
        });
        return reply.status(401).send({ message: "Not authorized" });
    }
};

export const checkRole = (roles: UserRole[]) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const userPayload = req.user as { id: number };
            const user = await findUserById(userPayload.id);

            if (!user) {
                return reply.status(401).send({ message: "User not found" });
            }

            // Admin siempre tiene acceso a todo
            if (user.role === UserRole.ADMIN || user.role === "admin") {
                req.user = user;
                return;
            }

            // Check if user role is in allowed roles (handle both enum and string comparisons)
            const userRoleStr = String(user.role);
            const allowedRolesStr = roles.map(r => String(r));
            const hasPermission = roles.includes(user.role) || allowedRolesStr.includes(userRoleStr);
            
            if (!hasPermission) {
                console.log(`[checkRole] Access denied. User role: ${user.role} (${typeof user.role}), Allowed roles: ${roles.join(', ')}`);
                return reply.status(403).send({ message: "Forbidden: Insufficient permissions" });
            }
            
            req.user = user;

        } catch (error) {
            console.error("[checkRole] Error:", error);
            return reply.status(500).send({ message: "Internal Server Error" });
        }
    };
};
