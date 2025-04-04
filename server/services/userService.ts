import { UserSchema } from '@@/server/models/userSchema'
import bcrypt from 'bcrypt'

export async function createUser(input: unknown) {
  logger.debug('createUser called with input:', input)

  const parsed = zUser.safeParse(input)
  if (!parsed.success) {
    logger.error('User validation failed:', parsed.error.flatten())
    const error = new Error('Validation failed')
    error.cause = parsed.error.flatten()
    throw error
  }

  try {
    const emailExists = await UserSchema.findOne({ email: parsed.data.email })
    if (emailExists) {
      logger.debug(`User with email "${parsed.data.email}" already exists`)
      const error = new Error('User already exists')
      error.cause = { email: 'Email already in use' }
      throw error
    }

    const usernameExists = await UserSchema.findOne({ username: parsed.data.username })
    if (usernameExists) {
      logger.debug(`User with username "${parsed.data.username}" already exists`)
      const error = new Error('Username already exists')
      error.cause = { username: 'Username already in use' }
      throw error
    }

    parsed.data.password = await bcrypt.hash(parsed.data.password, 10)
    const user = await UserSchema.create(parsed.data)
    logger.success(`User created with ID: ${user.id}`)
    return sanitizeUser(user)
  } catch (err) {
    logger.error('Error creating user:', err)
    throw err
  }
}

export async function getUserById(id: string) {
  logger.debug(`getUserById called with id: ${id}`)
  try {
    const user = await UserSchema.findById(id)
    return user ? sanitizeUser(user) : null
  } catch (err) {
    logger.error('Failed to fetch user by ID:', err)
    return null
  }
}

export async function getUsers() {
  logger.debug('getUsers called')
  try {
    const users = await UserSchema.find()
    return users.map(sanitizeUser)
  } catch (err) {
    logger.error('Failed to fetch users:', err)
    return []
  }
}

export async function deleteUser(id: string) {
  logger.debug(`deleteUser called with id: ${id}`)
  try {
    const user = await UserSchema.findByIdAndDelete(id)
    logger.success(`User deleted with id: ${id}`)
    return user ? sanitizeUser(user) : null
  } catch (err) {
    logger.error('Failed to delete user:', err)
    return null
  }
}

export async function updateUser(id: string, data: Partial<z.infer<typeof zUser>>) {
  logger.debug('updateUser called with:', { id, data })

  try {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }

    await UserSchema.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })

    const updatedUser = await getUserById(id)
    logger.info('after user update', updatedUser)

    logger.success(`User updated: ${id}`)
    return updatedUser
  } catch (err) {
    logger.error('Failed to update user:', err)
    return null
  }
}

export async function getUserByUsername(username: string) {
  logger.debug(`getUserByUsername called with: ${username}`)
  try {
    const user = await UserSchema.findOne({ username })
    return user ? sanitizeUser(user) : null
  } catch (err) {
    logger.error('Failed to fetch user by username:', err)
    return null
  }
}

export async function getUserByUsernameWithPassword(username: string) {
  logger.debug(`getUserByUsernameWithPassword called with: ${username}`)
  try {
    const user = await UserSchema.findOne({ username })
    if (!user) {
      logger.debug('User not found:', username)
      const error = new Error('User not found')
      error.cause = { username: 'User not found' }
      throw error
    }

    const sanitized = sanitizeUser(user) as User
    sanitized.password = user.password
    return sanitized
  } catch (err) {
    logger.error('Failed to fetch user with password:', err)
    throw err
  }
}
