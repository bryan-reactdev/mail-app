import { join } from 'path';

export const rootPath = process.cwd();
export const uploadsPath = join(rootPath, 'uploads');
export const imagesPath = join(uploadsPath, 'images');
export const pdfsPath = join(uploadsPath, 'pdfs');

