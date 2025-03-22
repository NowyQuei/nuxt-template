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

/**
 * ✅ Validate and sanitize user input
 */
export function validateUserInput(body: any) {
  // ✅ Convert birthday to a Date if it's a string
  if (typeof body.birthday === 'string') {
    body.birthday = new Date(body.birthday)
  }

  // ✅ Ensure the username is always lowercase
  if (typeof body.username === 'string') {
    body.username = body.username.toLowerCase()
  }

  // ✅ Validate user data with Zod
  const parsedUser = UserSchema.omit({ id: true }).safeParse(body)

  if (!parsedUser.success) {
    return { success: false, errors: formatZodErrors(parsedUser.error) }
  }

  return { success: true, data: parsedUser.data }
}

/**
 * ✅ Removes sensitive fields from user data
 * - Removes `password`
 * - Removes `role`
 * - Removes `isActive`
 */
export function sanitizeUser(user: z.infer<typeof UserSchema>) {
  const { password, role, isActive, ...sanitizedUser } = user
  return sanitizedUser
}
