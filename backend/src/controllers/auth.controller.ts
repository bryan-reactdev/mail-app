import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../app";
import { User, UserRole } from "../entities/User";
import { findUserByEmail, verifyPassword } from "../services/auth.service";
import { createUser } from "../services/user.service";
import bcrypt from "bcryptjs";

interface LoginBody {
    email: string;
    password: string;
}

interface RegisterBody {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
}

const mapUserToResponse = (user: User) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const register = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { email, password, name, role } = req.body as RegisterBody;

        if (!email || !password || !name) {
            return reply.status(400).send({ message: "Email, password, and name are required" });
        }

        const user = await createUser({ email, password, name, role });

        reply.send({
            message: "User registered successfully",
            data: mapUserToResponse(user),
        });
    } catch (error: any) {
        console.error(error);
        reply.status(400).send({ message: error.message || "Registration failed" });
    }
};

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { email, password } = req.body as LoginBody;

        if (!email || !password) {
            return reply.status(400).send({ message: "Email and password are required" });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return reply.status(401).send({ message: "Invalid credentials" });
        }

        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return reply.status(401).send({ message: "Invalid credentials" });
        }

        const token = (req.server as any).jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        reply.setCookie("token", token, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        reply.send({
            message: "Login successful",
            data: mapUserToResponse(user),
        });
    } catch (error: any) {
        console.error(error);
        reply.status(500).send({ message: "Login failed" });
    }
};

export const logout = async (req: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie("token", {
        path: "/",
        sameSite: "lax",
    });
    reply.send({ message: "Logout successful" });
};

export const checkAuth = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const userPayload = req.user as { id: number };
        const repo = AppDataSource.getRepository(User);
        const user = await repo.findOne({ where: { id: userPayload.id } });

        if (!user) {
            return reply.status(401).send({ message: "User not found" });
        }

        reply.send({
            message: "Authenticated",
            data: mapUserToResponse(user),
        });
    } catch (error: any) {
        console.error(error);
        reply.status(500).send({ message: "Authentication check failed" });
    }
};

