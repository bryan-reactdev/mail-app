import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));

export class ImageService {
  private async ensureDir(dir: string): Promise<void> {
    await fs.mkdir(dir, { recursive: true });
  }

  /** Tolera JPEGs de móvil con metadatos o bytes extra que libvips rechaza por defecto. */
  private fromBuffer(buffer: Buffer) {
    return sharp(buffer, { failOn: 'none' });
  }

  async saveProfilePhoto(
    userId: number,
    buffer: Buffer
  ): Promise<{ profilePhoto: string; profilePhotoThumb: string }> {
    const userDir = path.join(UPLOAD_ROOT, 'users', String(userId));
    await this.ensureDir(userDir);

    const profilePath = path.join(userDir, 'profile.webp');
    const thumbPath = path.join(userDir, 'profile-thumb.webp');

    await this.fromBuffer(buffer)
      .rotate()
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(profilePath);

    await this.fromBuffer(buffer)
      .rotate()
      .resize(150, 150, { fit: 'cover' })
      .webp({ quality: 70 })
      .toFile(thumbPath);

    return {
      profilePhoto: `/uploads/users/${userId}/profile.webp`,
      profilePhotoThumb: `/uploads/users/${userId}/profile-thumb.webp`,
    };
  }
}

export const imageService = new ImageService();
