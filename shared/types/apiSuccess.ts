import { z } from 'zod'

export const FlatSuccessSchema = z.object({
  data: z.unknown(),
  message: z.string().optional(),
  meta: z.record(z.unknown()).optional()
})

export const CreateApiSuccessParamsSchema = FlatSuccessSchema.extend({
  status: z.number().int().min(100).max(299).optional()
})

export type CreateApiSuccessParams = z.infer<typeof CreateApiSuccessParamsSchema>

export type ApiSuccessResponse<T = unknown> = z.infer<typeof FlatSuccessSchema> & { data: T }
