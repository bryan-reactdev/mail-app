import { FastifyInstance } from 'fastify';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import statsRoutes from './stats.routes';

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  await app.register(authRoutes, { prefix: '' });
  await app.register(userRoutes, { prefix: '' });
  await app.register(statsRoutes, { prefix: '' });
}
