import 'reflect-metadata';
import { config } from 'dotenv';
import { createApp } from './app';
import { AppDataSource } from './config/database';

config();

async function start() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const app = await createApp();

    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    console.log(`🚀 Server running at http://${host}:${port}`);
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido, cerrando servidor...');
  await AppDataSource.destroy();
  process.exit(0);
});

start();

