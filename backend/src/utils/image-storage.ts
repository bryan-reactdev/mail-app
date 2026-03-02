import sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomBytes } from 'crypto';

/**
 * Configuración de almacenamiento de imágenes
 * Puede ser configurada mediante variables de entorno
 */
export const IMAGE_CONFIG = {
  // Ruta base donde se guardarán las imágenes
  UPLOAD_BASE_PATH: process.env.UPLOAD_BASE_PATH || path.join(process.cwd(), 'uploads'),
  
  // Rutas relativas para diferentes tipos de imágenes
  PROPERTIES_PATH: 'properties',
  IMAGES_SUBFOLDER: 'images',
  PLANS_SUBFOLDER: 'plans',
  
  // Configuración de compresión WebP
  WEBP_QUALITY: parseInt(process.env.WEBP_QUALITY || '80'),
  MAX_WIDTH: parseInt(process.env.MAX_IMAGE_WIDTH || '1920'),
  
  // Límites de validación
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB en bytes
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_PROPERTY: parseInt(process.env.MAX_IMAGES_PER_PROPERTY || '20'),
  MAX_PLANS_PER_PROPERTY: parseInt(process.env.MAX_PLANS_PER_PROPERTY || '10'),
} as const;

/**
 * Crea la estructura de directorios necesaria
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Genera un nombre único para el archivo
 */
export function generateUniqueFileName(): string {
  const timestamp = Date.now();
  const random = randomBytes(8).toString('hex');
  return `${timestamp}-${random}.webp`;
}

/**
 * Obtiene la ruta completa donde se guardará una imagen
 */
export function getImagePath(propertyId: number, imageType: 'image' | 'plan', fileName: string): string {
  const subfolder = imageType === 'image' ? IMAGE_CONFIG.IMAGES_SUBFOLDER : IMAGE_CONFIG.PLANS_SUBFOLDER;
  return path.join(
    IMAGE_CONFIG.UPLOAD_BASE_PATH,
    IMAGE_CONFIG.PROPERTIES_PATH,
    propertyId.toString(),
    subfolder,
    fileName
  );
}

/**
 * Obtiene la ruta relativa que se guardará en la base de datos
 */
export function getRelativeImagePath(propertyId: number, imageType: 'image' | 'plan', fileName: string): string {
  const subfolder = imageType === 'image' ? IMAGE_CONFIG.IMAGES_SUBFOLDER : IMAGE_CONFIG.PLANS_SUBFOLDER;
  return path.join(
    IMAGE_CONFIG.PROPERTIES_PATH,
    propertyId.toString(),
    subfolder,
    fileName
  ).replace(/\\/g, '/'); // Normalizar separadores para que funcione en todos los sistemas
}

/**
 * Valida el tipo MIME del archivo
 */
export function isValidImageType(mimeType: string): boolean {
  return (IMAGE_CONFIG.ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
}

/**
 * Valida el tamaño del archivo
 */
export function isValidFileSize(fileSize: number): boolean {
  return fileSize <= IMAGE_CONFIG.MAX_FILE_SIZE;
}

/**
 * Procesa una imagen: convierte a WebP, comprime y redimensiona
 */
export async function processImage(
  buffer: Buffer,
  outputPath: string
): Promise<{ width: number; height: number; size: number }> {
  // Asegurar que el directorio existe
  const dir = path.dirname(outputPath);
  await ensureDirectoryExists(dir);

  // Procesar imagen con Sharp
  const image = sharp(buffer);
  const metadata = await image.metadata();

  // Redimensionar si es necesario (mantener aspect ratio)
  let processedImage = image;
  if (metadata.width && metadata.width > IMAGE_CONFIG.MAX_WIDTH) {
    processedImage = image.resize(IMAGE_CONFIG.MAX_WIDTH, null, {
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  // Convertir a WebP y comprimir
  const processedBuffer = await processedImage
    .webp({ quality: IMAGE_CONFIG.WEBP_QUALITY })
    .toBuffer();

  // Guardar archivo
  await fs.writeFile(outputPath, processedBuffer);

  // Obtener dimensiones finales
  const finalMetadata = await sharp(processedBuffer).metadata();

  return {
    width: finalMetadata.width || 0,
    height: finalMetadata.height || 0,
    size: processedBuffer.length,
  };
}

/**
 * Elimina un archivo de imagen
 */
export async function deleteImage(filePath: string): Promise<void> {
  try {
    const fullPath = path.join(IMAGE_CONFIG.UPLOAD_BASE_PATH, filePath);
    await fs.unlink(fullPath);
  } catch (error: any) {
    // Ignorar error si el archivo no existe
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Elimina todas las imágenes de una propiedad
 */
export async function deletePropertyImages(propertyId: number): Promise<void> {
  try {
    const propertyPath = path.join(
      IMAGE_CONFIG.UPLOAD_BASE_PATH,
      IMAGE_CONFIG.PROPERTIES_PATH,
      propertyId.toString()
    );
    await fs.rm(propertyPath, { recursive: true, force: true });
  } catch (error: any) {
    // Ignorar error si el directorio no existe
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Inicializa la estructura de directorios base
 */
export async function initializeImageStorage(): Promise<void> {
  await ensureDirectoryExists(IMAGE_CONFIG.UPLOAD_BASE_PATH);
  const propertiesPath = path.join(IMAGE_CONFIG.UPLOAD_BASE_PATH, IMAGE_CONFIG.PROPERTIES_PATH);
  await ensureDirectoryExists(propertiesPath);
}

/**
 * Obtiene la ruta relativa de una imagen (para respuestas API)
 * Retorna solo el path relativo, sin el base URL
 */
export function getImageUrl(relativePath: string): string {
  // Asegurar que el path comience con uploads/
  return relativePath.startsWith('uploads/') 
    ? relativePath 
    : `uploads/${relativePath}`;
}

