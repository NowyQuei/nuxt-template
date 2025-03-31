import { UserSchema } from '@@/server/models/userSchema'
import CredentialsSchema from '@@/server/models/credentialsSchema'
import bcrypt from 'bcrypt'

export async function createUser(input: unknown) {
  const parsed = zUser.safeParse(input)

  if (!parsed.success) {
    const error = new Error('Validation failed')
    error.cause = parsed.error.flatten()
    throw error
  }

  const existingUser = await UserSchema.findOne({ email: parsed.data.email })
  if (existingUser) {
    const error = new Error('User already exists')
    error.cause = { email: 'Email already in use' }
    throw error
  }

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

export async function updateUser(id: string, updates: Partial<zUser>) {
  const user = await UserSchema.findByIdAndUpdate(id, updates, { new: true })
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

export async function addPasskey(userId: string, credential: zCredentials) {
  const existing = await CredentialsSchema.findOne({
    userId,
    publicKey: credential.publicKey
  })

  if (existing) {
    logger.info('Credential already exists for user:', userId)
    return
  }

  const sameName = await CredentialsSchema.findOne({ userId, name: credential.name })
  if (sameName) {
    const error = new Error(`Passkey name "${credential.name}" already exists for this user`)
    error.cause = { name: 'Duplicate passkey name' }
    throw error
  }

  const newCredential = await CredentialsSchema.create({
    userId,
    publicKey: credential.publicKey,
    counter: credential.counter,
    backedUp: credential.backedUp ? 1 : 0,
    transports: credential.transports.join(','),
    name: credential.name
  })

  await UserSchema.findByIdAndUpdate(userId, {
    $addToSet: { credentials: newCredential._id }
  })

  logger.success(`Passkey "${newCredential.name}" added to user ${userId}`)
}
