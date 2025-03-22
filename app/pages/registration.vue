<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import dayjs from 'dayjs'

const toast = useAppToast()

const defaultBirthday = dayjs().subtract(18, 'years').subtract(1, 'day').startOf('day').toDate()

const defaultUser = {
  id: uuidv4(),
  username: 'test',
  firstName: 'testi',
  lastName: 'tester',
  email: 'test@test.com',
  password: 'Start.1234567',
  birthday: defaultBirthday
}

async function handleUserSubmit(data: Partial<z.infer<typeof UserSchema>>) {
  logger.info('Sending this data to API:', data)
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  } catch (error) {
    logger.error('Error creating user:', error)
    throw error // ⚠️ This is important
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
