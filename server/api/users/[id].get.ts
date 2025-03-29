import { z } from 'zod'

const testUser: z.infer<typeof ZUser> = {
  id: '4dcf618a-8844-450b-882e-62317f709b07',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@example.com',
  password: 'Start.1234567',
  birthday: new Date('2000-01-01T00:00:00.000Z'),
  role: 'user',
  isActive: true
}

export default defineEventHandler((event) => {
  logger.info('triggered /api/users/[id].get.ts')
  const userId = event.context.params?.id

  // ! Both ifs are used here in a user friendly way to return the correct error message. This should be avoided in production because it can leak information about the system (security risk).
  if (!userId) {
    return createApiError(event, {
      code: 'missing_user_id',
      message: 'User ID is required in the path.'
    })
  }

  if (userId !== testUser.id) {
    return createApiError(event, {
      code: 'user_not_found',
      message: `User with ID '${userId}' was not found.`,
      status: 404
    })
  }

  return createApiSuccess(event, {
    status: 200,
    data: sanitizeUser(testUser)
  })
})
