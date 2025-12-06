import { FastifyInstance } from "fastify";
import { register, login, logout, checkAuth } from "../controllers/auth.controller";
import { authenticate, checkRole } from "../middlewares/auth.middleware";
import { UserRole } from "../entities/User";

export default async function (server: FastifyInstance) {
    // Solo los ADMIN pueden registrar nuevos usuarios
    server.post("/register", { preHandler: [authenticate, checkRole([UserRole.ADMIN])] }, register);

    server.post("/login", login);
    server.post("/authenticate", { preHandler: [authenticate] }, checkAuth);
    server.post("/logout", logout);
    server.get("/profile", { preHandler: [authenticate] }, async (req, reply) => {
        reply.send({ user: (req as any).user });
    });
}
