import { z } from 'zod'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid' // ✅ Import UUID generator

export const ZUser = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv4()), // ✅ Automatically generate UUID if not provided

  username: z
    .string()
    .min(4, 'Username must be at least 4 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),

  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),

  birthday: z.coerce.date().refine((date) => {
    return dayjs(date).isValid() && dayjs().diff(dayjs(date), 'year') >= 18
  }, 'User must be at least 18 years old'),

  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),

  role: z.enum(['admin', 'user', 'moderator']).default('user'),
  isActive: z.boolean().default(true),
  profileImage: z.string().url().optional()
})

// Infer TypeScript types
export type User = z.infer<typeof ZUser>

export const ZUserWithMeta = ZUser.extend({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  __v: z.number().optional()
})

export type UserWithMeta = z.infer<typeof ZUserWithMeta>
