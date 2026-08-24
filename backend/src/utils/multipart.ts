import { FastifyRequest } from 'fastify';
import type { MultipartFile } from '@fastify/multipart';

export interface ParsedMultipart<T> {
  fields: T;
  photo: Buffer | null;
}

export async function parseMultipartRequest<T extends Record<string, string>>(
  request: FastifyRequest
): Promise<ParsedMultipart<T>> {
  const fields = {} as T;
  let photo: Buffer | null = null;

  const parts = request.parts();
  for await (const part of parts) {
    if (part.type === 'file') {
      const file = part as MultipartFile;
      if (file.fieldname === 'photo' && file.mimetype.startsWith('image/')) {
        photo = await file.toBuffer();
      } else {
        await file.toBuffer();
      }
      continue;
    }

    const value = String(part.value ?? '').trim();
    (fields as Record<string, string>)[part.fieldname] = value;
  }

  return { fields, photo };
}
