import { z } from 'zod'

export const ErrorObjectSchema = z.object({
  code: z.string(),
  message: z.string(),
  status: z.number().int().min(100).max(599),
  details: z.array(z.unknown()).optional().nullable()
})

export const CreateApiErrorParamsSchema = ErrorObjectSchema.extend({
  status: ErrorObjectSchema.shape.status.optional()
})

export type CreateApiErrorParams = z.infer<typeof CreateApiErrorParamsSchema>

export const ApiErrorSchema = z.object({
  error: ErrorObjectSchema
})

export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>
