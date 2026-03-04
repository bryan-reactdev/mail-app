import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { registerRoutes } from './routes';

export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  // Swagger/OpenAPI
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'API Inmobiliaria',
        description: 'Documentación de la API del backend de Inmobiliaria',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Servidor de desarrollo',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
  });

  // Headers de seguridad (Helmet)
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Necesario para Swagger UI
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Necesario para Swagger UI
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  // Cookies
  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || process.env.JWT_SECRET || 'cookie-secret',
    parseOptions: {},
  });

  // CORS - in development allow all origins so we never send 500 without CORS headers
  const isProduction = process.env.NODE_ENV === 'production';
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:4178', 'http://localhost:5173', 'http://192.168.0.194:4178', 'http://100.69.105.83'];

  await app.register(cors, {
    origin: isProduction
      ? (origin, cb) => {
          if (!origin) return cb(null, true);
          if (corsOrigins.includes(origin)) return cb(null, true);
          return cb(null, false);
        }
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // JWT
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    cookie: {
      cookieName: 'token',
      signed: false,
    },
    // Soporte para bearer tokens (útil para Swagger y APIs)
    decode: { complete: true },
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  });

  // Registrar rutas
  await registerRoutes(app);

  // Ensure CORS headers on error responses (e.g. 500) so browser doesn't block with "CORS missing"
  app.setErrorHandler((error: { statusCode?: number; message?: string }, request, reply) => {
    const origin = request.headers.origin;
    if (origin) {
      reply.header('Access-Control-Allow-Origin', origin);
      reply.header('Access-Control-Allow-Credentials', 'true');
    }
    reply.status(error.statusCode ?? 500).send({
      message: error.message ?? 'Internal Server Error',
      data: null,
    });
  });

  return app;
}

