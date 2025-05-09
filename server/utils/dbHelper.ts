import { z } from 'zod'

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
  const parsedUser = zUser.omit({ id: true }).safeParse(body)

  if (!parsedUser.success) {
    return { success: false, errors: formatZodErrors(parsedUser.error) }
  }

  return { success: true, data: parsedUser.data }
}

/**
 * ✅ Removes sensitive fields from user data
 * - Removes `password`
 * - Removes `isActive`
 * - Removes `credentials`
 */
export function sanitizeUser(user: User) {
  const plainUser =
    typeof user === 'object' && user !== null && 'toJSON' in user ? (user as any).toJSON() : user

  const { password, isActive, __v, createdAt, updatedAt, credentials, ...safe } =
    plainUser as z.infer<typeof zUserWithMeta>

  return safe
}
