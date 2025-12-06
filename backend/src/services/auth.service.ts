import { AppDataSource } from "../app";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

export const findUserById = async (id: number): Promise<User | null> => {
    const repo = AppDataSource.getRepository(User);
    return repo.findOne({ where: { id } });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const repo = AppDataSource.getRepository(User);
    return repo.findOne({ 
        where: { email },
        select: ["id", "email", "password", "name", "role", "createdAt", "updatedAt"]
    });
};

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

