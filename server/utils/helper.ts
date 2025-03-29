import { z } from 'zod'

/**
 * ✅ Helper function to format Zod errors
 */
export function formatZodErrors(error: z.ZodError) {
  return Object.fromEntries(
    Object.entries(error.format())
      .filter(([key]) => key !== '_errors') // 🚀 Remove `_errors`
      .map(([key, value]) => [key, value?._errors?.[0] || 'Invalid value'])
  )
}
