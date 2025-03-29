import { UserSchema } from '@@/server/models/userSchema'

export async function createUser(input: unknown) {
  const parsed = ZUser.safeParse(input)

  if (!parsed.success) {
    const error = new Error('Validation failed')
    error.cause = parsed.error.flatten()
    throw error
  }

  // Check if user already exists
  const existingUser = await UserSchema.findOne({ email: parsed.data.email })
  if (existingUser) {
    const error = new Error('User already exists')
    error.cause = { email: 'Email already in use' }
    throw error
  }

  // check if username already exists
  const existingUsername = await UserSchema.findOne({ username: parsed.data.username })
  if (existingUsername) {
    const error = new Error('Username already exists')
    error.cause = { username: 'Username already in use' }
    throw error
  }

  const user = await UserSchema.create(parsed.data)
  return user
}

export async function getUserById(id: string) {
  const user = await UserSchema.findById(id)
  return user ? sanitizeUser(user) : null
}

export async function getUsers() {
  const users = await UserSchema.find()
  return users.map(sanitizeUser)
}

export async function deleteUser(id: string) {
  const user = await UserSchema.findByIdAndDelete(id)
  return user ? sanitizeUser(user) : null
}
