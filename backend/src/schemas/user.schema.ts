import { z } from 'zod';

export const STAFF_ROLES = ['admin', 'supervisor', 'staff'] as const;
export const CLIENT_ROLE = 'user' as const;
export const ALL_ROLES = [...STAFF_ROLES, CLIENT_ROLE] as const;

const staffRoleEnum = z.enum(STAFF_ROLES);

export const createUserSchema = z.object({
  fullName: z.string().min(1).max(200).trim(),
  phone: z.string().min(1).max(50).trim(),
  email: z
    .union([z.string().email().max(255).toLowerCase().trim(), z.literal('')])
    .optional()
    .transform((v) => (v === '' || v === undefined ? null : v)),
  password: z.string().min(1).max(100),
  role: staffRoleEnum,
});

export const updateUserSchema = z.object({
  fullName: z.string().min(1).max(200).trim(),
  phone: z.string().min(1).max(50).trim(),
  email: z
    .union([z.string().email().max(255).toLowerCase().trim(), z.literal('')])
    .optional()
    .transform((v) => (v === '' || v === undefined ? null : v)),
  password: z.string().max(100),
  role: staffRoleEnum,
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
