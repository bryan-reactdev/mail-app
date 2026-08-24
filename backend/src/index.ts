import 'reflect-metadata';
import { config } from 'dotenv';
import path from 'node:path';
import { createApp } from './app';
import { AppDataSource } from './config/database';

config({ path: path.resolve(__dirname, '../.env'), override: true });

async function start() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Base de datos conectada');

    const app = await createApp();
    const port = parseInt(process.env.PORT || '3005');
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    console.log(`🚀 Servidor en http://${host}:${port}`);
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await AppDataSource.destroy();
  process.exit(0);
});

start();
