import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

export const zCredentials = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv4()),
  userId: z
    .string()
    .uuid()
    .default(() => uuidv4()),
  credentialId: z.string(),
  publicKey: z.string(),
  counter: z.number().default(1),
  backedUp: z.number().default(0),
  transports: z.string(),
  name: z.string().min(1, 'Name is required')
})

export type Credentials = z.infer<typeof zCredentials>

// Extend with metadata
export const zCredentialsMeta = zCredentials.extend({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  __v: z.number().optional()
})
export type CredentialsMeta = z.infer<typeof zCredentialsMeta>
