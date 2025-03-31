import { UserSchema } from '@@/server/models/userSchema'
import bcrypt from 'bcrypt'

export async function createUser(input: unknown) {
  const parsed = zUser.safeParse(input)

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

  parsed.data.password = await bcrypt.hash(parsed.data.password, 10)

  const user = await UserSchema.create(parsed.data)
  return sanitizeUser(user)
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

export async function getUserByUsername(username: string) {
  const user = await UserSchema.findOne({ username })
  return user ? sanitizeUser(user) : null
}

export async function getUserByUsernameWithPassword(username: string) {
  const user = await UserSchema.findOne({ username })
  if (!user) {
    const error = new Error('User not found')
    error.cause = { username: 'User not found' }
    throw error
  }

  const sanitized = sanitizeUser(user) as User
  sanitized.password = user.password

  return sanitized
}
