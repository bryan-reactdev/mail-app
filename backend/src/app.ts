import "reflect-metadata";
import { DataSource } from "typeorm";

import dotenv from "dotenv";
import { User } from "./entities/User";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: true, // para desarrollo
    extra: {
        // Configurar timezone en la conexión MySQL
        // Usar zona horaria local del servidor (ej: '-06:00' para UTC-6)
        timezone: process.env.DB_TIMEZONE || 'local',
    },
});
