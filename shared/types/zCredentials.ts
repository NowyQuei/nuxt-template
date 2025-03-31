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
  publicKey: z.string(),
  counter: z.number().default(1),
  backedUp: z.number().default(0),
  transports: z.string()
})

export type Credentials = z.infer<typeof zCredentials>
