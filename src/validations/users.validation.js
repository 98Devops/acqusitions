import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(255).trim().optional(),
    email: z.string().email().max(255).toLowerCase().trim().optional(),
    password: z.string().min(6).max(128).optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const userIdSchema = z.object({
  id: z.preprocess(val => {
    if (typeof val === 'string' && val.trim() !== '') return Number(val);
    if (typeof val === 'number') return val;
    return NaN;
  }, z.number().int().positive()),
});

export default { updateUserSchema, userIdSchema };
