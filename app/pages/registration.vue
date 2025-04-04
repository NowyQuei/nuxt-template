<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import dayjs from 'dayjs'

const { fetch } = useUserSession()

const defaultBirthday = dayjs().subtract(18, 'years').subtract(1, 'day').startOf('day').toDate()

const defaultUser = {
  id: uuidv4(),
  username: 'test',
  firstName: 'testi',
  lastName: 'tester',
  email: 'test@test.com',
  password: '*gsThXqsAA4_RcWxPEwacCTB',
  birthday: defaultBirthday,
  createPasskey: true // ✅ registration-specific override
}

async function handleUserSubmit(
  data: Partial<z.infer<typeof zUser>> & {
    createPasskey?: boolean
    passkeyName?: string
  }
) {
  logger.debug('Sending this data to API:', data)

  try {
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    await fetch()
    $toast.success('User created successfully.')

    if (data.createPasskey && data.passkeyName) {
      const { register } = useWebAuthn()
      try {
        await register({ userName: data.email!, name: data.passkeyName })
        await fetch()
        $toast.success('Passkey created successfully.')
      } catch (e) {
        $toast.error('Passkey registration failed.')
        logger.error(e)
      }
    }

    await navigateTo('/')
  } catch (error) {
    logger.error('Error creating user:', error)
    throw error
  }
}
</script>

<template>
  <div class="flex justify-center items-cente min-h-full">
    <FormUser :user="defaultUser" :submit="handleUserSubmit" formTitle="Create Account">
      <template #header>
        <h2 class="text-lg font-bold text-center text-primary">Create Your Account</h2>
      </template>

      <template #footer>
        <p class="text-sm text-gray-500 text-center">
          By signing up, you agree to our
          <a href="/" class="text-primary hover:underline">Terms of Service</a>.
        </p>
      </template>
    </FormUser>
  </div>
</template>
