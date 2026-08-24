import fs from 'node:fs/promises';
import path from 'node:path';
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { registerRoutes } from './routes';

const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));

export async function createApp(): Promise<FastifyInstance> {
  await fs.mkdir(UPLOAD_ROOT, { recursive: true });

  const app = Fastify({
    logger: { level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' },
    disableRequestLogging: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:3005', 'http://127.0.0.1:5173', 'http://127.0.0.1:3005'];

  function isLocalNetworkOrigin(origin: string): boolean {
    try {
      const { hostname, protocol } = new URL(origin);
      if (protocol !== 'http:' && protocol !== 'https:') return false;
      return (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
      );
    } catch {
      return false;
    }
  }

  await app.register(cors, {
    origin: (origin, cb) => {
      // Server-to-server / curl (no Origin header)
      if (!origin) return cb(null, true);
      // Dev / LAN: reflect request origin (required for credentials)
      if (!isProduction) return cb(null, origin);
      if (isLocalNetworkOrigin(origin)) return cb(null, origin);
      if (corsOrigins.includes(origin)) return cb(null, origin);
      return cb(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  });

  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || process.env.JWT_SECRET || 'base-app-cookie-secret',
    parseOptions: {},
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'base-app-jwt-secret',
    cookie: { cookieName: 'token', signed: false },
    sign: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  });

  await app.register(multipart, {
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  await app.register(fastifyStatic, {
    root: UPLOAD_ROOT,
    prefix: '/uploads/',
    decorateReply: false,
  });

  await registerRoutes(app);

  return app;
}
