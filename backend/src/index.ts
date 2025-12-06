import Fastify from "fastify";
import { AppDataSource } from "./app";

import dotenv from "dotenv";
import fastifyJwt from "fastify-jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";

import authRoutes from "./routes/auth.routes";

dotenv.config();
const server = Fastify({ logger: true });

// CORS
server.register(fastifyCors, {
    origin: (origin, cb) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return cb(null, true);
        
        const allowedOrigins = [
            "http://biovizionalbums.com",
            "https://biovizionalbums.com",
            "http://192.168.3.182:3000",
            "http://192.168.3.182:3001",
            "http://192.168.3.182:4174",
            "http://192.168.3.13:3000",
            "http://192.168.3.13:3001",
            "http://192.168.3.13:4174",
            "http://192.168.0.210:4174",
            "http://192.168.0.210:3000",
            "http://192.168.0.210:3001",
            "http://www.biovizionalbums.com",
            "https://www.biovizionalbums.com",
            "http://localhost:4176",
            "http://localhost:3000",
        ];
        
        if (allowedOrigins.includes(origin)) {
            cb(null, true);
        } else {
            cb(new Error("Not allowed by CORS"), false);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
});

// Cookies
server.register(fastifyCookie);

// JWT
server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "supersecret",
    cookie: {
        cookieName: "token",
        signed: false
    }
});

// Auth routes
server.register(async function (app) {
    app.register(authRoutes, { prefix: "/auth" });
}, { prefix: "/biovac" });

// Server startup
const start = async () => {
    try {
        await AppDataSource.initialize();
        console.log("DB connected");

        const timezone = process.env.DB_TIMEZONE || 'America/Montreal';
        try {
            await AppDataSource.query(`SET time_zone = '${timezone}'`);
            console.log(`MySQL timezone set to: ${timezone}`);
        } catch (tzError) {
            try {
                await AppDataSource.query(`SET time_zone = '-05:00'`);
                console.log(`MySQL timezone set to: -05:00`);
            } catch (offsetError) {
                console.warn(`Warning: Could not set MySQL timezone: ${offsetError}`);
            }
        }

        await server.listen({ port: 3001, host: '0.0.0.0' });
        console.log("Server running on http://localhost:3001");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();